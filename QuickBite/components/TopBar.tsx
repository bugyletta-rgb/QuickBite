
import React from 'react';
import { AppLanguage } from '../types';

interface TopBarProps {
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

const TopBar: React.FC<TopBarProps> = ({ language, onLanguageChange }) => {
  const handleShareApp = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QuickBite AI Chef',
        text: 'Check out this AI Recipe generator I found!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('App link copied to clipboard!');
    }
  };

  const getFlag = (lang: AppLanguage) => {
    switch (lang) {
      case AppLanguage.TR: return '🇹🇷';
      case AppLanguage.ES: return '🇪🇸';
      default: return '🇺🇸';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md pt-[env(safe-area-inset-top,1rem)] pb-4 px-6 border-b border-slate-100 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-orange-200">
          <i className="fa-solid fa-utensils text-sm"></i>
        </div>
        <h1 className="text-xl font-extrabold tracking-tight text-slate-800">
          QuickBite <span className="text-orange-500">AI</span>
        </h1>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="relative group">
          <button className="flex items-center gap-1 bg-slate-100 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-200 transition-colors">
            {getFlag(language)} {language.substring(0, 2).toUpperCase()}
            <i className="fa-solid fa-chevron-down text-[8px]"></i>
          </button>
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-100 rounded-xl shadow-xl p-1 hidden group-hover:block z-[60] min-w-[100px]">
            {Object.values(AppLanguage).map((lang) => (
              <button
                key={lang}
                onClick={() => onLanguageChange(lang)}
                className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-2 ${
                  language === lang ? 'bg-orange-50 text-orange-600' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{getFlag(lang)}</span>
                {lang}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleShareApp}
          className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 active:scale-90 transition-transform"
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
      </div>
    </header>
  );
};

export default TopBar;
