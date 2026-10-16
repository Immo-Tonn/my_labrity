import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import WebsiteRelaunchPageClient, {
  type WebsiteRelaunchData,
} from './WebsiteRelaunchPageClient';

const PATH = '/website-relaunch';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Website Relaunch: SEO und Weiterleitungen im Blick | Labrity',
    description:
      'Website erneuern, ohne Sichtbarkeit unnötig zu riskieren: Analyse, saubere 301-Weiterleitungen und ein strukturiertes Vorgehen beim Relaunch.',
  },
  en: {
    title: 'Website Relaunch with SEO and Redirects in Mind | Labrity',
    description:
      'Renew your website without needless risk to your visibility: analysis, clean 301 redirects and a structured process for your relaunch.',
  },
  ru: {
    title: 'Обновление сайта с учётом SEO и редиректов | Labrity',
    description:
      'Обновите сайт без лишнего риска для видимости: анализ текущего сайта, аккуратные 301-редиректы и структурный процесс обновления.',
  },
  ua: {
    title: 'Оновлення сайту з урахуванням SEO та редиректів | Labrity',
    description:
      'Оновіть сайт без зайвого ризику для видимості: аналіз поточного сайту, акуратні 301-редиректи та структурований процес оновлення.',
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
