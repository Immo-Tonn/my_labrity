import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import PrivacyPageClient from './PrivacyPageClient';

const PATH = '/privacy';

const FALLBACK_TITLE: Record<Language, string> = {
  de: 'Datenschutz',
  en: 'Privacy Policy',
  ru: 'Политика конфиденциальности',
  ua: 'Політика конфіденційності',
};

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Datenschutz | Labrity',
    description:
      'Informationen zur Verarbeitung personenbezogener Daten auf der Website von Labrity gemäß DSGVO.',
  },
  en: {
    title: 'Privacy Policy | Labrity',
    description:
      'Information on the processing of personal data on the Labrity website in accordance with GDPR.',
  },
  ru: {
    title: 'Политика конфиденциальности | Labrity',
    description:
      'Информация об обработке персональных данных на сайте Labrity в соответствии с GDPR.',
  },
  ua: {
    title: 'Політика конфіденційності | Labrity',
    description:
      'Інформація про обробку персональних даних на сайті Labrity відповідно до GDPR.',
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

export default async function PrivacyPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const [common, privacy] = await Promise.all([
    getData('common', params.lang),
    getData('privacy', params.lang),
  ]);

  const title =
    common?.footerLabelPolicy ||
    FALLBACK_TITLE[params.lang] ||
    FALLBACK_TITLE.de;

  return <PrivacyPageClient title={title} conditions={privacy ?? []} />;
}
