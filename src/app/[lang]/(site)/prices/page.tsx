import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { isLanguage, withLocale } from '@/utils/localizedPath';
import PricesPageClient, { type PricesData } from './PricesPageClient';

const PATH = '/prices';

type PageParams = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  if (!isLanguage(params.lang)) notFound();

  const prices = await getData('prices', params.lang);
  const canonical = withLocale(PATH, params.lang);

  return {
    title: prices.meta.title,
    description: prices.meta.description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(PATH),
    },
    openGraph: await buildOpenGraph(
      params.lang,
      canonical,
      prices.meta.title,
      prices.meta.description,
    ),
  };
}

export default async function PricesPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: PricesData = await getData('prices', params.lang);

  // FAQPage schema built directly from the FAQ block actually rendered below
  // (PricesPageClient), so the structured data can never drift from what a
  // visitor sees — this is the only page with a real, visible FAQ.
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: initialData.faq.items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <PricesPageClient initialData={initialData} />
    </>
  );
}
