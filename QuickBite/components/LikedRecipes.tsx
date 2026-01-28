
import React from 'react';
import { Recipe, AppLanguage } from '../types';
import RecipeCard from './RecipeCard';

interface LikedRecipesProps {
  recipes: Recipe[];
  onRemove: (recipe: Recipe) => void;
  onShare: (recipe: Recipe) => void;
  onBack: () => void;
  language: AppLanguage;
}

const LikedRecipes: React.FC<LikedRecipesProps> = ({ recipes, onRemove, onShare, onBack, language }) => {
  const getLabel = (key: string) => {
    const labels: Record<string, Record<AppLanguage, string>> = {
      title: { [AppLanguage.EN]: 'My Kitchen', [AppLanguage.TR]: 'Mutfağım', [AppLanguage.ES]: 'Mi Cocina' },
      saved: { [AppLanguage.EN]: `Saved ${recipes.length} meals.`, [AppLanguage.TR]: `${recipes.length} tarif kaydedildi.`, [AppLanguage.ES]: `${recipes.length} comidas guardadas.` },
      empty: { [AppLanguage.EN]: 'No saved recipes', [AppLanguage.TR]: 'Kaydedilmiş tarif yok', [AppLanguage.ES]: 'No hay recetas guardadas' },
      button: { [AppLanguage.EN]: 'Start Discovering', [AppLanguage.TR]: 'Keşfetmeye Başla', [AppLanguage.ES]: 'Empezar a Descubrir' }
    };
    return labels[key]?.[language] || labels[key]?.[AppLanguage.EN];
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500 pb-10">
      <div className="px-2">
        <h2 className="text-2xl font-serif font-extrabold text-slate-900">{getLabel('title')}</h2>
        <p className="text-sm text-slate-500">{getLabel('saved')}</p>
      </div>

      {recipes.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center shadow-sm border border-slate-100 space-y-6">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-orange-200 text-3xl">
            <i className="fa-solid fa-heart-crack"></i>
          </div>
          <h3 className="text-lg font-bold text-slate-800">{getLabel('empty')}</h3>
          <button
            onClick={onBack}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg shadow-orange-100 active:scale-95 transition-transform"
          >
            {getLabel('button')}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {recipes.map((recipe) => (
            <RecipeCard 
              key={recipe.id} 
              recipe={recipe} 
              isLiked={true} 
              onLike={onRemove} 
              onShare={onShare} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LikedRecipes;
