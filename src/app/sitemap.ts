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
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/prices', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/process', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
];

function buildLanguageAlternates(path: string) {
  const languages: Record<string, string> = {};

  for (const lang of LOCALES) {
    languages[HREFLANG_CODES[lang]] = `${SITE_URL}${withLocale(path, lang)}`;
  }

  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PAGES.flatMap(({ path, changeFrequency, priority }) =>
    LOCALES.map((lang: Language) => ({
      url: `${SITE_URL}${withLocale(path, lang)}`,
      lastModified,
      changeFrequency,
      priority,
      alternates: {
        languages: buildLanguageAlternates(path),
      },
    })),
  );
}
