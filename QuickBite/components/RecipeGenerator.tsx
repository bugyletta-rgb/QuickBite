
import React, { useState } from 'react';
import { MealCategory, Recipe, AppLanguage } from '../types';
import { generateRecipe } from '../geminiService';
import RecipeCard from './RecipeCard';

interface RecipeGeneratorProps {
  onLike: (recipe: Recipe) => void;
  onShare: (recipe: Recipe) => void;
  likedRecipes: Recipe[];
  language: AppLanguage;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onLike, onShare, likedRecipes, language }) => {
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MealCategory>(MealCategory.DINNER);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newRecipe = await generateRecipe(selectedCategory, language);
      setRecipe(newRecipe);
    } catch (error) {
      console.error("Generation error", error);
      const msg = language === AppLanguage.TR ? "Bir hata oluştu şef! Tekrar dene." : 
                  language === AppLanguage.ES ? "¡Algo salió mal chef! Inténtalo de nuevo." : 
                  "Something went wrong chef! Try again.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const isLiked = recipe ? likedRecipes.some(r => r.id === recipe.id || r.title === recipe.title) : false;

  const getCategoryLabel = (cat: MealCategory) => {
    const categories: Record<MealCategory, Record<AppLanguage, string>> = {
      [MealCategory.BREAKFAST]: { [AppLanguage.EN]: 'Breakfast', [AppLanguage.TR]: 'Kahvaltı', [AppLanguage.ES]: 'Desayuno' },
      [MealCategory.LUNCH]: { [AppLanguage.EN]: 'Lunch', [AppLanguage.TR]: 'Öğle Yemeği', [AppLanguage.ES]: 'Almuerzo' },
      [MealCategory.DINNER]: { [AppLanguage.EN]: 'Dinner', [AppLanguage.TR]: 'Akşam Yemeği', [AppLanguage.ES]: 'Cena' },
      [MealCategory.VEGAN]: { [AppLanguage.EN]: 'Vegan', [AppLanguage.TR]: 'Vegan', [AppLanguage.ES]: 'Vegano' },
      [MealCategory.DESSERT]: { [AppLanguage.EN]: 'Dessert', [AppLanguage.TR]: 'Tatlı', [AppLanguage.ES]: 'Postre' },
      [MealCategory.SNACK]: { [AppLanguage.EN]: 'Snack', [AppLanguage.TR]: 'Atıştırmalık', [AppLanguage.ES]: 'Merienda' }
    };
    return categories[cat]?.[language] || cat;
  };

  const getLabel = (key: string) => {
    const labels: Record<string, Record<AppLanguage, string>> = {
      title: { [AppLanguage.EN]: 'Fresh Ideas', [AppLanguage.TR]: 'Taze Fikirler', [AppLanguage.ES]: 'Ideas Frescas' },
      subtitle: { [AppLanguage.EN]: 'Pick a vibe and let AI cook.', [AppLanguage.TR]: 'Bir mod seç ve yapay zeka pişirsin.', [AppLanguage.ES]: 'Elige un estilo y deja que la IA cocine.' },
      button: { [AppLanguage.EN]: 'CREATE RECIPE', [AppLanguage.TR]: 'TARİF OLUŞTUR', [AppLanguage.ES]: 'CREAR RECETA' },
      thinking: { [AppLanguage.EN]: 'Thinking...', [AppLanguage.TR]: 'Düşünülüyor...', [AppLanguage.ES]: 'Pensando...' },
      empty: { [AppLanguage.EN]: 'Select a category to start.', [AppLanguage.TR]: 'Başlamak için bir kategori seçin.', [AppLanguage.ES]: 'Selecciona una categoría para empezar.' },
      daily: { [AppLanguage.EN]: 'Daily', [AppLanguage.TR]: 'Günlük', [AppLanguage.ES]: 'Diario' }
    };
    return labels[key]?.[language] || labels[key]?.[AppLanguage.EN];
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <section className="space-y-4">
        <div className="px-2">
          <h2 className="text-2xl font-serif font-extrabold text-slate-900">
            {getLabel('title')} <span className="text-orange-500">{getLabel('daily')}</span>
          </h2>
          <p className="text-sm text-slate-500">{getLabel('subtitle')}</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 px-1 hide-scrollbar -mx-4 px-4">
          {Object.values(MealCategory).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                selectedCategory === cat 
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-100' 
                  : 'bg-white text-slate-600 border border-slate-100 shadow-sm'
              }`}
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        <div className="pt-2 flex justify-center">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full max-w-xs flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-white transition-all transform active:scale-95 shadow-lg ${
              loading ? 'bg-slate-300' : 'bg-slate-900 active:bg-slate-800'
            }`}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>{getLabel('thinking')}</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-bolt text-orange-400"></i>
                <span>{getLabel('button')}</span>
              </>
            )}
          </button>
        </div>
      </section>

      {recipe ? (
        <div className="animate-in slide-in-from-bottom-6 duration-500">
          <RecipeCard 
            recipe={recipe} 
            isLiked={isLiked} 
            onLike={onLike} 
            onShare={onShare} 
          />
        </div>
      ) : !loading && (
        <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl py-16 text-center space-y-3">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <i className="fa-solid fa-wand-sparkles text-2xl"></i>
          </div>
          <p className="text-slate-400 font-medium text-sm px-8">{getLabel('empty')}</p>
        </div>
      )}
    </div>
  );
};

export default RecipeGenerator;
