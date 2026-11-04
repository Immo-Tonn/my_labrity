'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, HelpCircle } from 'lucide-react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { BackgroundVideo } from '@/components/common/BackgroundVideo';
import { InnerPhoto } from '@/components/common/InnerPhoto';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

import { ProblemsGrid } from './ProblemsGrid';

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
  visual: {
    caption: string;
    alt1: string;
    alt2: string;
    pauseLabel: string;
    playLabel: string;
  };
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
    <section className="border-t border-[#111]/[0.12] py-16 md:py-20">
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
              className="group flex flex-col items-start gap-3 border border-[#111]/[0.12] bg-white/40 px-6 py-5 transition duration-300 hover:bg-white/70 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
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
    <main className="swiss min-h-screen overflow-hidden bg-[#F7F7F5]/65 text-black">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* HERO */}
      <section className="mx-auto max-w-[1700px] px-5 pb-12 pt-[112px] md:px-8 md:pb-24 md:pt-[170px]">
        <Breadcrumbs
          variant="swiss"
          parentLabel={content.breadcrumbParentLabel}
          parentHref="/services"
          currentLabel={content.hero.kicker}
        />

        <div className="grid items-center gap-9 md:gap-12 xl:grid-cols-[1.15fr_0.85fr] xl:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="2xl:text-[80px] font-tenor text-[34px] leading-[1.04] tracking-[-0.04em] text-black md:text-[60px] xl:text-[68px]">
              {content.hero.title}
            </h1>
            <p className="mt-6 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:mt-8 md:text-[18px]">
              {content.hero.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 md:mt-10 md:gap-4">
              <LocalizedLink
                href="/contact"
                className={`${primaryBtn} w-full text-center sm:w-auto`}
              >
                {content.hero.button}
              </LocalizedLink>
              <a
                href="#situationen"
                className="group/link relative inline-flex min-h-[44px] items-center font-montserrat text-[12px] uppercase tracking-[0.14em] text-black/70 transition-colors duration-300 before:absolute before:bottom-[10px] before:left-0 before:z-10 before:h-px before:w-0 before:bg-[#FF3830] before:transition-[width] before:duration-300 after:absolute after:bottom-[10px] after:left-0 after:h-px after:w-full after:bg-black/30 hover:text-[#FF3830] hover:before:w-full focus-visible:text-[#FF3830] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] focus-visible:before:w-full"
              >
                {content.hero.secondary}
              </a>
            </div>
          </motion.div>

          <motion.figure
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto w-full max-w-[520px] xl:max-w-none"
          >
            <InnerPhoto
              src="/images/inner/kontakt-red-1600.webp"
              width={1536}
              height={1024}
              sizes="(min-width: 1280px) 40vw, (min-width: 768px) 520px, 92vw"
              position="38% 50%"
              open
              priority
              className="aspect-[3/2] w-full xl:aspect-[4/3]"
            />
          </motion.figure>
        </div>
      </section>

      {/* PROBLEMS -> SOLUTIONS */}
      <section
        id="situationen"
        className="sw-tint scroll-mt-24 border-t border-[#111]/[0.12] py-24 md:py-32"
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

          <ProblemsGrid
            items={content.problems.items}
            problemLabel={content.problems.problemLabel}
            solutionLabel={content.problems.solutionLabel}
          />

          <p className="mt-8 max-w-[760px] border-l border-black pl-5 font-montserrat text-[13px] leading-7 text-neutral-500">
            {content.problems.note}
          </p>
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section className="border-t border-[#111]/[0.12] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="max-w-[760px]">
            <p className={kicker}>{content.tasks.kicker}</p>
            <h2 className="font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
              {content.tasks.title}
            </h2>
            <p className="mt-7 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.tasks.description}
            </p>
          </div>
        </div>

        {/* Full-bleed: edge to edge of the browser window. */}
        <figure className="mt-12 w-full md:mt-16">
          <BackgroundVideo
            webm="/videos/software-bg.webm"
            mp4="/videos/software-bg.mp4"
            poster="/videos/software-bg-poster.jpg"
            pauseLabel={content.visual.pauseLabel}
            playLabel={content.visual.playLabel}
            className="aspect-[16/10] w-full border-x-0 md:aspect-auto md:h-[clamp(500px,40vw,650px)]"
          />
        </figure>

        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.tasks.items.map(item => (
              <div
                key={item.title}
                className="border border-[#111]/[0.12] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/70"
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
      <section className="sw-tint border-t border-[#111]/[0.12] py-24 md:py-32">
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
                className="border border-[#111]/[0.12] bg-white/55 p-7 md:p-9"
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
          <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
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

            <InnerPhoto
              src="/images/inner/software-glass-1600.webp"
              width={1536}
              height={1024}
              sizes="(min-width: 1024px) 42vw, 92vw"
              position="50% 55%"
              className="aspect-[3/2] w-full border-white/20 sm:aspect-[16/10] lg:aspect-[4/3]"
            />
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
      <section className="border-t border-[#111]/[0.12] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <p className={kicker}>{content.process.kicker}</p>
          <h2 className="max-w-[860px] font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
            {content.process.title}
          </h2>

          <ol className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {content.process.items.map((item, index) => (
              <li
                key={item.title}
                className="border border-[#111]/[0.12] bg-white/45 p-6"
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
      <section className="sw-tint border-t border-[#111]/[0.12] py-24 md:py-32">
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
      <section className="border-t border-[#111]/[0.12] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="grid gap-10 border border-[#111]/[0.12] bg-white/55 p-7 shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:p-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-center xl:p-14">
            <div>
              <p className={kicker}>{content.pricing.kicker}</p>
              <h2 className="font-tenor text-[38px] leading-[1] tracking-[-0.04em] text-black md:text-[60px]">
                {content.pricing.title}
              </h2>
            </div>
            <div className="xl:border-l xl:border-[#111]/[0.12] xl:pl-12">
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
                  className="group/link relative inline-flex min-h-[44px] items-center font-montserrat text-[12px] uppercase tracking-[0.14em] text-black/70 transition-colors duration-300 before:absolute before:bottom-[10px] before:left-0 before:z-10 before:h-px before:w-0 before:bg-[#FF3830] before:transition-[width] before:duration-300 after:absolute after:bottom-[10px] after:left-0 after:h-px after:w-full after:bg-black/30 hover:text-[#FF3830] hover:before:w-full focus-visible:text-[#FF3830] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] focus-visible:before:w-full"
                >
                  {content.pricing.linkLabel}
                </LocalizedLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#111]/[0.12] py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-8">
          <p className={kicker}>{content.faq.kicker}</p>
          <h2 className="font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
            {content.faq.title}
          </h2>

          <div className="mt-12 divide-y divide-[#111]/[0.12] border-y border-[#111]/[0.12]">
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
