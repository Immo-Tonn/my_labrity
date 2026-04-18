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
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 1000);

    const hideTimer = setTimeout(() => {
      setShow(false);
    }, 2500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!show || !data) return null;

  const { logo } = data.layout;

  return (
    <div className={`${s.wrapper} ${fade ? s.fadeOut : ''}`}>
      <div className={s.inner}>
        <h1 className={s.logo}>{logo.label}</h1>

        <div className={s.loader}>
          <div className={s.orbit}>
            <div className={s.spark}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
