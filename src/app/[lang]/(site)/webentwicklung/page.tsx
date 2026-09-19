import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import WebentwicklungPageClient, {
  type WebentwicklungData,
} from './WebentwicklungPageClient';

const PATH = '/webentwicklung';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Webentwicklung Agentur | Labrity',
    description:
      'Individuelle Webentwicklung für Unternehmen, die technisch solide und langfristig performant online sein wollen.',
  },
  en: {
    title: 'Web Development Agency | Labrity',
    description:
      'Custom web development for businesses that want a technically solid, long-term reliable online presence.',
  },
  ru: {
    title: 'Веб-разработка | Labrity',
    description:
      'Индивидуальная веб-разработка для тех, кто хочет технически надёжное и стабильно быстрое присутствие в интернете.',
  },
  ua: {
    title: 'Веб-розробка | Labrity',
    description:
      'Індивідуальна веб-розробка для тих, хто хоче технічно надійну та стабільно швидку присутність в інтернеті.',
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

export default async function WebentwicklungPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: WebentwicklungData = await getData(
    'webentwicklung',
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
      <WebentwicklungPageClient initialData={initialData} />
    </>
  );
}
