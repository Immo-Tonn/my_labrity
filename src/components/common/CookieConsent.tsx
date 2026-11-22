'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import * as CookieConsentApi from 'vanilla-cookieconsent';

import 'vanilla-cookieconsent/dist/cookieconsent.css';

import { useLanguage } from '@/utils/LanguageContext';
import CookieIcon from '@/../public/icons/cookie.svg';
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

const CONSENT_REVISION = 1;

// Proof of consent (Art. 7(1) DSGVO): sends the choice and the random consent
// ID to /api/consent. Never blocks or changes the visitor's choice.
const logConsent = (trigger: 'first' | 'change', lang: string) => {
  try {
    const { consentId } = CookieConsentApi.getCookie();
    const { acceptType } = CookieConsentApi.getUserPreferences();

    void fetch('/api/consent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        consentId,
        acceptType,
        analytics: CookieConsentApi.acceptedCategory('analytics'),
        revision: CONSENT_REVISION,
        lang,
        path: window.location.pathname.slice(0, 120),
        trigger,
      }),
    }).catch(() => undefined);
  } catch {
    // Logging must never break the banner.
  }
};

const gtagUpdate = (granted: boolean) => {
  window.gtag?.('consent', 'update', {
    analytics_storage: granted ? 'granted' : 'denied',
  });
};

export default function CookieConsent() {
  const { lang } = useLanguage();
  const [analytics, setAnalytics] = useState(false);
  const [decided, setDecided] = useState(false);
  const initialLang = useRef(lang);
  const langRef = useRef(lang);

  useEffect(() => {
    const sync = () => {
      const granted = CookieConsentApi.acceptedCategory('analytics');

      // Consent Mode v2: the default (all denied) was set before anything
      // else; only now, after an explicit choice, is it upgraded.
      gtagUpdate(granted);
      if (GA_ID) window[`ga-disable-${GA_ID}`] = !granted;
      setAnalytics(granted);
      setDecided(true);
    };

    void CookieConsentApi.run({
      revision: CONSENT_REVISION,
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
      onFirstConsent: () => logConsent('first', langRef.current),
      onConsent: sync,
      onChange: () => {
        sync();
        logConsent('change', langRef.current);
      },
    });
    // Run once; language changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (initialLang.current === lang) return;

    initialLang.current = lang;
    langRef.current = lang;
    void CookieConsentApi.setLanguage(lang);
  }, [lang]);

  const label = COOKIE_TEXTS[lang]?.preferencesTitle ?? 'Cookie settings';

  return (
    <>
      {decided && (
        <button
          type="button"
          aria-label={label}
          title={label}
          onClick={() => CookieConsentApi.showPreferences()}
          className="group fixed bottom-4 left-4 z-[900] flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white text-black shadow-md transition hover:scale-105 hover:bg-black hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <CookieIcon
            width={26}
            height={24}
            aria-hidden="true"
            className="group-hover:[&_circle[fill='#FFFFFF']]:fill-black [&_path]:transition-[fill] group-hover:[&_path]:fill-white"
          />
        </button>
      )}
      {analytics && (
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
      )}
    </>
  );
}
