import type { Language } from '@/utils/localizedPath';

export type IndustryConfig = {
  path: string;
  dataFile: string;
  image: { src: string; width: number; height: number };
  // Host of the live concept site and the language versions it really has.
  // Visitors in a language the concept lacks get the German version.
  demoHost: string;
  demoLangs: ReadonlyArray<'de' | 'en' | 'ru' | 'uk'>;
};

// Niche landing pages for industries. Each page targets "website for <industry>
// in Münster" intent and points at one concept project from the portfolio.
export const INDUSTRIES = {
  arztpraxis: {
    path: '/website-fuer-arztpraxis',
    dataFile: 'industry-arztpraxis',
    image: {
      src: '/images/projects/hausarztpraxis-weber.webp',
      width: 1600,
      height: 887,
    },
    demoHost: 'hausarzt-concept',
    demoLangs: ['de', 'en', 'uk'],
  },
  'beauty-studio': {
    path: '/website-fuer-beauty-studio',
    dataFile: 'industry-beauty-studio',
    image: {
      src: '/images/projects/lash-studio-demo.webp',
      width: 1600,
      height: 888,
    },
    demoHost: 'beauty-studio-demo-nine',
    demoLangs: ['de', 'en', 'uk'],
  },
  pizzeria: {
    path: '/website-fuer-pizzeria',
    dataFile: 'industry-pizzeria',
    image: {
      src: '/images/projects/pizza-doner.webp',
      width: 1600,
      height: 874,
    },
    demoHost: 'pizza-doner-lieferservice',
    demoLangs: ['de', 'en', 'uk'],
  },
  billardclub: {
    path: '/website-fuer-billardclub',
    dataFile: 'industry-billardclub',
    image: {
      src: '/images/projects/billyard.webp',
      width: 1600,
      height: 966,
    },
    demoHost: 'billyard-nu',
    demoLangs: ['de', 'en', 'ru'],
  },
  apartments: {
    path: '/website-fuer-apartments',
    dataFile: 'industry-apartments',
    image: {
      src: '/images/projects/apartament-demo.webp',
      width: 1600,
      height: 1045,
    },
    demoHost: 'apartament-demo',
    demoLangs: ['de', 'en', 'ru'],
  },
} as const satisfies Record<string, IndustryConfig>;

export type IndustrySlug = keyof typeof INDUSTRIES;

const DEMO_LANG: Record<Language, 'de' | 'en' | 'ru' | 'uk'> = {
  de: 'de',
  en: 'en',
  ru: 'ru',
  ua: 'uk',
};

export function industryDemoUrl(slug: IndustrySlug, lang: Language) {
  const { demoHost, demoLangs } = INDUSTRIES[slug];
  const want = DEMO_LANG[lang];
  const path = (demoLangs as readonly string[]).includes(want) ? want : 'de';
  return `https://${demoHost}.vercel.app/${path}`;
}
