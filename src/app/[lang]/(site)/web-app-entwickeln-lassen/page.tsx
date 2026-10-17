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

const PATH = '/web-app-entwickeln-lassen';

// Titles stay brand-light and keyword-first; descriptions are written for the
// click (value + what is covered + next step), not stuffed with keywords.
const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Web-App entwickeln lassen: individuelle Software | Labrity',
    description:
      'Web-App entwickeln lassen: Terminbuchung, CRM, Zeiterfassung und Auswertungen als individuelle Software für Ihr Unternehmen. Persönliches Angebot.',
  },
  en: {
    title: 'Custom Web App Development for Businesses | Labrity',
    description:
      'Have a web app developed: online booking, CRM, time tracking and analytics as custom software for your business in Germany. Personal quote.',
  },
  ru: {
    title: 'Разработка веб-приложений на заказ в Германии | Labrity',
    description:
      'Разработка веб-приложений на заказ: онлайн-запись, CRM, учёт рабочего времени и аналитика под процессы вашей компании. Персональное предложение.',
  },
  ua: {
    title: 'Розробка вебзастосунків на замовлення в Німеччині | Labrity',
    description:
      'Розробка вебзастосунків на замовлення: онлайн-запис, CRM, облік робочого часу та аналітика під процеси вашої компанії. Персональна пропозиція.',
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
  const url = `${SITE_URL}${withLocale(PATH, params.lang)}`;

  const breadcrumbSchema = buildBreadcrumbSchema([
    {
      name: initialData.breadcrumbParentLabel,
      url: withLocale('/services', params.lang),
    },
    { name: initialData.hero.kicker, url: withLocale(PATH, params.lang) },
  ]);

  // Service without any offer/price (pricing is "on request" by design). The
  // catalog lists exactly the building blocks that are shown on the page.
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: initialData.hero.title,
    description,
    serviceType: initialData.hero.kicker,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'Germany' },
    url,
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: initialData.tasks.title,
      itemListElement: initialData.tasks.items.map(item => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: item.title,
          description: item.description,
        },
      })),
    },
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
