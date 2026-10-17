import { getData } from './getData';
import { type Language } from './localizedPath';

// og:locale uses underscore-separated BCP-47-ish codes, distinct from the
// hreflang codes in localizedPath.ts (which use hyphens/ISO 639-1 only).
const OG_LOCALE: Record<Language, string> = {
  de: 'de_DE',
  en: 'en_US',
  ru: 'ru_RU',
  ua: 'uk_UA',
};

const ALL_LOCALES: Language[] = ['de', 'en', 'ru', 'ua'];

type OpenGraphImage = {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
};

// Every page's own generateMetadata() replaces the layout's `openGraph`
// object wholesale (Next.js doesn't deep-merge it per field), so any field
// not repeated here — images, locale, siteName — silently disappears from
// that page's og: tags. This helper re-attaches them from meta.json on
// every page, so og:image and og:locale survive everywhere.
export async function buildOpenGraph(
  lang: Language,
  canonical: string,
  title: string,
  description: string,
) {
  const meta = await getData('meta', lang);
  const images: OpenGraphImage[] = meta.openGraph.images;

  return {
    type: 'website' as const,
    url: canonical,
    title,
    description,
    siteName: 'Labrity',
    locale: OG_LOCALE[lang],
    alternateLocale: ALL_LOCALES.filter(l => l !== lang).map(l => OG_LOCALE[l]),
    images,
  };
}
