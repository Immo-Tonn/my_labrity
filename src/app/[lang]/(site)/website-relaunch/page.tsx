import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import WebsiteRelaunchPageClient, {
  type WebsiteRelaunchData,
} from './WebsiteRelaunchPageClient';

const PATH = '/website-relaunch';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Website Relaunch in Münster: SEO im Blick | Labrity',
    description:
      'Website Relaunch in Münster ohne unnötiges Risiko für Ihre Sichtbarkeit: Analyse, saubere 301-Weiterleitungen und ein strukturiertes Vorgehen.',
  },
  en: {
    title: 'Website Relaunch in Münster, SEO in Mind | Labrity',
    description:
      'Website relaunch in Münster without needless risk to your visibility: analysis, clean 301 redirects and a structured process.',
  },
  ru: {
    title: 'Обновление сайта в Мюнстере с учётом SEO | Labrity',
    description:
      'Обновление сайта в Мюнстере без лишнего риска для видимости: анализ, аккуратные 301-редиректы и структурный процесс.',
  },
  ua: {
    title: 'Оновлення сайту в Мюнстері з урахуванням SEO | Labrity',
    description:
      'Оновлення сайту в Мюнстері без зайвого ризику для видимості: аналіз, акуратні 301-редиректи та структурований процес.',
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

export default async function WebsiteRelaunchPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: WebsiteRelaunchData = await getData(
    'website-relaunch',
    params.lang,
  );

  const breadcrumbSchema = buildBreadcrumbSchema([
    {
      name: initialData.breadcrumbParentLabel,
      url: withLocale('/services', params.lang),
    },
    { name: initialData.hero.kicker, url: withLocale(PATH, params.lang) },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <WebsiteRelaunchPageClient initialData={initialData} />
    </>
  );
}
