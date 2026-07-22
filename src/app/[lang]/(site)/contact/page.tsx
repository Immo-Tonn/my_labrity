import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import ContactPageClient, { type ContactData } from './ContactPageClient';

const PATH = '/contact';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Kontakt | Labrity',
    description:
      'Erzählen Sie uns von Ihrem Projekt — wir freuen uns auf Ihre Anfrage für Ihre neue Website, Ihr Rebranding oder Ihren digitalen Auftritt.',
  },
  en: {
    title: 'Contact | Labrity',
    description:
      'Tell us about your project — we would love to hear from you about your new website, rebrand or digital presence.',
  },
  ru: {
    title: 'Контакты | Labrity',
    description:
      'Расскажите нам о вашем проекте — мы будем рады вашей заявке на новый сайт, редизайн или полноценное цифровое присутствие.',
  },
  ua: {
    title: 'Контакти | Labrity',
    description:
      'Розкажіть нам про ваш проєкт — будемо раді вашому зверненню щодо нового сайту, ребрендингу або цифрової присутності.',
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

export default async function ContactPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: ContactData = await getData('contact', params.lang);

  return <ContactPageClient initialData={initialData} />;
}
