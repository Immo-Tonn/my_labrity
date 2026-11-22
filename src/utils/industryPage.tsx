import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import IndustryPageClient, {
  type IndustryPageData,
} from '@/components/common/IndustryPage/IndustryPageClient';
import {
  INDUSTRIES,
  industryDemoUrl,
  type IndustrySlug,
} from '@/data/industries';
import { getData } from '@/utils/getData';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { isLanguage, withLocale } from '@/utils/localizedPath';
import { buildOpenGraph } from '@/utils/openGraph';
import { SITE_URL } from '@/utils/siteUrl';
import { buildTwitter } from '@/utils/twitter';

type PageParams = { lang: string };

export async function generateIndustryMetadata(
  slug: IndustrySlug,
  params: PageParams,
): Promise<Metadata> {
  if (!isLanguage(params.lang)) notFound();

  const { path, dataFile } = INDUSTRIES[slug];
  const data: IndustryPageData = await getData(dataFile, params.lang);
  const { title, description } = data.meta;
  const canonical = withLocale(path, params.lang);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(path),
    },
    openGraph: await buildOpenGraph(params.lang, canonical, title, description),
    twitter: await buildTwitter(params.lang, title, description),
  };
}

export async function IndustryPage({
  slug,
  params,
}: {
  slug: IndustrySlug;
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const { path, dataFile, image } = INDUSTRIES[slug];
  const initialData: IndustryPageData = await getData(dataFile, params.lang);
  const { title, description } = initialData.meta;
  const url = `${SITE_URL}${withLocale(path, params.lang)}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    {
      name: initialData.breadcrumbParentLabel,
      url: withLocale('/services', params.lang),
    },
    { name: initialData.hero.kicker, url: withLocale(path, params.lang) },
  ]);

  // Service without any offer/price. The catalog lists exactly the building
  // blocks visible on the page (no invented clients, no ratings, no reviews).
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title.replace(/ \| Labrity$/, ''),
    description,
    serviceType: initialData.hero.kicker,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: [
      { '@type': 'City', name: 'Münster' },
      { '@type': 'Country', name: 'Germany' },
    ],
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
      <IndustryPageClient
        initialData={initialData}
        demoUrl={industryDemoUrl(slug, params.lang)}
        image={image}
      />
    </>
  );
}
