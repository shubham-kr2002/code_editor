import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import LanguageSelector from './LanguageSelector';

/**
 * Toolbar Component
 * 
 * Provides action buttons and controls for the code editor:
 * - Run button to execute code
 * - Save button to save current file
 * - New File button for creating new files
 * - Language selector for choosing programming language
 * - Theme switcher for changing UI theme
 * 
 * Responsive design adjusts layout for different screen sizes.
 */
const Toolbar = ({ 
  onRun, 
  onSave, 
  language, 
  onLanguageChange, 
  theme, 
  onThemeChange, 
  isLoading 
}) => {
  // Theme-specific styles
  const themeStyles = {
    light: {
      bg: 'bg-white',
      border: 'border-gray-200',
      text: 'text-gray-800',
      runButton: 'bg-green-500 hover:bg-green-600 text-white',
      saveButton: 'bg-blue-500 hover:bg-blue-600 text-white',
    },
    dark: {
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-gray-100',
      runButton: 'bg-green-600 hover:bg-green-700 text-white',
      saveButton: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    rainbow: {
      bg: 'bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100',
      border: 'border-purple-200',
      text: 'text-purple-900',
      runButton: 'bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white',
      saveButton: 'bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white',
    }
  };
  
  const style = themeStyles[theme] || themeStyles.light;
  
  return (
    <div className={`p-3 ${style.bg} ${style.border} border-b shadow-sm flex flex-wrap items-center gap-2 justify-between`}>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onRun}
          disabled={isLoading}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 shadow-sm transition-transform duration-200 transform hover:scale-105 ${style.runButton} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Running...</span>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              <span>Run</span>
            </>
          )}
        </button>
        
        <button
          onClick={onSave}
          className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1.5 shadow-sm transition-transform duration-200 transform hover:scale-105 ${style.saveButton}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h-1v5.586l-2.293-2.293z" />
            <path d="M5 16a3 3 0 01-3-3V7a3 3 0 013-3h10a3 3 0 013 3v6a3 3 0 01-3 3H5z" />
          </svg>
          <span className="hidden sm:inline">Save</span>
        </button>
        
        <div className="mx-2 hidden md:block">
          <LanguageSelector
            language={language}
            onLanguageChange={onLanguageChange}
            theme={theme}
          />
        </div>
      </div>
      
      <div className="flex items-center">
        <ThemeSwitcher
          currentTheme={theme}
          onThemeChange={onThemeChange}
        />
      </div>
    </div>
  );
};

export default Toolbar; 