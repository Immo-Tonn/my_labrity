import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { isLanguage, withLocale } from '@/utils/localizedPath';
import HomePageClient, { type HomeData } from './HomePageClient';

const PATH = '/';

type PageParams = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  if (!isLanguage(params.lang)) notFound();

  const canonical = withLocale(PATH, params.lang);

  return {
    alternates: {
      canonical,
      languages: buildHreflangAlternates(PATH),
    },
    openGraph: {
      url: canonical,
    },
  };
}

export default async function Home({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: HomeData = await getData('home', params.lang);

  return <HomePageClient initialData={initialData} />;
}
