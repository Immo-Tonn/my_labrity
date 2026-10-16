import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import WebdesignPageClient, { type WebdesignData } from './WebdesignPageClient';

const PATH = '/webdesign';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Webdesign für Selbstständige & kleine Firmen | Labrity',
    description:
      'Webdesign aus Münster: klare Struktur und hochwertige Optik, die Vertrauen schafft – für Selbstständige und kleine Unternehmen in Deutschland.',
  },
  en: {
    title: 'Web Design for Freelancers & Small Businesses | Labrity',
    description:
      'Web design from Münster with a clear structure and a premium look that builds trust – for freelancers and small businesses across Germany.',
  },
  ru: {
    title: 'Веб-дизайн для предпринимателей и малого бизнеса | Labrity',
    description:
      'Веб-дизайн из Мюнстера: чёткая структура и качественная эстетика, которые вызывают доверие, — для предпринимателей и малого бизнеса в Германии.',
  },
  ua: {
    title: 'Веб-дизайн для підприємців і малого бізнесу | Labrity',
    description:
      'Веб-дизайн із Мюнстера: чітка структура та якісна естетика, що викликають довіру, — для підприємців і малого бізнесу в Німеччині.',
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

export default async function WebdesignPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: WebdesignData = await getData('webdesign', params.lang);

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
      <WebdesignPageClient initialData={initialData} />
    </>
  );
}
