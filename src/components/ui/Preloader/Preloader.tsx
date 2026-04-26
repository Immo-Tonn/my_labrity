'use client';

import React, { useEffect, useState } from 'react';
import s from './Preloader.module.css';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

interface CommonData {
  layout: {
    logo: {
      label: string;
      preloaderSubtitle?: string;
    };
  };
}

export const Preloader = () => {
  const { lang } = useLanguage();

  const [data, setData] = useState<CommonData | null>(null);
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const result = await getData('common', lang);
      setData(result);
    };

    loadData();
  }, [lang]);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => {
      setFade(true);
    }, 900);

    const hideTimer = window.setTimeout(() => {
      setShow(false);
    }, 1800);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!show || !data) return null;

  const logoLabel = data.layout.logo.label || 'Labrity';
  const subtitle = data.layout.logo.preloaderSubtitle || 'Premium Web Studio';

  return (
    <div className={`${s.wrapper} ${fade ? s.fadeOut : ''}`}>
      <div className={s.inner}>
        <div className={s.line} aria-hidden="true">
          <span className={s.lineFill} />
        </div>

        <h1 className={s.logo}>{logoLabel}</h1>
        <p className={s.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
};
