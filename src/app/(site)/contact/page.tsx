import type { Metadata } from 'next';

import ContactPageClient from './ContactPageClient';

export const metadata: Metadata = {
  title: 'Kontakt | Labrity',
  description:
    'Erzählen Sie uns von Ihrem Projekt — wir freuen uns auf Ihre Anfrage für Ihre neue Website, Ihr Rebranding oder Ihren digitalen Auftritt.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    url: '/contact',
    title: 'Kontakt | Labrity',
    description:
      'Erzählen Sie uns von Ihrem Projekt — wir freuen uns auf Ihre Anfrage für Ihre neue Website, Ihr Rebranding oder Ihren digitalen Auftritt.',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
