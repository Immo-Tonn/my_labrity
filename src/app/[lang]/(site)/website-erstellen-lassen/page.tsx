import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import WebsiteErstellenLassenPageClient, {
  type WebsiteErstellenLassenData,
} from './WebsiteErstellenLassenPageClient';

const PATH = '/website-erstellen-lassen';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Website erstellen lassen | Labrity',
    description:
      'Sie möchten eine Website erstellen lassen, die von Anfang an überzeugt? Labrity begleitet Sie von der ersten Idee bis zum fertigen, professionellen Auftritt.',
  },
  en: {
    title: 'Website Design & Build | Labrity',
    description:
      'Ready to have your website built by professionals? Labrity takes you from the first idea to a finished, professional site.',
  },
  ru: {
    title: 'Разработка сайта | Labrity',
    description:
      'Хотите заказать разработку сайта, который убеждает с первого визита? Labrity проведёт вас от идеи до готового профессионального сайта.',
  },
  ua: {
    title: 'Розробка сайту | Labrity',
    description:
      'Хочете замовити розробку сайту, який переконує з першого візиту? Labrity проведе вас від ідеї до готового професійного сайту.',
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

export default async function WebsiteErstellenLassenPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: WebsiteErstellenLassenData = await getData(
    'website-erstellen-lassen',
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
      <WebsiteErstellenLassenPageClient initialData={initialData} />
    </>
  );
}
