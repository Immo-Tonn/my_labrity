import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import ServicesPageClient, {
  type ServicesPageData,
} from './ServicesPageClient';

const PATH = '/services';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Leistungen: Webdesign & Entwicklung in Münster | Labrity',
    description:
      'Webdesign, Webentwicklung und Relaunch in Münster: von der Landingpage bis zum vollständigen Webauftritt, der Vertrauen schafft und Anfragen erleichtert.',
  },
  en: {
    title: 'Web Design & Development in Münster | Labrity',
    description:
      'Web design, development and relaunch in Münster: from landing pages to complete websites that build trust and make it easy for new clients to get in touch.',
  },
  ru: {
    title: 'Веб-дизайн и разработка в Мюнстере | Labrity',
    description:
      'Веб-дизайн, разработка и обновление сайтов в Мюнстере: от лендингов до полноценных сайтов, которые вызывают доверие и облегчают обращение клиентов.',
  },
  ua: {
    title: 'Веб-дизайн і розробка в Мюнстері | Labrity',
    description:
      'Веб-дизайн, розробка й оновлення сайтів у Мюнстері: від лендінгів до повноцінних сайтів, що викликають довіру й полегшують звернення клієнтів.',
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

export default async function ServicesPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const [home, serviceLinks, services, common] = await Promise.all([
    getData('home', params.lang),
    getData('service-links', params.lang),
    getData('services', params.lang),
    getData('common', params.lang),
  ]);

  const initialData: ServicesPageData = {
    servicesSection: home.servicesSection,
    services,
    buttonLabel: common.buttonsText.v1,
    serviceLinks,
    cta: home.cta,
  };

  return <ServicesPageClient initialData={initialData} />;
}
