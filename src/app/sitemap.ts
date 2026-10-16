import type { MetadataRoute } from 'next';

import { BLOG_SLUGS } from '@/data/blogSlugs';
import { getData } from '@/utils/getData';
import { SITE_URL } from '@/utils/siteUrl';
import {
  DEFAULT_LOCALE,
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
  {
    path: '/website-erstellen-lassen',
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  { path: '/webdesign', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/webentwicklung', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/web-apps', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/website-relaunch', changeFrequency: 'weekly', priority: 0.9 },
  {
    path: '/landingpage-erstellen-lassen',
    changeFrequency: 'weekly',
    priority: 0.9,
  },
  { path: '/portfolio', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/prices', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/process', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/impressum', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/ueber-uns', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
];

// Absolute URL for a locale-free path. The German homepage is the bare origin
// (no trailing slash), matching the <link rel="canonical"> that Next.js emits.
function absoluteUrl(path: string, lang: Language) {
  return `${SITE_URL}${withLocale(path, lang)}`.replace(/\/$/, '');
}

function buildLanguageAlternates(path: string) {
  const languages: Record<string, string> = {};

  for (const lang of LOCALES) {
    languages[HREFLANG_CODES[lang]] = absoluteUrl(path, lang);
  }

  languages['x-default'] = absoluteUrl(path, DEFAULT_LOCALE);

  return languages;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // No `lastModified` on static pages: we don't track real per-page change
  // dates, and a timestamp that's just "now" on every build/request is worse
  // than no signal at all. Blog articles are the exception — they carry a
  // real `updatedDate` in their own JSON, which is used as `lastModified`.
  const localizedEntries = PAGES.flatMap(
    ({ path, changeFrequency, priority }) =>
      LOCALES.map((lang: Language) => ({
        url: absoluteUrl(path, lang),
        changeFrequency,
        priority,
        alternates: {
          languages: buildLanguageAlternates(path),
        },
      })),
  );

  const blogArticleEntries = await Promise.all(
    BLOG_SLUGS.flatMap(slug =>
      LOCALES.map(async (lang: Language) => {
        const path = `/blog/${slug}`;
        const article = await getData(`blog/${slug}`, lang);
        const updatedDate: unknown = article.updatedDate;
        const lastModified =
          typeof updatedDate === 'string' &&
          !Number.isNaN(Date.parse(updatedDate))
            ? updatedDate
            : undefined;

        return {
          url: absoluteUrl(path, lang),
          ...(lastModified ? { lastModified } : {}),
          changeFrequency: 'monthly' as const,
          priority: 0.6,
          alternates: {
            languages: buildLanguageAlternates(path),
          },
        };
      }),
    ),
  );

  return [...localizedEntries, ...blogArticleEntries];
}
