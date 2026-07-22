import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import ProcessPageClient, { type ProcessData } from './ProcessPageClient';

const PATH = '/process';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Ablauf – Von der Idee zur Website | Labrity',
    description:
      'Wir begleiten Ihr Projekt Schritt für Schritt — mit klarer Struktur, modernem Design und einem Prozess, der verständlich bleibt.',
  },
  en: {
    title: 'Process – From Idea to Website | Labrity',
    description:
      'We guide your project step by step — with clear structure, modern design and a process that stays easy to understand.',
  },
  ru: {
    title: 'Процесс – От идеи до сайта | Labrity',
    description:
      'Мы ведём ваш проект шаг за шагом — с понятной структурой, современным дизайном и процессом, в котором легко ориентироваться.',
  },
  ua: {
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
    openGraph: {
      url: canonical,
      title,
      description,
    },
  };
}

export default async function ProcessPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: ProcessData = await getData('process', params.lang);

  return <ProcessPageClient initialData={initialData} />;
}
