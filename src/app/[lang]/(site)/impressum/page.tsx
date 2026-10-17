import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';

const PATH = '/impressum';

const FALLBACK_TITLE: Record<Language, string> = {
  de: 'Impressum',
  en: 'Imprint',
  ru: 'Юридическая информация',
  ua: 'Імпресум',
};

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Impressum | Labrity',
    description:
      'Anbieterkennzeichnung von Labrity: Diensteanbieter, Kontaktmöglichkeiten und inhaltlich Verantwortlicher.',
  },
  en: {
    title: 'Imprint | Labrity',
    description:
      'Legal notice of Labrity: service provider, contact details and person responsible for content.',
  },
  ru: {
    title: 'Юридическая информация (Impressum) | Labrity',
    description:
      'Юридическая информация о Labrity: поставщик услуг, контактные данные и ответственный за содержание сайта.',
  },
  ua: {
    title: 'Імпресум (юридична інформація) | Labrity',
    description:
      'Юридична інформація про Labrity: постачальник послуг, контактні дані та відповідальний за контент.',
  },
};

type Section = {
  _id: string;
  title: string;
  description: { children: { text: string }[] }[];
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
    robots: { index: true, follow: true },
    alternates: {
      canonical,
      languages: buildHreflangAlternates(PATH),
    },
    openGraph: await buildOpenGraph(params.lang, canonical, title, description),
  };
}

export default async function ImpressumPage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();

  const lang: Language = params.lang;

  const [common, impressum] = await Promise.all([
    getData('common', lang),
    getData('impressum', lang),
  ]);

  const sections: Section[] = impressum ?? [];
  const title = common?.footerLabelImpressum || FALLBACK_TITLE[lang];

  return (
    <main className="min-h-screen bg-[#f8f6f1] pt-[120px] md:pt-[140px] xl:pt-[170px]">
      <section className="container pb-[90px] md:pb-[110px] xl:pb-[140px]">
        <div className="overflow-hidden border border-[#e7e2d9] bg-white px-6 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.05)] md:px-10 md:py-14 xl:px-14 xl:py-16">
          <h1 className="max-w-[720px] font-tenor text-[36px] leading-[1.04] text-black md:text-[52px] xl:text-[64px]">
            {title}
          </h1>

          <div className="mt-10 max-w-[820px]">
            {sections.map(item => (
              <section key={item._id} className="mb-8">
                <h2 className="font-tenor text-xl font-semibold text-[#18352b]">
                  {item.title}
                </h2>

                <div className="mt-2 font-montserrat text-sm leading-7 text-[#18352b]/75">
                  {item.description.map((block, index) => (
                    <p key={index} className="whitespace-pre-line">
                      {block.children[0]?.text ?? ''}
                    </p>
                  ))}
                </div>
              </section>
            ))}

            <p className="font-montserrat text-sm leading-7">
              <Link
                href={withLocale('/privacy', lang)}
                className="text-[#18352b] underline underline-offset-4 transition hover:opacity-70"
              >
                {common?.footerLabelPolicy}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
