import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import PrivacyPageClient from './PrivacyPageClient';

const PATH = '/privacy';

const FALLBACK_TITLE: Record<Language, string> = {
  de: 'Datenschutz',
  en: 'Privacy Policy',
  ru: 'Политика конфиденциальности',
  ua: 'Політика конфіденційності',
};

type PageParams = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  if (!isLanguage(params.lang)) notFound();

  const title = FALLBACK_TITLE[params.lang];
  const canonical = withLocale(PATH, params.lang);

  return {
    title,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(PATH),
    },
    openGraph: {
      url: canonical,
      title,
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: PageParams;
}) {
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
