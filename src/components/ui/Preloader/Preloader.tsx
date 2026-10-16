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

const SESSION_KEY = 'labrity-preloader-seen';

export const Preloader = () => {
  const { lang } = useLanguage();

  const [data, setData] = useState<CommonData | null>(null);
  // Starts hidden: it is only switched on after mount, and only on the first
  // visit of a browser session, so repeat visits (and reduced-motion
  // visitors) never wait for it and the server HTML never carries the overlay.
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = window.sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      // Storage blocked: fall back to showing it once per page load.
    }

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (seen || reducedMotion) return;

    setShow(true);

    const fadeTimer = window.setTimeout(() => {
      setFade(true);
    }, 900);

    const hideTimer = window.setTimeout(() => {
      try {
        window.sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        // ignore
      }
      setShow(false);
    }, 1800);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (!show) return;

    let cancelled = false;

    getData('common', lang).then(result => {
      if (!cancelled) setData(result);
    });

    return () => {
      cancelled = true;
    };
  }, [lang, show]);

  if (!show) return null;

  // Branding text is static, so the overlay renders immediately; the
  // localized subtitle swaps in as soon as the dictionary has loaded.
  const logoLabel = data?.layout.logo.label || 'Labrity';
  const subtitle = data?.layout.logo.preloaderSubtitle || 'Premium Web Studio';

  return (
    <div className={`${s.wrapper} ${fade ? s.fadeOut : ''}`} aria-hidden="true">
      <div className={s.inner}>
        <div className={s.line}>
          <span className={s.lineFill} />
        </div>

        <p className={s.logo}>{logoLabel}</p>
        <p className={s.subtitle}>{subtitle}</p>
      </div>
    </div>
  );
};
