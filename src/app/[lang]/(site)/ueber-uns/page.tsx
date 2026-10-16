import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    title: 'Über Labrity: Websites, Web-Apps, CRM & iOS-Apps aus Münster',
    description:
      'Labrity aus Münster entwickelt Websites, Webanwendungen, SaaS-Plattformen, CRM-Systeme und iOS-Apps für Unternehmen in NRW und deutschlandweit.',
  },
  en: {
    title: 'About Labrity: Websites, Web Apps, CRM & iOS Apps from Münster',
    description:
      'Labrity from Münster builds websites, web applications, SaaS platforms, CRM systems and iOS apps for businesses in North Rhine-Westphalia and across Germany.',
  },
  ru: {
    title: 'О Labrity: сайты, веб-приложения, CRM и iOS-приложения',
    description:
      'Labrity из Мюнстера разрабатывает сайты, веб-приложения, SaaS-платформы, CRM-системы и iOS-приложения для компаний в NRW и по всей Германии.',
  },
  ua: {
    title: 'Про Labrity: сайти, вебзастосунки, CRM та iOS-застосунки',
    description:
      'Labrity з Мюнстера розробляє сайти, вебзастосунки, SaaS-платформи, CRM-системи та iOS-застосунки для компаній у NRW та по всій Німеччині.',
  },
};

type AboutData = {
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
  capabilities: {
    title: string;
    intro: string;
    items: { title: string; text: string }[];
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
    <main className="min-h-screen bg-[#f8f6f1] pt-[120px] md:pt-[140px] xl:pt-[170px]">
      <section className="container pb-[90px] md:pb-[110px] xl:pb-[140px]">
        <div className="overflow-hidden border border-[#e7e2d9] bg-white px-6 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.05)] md:px-10 md:py-14 xl:px-14 xl:py-16">
          <h1 className="max-w-[720px] font-tenor text-[36px] leading-[1.04] text-black md:text-[52px] xl:text-[64px]">
            {about.title}
          </h1>

          <p className="mt-8 max-w-[820px] font-montserrat text-base leading-8 text-[#18352b]/80">
            {about.intro}
          </p>

          <div className="mt-10 max-w-[820px]">
            <section className="mb-10">
              <h2 className="font-tenor text-2xl font-semibold text-[#18352b] md:text-3xl">
                {about.capabilities.title}
              </h2>
              <p className="mt-3 font-montserrat text-sm leading-7 text-[#18352b]/75">
                {about.capabilities.intro}
              </p>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {about.capabilities.items.map(item => (
                  <article key={item.title}>
                    <h3 className="font-tenor text-lg font-semibold text-[#18352b]">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-montserrat text-sm leading-7 text-[#18352b]/75">
                      {item.text}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            {about.sections.map(section => (
              <section key={section.title} className="mb-8">
                <h2 className="font-tenor text-xl font-semibold text-[#18352b]">
                  {section.title}
                </h2>
                <p className="mt-2 font-montserrat text-sm leading-7 text-[#18352b]/75">
                  {section.text}
                </p>
              </section>
            ))}

            <section className="mb-8">
              <h2 className="font-tenor text-xl font-semibold text-[#18352b]">
                {about.services.title}
              </h2>
              <ul className="mt-2 list-disc pl-5 font-montserrat text-sm leading-7 text-[#18352b]/75">
                {about.services.items.map(item => (
                  <li key={item.href}>
                    <Link
                      href={withLocale(item.href, lang)}
                      className="underline underline-offset-4 transition hover:opacity-70"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <Link
              href={withLocale('/contact', lang)}
              className="inline-flex min-h-[48px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition hover:opacity-90"
            >
              {about.contactLabel}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
