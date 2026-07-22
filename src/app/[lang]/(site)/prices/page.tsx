import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
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
    openGraph: {
      url: canonical,
      title: prices.meta.title,
      description: prices.meta.description,
    },
  };
}

export default async function PricesPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: PricesData = await getData('prices', params.lang);

  return <PricesPageClient initialData={initialData} />;
}
