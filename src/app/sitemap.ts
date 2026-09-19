import type { MetadataRoute } from 'next';

import { SITE_URL } from '@/utils/siteUrl';
import {
  HREFLANG_CODES,
  LOCALES,
  withLocale,
  type Language,
} from '@/utils/localizedPath';

const PAGES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/services', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/website-erstellen-lassen', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/webdesign', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/webentwicklung', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/website-relaunch', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/landingpage-erstellen-lassen', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/prices', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/process', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
];

function buildLanguageAlternates(path: string) {
  const languages: Record<string, string> = {};

  for (const lang of LOCALES) {
    languages[HREFLANG_CODES[lang]] = `${SITE_URL}${withLocale(path, lang)}`;
  }

  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // No `lastModified` field: we don't track real per-page change dates, and
  // a timestamp that's just "now" on every build/request is worse than no
  // signal at all — it tells crawlers everything changed today regardless
  // of whether it actually did.
  return PAGES.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((lang: Language) => ({
      url: `${SITE_URL}${withLocale(path, lang)}`,
      changeFrequency,
      priority,
      alternates: {
        languages: buildLanguageAlternates(path),
      },
    })),
  );
}
