import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { SITE_URL } from '@/utils/siteUrl';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import WebAppsPageClient, { type WebAppsData } from './WebAppsPageClient';

const PATH = '/web-apps';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Web-Apps & individuelle Business-Lösungen | Labrity',
    description:
      'Individuelle Web-Apps für Ihren Betrieb: Online-Terminbuchung, Zeiterfassung, Kunden- und Auftragsverwaltung, Admin-Bereich. Preis auf Anfrage.',
  },
  en: {
    title: 'Web Apps & Custom Business Solutions | Labrity',
    description:
      'Custom web apps for your business: online booking, time tracking, customer and order management, admin area. Price on request.',
  },
  ru: {
    title: 'Веб-приложения и бизнес-решения на заказ | Labrity',
    description:
      'Индивидуальные веб-приложения для бизнеса: онлайн-запись, учёт рабочего времени, клиенты и заказы, админ-панель. Цена по запросу.',
  },
  ua: {
    title: 'Вебзастосунки та бізнес-рішення на замовлення | Labrity',
    description:
      'Індивідуальні вебзастосунки для бізнесу: онлайн-запис, облік робочого часу, клієнти й замовлення, адмін-панель. Ціна за запитом.',
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

export default async function WebAppsPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: WebAppsData = await getData('web-apps', params.lang);
  const { title, description } = META[params.lang];

  const breadcrumbSchema = buildBreadcrumbSchema([
    {
      name: initialData.breadcrumbParentLabel,
      url: withLocale('/services', params.lang),
    },
    { name: initialData.hero.kicker, url: withLocale(PATH, params.lang) },
  ]);

  // Service without any offer/price: pricing is "on request" by design.
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    description,
    serviceType: initialData.hero.kicker,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: ['DE'],
    url: `${SITE_URL}${withLocale(PATH, params.lang)}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <WebAppsPageClient initialData={initialData} />
    </>
  );
}
