import type { Metadata } from 'next';

import ProcessPageClient from './ProcessPageClient';

export const metadata: Metadata = {
  title: 'Ablauf – Von der Idee zur Website | Labrity',
  description:
    'Wir begleiten Ihr Projekt Schritt für Schritt — mit klarer Struktur, modernem Design und einem Prozess, der verständlich bleibt.',
  alternates: {
    canonical: '/process',
  },
  openGraph: {
    url: '/process',
    title: 'Ablauf – Von der Idee zur Website | Labrity',
    description:
      'Wir begleiten Ihr Projekt Schritt für Schritt — mit klarer Struktur, modernem Design und einem Prozess, der verständlich bleibt.',
  },
};

export default function ProcessPage() {
  return <ProcessPageClient />;
}
