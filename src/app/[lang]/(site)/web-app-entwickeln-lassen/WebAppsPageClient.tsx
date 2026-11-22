'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, HelpCircle } from 'lucide-react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { BackgroundVideo } from '@/components/common/BackgroundVideo';
import { InnerPhoto } from '@/components/common/InnerPhoto';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

import { ProblemsGrid } from './ProblemsGrid';
import styles from './SoftwareTail.module.css';

type Item = { title: string; description: string };
type FaqItem = { question: string; answer: string };
type LinkItem = { label: string; linkLabel: string; href: string };
type UseCase = { audience: string; title: string; description: string };
type Pair = { problem: string; solution: string };

export type WebAppsData = {
  breadcrumbParentLabel: string;
  hero: {
    h1?: string;
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

const TAIL_EASE = [0.23, 1, 0.32, 1] as const;

// Short slide from a given side; nothing moves with reduced motion.
function useReveal() {
  const reduce = useReducedMotion();

  return (x: number, y: number, delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x, y },
          whileInView: { opacity: 1, x: 0, y: 0 },
          viewport: { once: true, amount: 0.12 },
          transition: { duration: 0.45, delay, ease: TAIL_EASE },
        };
}

const cx = (...names: (string | false | undefined)[]) =>
  names.filter(Boolean).join(' ');

function LinkList({
  kickerText,
  title,
  items,
  reveal,
}: {
  kickerText: string;
  title: string;
  items: LinkItem[];
  reveal: ReturnType<typeof useReveal>;
}) {
  return (
    <div
      className={cx(styles.grid, styles.split)}
      style={{ '--cols': '0.8fr 1.2fr' } as React.CSSProperties}
    >
      <motion.div
        {...reveal(-16, 0)}
        className={cx(styles.block, styles.dark, styles.pad)}
      >
        <p className={`${styles.kicker} font-montserrat`}>{kickerText}</p>
        <h2 className="font-tenor text-[26px] leading-[1.1] md:text-[34px]">
          {title}
        </h2>
      </motion.div>

      <div className={styles.stack}>
        {items.map((item, index) => (
          <motion.div
            key={item.href}
            {...reveal(16, 0, index * 0.05)}
            className="flex-1"
          >
            <LocalizedLink
              href={item.href}
              className={cx(styles.linkRow, styles.light, 'h-full')}
            >
              <span className="font-montserrat text-[14px] leading-6">
                {item.label}
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 font-montserrat text-[13px] font-semibold uppercase tracking-[0.06em]">
                <span className={styles.underline}>{item.linkLabel}</span>
                <span aria-hidden="true" className={styles.arrow}>
                  <ArrowUpRight size={16} strokeWidth={1.8} />
                </span>
              </span>
            </LocalizedLink>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Head({
  tone,
  kickerText,
  title,
  description,
  reveal,
  x = -16,
}: {
  tone: 'dark' | 'light';
  kickerText: string;
  title: string;
  description?: string;
  reveal: ReturnType<typeof useReveal>;
  x?: number;
}) {
  return (
    <motion.div
      {...reveal(x, 0)}
      className={cx(styles.block, styles[tone], styles.pad)}
    >
      <p className={`${styles.kicker} font-montserrat`}>{kickerText}</p>
      <h2 className="max-w-[860px] font-tenor text-[32px] leading-[1.05] tracking-[-0.03em] md:text-[54px]">
        {title}
      </h2>
      {description && (
        <p
          className={`${styles.sub} mt-6 max-w-[760px] font-montserrat text-[15px] leading-8 md:text-[17px]`}
        >
          {description}
        </p>
      )}
    </motion.div>
  );
}

export default function WebAppsPageClient({
  initialData,
}: {
  initialData: WebAppsData;
}) {
  const content = initialData;
  const reveal = useReveal();

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
    <main
      className={`${styles.page} swiss min-h-screen overflow-x-clip bg-[#F7F7F5]/65 text-black`}
    >
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
            <h1 className="2xl:text-[72px] font-tenor text-[32px] leading-[1.04] tracking-[-0.04em] text-black md:text-[54px] xl:text-[60px]">
              {content.hero.h1 ?? content.hero.title}
            </h1>
            <p className="mt-6 max-w-[760px] font-tenor text-[22px] leading-[1.15] tracking-[-0.02em] text-black/80 md:text-[30px]">
              {content.hero.title}
            </p>
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
      </section>

      {/* AFTER THE VIDEO — graphite / light blocks, 16px apart */}
      <section className="mx-auto max-w-[1700px] px-5 pb-24 pt-2 md:px-8 md:pb-32 md:pt-4">
        <div className={styles.stack} style={{ opacity: 1 }}>
          {/* TASKS — starts light (the video above is dark) */}
          <div
            className={cx(
              styles.grid,
              styles.cols,
              styles.cols2,
              styles.cols3,
              styles.startLight,
            )}
          >
            {content.tasks.items.map((item, index) => (
              <motion.div
                key={item.title}
                {...reveal(index % 2 === 0 ? -12 : 12, 12, (index % 3) * 0.05)}
                className={cx(styles.block, styles.hoverable, styles.cardPad)}
              >
                <h3 className="font-tenor text-[24px] leading-[1.1] tracking-[-0.02em]">
                  {item.title}
                </h3>
                <span
                  aria-hidden="true"
                  className={cx(styles.rule, 'mt-5 w-16')}
                />
                <p
                  className={`${styles.sub} mt-5 font-montserrat text-[14px] leading-7`}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* CONSULT — graphite */}
          <motion.div
            {...reveal(0, 16)}
            className={cx(styles.block, styles.dark, styles.pad)}
          >
            <h3 className="font-tenor text-[28px] leading-[1.05] md:text-[40px]">
              {content.consult.title}
            </h3>
            <p
              className={`${styles.sub} mt-4 max-w-[760px] font-montserrat text-[15px] leading-8 md:text-[17px]`}
            >
              {content.consult.description}
            </p>
            <LocalizedLink
              href="/contact"
              className={`${styles.btn} mt-8 font-montserrat`}
            >
              {content.consult.button}
            </LocalizedLink>
          </motion.div>

          {/* WHO IT IS FOR — light heading, cards start graphite */}
          <Head
            tone="light"
            kickerText={content.useCases.kicker}
            title={content.useCases.title}
            description={content.useCases.description}
            reveal={reveal}
          />

          <div
            className={cx(
              styles.grid,
              styles.cols,
              styles.cols2,
              styles.cols3,
              styles.startDark,
            )}
          >
            {content.useCases.items.map((item, index) => (
              <motion.article
                key={item.audience}
                {...reveal(index % 2 === 0 ? -12 : 12, 12, (index % 3) * 0.05)}
                className={cx(styles.block, styles.hoverable, styles.cardPad)}
              >
                <p className="font-montserrat text-[11px] uppercase tracking-[0.28em] opacity-80">
                  {item.audience}
                </p>
                <h3 className="mt-4 font-tenor text-[26px] leading-[1.1] tracking-[-0.02em] md:text-[28px]">
                  {item.title}
                </h3>
                <p
                  className={`${styles.sub} mt-4 font-montserrat text-[14px] leading-7 md:text-[15px]`}
                >
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>

          {/* WHY CUSTOM — graphite */}
          <motion.div
            {...reveal(0, 16)}
            className={cx(styles.block, styles.dark, styles.pad)}
          >
            <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
              <div className="max-w-[900px]">
                <p className={`${styles.kicker} font-montserrat`}>
                  {content.why.kicker}
                </p>
                <h2 className="font-tenor text-[34px] leading-[1.02] tracking-[-0.04em] md:text-[64px]">
                  {content.why.title}
                </h2>
                <p
                  className={`${styles.sub} mt-6 max-w-[720px] font-montserrat text-[15px] leading-8 md:text-[17px]`}
                >
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

            <div className={cx(styles.compare, 'mt-12')}>
              <p className="px-6 py-4 font-montserrat text-[11px] uppercase tracking-[0.28em] opacity-70 md:px-8">
                {content.why.standardLabel}
              </p>
              <p className="hidden px-6 py-4 font-montserrat text-[11px] uppercase tracking-[0.28em] md:block md:px-8">
                {content.why.customLabel}
              </p>
              {content.why.rows.map(row => (
                <div key={row.standard} className="md:contents">
                  <p className="px-6 pb-3 pt-6 font-montserrat text-[15px] leading-7 opacity-70 md:px-8 md:py-6">
                    {row.standard}
                  </p>
                  <div className="px-6 pb-6 pt-0 md:px-8 md:py-6">
                    <p className="mb-2 font-montserrat text-[11px] uppercase tracking-[0.28em] md:hidden">
                      {content.why.customLabel}
                    </p>
                    <p className="font-tenor text-[20px] leading-[1.3]">
                      {row.custom}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p
              className={`${styles.sub} mt-8 max-w-[760px] font-montserrat text-[13px] leading-7`}
            >
              {content.why.note}
            </p>
          </motion.div>

          {/* PROCESS — light heading, cards start graphite */}
          <Head
            tone="light"
            kickerText={content.process.kicker}
            title={content.process.title}
            reveal={reveal}
          />

          <ol
            className={cx(
              styles.grid,
              styles.cols,
              styles.cols2,
              styles.cols5,
              styles.startDark,
            )}
          >
            {content.process.items.map((item, index) => (
              <motion.li
                key={item.title}
                {...reveal(index % 2 === 0 ? -12 : 12, 12, (index % 5) * 0.05)}
                className={cx(styles.block, styles.hoverable, styles.cardPad)}
              >
                <span className={`${styles.num} inline-block font-montserrat`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 font-tenor text-[24px] leading-[1.1]">
                  {item.title}
                </h3>
                <p
                  className={`${styles.sub} mt-3 font-montserrat text-[14px] leading-7`}
                >
                  {item.description}
                </p>
              </motion.li>
            ))}
          </ol>

          {/* CLARIFY — light heading, rows graphite / light */}
          <Head
            tone="light"
            kickerText={content.clarify.kicker}
            title={content.clarify.title}
            description={content.clarify.description}
            reveal={reveal}
          />

          <div className={styles.stack}>
            {content.clarify.items.map((item, index) => (
              <motion.div
                key={item.title}
                {...reveal(index % 2 === 0 ? -16 : 16, 0)}
                className={cx(
                  styles.block,
                  styles.hoverable,
                  styles.row,
                  index % 2 === 0 ? styles.dark : styles.light,
                )}
              >
                <h3 className="font-tenor text-[24px] leading-[1.1]">
                  {item.title}
                </h3>
                <p
                  className={`${styles.sub} font-montserrat text-[14px] leading-7 md:text-[15px]`}
                >
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* PRICING — graphite title | light content */}
          <div
            className={cx(styles.grid, styles.split)}
            style={{ '--cols': '0.9fr 1.1fr' } as React.CSSProperties}
          >
            <motion.div
              {...reveal(-16, 0)}
              className={cx(styles.block, styles.dark, styles.pad)}
            >
              <p className={`${styles.kicker} font-montserrat`}>
                {content.pricing.kicker}
              </p>
              <h2 className="font-tenor text-[38px] leading-[1] tracking-[-0.04em] md:text-[60px]">
                {content.pricing.title}
              </h2>
            </motion.div>

            <motion.div
              {...reveal(16, 0, 0.05)}
              className={cx(styles.block, styles.light, styles.pad)}
            >
              <p
                className={`${styles.sub} font-montserrat text-[15px] leading-8 md:text-[17px]`}
              >
                {content.pricing.description}
              </p>
              <p
                className={`${styles.sub} mt-6 border-l-2 border-[#FF3830] pl-5 font-montserrat text-[13px] leading-7`}
              >
                {content.pricing.note}
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                <LocalizedLink
                  href="/contact"
                  className={`${styles.btn} font-montserrat`}
                >
                  {content.pricing.button}
                </LocalizedLink>
                <LocalizedLink
                  href="/prices"
                  className={`${styles.textLink} font-montserrat`}
                >
                  {content.pricing.linkLabel}
                </LocalizedLink>
              </div>
            </motion.div>
          </div>

          {/* FAQ — graphite heading, light accordion */}
          <Head
            tone="dark"
            kickerText={content.faq.kicker}
            title={content.faq.title}
            reveal={reveal}
          />

          <motion.div
            {...reveal(0, 16)}
            className={cx(styles.block, styles.light, styles.faq)}
          >
            {content.faq.items.map(item => (
              <details key={item.question} className="group px-6 py-6 md:px-10">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-start justify-between gap-6">
                  <h3 className="font-tenor text-[22px] leading-[1.1] tracking-[-0.02em] md:text-[30px]">
                    {item.question}
                  </h3>
                  <HelpCircle
                    size={24}
                    strokeWidth={1.1}
                    className="mt-1 shrink-0 opacity-70 transition duration-200 group-open:rotate-45"
                  />
                </summary>
                <p
                  className={`${styles.sub} mt-5 max-w-[820px] font-montserrat text-[14px] leading-8 md:text-[16px]`}
                >
                  {item.answer}
                </p>
              </details>
            ))}
          </motion.div>

          <LinkList
            kickerText={content.disambiguation.kicker}
            title={content.disambiguation.title}
            items={content.disambiguation.items}
            reveal={reveal}
          />

          <LinkList
            kickerText={content.relatedArticles.kicker}
            title={content.relatedArticles.title}
            items={content.relatedArticles.items}
            reveal={reveal}
          />

          {/* CTA — graphite */}
          <motion.div
            {...reveal(0, 16)}
            className={cx(styles.block, styles.dark, styles.pad, 'md:py-20')}
          >
            <p className={`${styles.kicker} font-montserrat`}>
              {content.cta.kicker}
            </p>
            <h2 className="max-w-[900px] font-tenor text-[34px] leading-[1] tracking-[-0.04em] md:text-[64px]">
              {content.cta.title}
            </h2>
            <p
              className={`${styles.sub} mt-6 max-w-[680px] font-montserrat text-[15px] leading-8 md:text-[18px]`}
            >
              {content.cta.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <LocalizedLink
                href="/contact"
                className={`${styles.btn} font-montserrat`}
              >
                {content.cta.primaryButton}
              </LocalizedLink>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
