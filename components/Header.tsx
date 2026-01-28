
import React from 'react';
import { View } from '../types';

interface HeaderProps {
  currentView: View;
  onViewChange: (view: View) => void;
  likedCount: number;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange, likedCount }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-5xl">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => onViewChange('generate')}
        >
          <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform">
            <i className="fa-solid fa-utensils"></i>
          </div>
          <h1 className="text-2xl font-serif font-bold tracking-tight text-gray-800">
            QuickBite<span className="text-orange-500">AI</span>
          </h1>
        </div>

        <nav className="flex gap-1 bg-gray-100 p-1 rounded-full">
          <button
            onClick={() => onViewChange('generate')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              currentView === 'generate' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Discover
          </button>
          <button
            onClick={() => onViewChange('liked')}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              currentView === 'liked' 
                ? 'bg-white text-orange-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            My Kitchen
            {likedCount > 0 && (
              <span className="bg-orange-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
                {likedCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
