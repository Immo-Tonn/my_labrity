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
    title: 'Website Relaunch Agentur | Labrity',
    description:
      'Labrity begleitet Ihren Website-Relaunch mit einem strukturierten Vorgehen, das SEO-Risiken minimiert — von der Analyse bis zur sorgfältigen Umleitung.',
  },
  en: {
    title: 'Website Relaunch Agency | Labrity',
    description:
      'Labrity guides your website relaunch with a structured process that minimises SEO risk — from analysis to careful redirects.',
  },
  ru: {
    title: 'Обновление сайта (Relaunch) | Labrity',
    description:
      'Labrity сопровождает обновление сайта по структурному процессу, который снижает SEO-риски — от анализа до аккуратных редиректов.',
  },
  ua: {
    title: 'Оновлення сайту (Relaunch) | Labrity',
    description:
      'Labrity супроводжує оновлення сайту за структурним процесом, який знижує SEO-ризики — від аналізу до обережних редиректів.',
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
    { name: initialData.breadcrumbParentLabel, url: withLocale('/services', params.lang) },
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
