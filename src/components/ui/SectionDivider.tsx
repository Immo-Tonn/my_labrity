'use client';

import { useEffect, useState } from 'react';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

interface DividerData {
  title: string;
}

export const SectionDivider = () => {
  const { lang } = useLanguage();
  const [divider, setDivider] = useState<DividerData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getData('divider', lang);
      setDivider(result);
    };

    loadData();
  }, [lang]);

  if (!divider) return null;

  return (
    <div className="relative flex h-[200px] w-full items-center justify-center bg-[#1a130f] px-6 md:px-10">
      {/* TOP LINE */}
      <div className="absolute left-0 top-0 h-[1px] w-full bg-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />

      {/* TEXT */}
      <div className="w-full text-center font-montserrat text-2xl font-light tracking-[0.35em] text-[#e8d59c] drop-shadow-[0_0_6px_rgba(232,213,156,0.6)] md:text-3xl">
        {divider.title}
      </div>

      {/* BOTTOM LINE */}
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
    </div>
  );
};
