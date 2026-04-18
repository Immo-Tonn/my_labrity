'use client';

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui';
import ArrowDown from '@/../public/icons/arrow-down.svg';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

import styles from './Hero.module.css';

export const Hero = () => {
  const { lang } = useLanguage();

  const [hero, setHero] = useState<any>(null);
  const [common, setCommon] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const heroData = await getData('hero', lang);
      const commonData = await getData('common', lang);

      setHero(heroData);
      setCommon(commonData);
    };

    loadData();
  }, [lang]);

  if (!hero || !common) return null;

  return (
    <section
      className={`
        relative min-h-screen w-full
        pb-[140px] pt-[140px]
        md:pb-[122px] md:pt-[122px]
        xl:pb-[262px] xl:pt-[234px]
        ${styles.section_hero}
      `}
    >
      {/* Видео фон */}
      <video
        className="absolute inset-0 z-0 h-full w-full object-cover"
        src="/videos/hero.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* затемнение */}
      <div className="absolute inset-0 z-[2] bg-black/35" />

      {/* контент */}
      <div className="container relative z-[3] xl:pt-[110px]">
        <p className="mb-4 font-montserrat font-medium uppercase text-[rgba(255,245,225,0.92)] drop-shadow-[0_0_4px_rgba(0,0,0,0.45)] md:text-base">
          {hero.pretitle}
        </p>

        <h1 className="mb-12 font-tenor text-large/[48px] font-normal tracking-[0.5px] text-[rgba(255,230,170,1)] drop-shadow-[0_0_6px_rgba(0,0,0,0.45)] md:mb-14 md:text-7xl/[84px] xl:mb-16 xl:w-[600px]">
          {hero.title}
        </h1>

        <Button tag="a" href={hero.btnHeroHref} className="mt-6" accent={false}>
          {common.buttonsText.v1}
        </Button>
      </div>

      {/* стрелка вниз */}
      <ArrowDown
        aria-label={hero.ariaLabelIcon}
        onClick={() => {
          const section = document.getElementById('about');
          section?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="
          absolute bottom-[80px] left-1/2
          z-[3]
          h-[36px]
          w-[36px] -translate-x-1/2
          drop-shadow-[0_0_6px_rgba(255,230,150,0.9)]
          md:bottom-[100px] md:h-[44px] md:w-[44px]
          xl:bottom-[120px] xl:h-[52px] xl:w-[52px]
          [&>path]:stroke-[rgba(255,230,150,0.95)]
        "
      />
    </section>
  );
};
