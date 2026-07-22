export type Language = 'de' | 'en' | 'ua' | 'ru';

export const LOCALES: Language[] = ['de', 'en', 'ua', 'ru'];

export const DEFAULT_LOCALE: Language = 'de';

// Maps our internal locale codes to real BCP-47/hreflang language codes.
// 'ua' is our folder/URL convention, but Ukrainian's actual language code is 'uk'.
export const HREFLANG_CODES: Record<Language, string> = {
  de: 'de',
  en: 'en',
  ru: 'ru',
  ua: 'uk',
};

export const isLanguage = (value: string): value is Language =>
  (LOCALES as string[]).includes(value);

const LOCALE_PREFIX_RE = /^\/(en|ua|ru)(?=\/|$)/;

// Splits a browser pathname into its locale and the locale-free path.
// '/ru/prices' -> { lang: 'ru', path: '/prices' }
// '/services'  -> { lang: 'de', path: '/services' }
// '/ru'        -> { lang: 'ru', path: '/' }
export function stripLocale(pathname: string): {
  lang: Language;
  path: string;
} {
  const match = pathname.match(LOCALE_PREFIX_RE);

  if (match) {
    const rest = pathname.slice(match[0].length) || '/';
    return { lang: match[1] as Language, path: rest };
  }

  return { lang: DEFAULT_LOCALE, path: pathname };
}

// Prefixes a locale-free path with its locale segment (default locale stays unprefixed).
// withLocale('/prices', 'ru') -> '/ru/prices'
// withLocale('/prices', 'de') -> '/prices'
export function withLocale(path: string, lang: Language): string {
  if (!path.startsWith('/')) return path;
  if (lang === DEFAULT_LOCALE) return path;

  return path === '/' ? `/${lang}` : `/${lang}${path}`;
}
