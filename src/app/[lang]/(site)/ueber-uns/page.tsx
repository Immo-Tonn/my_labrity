import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { InnerPhoto } from '@/components/common/InnerPhoto';
import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';

// Prepared page: only confirmed facts (see about.json). It stays out of the
// navigation and footer (no internal link yet), until the owner has
// supplied real "about" content (photo, background, references, ...).

const PATH = '/ueber-uns';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Über Labrity | Web Studio aus Münster',
    description:
      'Labrity ist ein Web Studio aus Münster für Unternehmen in NRW und deutschlandweit: wer wir sind, wie wir arbeiten und was wir anbieten.',
  },
  en: {
    title: 'About Labrity | Web Studio from Münster',
    description:
      'Labrity is a web studio from Münster working with businesses in North Rhine-Westphalia and across Germany: who we are, how we work and what we offer.',
  },
  ru: {
    title: 'О Labrity | Веб-студия из Мюнстера',
    description:
      'Labrity — веб-студия из Мюнстера для компаний в NRW и по всей Германии: кто мы, как работаем и что предлагаем.',
  },
  ua: {
    title: 'Про Labrity | Веб-студія з Мюнстера',
    description:
      'Labrity — веб-студія з Мюнстера для компаній у NRW та по всій Німеччині: хто ми, як працюємо і що пропонуємо.',
  },
};

type AboutData = {
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
  capabilities: {
    title: string;
    text: string;
    linkLabel: string;
    href: string;
  };
  services: { title: string; items: { label: string; href: string }[] };
  contactLabel: string;
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

export default async function AboutPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const lang: Language = params.lang;
  const about: AboutData = await getData('about', lang);

  return (
    <main className="swiss min-h-screen bg-[#F7F7F5]/65 pt-[120px] md:pt-[140px] xl:pt-[170px]">
      <section className="container pb-[90px] md:pb-[110px] xl:pb-[140px]">
        <div className="grid gap-8 border-b border-[#111] pb-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16 lg:pb-16">
          <h1 className="max-w-[820px] font-tenor text-black">{about.title}</h1>

          <p className="max-w-[520px] font-montserrat text-base leading-8 text-[#111111]/80 md:text-[17px]">
            {about.intro}
          </p>
        </div>

        <InnerPhoto
          src="/images/inner/about-team-work.webp"
          width={1536}
          height={1024}
          sizes="(min-width: 1500px) 1400px, 92vw"
          position="50% 42%"
          open
          priority
          className="mt-10 aspect-[4/3] w-full md:mt-12 md:aspect-[21/9]"
        />

        <div className="sw-ink mt-10 grid gap-6 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 xl:px-14 xl:py-16">
          <h2 className="max-w-[640px] font-tenor text-[#111111]">
            {about.capabilities.title}
          </h2>

          <div className="max-w-[520px]">
            <p className="font-montserrat text-[15px] leading-8 text-[#111111]/75">
              {about.capabilities.text}
            </p>
            <Link
              href={withLocale(about.capabilities.href, lang)}
              className="mt-6 inline-flex min-h-[44px] items-center border-b border-[#FF3830] font-montserrat text-[13px] font-semibold uppercase tracking-[0.06em] text-[#111111] transition hover:opacity-70"
            >
              {about.capabilities.linkLabel}
            </Link>
          </div>
        </div>

        <div className="mt-10 border-b border-[#111]">
          {about.sections.map(section => (
            <div
              key={section.title}
              className="grid gap-3 border-t border-[#111] py-8 md:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16"
            >
              <h2 className="font-tenor text-[#111111]">{section.title}</h2>
              <p className="max-w-[520px] font-montserrat text-[15px] leading-8 text-[#111111]/75">
                {section.text}
              </p>
            </div>
          ))}

          <div className="grid gap-4 border-t border-[#111] py-8 md:py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
            <h2 className="font-tenor text-[#111111]">
              {about.services.title}
            </h2>
            <ul className="max-w-[520px] border-t border-black/20 font-montserrat text-[15px] leading-7 text-[#111111]/80">
              {about.services.items.map(item => (
                <li key={item.href} className="border-b border-black/20">
                  <Link
                    href={withLocale(item.href, lang)}
                    className="group flex min-h-[48px] items-center justify-between gap-4 transition hover:text-[#111111]"
                  >
                    <span>{item.label}</span>
                    <span
                      aria-hidden="true"
                      className="h-[6px] w-[6px] bg-[#FF3830] opacity-0 transition duration-300 group-hover:opacity-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <InnerPhoto
          src="/images/inner/about-studio-light.webp"
          width={1536}
          height={1024}
          sizes="(min-width: 1500px) 1400px, 92vw"
          position="55% 55%"
          className="mt-10 aspect-[4/3] w-full md:aspect-[21/9]"
        />

        <Link
          href={withLocale('/contact', lang)}
          className="mt-10 inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition"
        >
          {about.contactLabel}
        </Link>
      </section>
    </main>
  );
}
