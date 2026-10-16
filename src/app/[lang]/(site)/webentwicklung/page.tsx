import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import WebentwicklungPageClient, {
  type WebentwicklungData,
} from './WebentwicklungPageClient';

const PATH = '/webentwicklung';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Webentwicklung: schnelle, solide Websites | Labrity',
    description:
      'Individuelle Webentwicklung für Unternehmen: technisch solide, schnell ladend und so aufgebaut, dass Ihre Website mit Ihnen wachsen kann.',
  },
  en: {
    title: 'Web Development: Fast, Solid Websites | Labrity',
    description:
      'Custom web development for businesses: technically solid, fast-loading and built so that your website can grow along with you.',
  },
  ru: {
    title: 'Веб-разработка: быстрые и надёжные сайты | Labrity',
    description:
      'Индивидуальная веб-разработка для бизнеса: технически надёжная основа, быстрая загрузка и сайт, который может расти вместе с вами.',
  },
  ua: {
    title: 'Веб-розробка: швидкі та надійні сайти | Labrity',
    description:
      'Індивідуальна веб-розробка для бізнесу: технічно надійна основа, швидке завантаження і сайт, який може зростати разом з вами.',
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
      <WebentwicklungPageClient initialData={initialData} />
    </>
  );
}
