import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import ProcessPageClient, { type ProcessData } from './ProcessPageClient';

const PATH = '/process';

const HOME_LABEL: Record<Language, string> = {
  de: 'Startseite',
  en: 'Home',
  ru: 'Главная',
  ua: 'Головна',
};

const META: Record<
  Language,
  { title: string; description: string; crumb: string }
> = {
  de: {
    crumb: 'Ablauf',
    title: 'Ablauf – Von der Idee zur Website | Labrity',
    description:
      'Wir begleiten Ihr Projekt Schritt für Schritt — mit klarer Struktur, modernem Design und einem Prozess, der verständlich bleibt.',
  },
  en: {
    crumb: 'Process',
    title: 'Process – From Idea to Website | Labrity',
    description:
      'We guide your project step by step — with clear structure, modern design and a process that stays easy to understand.',
  },
  ru: {
    crumb: 'Процесс',
    title: 'Процесс – От идеи до сайта | Labrity',
    description:
      'Мы ведём ваш проект шаг за шагом — с понятной структурой, современным дизайном и процессом, в котором легко ориентироваться.',
  },
  ua: {
    crumb: 'Процес',
    title: 'Процес – Від ідеї до сайту | Labrity',
    description:
      'Ми ведемо ваш проєкт крок за кроком — з чіткою структурою, сучасним дизайном і процесом, у якому легко орієнтуватися.',
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

export default async function ProcessPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: ProcessData = await getData('process', params.lang);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: HOME_LABEL[params.lang], url: withLocale('/', params.lang) },
    { name: META[params.lang].crumb, url: withLocale(PATH, params.lang) },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProcessPageClient initialData={initialData} />
    </>
  );
}
