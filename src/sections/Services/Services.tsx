'use client';

import React, { useEffect, useState } from 'react';

import { ServicesList } from '@/components/common';
import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

export const Services = () => {
  const { lang } = useLanguage();
  const [common, setCommon] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('common', lang);
      setCommon(data);
    };

    loadData();
  }, [lang]);

  if (!common) return null;

  const servicesTitle = common.layout.titles.services;

  return (
    <section id="services" className="w-full py-10 md:py-[60px] xl:py-20">
      <div className="container">
        <h2 className="section-title mb-10 font-tenor text-accent md:mb-12 xl:mb-[60px]">
          {servicesTitle}
        </h2>

        <ServicesList />
      </div>
    </section>
  );
};
