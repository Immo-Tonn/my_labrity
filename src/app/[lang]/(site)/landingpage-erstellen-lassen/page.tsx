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
    title: 'Landingpage erstellen lassen | Labrity',
    description:
      'Eine Landingpage für Ihre Kampagne oder Ihr Angebot — klar auf ein Ziel ausgerichtet und schnell umgesetzt.',
  },
  en: {
    title: 'Landing Page Design | Labrity',
    description:
      'A landing page for your campaign or offer — focused on one goal and built fast.',
  },
  ru: {
    title: 'Создание лендинга | Labrity',
    description:
      'Лендинг под вашу кампанию или предложение — с фокусом на одну цель и быстрой реализацией.',
  },
  ua: {
    title: 'Створення лендингу | Labrity',
    description:
      'Лендинг під вашу кампанію чи пропозицію — з фокусом на одну мету та швидкою реалізацією.',
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
    { name: initialData.breadcrumbParentLabel, url: withLocale('/services', params.lang) },
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
