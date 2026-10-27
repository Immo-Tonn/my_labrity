import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { SITE_URL } from '@/utils/siteUrl';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import FashionBrandsPageClient, {
  type FashionBrandsData,
} from './FashionBrandsPageClient';

const PATH = '/website-fuer-modemarken';

// NØFORM concept site: the language versions that exist (de, en, uk). Russian
// visitors get the German version.
const DEMO_URL: Record<Language, string> = {
  de: 'https://noform-drab.vercel.app/de',
  en: 'https://noform-drab.vercel.app/en',
  ru: 'https://noform-drab.vercel.app/de',
  ua: 'https://noform-drab.vercel.app/uk',
};

// Niche page for fashion labels and streetwear brands. It targets "website for
// fashion brand" intent only; generic landing-page and company-site intent
// stays on /landingpage-erstellen-lassen and /website-erstellen-lassen.
const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Website für Modemarken erstellen lassen | Labrity',
    description:
      'Websites für Labels und Streetwear-Marken: Kampagnen-Einstieg, Lookbook und Kollektionsstart. Mit dem Konzeptbeispiel NØFORM.',
  },
  en: {
    title: 'Website for Fashion Brands and Labels | Labrity',
    description:
      'Websites for labels and streetwear brands: campaign opening, lookbook and collection launch. With the NØFORM concept project as an example.',
  },
  ru: {
    title: 'Сайт для модного бренда и лейбла | Labrity',
    description:
      'Сайты для лейблов и streetwear-брендов: кампейн-экран, лукбук и запуск коллекции. С концепт-проектом NØFORM в качестве примера.',
  },
  ua: {
    title: 'Сайт для модного бренду та лейблу | Labrity',
    description:
      'Сайти для лейблів і streetwear-брендів: кампейн-екран, лукбук і запуск колекції. З концепт-проєктом NØFORM як прикладом.',
  },
};

type PageParams = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  if (!isLanguage(params.lang)) notFound();

  const { title, description } = META[params.lang];
  const canonical = withLocale(PATH, params.lang);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(PATH),
    },
    openGraph: await buildOpenGraph(params.lang, canonical, title, description),
    twitter: await buildTwitter(params.lang, title, description),
  };
}

export default async function FashionBrandsPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: FashionBrandsData = await getData(
    'fashion-brands',
    params.lang,
  );
  const { title, description } = META[params.lang];
  const url = `${SITE_URL}${withLocale(PATH, params.lang)}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    {
      name: initialData.breadcrumbParentLabel,
      url: withLocale('/services', params.lang),
    },
    { name: initialData.hero.kicker, url: withLocale(PATH, params.lang) },
  ]);

  // Service without any offer/price. The catalog lists exactly the building
  // blocks that are visible on the page (no invented clients, no ratings).
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title.replace(/ \| Labrity$/, ''),
    description,
    serviceType: initialData.hero.kicker,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Germany' },
    url,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: initialData.offer.title,
      itemListElement: initialData.offer.items.map(item => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.title,
          description: item.description,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <FashionBrandsPageClient
        initialData={initialData}
        demoUrl={DEMO_URL[params.lang]}
      />
    </>
  );
}
