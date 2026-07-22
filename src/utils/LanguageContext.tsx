'use client';

import { createContext, useContext } from 'react';

import type { Language } from './localizedPath';

interface LanguageContextType {
  lang: Language;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({
  lang,
  children,
}: {
  lang: Language;
  children: React.ReactNode;
}) => {
  return (
    <LanguageContext.Provider value={{ lang }}>
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
