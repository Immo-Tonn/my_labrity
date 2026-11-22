import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import LandingpageErstellenLassenPageClient, {
  type LandingpageErstellenLassenData,
} from './LandingpageErstellenLassenPageClient';

const PATH = '/landingpage-erstellen-lassen';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Landingpage erstellen lassen in Münster | Labrity',
    description:
      'Landingpage erstellen lassen in Münster: eine Seite mit klarem Ziel für Kampagne, Angebot oder schnellen Start. Struktur, Design und Umsetzung.',
  },
  en: {
    title: 'Landing Page Design in Münster | Labrity',
    description:
      'Landing page design in Münster: one page with one clear goal for your campaign, your offer or a fast start. Structure, design and build.',
  },
  ru: {
    title: 'Создание лендинга в Мюнстере | Labrity',
    description:
      'Создание лендинга в Мюнстере: страница с одной понятной целью для кампании, предложения или быстрого старта. Структура, дизайн, реализация.',
  },
  ua: {
    title: 'Створення лендінгу в Мюнстері | Labrity',
    description:
      'Створення лендінгу в Мюнстері: сторінка з однією зрозумілою метою для кампанії, пропозиції чи швидкого старту. Структура, дизайн, реалізація.',
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

export default async function LandingpageErstellenLassenPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: LandingpageErstellenLassenData = await getData(
    'landingpage-erstellen-lassen',
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
      <LandingpageErstellenLassenPageClient initialData={initialData} />
    </>
  );
}
