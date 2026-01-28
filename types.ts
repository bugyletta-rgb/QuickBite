
export interface Recipe {
  id: string;
  title: string;
  category: string;
  description: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
  imageUrl?: string;
}

export enum MealCategory {
  BREAKFAST = 'Breakfast',
  LUNCH = 'Lunch',
  DINNER = 'Dinner',
  VEGAN = 'Vegan',
  DESSERT = 'Dessert',
  SNACK = 'Snack'
}

export enum AppLanguage {
  EN = 'English',
  TR = 'Turkish',
  ES = 'Spanish'
}

export type View = 'generate' | 'liked';
