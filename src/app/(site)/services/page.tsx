import type { Metadata } from 'next';

import ServicesPageClient from './ServicesPageClient';

export const metadata: Metadata = {
  title: 'Leistungen | Labrity',
  description:
    'Von starken Landingpages bis zu exklusiven Webauftritten entwickeln wir digitale Lösungen, die Vertrauen schaffen, Wirkung erzeugen und neue Kunden gewinnen.',
  alternates: {
    canonical: '/services',
  },
  openGraph: {
    url: '/services',
    title: 'Leistungen | Labrity',
    description:
      'Von starken Landingpages bis zu exklusiven Webauftritten entwickeln wir digitale Lösungen, die Vertrauen schaffen, Wirkung erzeugen und neue Kunden gewinnen.',
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}
