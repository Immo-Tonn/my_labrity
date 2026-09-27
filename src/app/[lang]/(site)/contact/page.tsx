import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import ContactPageClient, { type ContactData } from './ContactPageClient';

const PATH = '/contact';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Kontakt | Labrity',
    description:
      'Labrity aus Münster entwickelt digitale Auftritte für Unternehmen in Nordrhein-Westfalen und deutschlandweit. Erzählen Sie uns von Ihrem Projekt.',
  },
  en: {
    title: 'Contact | Labrity',
    description:
      'Labrity, based in Münster, builds digital presences for businesses across North Rhine-Westphalia and throughout Germany. Tell us about your project.',
  },
  ru: {
    title: 'Контакты | Labrity',
    description:
      'Labrity из Мюнстера создаёт цифровые проекты для компаний в Северном Рейне-Вестфалии и по всей Германии. Расскажите нам о вашем проекте.',
  },
  ua: {
    title: 'Контакти | Labrity',
    description:
      'Labrity з Мюнстера створює цифрові проєкти для компаній у Північному Рейні-Вестфалії та по всій Німеччині. Розкажіть нам про ваш проєкт.',
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
  };
}

export default async function ContactPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const initialData: ContactData = await getData('contact', params.lang);

  return <ContactPageClient initialData={initialData} />;
}
