
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { translations } from '@/i18n/translations';
import { TranslationsType } from '@/i18n/types';

type Language = 'en' | 'es' | 'fr';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Check if there's a saved language preference
  const getSavedLanguage = (): Language => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage === 'en' || savedLanguage === 'es' || savedLanguage === 'fr') 
      ? savedLanguage as Language 
      : 'en';
  };

  const [language, setLanguage] = useState<Language>(getSavedLanguage());

  // Save language preference when it changes
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language] || translations[key]['en']; // Fallback to English
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
