import React from 'react';

/**
 * ThemeSwitcher Component
 * 
 * Allows users to switch between different UI themes:
 * - Light: Clean, bright interface
 * - Dark: Low-light interface for reduced eye strain
 * - Rainbow: Colorful, playful interface for young coders
 */
const ThemeSwitcher = ({ currentTheme, onThemeChange }) => {
  const themes = [
    { id: 'light', name: 'Light' },
    { id: 'dark', name: 'Dark' },
    { id: 'rainbow', name: 'Rainbow' }
  ];
  
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium hidden sm:inline">Theme:</span>
      <div className="flex rounded-lg overflow-hidden">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeChange(theme.id)}
            className={`px-3 py-1.5 text-sm transition-all duration-200 transform hover:scale-105 ${
              currentTheme === theme.id
                ? theme.id === 'rainbow'
                  ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white font-bold'
                  : theme.id === 'dark'
                  ? 'bg-gray-800 text-white font-bold'
                  : 'bg-gray-100 text-gray-800 font-bold'
                : theme.id === 'rainbow'
                ? 'bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 text-white opacity-70'
                : theme.id === 'dark'
                ? 'bg-gray-700 text-gray-200'
                : 'bg-white text-gray-600'
            }`}
          >
            {theme.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher; 