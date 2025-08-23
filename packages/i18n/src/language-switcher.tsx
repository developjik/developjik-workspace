"use client";

import React from 'react';
import { useI18nContext } from './i18n-provider';
import { SUPPORTED_LANGUAGES, SupportedLanguage } from './i18n-config';

interface LanguageSwitcherProps {
  className?: string;
  showLabel?: boolean;
}

export function LanguageSwitcher({ className, showLabel = true }: LanguageSwitcherProps) {
  const { language, changeLanguage, isLoading } = useI18nContext();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as SupportedLanguage;
    changeLanguage(newLanguage);
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      {showLabel && (
        <label htmlFor="language-select" className="text-sm font-medium text-gray-700">
          Language:
        </label>
      )}
      <select
        id="language-select"
        value={language}
        onChange={handleLanguageChange}
        disabled={isLoading}
        className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
      >
        {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
      {isLoading && (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      )}
    </div>
  );
}

interface LanguageToggleProps {
  className?: string;
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const { language, changeLanguage, isLoading } = useI18nContext();

  const toggleLanguage = () => {
    const newLanguage: SupportedLanguage = language === 'en' ? 'ko' : 'en';
    changeLanguage(newLanguage);
  };

  return (
    <button
      onClick={toggleLanguage}
      disabled={isLoading}
      className={`
        px-3 py-1 rounded-md text-sm font-medium 
        bg-gray-100 hover:bg-gray-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-200
        ${className || ''}
      `}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
      ) : (
        <span>{language === 'en' ? '한국어' : 'English'}</span>
      )}
    </button>
  );
}