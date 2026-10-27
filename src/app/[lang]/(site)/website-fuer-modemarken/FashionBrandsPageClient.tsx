'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowUpRight, HelpCircle } from 'lucide-react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

type Item = { title: string; description: string };
type FaqItem = { question: string; answer: string };
type LinkItem = { label: string; linkLabel: string; href: string };

export type FashionBrandsData = {
  breadcrumbParentLabel: string;
  hero: { kicker: string; title: string; description: string };
  images: { heroAlt: string; lookbookAlt: string; visorAlt: string };
  needs: {
    kicker: string;
    title: string;
    description: string;
    items: Item[];
  };
  example: {
    kicker: string;
    title: string;
    description: string;
    facts: Item[];
    button: string;
    note: string;
  };
  offer: {
    kicker: string;
    title: string;
    description: string;
    items: Item[];
  };
  disclaimerStatement: { kicker: string; title: string; description: string };
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

function LinkGrid({ items }: { items: LinkItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map(item => (
        <LocalizedLink
          key={item.href}
          href={item.href}
          className="group flex flex-col items-start justify-between gap-4 border border-[#e7e2d9] bg-white/40 px-6 py-5 transition duration-300 hover:bg-white/70"
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
  );
}

export default function FashionBrandsPageClient({
  initialData,
  demoUrl,
}: {
  initialData: FashionBrandsData;
  demoUrl: string;
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
          <h1 className="font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[72px] xl:text-[96px]">
            {content.hero.title}
          </h1>
          <p className="mt-8 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[18px]">
            {content.hero.description}
          </p>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px]"
            >
              {content.example.button}
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </a>
            <span className="inline-block border border-neutral-400 px-2 py-1 font-montserrat text-[10px] uppercase tracking-[0.2em] text-neutral-600">
              {content.example.kicker}
            </span>
          </div>
        </motion.div>
      </section>

      {/* HERO VISUAL — NØFORM concept project (click opens the live site) */}
      <section className="px-5 md:px-8">
        <a
          href={demoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={content.example.button}
          className="group relative mx-auto block max-w-[1700px] overflow-hidden border border-[#e7e2d9] bg-black"
        >
          <Image
            src="/images/projects/noform.webp"
            alt={content.images.heroAlt}
            width={1600}
            height={886}
            priority
            sizes="(min-width: 1700px) 1700px, 100vw"
            className="h-auto w-full transition duration-700 group-hover:scale-[1.015]"
          />
          <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 bg-white px-4 py-3 font-montserrat text-[11px] font-semibold uppercase tracking-[0.12em] text-black md:bottom-6 md:right-6 md:text-[12px]">
            {content.example.button}
            <ArrowUpRight size={14} strokeWidth={1.8} />
          </span>
        </a>
      </section>

      {/* WHAT MATTERS */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400">
              {content.needs.kicker}
            </p>
            <h2 className="font-tenor text-[36px] leading-[1.05] tracking-[-0.03em] text-black md:text-[60px]">
              {content.needs.title}
            </h2>
            <p className="mt-7 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.needs.description}
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {content.needs.items.map(item => (
              <div
                key={item.title}
                className="border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/70"
              >
                <h3 className="font-tenor text-[26px] leading-[1.05] tracking-[-0.02em] text-black">
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

      {/* EXAMPLE — NØFORM (fictional concept brand, clearly labelled) */}
      <section className="bg-black py-24 text-white md:py-32">
        <div className="mx-auto max-w-[1600px] px-5 md:px-8">
          <div className="grid gap-10 xl:grid-cols-[1fr_0.9fr] xl:gap-20">
            <div>
              <p className="mb-5 inline-block border border-white/40 px-2 py-1 font-montserrat text-[10px] uppercase tracking-[0.2em] text-white/70">
                {content.example.kicker}
              </p>
              <h2 className="font-tenor text-[36px] leading-[1] tracking-[-0.03em] md:text-[64px]">
                {content.example.title}
              </h2>
            </div>
            <div className="flex items-end">
              <p className="max-w-[620px] font-montserrat text-[16px] leading-9 text-white/70 md:text-[18px]">
                {content.example.description}
              </p>
            </div>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2">
            <div className="overflow-hidden border border-white/10">
              <Image
                src="/images/fashion/noform-lookbook.webp"
                alt={content.images.lookbookAlt}
                width={1600}
                height={900}
                sizes="(min-width: 1600px) 780px, (min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </div>
            <div className="overflow-hidden border border-white/10">
              <Image
                src="/images/fashion/noform-visor.webp"
                alt={content.images.visorAlt}
                width={1600}
                height={900}
                sizes="(min-width: 1600px) 780px, (min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </div>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {content.example.facts.map(item => (
              <div key={item.title} className="border-t border-white/20 pt-6">
                <h3 className="font-tenor text-[24px] leading-[1.1] tracking-[-0.02em]">
                  {item.title}
                </h3>
                <p className="mt-3 font-montserrat text-[14px] leading-7 text-white/60">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
            <a
              href={demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 border border-white bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px]"
            >
              {content.example.button}
              <ArrowUpRight size={16} strokeWidth={1.8} />
            </a>
            <p className="font-montserrat text-[12px] uppercase leading-6 tracking-[0.14em] text-white/50">
              {content.example.note}
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE BUILD */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400">
              {content.offer.kicker}
            </p>
            <h2 className="font-tenor text-[36px] leading-[1.05] tracking-[-0.03em] text-black md:text-[60px]">
              {content.offer.title}
            </h2>
            <p className="mt-7 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.offer.description}
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {content.offer.items.map(item => (
              <div
                key={item.title}
                className="min-h-[170px] border border-[#e7e2d9] bg-white/45 p-7 transition duration-300 hover:-translate-y-[2px] hover:bg-white/75"
              >
                <h3 className="font-tenor text-[26px] leading-[1.05] tracking-[-0.02em] text-black">
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

      {/* HONEST STATEMENT — shop vs. brand site, no ranking guarantees */}
      <section className="bg-black py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-8 xl:grid-cols-[1fr_0.9fr] xl:gap-20">
          <div>
            <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-white/60">
              {content.disclaimerStatement.kicker}
            </p>
            <h2 className="font-tenor text-[40px] leading-[1] tracking-[-0.03em] md:text-[68px]">
              {content.disclaimerStatement.title}
            </h2>
          </div>
          <div className="flex items-end">
            <p className="max-w-[620px] font-montserrat text-[16px] leading-9 text-white/70 md:text-[19px]">
              {content.disclaimerStatement.description}
            </p>
          </div>
        </div>
      </section>

      {/* DISAMBIGUATION */}
      <section className="border-t border-[#e7e2d9] py-16 md:py-20">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <p className="mb-3 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400">
            {content.disambiguation.kicker}
          </p>
          <h2 className="mb-8 font-tenor text-[26px] leading-[1.1] text-black md:text-[34px]">
            {content.disambiguation.title}
          </h2>
          <LinkGrid items={content.disambiguation.items} />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1300px] px-5 md:px-8">
          <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400">
            {content.faq.kicker}
          </p>
          <h2 className="font-tenor text-[36px] leading-[1.05] tracking-[-0.03em] text-black md:text-[54px]">
            {content.faq.title}
          </h2>

          <div className="mt-12 divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
            {content.faq.items.map(item => (
              <details key={item.question} className="group py-7">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-start justify-between gap-6">
                  <h3 className="font-tenor text-[22px] font-normal leading-[1.1] tracking-[-0.02em] text-black md:text-[30px]">
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

      {/* RELATED ARTICLES */}
      <section className="border-t border-[#e7e2d9] py-16 md:py-20">
        <div className="mx-auto max-w-[1100px] px-5 md:px-8">
          <p className="mb-3 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400">
            {content.relatedArticles.kicker}
          </p>
          <h2 className="mb-8 font-tenor text-[26px] leading-[1.1] text-black md:text-[34px]">
            {content.relatedArticles.title}
          </h2>
          <LinkGrid items={content.relatedArticles.items} />
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1500px] bg-[#111111] px-6 py-14 text-center text-white shadow-[0_30px_70px_rgba(0,0,0,0.12)] md:px-10 md:py-20">
          <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.32em] text-white/60">
            {content.cta.kicker}
          </p>
          <h2 className="mx-auto max-w-[900px] font-tenor text-[38px] leading-[1] tracking-[-0.04em] md:text-[68px]">
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
              href="/portfolio"
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
