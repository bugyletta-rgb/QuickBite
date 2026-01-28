
import { GoogleGenAI, Type } from "@google/genai";
import { MealCategory, Recipe, AppLanguage } from "./types";

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Name of the dish" },
    description: { type: Type.STRING, description: "Short appetizing description" },
    prepTime: { type: Type.STRING, description: "Preparation time (e.g., 5 mins)" },
    cookTime: { type: Type.STRING, description: "Cooking time (e.g., 10 mins)" },
    servings: { type: Type.NUMBER, description: "Number of servings" },
    ingredients: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of ingredients with quantities"
    },
    instructions: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Numbered step-by-step cooking instructions"
    },
    nutrition: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING },
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING },
      },
      required: ["calories", "protein", "carbs", "fat"]
    }
  },
  required: ["title", "description", "prepTime", "cookTime", "servings", "ingredients", "instructions", "nutrition"]
};

export const generateRecipe = async (category: MealCategory, language: AppLanguage): Promise<Recipe> => {
  // Always initialize with the latest API key from environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recipePrompt = `Generate a creative, delicious, and quick ${category} recipe that can be made in under 30 minutes. 
  The recipe MUST be written entirely in the ${language} language. 
  Focus on high quality, fresh ingredients and clear instructions. 
  Return the result in JSON format according to the provided schema.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: recipePrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("Empty response from AI");
    
    const rawRecipe = JSON.parse(rawText.trim());

    // Generate a matching image using the Flash Image model
    let imageUrl = `https://picsum.photos/seed/${encodeURIComponent(rawRecipe.title)}/800/600`; 
    
    try {
      const imagePrompt = `Professional food photography of ${rawRecipe.title}. ${rawRecipe.description}. Natural lighting, high resolution, gourmet presentation.`;
      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePrompt }] },
        config: { imageConfig: { aspectRatio: "4:3" } },
      });

      if (imageResponse.candidates?.[0]?.content?.parts) {
        const imagePart = imageResponse.candidates[0].content.parts.find(p => p.inlineData);
        if (imagePart?.inlineData) {
          imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
      }
    } catch (imgError) {
      console.warn("Image generation failed, using fallback", imgError);
    }
    
    return {
      ...rawRecipe,
      id: crypto.randomUUID(),
      category,
      imageUrl
    };
  } catch (error) {
    console.error("Gemini Recipe Generation Error:", error);
    throw error;
  }
};
