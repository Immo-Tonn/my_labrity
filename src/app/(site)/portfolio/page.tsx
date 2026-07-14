import type { Metadata } from 'next';

import PortfolioPageClient from './PortfolioPageClient';

export const metadata: Metadata = {
  title: 'Portfolio – Referenzprojekte | Labrity',
  description:
    'Ausgewählte Projekte, die zeigen, wie wir Ästhetik, Strategie und Performance zu einer digitalen Präsenz auf Premium-Niveau verbinden.',
  alternates: {
    canonical: '/portfolio',
  },
  openGraph: {
    url: '/portfolio',
    title: 'Portfolio – Referenzprojekte | Labrity',
    description:
      'Ausgewählte Projekte, die zeigen, wie wir Ästhetik, Strategie und Performance zu einer digitalen Präsenz auf Premium-Niveau verbinden.',
  },
};

export default function PortfolioPage() {
  return <PortfolioPageClient />;
}
