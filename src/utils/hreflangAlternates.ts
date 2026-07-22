import {
  DEFAULT_LOCALE,
  HREFLANG_CODES,
  LOCALES,
  withLocale,
} from './localizedPath';

// Builds the `alternates.languages` (hreflang) map for a locale-free path.
// buildHreflangAlternates('/services') ->
//   { de: '/services', en: '/en/services', ru: '/ru/services', uk: '/ua/services', 'x-default': '/services' }
export function buildHreflangAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};

  for (const lang of LOCALES) {
    languages[HREFLANG_CODES[lang]] = withLocale(path, lang);
  }

  languages['x-default'] = withLocale(path, DEFAULT_LOCALE);

  return languages;
}
