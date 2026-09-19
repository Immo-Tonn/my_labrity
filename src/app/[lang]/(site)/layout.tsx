import { LanguageProvider } from '@/utils/LanguageContext';
import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { Montserrat, Tenor_Sans } from 'next/font/google';

import ConsentAnalytics from '@/components/common/ConsentAnalytics';
import QuizProvider from '@/components/quiz/QuizProvider';
import { classnames } from '@/utils/classnames';
import { Footer } from '@/layout/Footer';
import { Header } from '@/layout/Header';
import FakeAiChat from '@/components/common/FakeAiChat';
import LiveActivity from '@/components/common/LiveActivity';
import { SITE_URL } from '@/utils/siteUrl';
import { getData } from '@/utils/getData';
import { buildOpenGraph } from '@/utils/openGraph';
import {
  HREFLANG_CODES,
  isLanguage,
  LOCALES,
  withLocale,
  type Language,
} from '@/utils/localizedPath';

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '600'],
  display: 'swap',
  variable: '--font-montserrat',
});

const tenor = Tenor_Sans({
  subsets: ['cyrillic', 'latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-tenor',
});

// Organization + WebSite, linked via stable @id so they read as one graph.
// FAQPage schema deliberately lives on /prices (the only page with a real,
// visible FAQ block) instead of here, so it always matches what's on screen —
// see prices/page.tsx.
function buildStructuredData(lang: Language, description: string) {
  const organizationId = `${SITE_URL}/#organization`;
  const websiteId = `${SITE_URL}/#website`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'Labrity',
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo-white.svg`,
        description,
        areaServed: {
          '@type': 'Country',
          name: 'Germany',
        },
        // Only reliably-verified official profiles — see the SEO/entity
        // audit for why Facebook/LinkedIn aren't listed here yet.
        sameAs: ['https://www.instagram.com/labrity_it/'],
        knowsAbout: [
          'Webdesign',
          'Next.js',
          'SEO',
          'Landingpages',
          'Business Websites',
          'React Development',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'Labrity',
        url: SITE_URL,
        inLanguage: HREFLANG_CODES[lang],
        publisher: { '@id': organizationId },
      },
    ],
  };
}

export async function generateStaticParams() {
  return LOCALES.map(lang => ({ lang }));
}

type LayoutParams = { lang: string };

export async function generateMetadata({
  params,
}: {
  params: LayoutParams;
}): Promise<Metadata> {
  if (!isLanguage(params.lang)) notFound();

  const meta = await getData('meta', params.lang);
  const { title, description, keywords, manifest, openGraph, icons } = meta;
  const canonical = withLocale('/', params.lang);

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    icons,
    manifest,
    openGraph: await buildOpenGraph(
      params.lang,
      canonical,
      openGraph.title,
      openGraph.description,
    ),
    twitter: {
      card: 'summary_large_image',
      title: openGraph.title,
      description: openGraph.description,
      images: openGraph.images.map((img: { url: string }) => img.url),
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LayoutParams;
}>) {
  if (!isLanguage(params.lang)) notFound();

  const lang: Language = params.lang;
  const meta = await getData('meta', lang);
  const structuredData = buildStructuredData(lang, meta.description);

  return (
    <html lang={HREFLANG_CODES[lang]} className="!scroll-smooth">
      <body
        className={classnames(
          montserrat.variable,
          tenor.variable,
          'flex min-h-screen flex-col overflow-x-hidden bg-mainBcg',
        )}
      >
        <Script
          src="https://web.cmp.usercentrics.eu/modules/autoblocker.js"
          strategy="beforeInteractive"
        />

        <Script
          id="usercentrics-cmp"
          src="https://web.cmp.usercentrics.eu/ui/loader.js"
          data-ruleset-id="HFXPFXoht5HmRs"
          strategy="beforeInteractive"
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />

        <LanguageProvider lang={lang}>
          <QuizProvider>
            <Header />

            <div className="flex-grow">{children}</div>

            <Footer />

            <LiveActivity />

            <FakeAiChat />
          </QuizProvider>
        </LanguageProvider>
        <ConsentAnalytics />
      </body>
    </html>
  );
}
