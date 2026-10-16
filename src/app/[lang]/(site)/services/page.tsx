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
    title: 'Leistungen: Webdesign, Entwicklung & Relaunch | Labrity',
    description:
      'Von der Landingpage bis zum vollständigen Webauftritt: Wir entwickeln Websites, die Vertrauen schaffen und neue Anfragen erleichtern.',
  },
  en: {
    title: 'Services: Web Design, Development & Relaunch | Labrity',
    description:
      'From landing pages to complete websites: we build sites that create trust and make it easier for new clients to get in touch.',
  },
  ru: {
    title: 'Услуги: веб-дизайн, разработка и обновление | Labrity',
    description:
      'От лендингов до полноценных сайтов: мы создаём сайты, которые вызывают доверие и облегчают новым клиентам обращение к вам.',
  },
  ua: {
    title: 'Послуги: веб-дизайн, розробка й оновлення | Labrity',
    description:
      'Від лендінгів до повноцінних сайтів: ми створюємо сайти, що викликають довіру й полегшують новим клієнтам звернення до вас.',
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
