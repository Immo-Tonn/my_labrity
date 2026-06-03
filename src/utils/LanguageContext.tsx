'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Language = 'de' | 'en' | 'ua' | 'ru';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

const DEFAULT_LANGUAGE: Language = 'de';
const STORAGE_KEY = 'language';

const isValidLanguage = (value: string | null): value is Language => {
  return value === 'de' || value === 'en' || value === 'ua' || value === 'ru';
};

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLangState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(STORAGE_KEY);

    if (isValidLanguage(savedLanguage)) {
      setLangState(savedLanguage);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    window.localStorage.setItem(STORAGE_KEY, newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
};
