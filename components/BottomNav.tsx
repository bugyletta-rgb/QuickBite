
import React from 'react';
import { View, AppLanguage } from '../types';

interface BottomNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  likedCount: number;
  language: AppLanguage;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onViewChange, likedCount, language }) => {
  const getLabel = (key: string) => {
    const labels: Record<string, Record<AppLanguage, string>> = {
      home: { 
        [AppLanguage.EN]: 'Home', 
        [AppLanguage.TR]: 'Ana Sayfa', 
        [AppLanguage.ES]: 'Inicio' 
      },
      saved: { 
        [AppLanguage.EN]: 'Saved', 
        [AppLanguage.TR]: 'Kaydedilenler', 
        [AppLanguage.ES]: 'Guardados' 
      },
      explore: { 
        [AppLanguage.EN]: 'Explore', 
        [AppLanguage.TR]: 'Keşfet', 
        [AppLanguage.ES]: 'Explorar' 
      }
    };
    return labels[key]?.[language] || labels[key]?.[AppLanguage.EN];
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 bottom-nav-blur border-t border-slate-100 px-6 pb-[env(safe-area-inset-bottom,1.5rem)] pt-3 flex justify-around items-center z-50 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
      <button 
        onClick={() => onViewChange('generate')}
        className={`flex flex-col items-center gap-1 transition-all ${
          currentView === 'generate' ? 'text-orange-500' : 'text-slate-400'
        }`}
      >
        <div className={`w-12 h-8 rounded-2xl flex items-center justify-center transition-colors ${
          currentView === 'generate' ? 'bg-orange-50' : 'bg-transparent'
        }`}>
          <i className={`fa-solid fa-house-chimney ${currentView === 'generate' ? 'text-xl' : 'text-lg'}`}></i>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">{getLabel('home')}</span>
      </button>

      <button 
        onClick={() => onViewChange('liked')}
        className={`flex flex-col items-center gap-1 transition-all relative ${
          currentView === 'liked' ? 'text-orange-500' : 'text-slate-400'
        }`}
      >
        <div className={`w-12 h-8 rounded-2xl flex items-center justify-center transition-colors ${
          currentView === 'liked' ? 'bg-orange-50' : 'bg-transparent'
        }`}>
          <i className={`fa-solid fa-heart ${currentView === 'liked' ? 'text-xl' : 'text-lg'}`}></i>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">{getLabel('saved')}</span>
        {likedCount > 0 && (
          <span className="absolute top-0 right-1 bg-orange-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">
            {likedCount}
          </span>
        )}
      </button>

      <button 
        className="flex flex-col items-center gap-1 text-slate-400 opacity-50 cursor-not-allowed"
      >
        <div className="w-12 h-8 rounded-2xl flex items-center justify-center">
          <i className="fa-solid fa-compass text-lg"></i>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider">{getLabel('explore')}</span>
      </button>
    </nav>
  );
};

export default BottomNav;
