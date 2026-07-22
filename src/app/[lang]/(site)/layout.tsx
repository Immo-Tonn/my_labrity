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
import {
  HREFLANG_CODES,
  isLanguage,
  LOCALES,
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

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',

  name: 'Labrity',

  url: SITE_URL,

  logo: `${SITE_URL}/meta/logo.png`,

  description:
    'Professionelle moderne Websites für Unternehmen, Selbstständige und Marken in Deutschland.',

  areaServed: {
    '@type': 'Country',
    name: 'Germany',
  },

  knowsAbout: [
    'Webdesign',
    'Next.js',
    'SEO',
    'Landingpages',
    'Business Websites',
    'React Development',
  ],
};

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',

  mainEntity: [
    {
      '@type': 'Question',
      name: 'Wie viel kostet eine professionelle Website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Die Kosten hängen vom Umfang, Design und den gewünschten Funktionen ab. Jede Website wird individuell geplant.',
      },
    },
    {
      '@type': 'Question',
      name: 'Wie lange dauert die Entwicklung einer Website?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Je nach Projektumfang dauert die Entwicklung in der Regel zwischen wenigen Tagen und mehreren Wochen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Arbeiten Sie mit kleinen Unternehmen und Selbstständigen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Wir entwickeln Websites sowohl für Selbstständige als auch für Unternehmen und Marken.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ist die Website für Smartphones optimiert?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Alle Websites werden responsive entwickelt und funktionieren auf Smartphones, Tablets und Desktop-Geräten.',
      },
    },
    {
      '@type': 'Question',
      name: 'Entwickeln Sie Websites mit Next.js und React?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja. Wir arbeiten mit modernen Technologien wie Next.js, React und performanten Frontend-Lösungen.',
      },
    },
  ],
};

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

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    keywords,
    icons,
    manifest,
    openGraph: {
      ...openGraph,
      url: SITE_URL,
    },
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
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
