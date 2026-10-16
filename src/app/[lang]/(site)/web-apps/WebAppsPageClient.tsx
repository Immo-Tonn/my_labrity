'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, HelpCircle } from 'lucide-react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

type Item = { title: string; description: string };
type FaqItem = { question: string; answer: string };
type LinkItem = { label: string; linkLabel: string; href: string };
type UseCase = { audience: string; title: string; description: string };

export type WebAppsData = {
  breadcrumbParentLabel: string;
  hero: { kicker: string; title: string; description: string; button: string };
  tasks: { kicker: string; title: string; description: string; items: Item[] };
  useCases: {
    kicker: string;
    title: string;
    description: string;
    items: UseCase[];
  };
  experience: { kicker: string; title: string; description: string };
  process: { kicker: string; title: string; items: Item[] };
  clarify: {
    kicker: string;
    title: string;
    description: string;
    items: Item[];
  };
  pricing: {
    kicker: string;
    title: string;
    price: string;
    description: string;
    note: string;
    button: string;
    linkLabel: string;
  };
  disambiguation: { kicker: string; title: string; items: LinkItem[] };
  faq: { kicker: string; title: string; items: FaqItem[] };
  relatedArticles: { kicker: string; title: string; items: LinkItem[] };
  cta: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    backToServicesLabel: string;
  };
};

const kicker =
  'mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400';

function LinkList({
  kickerText,
  title,
  items,
}: {
  kickerText: string;
  title: string;
  items: LinkItem[];
}) {
  return (
    <section className="border-t border-[#e7e2d9] py-16 md:py-20">
      <div className="mx-auto max-w-[1100px] px-5 md:px-8">
        <p className="mb-3 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400">
          {kickerText}
        </p>
        <h2 className="mb-8 font-tenor text-[26px] leading-[1.1] text-black md:text-[34px]">
          {title}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map(item => (
            <LocalizedLink
              key={item.href}
              href={item.href}
              className="group flex flex-col items-start gap-3 border border-[#e7e2d9] bg-white/40 px-6 py-5 transition duration-300 hover:bg-white/70 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <span className="font-montserrat text-[14px] leading-6 text-neutral-600">
                {item.label}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 font-montserrat text-[13px] font-semibold uppercase tracking-[0.06em] text-black">
                {item.linkLabel}
                <ArrowUpRight size={14} strokeWidth={1.8} />
              </span>
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function WebAppsPageClient({
  initialData,
}: {
  initialData: WebAppsData;
}) {
  const content = initialData;

  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: content.faq.items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f1] text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* HERO */}
      <section className="mx-auto max-w-[1700px] px-5 pb-16 pt-[130px] md:px-8 md:pb-24 md:pt-[170px]">
        <Breadcrumbs
          parentLabel={content.breadcrumbParentLabel}
          parentHref="/services"
          currentLabel={content.hero.kicker}
        />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1180px]"
        >
          <p className="mb-6 font-montserrat text-[12px] font-medium uppercase tracking-[0.38em] text-black/60 md:text-[13px]">
            {content.hero.kicker}
          </p>
          <h1 className="font-tenor text-[38px] leading-[1.02] tracking-[-0.04em] text-black md:text-[68px] xl:text-[88px]">
            {content.hero.title}
          </h1>
          <p className="mt-8 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[18px]">
            {content.hero.description}
          </p>
          <LocalizedLink
            href="/contact"
            className="mt-10 inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px]"
          >
            {content.hero.button}
          </LocalizedLink>
        </motion.div>
      </section>

      {/* TASKS */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="mx-auto max-w-[860px] text-center">
            <p className={kicker}>{content.tasks.kicker}</p>
            <h2 className="font-tenor text-[34px] leading-[1.05] tracking-[-0.03em] text-black md:text-[56px]">
              {content.tasks.title}
            </h2>
            <p className="mt-7 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.tasks.description}
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.tasks.items.map(item => (
              <div
                key={item.title}
                className="border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/70"
              >
                <h3 className="font-tenor text-[24px] leading-[1.1] tracking-[-0.02em] text-black">
                  {item.title}
                </h3>
                <p className="mt-4 font-montserrat text-[14px] leading-7 text-neutral-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="max-w-[860px]">
            <p className={kicker}>{content.useCases.kicker}</p>
            <h2 className="font-tenor text-[34px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
              {content.useCases.title}
            </h2>
            <p className="mt-6 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.useCases.description}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {content.useCases.items.map(item => (
              <article
                key={item.audience}
                className="border border-[#e7e2d9] bg-white/55 p-7 md:p-9"
              >
                <p className="font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                  {item.audience}
                </p>
                <h3 className="mt-4 font-tenor text-[26px] leading-[1.1] tracking-[-0.02em] text-black md:text-[30px]">
                  {item.title}
                </h3>
                <p className="mt-4 font-montserrat text-[14px] leading-7 text-neutral-500 md:text-[15px]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-black py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-8 xl:grid-cols-[1fr_0.9fr] xl:gap-20">
          <div>
            <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-white/60">
              {content.experience.kicker}
            </p>
            <h2 className="font-tenor text-[40px] leading-[0.98] tracking-[-0.04em] md:text-[72px]">
              {content.experience.title}
            </h2>
          </div>
          <div className="flex items-end">
            <p className="max-w-[620px] font-montserrat text-[16px] leading-9 text-white/70 md:text-[19px]">
              {content.experience.description}
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <p className={kicker}>{content.process.kicker}</p>
          <h2 className="max-w-[860px] font-tenor text-[34px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
            {content.process.title}
          </h2>

          <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.process.items.map((item, index) => (
              <li
                key={item.title}
                className="border border-[#e7e2d9] bg-white/45 p-7"
              >
                <span className="font-montserrat text-xs tracking-[0.28em] text-neutral-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-tenor text-[26px] leading-[1.1] text-black">
                  {item.title}
                </h3>
                <p className="mt-3 font-montserrat text-[14px] leading-7 text-neutral-500">
                  {item.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CLARIFY UPFRONT */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="max-w-[860px]">
            <p className={kicker}>{content.clarify.kicker}</p>
            <h2 className="font-tenor text-[34px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
              {content.clarify.title}
            </h2>
            <p className="mt-6 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.clarify.description}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {content.clarify.items.map(item => (
              <div
                key={item.title}
                className="border-l border-black pl-6 md:pl-8"
              >
                <h3 className="font-tenor text-[24px] leading-[1.1] text-black">
                  {item.title}
                </h3>
                <p className="mt-3 font-montserrat text-[14px] leading-7 text-neutral-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="grid gap-10 border border-[#e7e2d9] bg-white/55 p-7 shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:p-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-center xl:p-14">
            <div>
              <p className={kicker}>{content.pricing.kicker}</p>
              <h2 className="font-tenor text-[38px] leading-[1] tracking-[-0.04em] text-black md:text-[60px]">
                {content.pricing.title}
              </h2>
            </div>
            <div className="xl:border-l xl:border-[#e7e2d9] xl:pl-12">
              <p className="font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
                {content.pricing.description}
              </p>
              <p className="mt-6 border-l border-black pl-5 font-montserrat text-[13px] leading-7 text-neutral-500">
                {content.pricing.note}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <LocalizedLink
                  href="/contact"
                  className="inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px]"
                >
                  {content.pricing.button}
                </LocalizedLink>
                <LocalizedLink
                  href="/prices"
                  className="inline-flex min-h-[44px] items-center font-montserrat text-[12px] uppercase tracking-[0.14em] text-black/70 underline underline-offset-4 transition duration-300 hover:text-black"
                >
                  {content.pricing.linkLabel}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <LinkList
        kickerText={content.disambiguation.kicker}
        title={content.disambiguation.title}
        items={content.disambiguation.items}
      />

      {/* FAQ */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-8">
          <p className={kicker}>{content.faq.kicker}</p>
          <h2 className="font-tenor text-[34px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
            {content.faq.title}
          </h2>

          <div className="mt-12 divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
            {content.faq.items.map(item => (
              <details key={item.question} className="group py-7">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-start justify-between gap-6">
                  <h3 className="font-tenor text-[22px] leading-[1.1] tracking-[-0.02em] text-black md:text-[30px]">
                    {item.question}
                  </h3>
                  <HelpCircle
                    size={24}
                    strokeWidth={1.1}
                    className="mt-1 shrink-0 text-black/40 transition duration-300 group-open:rotate-45"
                  />
                </summary>
                <p className="mt-5 max-w-[820px] font-montserrat text-[14px] leading-8 text-neutral-500 md:text-[16px]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <LinkList
        kickerText={content.relatedArticles.kicker}
        title={content.relatedArticles.title}
        items={content.relatedArticles.items}
      />

      {/* CTA */}
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1500px] bg-[#111111] px-6 py-14 text-center text-white shadow-[0_30px_70px_rgba(0,0,0,0.12)] md:px-10 md:py-20">
          <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-white/60">
            {content.cta.kicker}
          </p>
          <h2 className="mx-auto max-w-[900px] font-tenor text-[34px] leading-[1] tracking-[-0.04em] md:text-[64px]">
            {content.cta.title}
          </h2>
          <p className="mx-auto mt-6 max-w-[680px] font-montserrat text-[15px] leading-8 text-white/70 md:text-[18px]">
            {content.cta.description}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <LocalizedLink
              href="/contact"
              className="inline-flex min-h-[56px] items-center justify-center border border-white bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px]"
            >
              {content.cta.primaryButton}
            </LocalizedLink>
            <LocalizedLink
              href="/services"
              className="inline-flex min-h-[56px] items-center justify-center border border-white/40 bg-transparent px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              {content.cta.secondaryButton}
            </LocalizedLink>
          </div>

          <LocalizedLink
            href="/services"
            className="mt-7 inline-flex min-h-[44px] items-center font-montserrat text-[12px] uppercase tracking-[0.14em] text-white/60 underline-offset-4 transition duration-300 hover:text-white hover:underline"
          >
            {content.cta.backToServicesLabel}
          </LocalizedLink>
        </div>
      </section>
    </main>
  );
}
