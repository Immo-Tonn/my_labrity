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

  const homeData = await getData('home', params.lang);

  // The homepage's featured-projects carousel used to keep its own hand-authored
  // copy of each project's title/category/image, separate from the portfolio
  // page's data — the two lists had already drifted apart (different titles for
  // the same project, different item order). Deriving the carousel items from
  // `portfolio.items`/`portfolio.categories` here makes the portfolio page the
  // single source of truth, so both pages always show the same project titles,
  // images and order.
  const initialData: HomeData = {
    ...homeData,
    featuredProjects: {
      ...homeData.featuredProjects,
      items: homeData.portfolio.items.map(
        (item: { title: string; image?: string }) => ({
          title: item.title,
          category: homeData.portfolio.categories[item.title] ?? '',
          image: item.image ?? '',
        }),
      ),
    },
  };

  return <HomePageClient initialData={initialData} />;
}
