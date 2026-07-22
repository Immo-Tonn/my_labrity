import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import PortfolioPageClient, { type PortfolioData } from './PortfolioPageClient';

const PATH = '/portfolio';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Portfolio – Referenzprojekte | Labrity',
    description:
      'Ausgewählte Projekte, die zeigen, wie wir Ästhetik, Strategie und Performance zu einer digitalen Präsenz auf Premium-Niveau verbinden.',
  },
  en: {
    title: 'Portfolio – Reference Projects | Labrity',
    description:
      'Selected projects showing how we combine aesthetics, strategy and performance into a premium digital presence.',
  },
  ru: {
    title: 'Портфолио – Примеры работ | Labrity',
    description:
      'Избранные проекты, которые показывают, как мы соединяем эстетику, стратегию и эффективность в сильное цифровое присутствие premium-уровня.',
  },
  ua: {
    title: 'Портфоліо – Приклади робіт | Labrity',
    description:
      'Обрані проєкти, що показують, як ми поєднуємо естетику, стратегію та ефективність у premium цифрову присутність.',
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

export default async function PortfolioPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const home = await getData('home', params.lang);
  const initialData: PortfolioData = home.portfolio;

  return <PortfolioPageClient initialData={initialData} />;
}
