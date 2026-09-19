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
    title: 'Webdesign Agentur | Labrity',
    description:
      'Labrity entwickelt Webdesign, das Vertrauen schafft und Ihre Marke sichtbar macht — mit klarer Struktur und hochwertiger Ästhetik.',
  },
  en: {
    title: 'Webdesign Agency | Labrity',
    description:
      'Labrity creates webdesign that builds trust and makes your brand visible — with clear structure and a premium aesthetic.',
  },
  ru: {
    title: 'Веб-дизайн студия | Labrity',
    description:
      'Labrity создаёт веб-дизайн, который формирует доверие и делает бренд заметным — с чёткой структурой и премиальной эстетикой.',
  },
  ua: {
    title: 'Веб-дизайн студія | Labrity',
    description:
      'Labrity створює веб-дизайн, який формує довіру та робить бренд помітним — із чіткою структурою та преміальною естетикою.',
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
