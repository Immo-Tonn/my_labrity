import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import ServicesPageClient, {
  type ServicesPageData,
} from './ServicesPageClient';

const PATH = '/services';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Leistungen | Labrity',
    description:
      'Von starken Landingpages bis zu exklusiven Webauftritten entwickeln wir digitale Lösungen, die Vertrauen schaffen, Wirkung erzeugen und neue Kunden gewinnen.',
  },
  en: {
    title: 'Services | Labrity',
    description:
      'From high-converting landing pages to exclusive websites, we create digital solutions that build trust, create impact and attract new clients.',
  },
  ru: {
    title: 'Услуги | Labrity',
    description:
      'От сильных лендингов до эксклюзивных сайтов — мы создаём цифровые решения, которые вызывают доверие, формируют впечатление и помогают привлекать новых клиентов.',
  },
  ua: {
    title: 'Послуги | Labrity',
    description:
      'Від сильних лендінгів до ексклюзивних сайтів — ми створюємо цифрові рішення, які викликають довіру, формують враження та залучають нових клієнтів.',
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
    openGraph: {
      url: canonical,
      title,
      description,
    },
  };
}

export default async function ServicesPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const home = await getData('home', params.lang);

  const initialData: ServicesPageData = {
    servicesSection: home.servicesSection,
    cta: home.cta,
  };

  return <ServicesPageClient initialData={initialData} />;
}
