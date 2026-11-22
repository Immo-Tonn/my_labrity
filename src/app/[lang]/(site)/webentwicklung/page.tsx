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
    title: 'Webentwicklung in Münster: schnell und solide | Labrity',
    description:
      'Individuelle Webentwicklung in Münster: technisch solide, schnell ladend und so aufgebaut, dass Ihre Website mit Ihrem Unternehmen wachsen kann.',
  },
  en: {
    title: 'Web Development in Münster | Labrity',
    description:
      'Custom web development in Münster: technically solid, fast-loading and built so that your website can grow along with your business.',
  },
  ru: {
    title: 'Веб-разработка в Мюнстере | Labrity',
    description:
      'Индивидуальная веб-разработка в Мюнстере: технически надёжная основа, быстрая загрузка и сайт, который может расти вместе с вашим бизнесом.',
  },
  ua: {
    title: 'Веб-розробка у Мюнстері | Labrity',
    description:
      'Індивідуальна веб-розробка у Мюнстері: технічно надійна основа, швидке завантаження і сайт, який може зростати разом з вашим бізнесом.',
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
