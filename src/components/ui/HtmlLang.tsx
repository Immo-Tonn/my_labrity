'use client';
import { useEffect } from 'react';
import { useLanguage } from '@/utils/LanguageContext';

const langMap: Record<string, string> = {
  de: 'de',
  en: 'en',
  ru: 'ru',
  ua: 'uk',
};

export default function HtmlLang() {
  const { lang } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = langMap[lang] ?? 'de';
  }, [lang]);
  return null;
}
