"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import { initI18n, SupportedLanguage, DEFAULT_LANGUAGE } from './i18n-config';

interface I18nContextValue {
  language: SupportedLanguage;
  changeLanguage: (lang: SupportedLanguage) => void;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

interface I18nProviderProps {
  children: React.ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<SupportedLanguage>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [i18nInstance] = useState(() => initI18n());

  useEffect(() => {
    const initLanguage = async () => {
      try {
        // Wait for i18next to initialize
        await i18nInstance.init();
        setLanguage(i18nInstance.language as SupportedLanguage);
      } catch (error) {
        console.error('Failed to initialize i18n:', error);
        setLanguage(DEFAULT_LANGUAGE);
      } finally {
        setIsLoading(false);
      }
    };

    initLanguage();
  }, [i18nInstance]);

  const changeLanguage = async (lang: SupportedLanguage) => {
    setIsLoading(true);
    try {
      await i18nInstance.changeLanguage(lang);
      setLanguage(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: I18nContextValue = {
    language,
    changeLanguage,
    isLoading,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <I18nContext.Provider value={contextValue}>
      <I18nextProvider i18n={i18nInstance}>
        {children}
      </I18nextProvider>
    </I18nContext.Provider>
  );
}

export function useI18nContext() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18nContext must be used within an I18nProvider');
  }
  return context;
}