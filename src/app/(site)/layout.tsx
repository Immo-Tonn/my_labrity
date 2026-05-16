import { LanguageProvider } from '@/utils/LanguageContext';
import './globals.css';
import type { Metadata } from 'next';
import { Montserrat, Tenor_Sans } from 'next/font/google';

import { classnames } from '@/utils/classnames';
import { Footer } from '@/layout/Footer';
import { Header } from '@/layout/Header';
import meta from '@/data/de/meta.json';
import FakeAiChat from '@/components/common/FakeAiChat';

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

const NEXT_PUBLIC_URL = process.env.NEXT_PUBLIC_URL as string;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',

  name: 'Labrity',

  url: NEXT_PUBLIC_URL,

  logo: `${NEXT_PUBLIC_URL}/meta/logo.png`,

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

const { title, description, manifest, openGraph, icons } = meta;

export const metadata: Metadata = {
  title,
  description,
  icons,
  manifest,
  alternates: {
    canonical: NEXT_PUBLIC_URL,
  },
  openGraph: {
    ...openGraph,
    url: NEXT_PUBLIC_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="!scroll-smooth">
      <body
        className={classnames(
          montserrat.variable,
          tenor.variable,
          'flex min-h-screen flex-col overflow-x-hidden bg-mainBcg',
        )}
      >
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

        <LanguageProvider>
          <Header />

          <main className="flex-grow">{children}</main>

          <Footer name="" href="" ariaL="" />

          <FakeAiChat />
        </LanguageProvider>
      </body>
    </html>
  );
}
