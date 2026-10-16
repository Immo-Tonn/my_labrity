import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import LandingpageErstellenLassenPageClient, {
  type LandingpageErstellenLassenData,
} from './LandingpageErstellenLassenPageClient';

const PATH = '/landingpage-erstellen-lassen';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Landingpage erstellen lassen für Kampagne & Angebot | Labrity',
    description:
      'Eine Landingpage mit einem klaren Ziel – für Ihre Kampagne, Ihr Angebot oder einen schnellen Start. Struktur, Design und Umsetzung aus einer Hand.',
  },
  en: {
    title: 'Landing Page Design for Campaigns & Offers | Labrity',
    description:
      'A landing page with one clear goal – for your campaign, your offer or a fast start. Structure, design and build from a single source.',
  },
  ru: {
    title: 'Лендинг под кампанию или предложение | Labrity',
    description:
      'Лендинг с одной понятной целью — для вашей кампании, предложения или быстрого старта. Структура, дизайн и реализация в одних руках.',
  },
  ua: {
    title: 'Лендінг під кампанію чи пропозицію | Labrity',
    description:
      'Лендінг з однією зрозумілою метою — для вашої кампанії, пропозиції чи швидкого старту. Структура, дизайн і реалізація в одних руках.',
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
