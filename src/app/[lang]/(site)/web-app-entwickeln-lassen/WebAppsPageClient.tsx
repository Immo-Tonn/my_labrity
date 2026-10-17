'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, HelpCircle } from 'lucide-react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

type Item = { title: string; description: string };
type FaqItem = { question: string; answer: string };
type LinkItem = { label: string; linkLabel: string; href: string };
type UseCase = { audience: string; title: string; description: string };
type Pair = { problem: string; solution: string };

export type WebAppsData = {
  breadcrumbParentLabel: string;
  hero: {
    kicker: string;
    title: string;
    description: string;
    button: string;
    secondary: string;
  };
  visual: { caption: string; alt1: string; alt2: string };
  problems: {
    kicker: string;
    title: string;
    description: string;
    problemLabel: string;
    solutionLabel: string;
    items: Pair[];
    note: string;
  };
  tasks: { kicker: string; title: string; description: string; items: Item[] };
  useCases: {
    kicker: string;
    title: string;
    description: string;
    items: UseCase[];
  };
  why: {
    kicker: string;
    title: string;
    description: string;
    standardLabel: string;
    customLabel: string;
    rows: { standard: string; custom: string }[];
    note: string;
  };
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
  consult: { title: string; description: string; button: string };
  disambiguation: { kicker: string; title: string; items: LinkItem[] };
  faq: { kicker: string; title: string; items: FaqItem[] };
  relatedArticles: { kicker: string; title: string; items: LinkItem[] };
  cta: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
  };
};

const kicker =
  'mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400';

const primaryBtn =
  'inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px]';

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

// Purely decorative abstract chart motif (no data, hidden from assistive tech).
function AbstractCharts() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 520 360"
      className="pointer-events-none absolute right-0 top-[-10px] hidden h-auto w-[44%] max-w-[560px] text-black xl:block"
      fill="none"
    >
      <g stroke="currentColor" strokeOpacity="0.1" strokeWidth="1">
        <path d="M20 40H500M20 120H500M20 200H500M20 280H500" />
      </g>
      <g fill="currentColor" fillOpacity="0.07">
        <rect x="60" y="210" width="34" height="70" />
        <rect x="116" y="180" width="34" height="100" />
        <rect x="172" y="150" width="34" height="130" />
        <rect x="228" y="190" width="34" height="90" />
        <rect x="284" y="120" width="34" height="160" />
        <rect x="340" y="90" width="34" height="190" />
      </g>
      <path
        d="M60 230C120 200 160 150 230 160S320 100 380 70 450 60 480 40"
        stroke="#18352b"
        strokeOpacity="0.45"
        strokeWidth="1.5"
      />
      <circle cx="480" cy="40" r="5" fill="#18352b" fillOpacity="0.55" />
      <circle
        cx="400"
        cy="250"
        r="46"
        stroke="currentColor"
        strokeOpacity="0.12"
      />
      <path
        d="M400 204A46 46 0 0 1 446 250"
        stroke="#18352b"
        strokeOpacity="0.4"
        strokeWidth="2"
      />
    </svg>
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
      <section className="relative mx-auto max-w-[1700px] px-5 pb-16 pt-[130px] md:px-8 md:pb-24 md:pt-[170px]">
        <AbstractCharts />
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
          <h1 className="font-tenor text-[34px] leading-[1.04] tracking-[-0.04em] text-black md:text-[60px] xl:text-[80px]">
            {content.hero.title}
          </h1>
          <p className="mt-8 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[18px]">
            {content.hero.description}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <LocalizedLink href="/contact" className={primaryBtn}>
              {content.hero.button}
            </LocalizedLink>
            <a
              href="#situationen"
              className="inline-flex min-h-[44px] items-center font-montserrat text-[12px] uppercase tracking-[0.14em] text-black/70 underline underline-offset-4 transition duration-300 hover:text-black"
            >
              {content.hero.secondary}
            </a>
          </div>
        </motion.div>
      </section>

      {/* PROBLEMS -> SOLUTIONS */}
      <section
        id="situationen"
        className="scroll-mt-24 border-t border-[#e7e2d9] py-24 md:py-32"
      >
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="max-w-[860px]">
            <p className={kicker}>{content.problems.kicker}</p>
            <h2 className="font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
              {content.problems.title}
            </h2>
            <p className="mt-6 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.problems.description}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.problems.items.map((pair, index) => (
              <div
                key={pair.problem}
                className="flex flex-col border border-[#e7e2d9] bg-white/55 p-7"
              >
                <span className="font-montserrat text-xs tracking-[0.28em] text-neutral-400">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="mt-4 font-montserrat text-[11px] uppercase tracking-[0.24em] text-neutral-500">
                  {content.problems.problemLabel}
                </p>
                <p className="mt-2 flex-1 font-montserrat text-[15px] leading-7 text-neutral-600">
                  {pair.problem}
                </p>
                <div className="my-5 h-px w-12 bg-black/30" />
                <p className="font-montserrat text-[11px] uppercase tracking-[0.24em] text-[#18352b]">
                  {content.problems.solutionLabel}
                </p>
                <p className="mt-2 font-tenor text-[20px] leading-[1.25] text-black">
                  {pair.solution}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[760px] border-l border-black pl-5 font-montserrat text-[13px] leading-7 text-neutral-500">
            {content.problems.note}
          </p>
        </div>
      </section>

      {/* VISUAL (concept illustrations) */}
      <section className="px-5 md:px-8">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="overflow-hidden border border-[#e7e2d9]">
              <Image
                src="/images/web-apps/booking-calendar-mobile.webp"
                alt={content.visual.alt1}
                width={882}
                height={887}
                sizes="(min-width: 1500px) 740px, (min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden border border-[#e7e2d9]">
              <Image
                src="/images/web-apps/dashboard-overview.webp"
                alt={content.visual.alt2}
                width={882}
                height={887}
                sizes="(min-width: 1500px) 740px, (min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>
          <p className="mt-4 font-montserrat text-xs leading-6 text-neutral-500">
            {content.visual.caption}
          </p>
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="mx-auto max-w-[860px] text-center">
            <p className={kicker}>{content.tasks.kicker}</p>
            <h2 className="font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
              {content.tasks.title}
            </h2>
            <p className="mt-7 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.tasks.description}
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

          <div className="mt-12 bg-[#111111] px-6 py-10 text-white md:px-10 md:py-12">
            <h3 className="font-tenor text-[28px] leading-[1.05] md:text-[40px]">
              {content.consult.title}
            </h3>
            <p className="mt-4 max-w-[760px] font-montserrat text-[15px] leading-8 text-white/70 md:text-[17px]">
              {content.consult.description}
            </p>
            <LocalizedLink
              href="/contact"
              className="mt-8 inline-flex min-h-[56px] items-center justify-center border border-white bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px]"
            >
              {content.consult.button}
            </LocalizedLink>
          </div>
        </div>
      </section>

      {/* WHO IT IS FOR */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="max-w-[860px]">
            <p className={kicker}>{content.useCases.kicker}</p>
            <h2 className="font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
              {content.useCases.title}
            </h2>
            <p className="mt-6 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.useCases.description}
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.useCases.items.map(item => (
              <article
                key={item.audience}
                className="border border-[#e7e2d9] bg-white/55 p-7 md:p-9"
              >
                <p className="font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                  {item.audience}
                </p>
                <h3 className="mt-4 font-tenor text-[26px] leading-[1.1] tracking-[-0.02em] text-black md:text-[28px]">
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

      {/* WHY CUSTOM */}
      <section className="bg-black py-24 text-white md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="max-w-[900px]">
            <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-white/60">
              {content.why.kicker}
            </p>
            <h2 className="font-tenor text-[34px] leading-[1.02] tracking-[-0.04em] md:text-[64px]">
              {content.why.title}
            </h2>
            <p className="mt-6 max-w-[720px] font-montserrat text-[15px] leading-8 text-white/70 md:text-[17px]">
              {content.why.description}
            </p>
          </div>

          <div className="mt-12 grid gap-px border border-white/15 bg-white/15 md:grid-cols-2">
            <p className="bg-black px-6 py-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-white/50 md:px-8">
              {content.why.standardLabel}
            </p>
            <p className="hidden bg-black px-6 py-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-white md:block md:px-8">
              {content.why.customLabel}
            </p>
            {content.why.rows.map(row => (
              <div key={row.standard} className="bg-black md:contents">
                <p className="bg-black px-6 pb-3 pt-6 font-montserrat text-[15px] leading-7 text-white/55 md:px-8 md:py-6">
                  {row.standard}
                </p>
                <div className="bg-black px-6 pb-6 pt-0 md:px-8 md:py-6">
                  <p className="mb-2 font-montserrat text-[11px] uppercase tracking-[0.28em] text-white md:hidden">
                    {content.why.customLabel}
                  </p>
                  <p className="font-tenor text-[20px] leading-[1.3] text-white">
                    {row.custom}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 max-w-[760px] font-montserrat text-[13px] leading-7 text-white/55">
            {content.why.note}
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <p className={kicker}>{content.process.kicker}</p>
          <h2 className="max-w-[860px] font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
            {content.process.title}
          </h2>

          <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {content.process.items.map((item, index) => (
              <li
                key={item.title}
                className="border border-[#e7e2d9] bg-white/45 p-6"
              >
                <span className="font-montserrat text-xs tracking-[0.28em] text-neutral-500">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-tenor text-[24px] leading-[1.1] text-black">
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
            <h2 className="font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
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
                <LocalizedLink href="/contact" className={primaryBtn}>
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

      {/* FAQ */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-8">
          <p className={kicker}>{content.faq.kicker}</p>
          <h2 className="font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
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
        kickerText={content.disambiguation.kicker}
        title={content.disambiguation.title}
        items={content.disambiguation.items}
      />

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
          </div>
        </div>
      </section>
    </main>
  );
}
