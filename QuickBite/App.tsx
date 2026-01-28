
import React, { useState, useEffect, useCallback } from 'react';
import { Recipe, View, AppLanguage } from './types';
import TopBar from './components/TopBar';
import BottomNav from './components/BottomNav';
import RecipeGenerator from './components/RecipeGenerator';
import LikedRecipes from './components/LikedRecipes';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('generate');
  const [likedRecipes, setLikedRecipes] = useState<Recipe[]>([]);
  const [language, setLanguage] = useState<AppLanguage>(AppLanguage.EN);

  useEffect(() => {
    const saved = localStorage.getItem('quickbite_liked');
    const savedLang = localStorage.getItem('quickbite_lang');
    
    if (saved) {
      try {
        setLikedRecipes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved recipes", e);
      }
    }
    
    if (savedLang && Object.values(AppLanguage).includes(savedLang as AppLanguage)) {
      setLanguage(savedLang as AppLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quickbite_liked', JSON.stringify(likedRecipes));
  }, [likedRecipes]);

  useEffect(() => {
    localStorage.setItem('quickbite_lang', language);
  }, [language]);

  const toggleLike = useCallback((recipe: Recipe) => {
    setLikedRecipes(prev => {
      const isLiked = prev.some(r => r.id === recipe.id || r.title === recipe.title);
      if (isLiked) {
        return prev.filter(r => r.id !== recipe.id && r.title !== recipe.title);
      } else {
        return [...prev, recipe];
      }
    });
  }, []);

  const shareRecipe = (recipe: Recipe) => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: `Check out this ${recipe.category} recipe: ${recipe.title}!`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      const text = `Recipe: ${recipe.title}\n\nIngredients: ${recipe.ingredients.join(', ')}`;
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50">
      <TopBar language={language} onLanguageChange={setLanguage} />
      
      <main className="flex-grow overflow-y-auto pb-24 px-4 pt-4 hide-scrollbar">
        <div className="max-w-md mx-auto h-full">
          {currentView === 'generate' ? (
            <RecipeGenerator 
              onLike={toggleLike} 
              onShare={shareRecipe} 
              likedRecipes={likedRecipes} 
              language={language}
            />
          ) : (
            <LikedRecipes 
              recipes={likedRecipes} 
              onRemove={toggleLike} 
              onShare={shareRecipe}
              onBack={() => setCurrentView('generate')}
              language={language}
            />
          )}
        </div>
      </main>

      <BottomNav 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        likedCount={likedRecipes.length} 
        language={language}
      />
    </div>
  );
};

export default App;
