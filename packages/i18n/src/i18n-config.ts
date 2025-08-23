import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import koTranslations from './locales/ko.json';

export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ko: '한국어',
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

const resources = {
  en: { translation: enTranslations },
  ko: { translation: koTranslations },
};

export const initI18n = () => {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: DEFAULT_LANGUAGE,
      fallbackLng: DEFAULT_LANGUAGE,
      debug: process.env.NODE_ENV === 'development',

      interpolation: {
        escapeValue: false, // React already escapes values
      },

      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'i18nextLng',
      },

      react: {
        useSuspense: false,
      },
    });

  return i18n;
};

export { i18n };
export default i18n;