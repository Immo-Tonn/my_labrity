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
    title: 'Website erstellen lassen: von der Idee zum Auftritt | Labrity',
    description:
      'Website erstellen lassen in Münster: Konzept, Design und Umsetzung für Selbstständige und kleine Unternehmen – von der ersten Idee bis zum Launch.',
  },
  en: {
    title: 'Get a Website Built: From First Idea to Launch | Labrity',
    description:
      'Have a website built by a studio in Münster: concept, design and build for freelancers and small businesses, from first idea to launch.',
  },
  ru: {
    title: 'Заказать сайт: от первой идеи до запуска | Labrity',
    description:
      'Заказать разработку сайта в Мюнстере: концепция, дизайн и реализация для предпринимателей и малого бизнеса — от идеи до запуска.',
  },
  ua: {
    title: 'Замовити сайт: від першої ідеї до запуску | Labrity',
    description:
      'Замовити розробку сайту в Мюнстері: концепція, дизайн і реалізація для підприємців і малого бізнесу — від ідеї до запуску.',
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
      <WebsiteErstellenLassenPageClient initialData={initialData} />
    </>
  );
}
