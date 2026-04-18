'use client';

import React, { useEffect, useState } from 'react';

import { AboutList } from '@/components/common';
import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

export const About = () => {
  const { lang } = useLanguage();
  const [about, setAbout] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('about', lang);
      setAbout(data);
    };

    loadData();
  }, [lang]);

  if (!about) return null;

  return (
    <section
      id="about"
      className="relative w-full py-20 md:py-[120px] xl:py-40"
    >
      {/* плавный переход между двумя видео */}
      <div className="pointer-events-none absolute left-0 top-0 h-32 w-full bg-gradient-to-b from-black/70 to-transparent"></div>

      <div className="container">
        {/* TITLE */}
        <div className="mb-12 max-w-[720px]">
          <h2 className="section-subtitle font-tenor text-accent">
            {about.titleText}
          </h2>
        </div>

        {/* LIST */}
        <div className="max-w-[720px]">
          <AboutList aboutServices={about.services} />
        </div>
      </div>
    </section>
  );
};
