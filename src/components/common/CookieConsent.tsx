'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import * as CookieConsentApi from 'vanilla-cookieconsent';

import 'vanilla-cookieconsent/dist/cookieconsent.css';

import { useLanguage } from '@/utils/LanguageContext';
import { LOCALES, withLocale } from '@/utils/localizedPath';

import { COOKIE_TEXTS } from './cookieConsentTexts';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    [key: `ga-disable-${string}`]: boolean | undefined;
  }
}

const link = (href: string, label: string) =>
  `<a href="${href}" class="cc__link">${label}</a>`;

const fill = (text: string, privacy: string, impressum: string) =>
  text.replace('{privacy}', privacy).replace('{impressum}', impressum);

const buildTranslations = () =>
  Object.fromEntries(
    LOCALES.map(code => {
      const t = COOKIE_TEXTS[code];
      const privacy = link(withLocale('/privacy', code), t.privacy);
      const impressum = link(withLocale('/impressum', code), t.impressum);

      return [
        code,
        {
          consentModal: {
            title: t.title,
            description: fill(t.description, privacy, impressum),
            acceptAllBtn: t.acceptAll,
            acceptNecessaryBtn: t.acceptNecessary,
            showPreferencesBtn: t.showPreferences,
          },
          preferencesModal: {
            title: t.preferencesTitle,
            acceptAllBtn: t.acceptAll,
            acceptNecessaryBtn: t.acceptNecessary,
            savePreferencesBtn: t.save,
            closeIconLabel: t.close,
            sections: [
              {
                title: t.necessaryTitle,
                description: t.necessaryDescription,
                linkedCategory: 'necessary',
              },
              {
                title: t.analyticsTitle,
                description: t.analyticsDescription,
                linkedCategory: 'analytics',
              },
              {
                title: t.moreTitle,
                description: fill(t.moreDescription, privacy, impressum),
              },
            ],
          },
        },
      ];
    }),
  );

const gtagUpdate = (granted: boolean) => {
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
};

export default function CookieConsent() {
  const { lang } = useLanguage();
  const [analytics, setAnalytics] = useState(false);
  const initialLang = useRef(lang);

  useEffect(() => {
    const sync = () => {
      const granted = CookieConsentApi.acceptedCategory('analytics');

      // Consent Mode v2: the default (all denied) was set before anything
      // else; only now, after an explicit choice, is it upgraded.
      gtagUpdate(granted);
      if (GA_ID) window[`ga-disable-${GA_ID}`] = !granted;
      setAnalytics(granted);
    };

    void CookieConsentApi.run({
      revision: 1,
      autoClearCookies: true,
      hideFromBots: true,
      disablePageInteraction: false,
      cookie: { name: 'labrity_cookie_consent', expiresAfterDays: 182 },
      guiOptions: {
        consentModal: {
          layout: 'box inline',
          position: 'bottom left',
          equalWeightButtons: true,
          flipButtons: false,
        },
        preferencesModal: {
          layout: 'box',
          equalWeightButtons: true,
          flipButtons: false,
        },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: {
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: '_gid' }],
          },
        },
      },
      language: {
        default: lang,
        translations: buildTranslations(),
      },
      onConsent: sync,
      onChange: sync,
    });
    // Run once; language changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLang.current === lang) return;

    initialLang.current = lang;
    void CookieConsentApi.setLanguage(lang);
  }, [lang]);

  if (!analytics) return null;

  return (
    <>
      <Analytics />
      {GA_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`gtag('js', new Date());gtag('config', '${GA_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
