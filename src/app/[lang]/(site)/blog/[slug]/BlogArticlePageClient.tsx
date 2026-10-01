'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { HelpCircle, ArrowUpRight } from 'lucide-react';

import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { BLOG_COVER_IMAGES, BLOG_HERO_IMAGE } from '@/utils/blogImages';

type Section = {
  heading: string;
  level: 'h2' | 'h3';
  paragraphs: string[];
  checklist?: string[];
};

type FaqItem = { question: string; answer: string };
type Source = { label: string; url: string };
type RelatedArticle = { slug: string; title: string };

export type BlogArticleData = {
  slug: string;
  meta: { title: string; description: string };
  breadcrumbLabel: string;
  publishedDate: string;
  updatedDate: string;
  hero: { kicker: string; title: string; intro: string };
  keyTakeaway: { title: string; text: string } | null;
  sections: Section[];
  sources?: Source[];
  faq?: { kicker: string; title: string; items: FaqItem[] };
  relatedService: {
    label: string;
    description: string;
    linkLabel: string;
    href: string;
  };
  secondaryLink: { label: string; href: string } | null;
  relatedArticles: RelatedArticle[];
  images: { coverAlt: string };
  ui: {
    breadcrumbParent: string;
    sourcesLabel: string;
    moreArticlesLabel: string;
    allArticlesLabel: string;
  };
};

export default function BlogArticlePageClient({
  initialData,
}: {
  initialData: BlogArticleData;
}) {
  const content = initialData;
  const cover = BLOG_COVER_IMAGES[content.slug] ?? BLOG_HERO_IMAGE;
  const isPortraitCover = cover.height > cover.width;

  const faqStructuredData = content.faq
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: content.faq.items.map(item => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f1] text-black">
      {faqStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      )}

      {/* HERO — breadcrumbs + kicker + h1 stay one typographic group */}
      <section className="mx-auto max-w-[1300px] px-5 pt-[130px] md:px-8 md:pt-[170px]">
        <Breadcrumbs
          parentLabel={content.ui.breadcrumbParent}
          parentHref="/blog"
          currentLabel={content.breadcrumbLabel}
        />

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-6 font-montserrat text-[12px] font-medium uppercase tracking-[0.38em] text-black/45 md:text-[13px]">
            {content.hero.kicker}
          </p>
          <h1 className="max-w-[900px] font-tenor text-[36px] leading-[1.05] tracking-[-0.03em] text-black md:text-[58px] xl:text-[68px]">
            {content.hero.title}
          </h1>
        </motion.div>
      </section>

      {/* COVER IMAGE — large premium editorial visual, directly after H1 */}
      <section className="px-5 pb-10 pt-10 md:px-8 md:pb-14 md:pt-12">
        <div
          className={
            isPortraitCover ? 'mx-auto max-w-[560px]' : 'mx-auto max-w-[1600px]'
          }
        >
          <div className="overflow-hidden border border-[#e7e2d9]">
            <Image
              src={cover.src}
              alt={content.images.coverAlt}
              width={cover.width}
              height={cover.height}
              sizes={
                isPortraitCover
                  ? '(min-width: 560px) 560px, 92vw'
                  : '(min-width: 1600px) 1600px, 100vw'
              }
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="mx-auto max-w-[1300px] px-5 pb-16 md:px-8 md:pb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[720px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]"
        >
          {content.hero.intro}
        </motion.p>
      </section>

      {/* KEY TAKEAWAY */}
      {content.keyTakeaway && (
        <section className="px-5 md:px-8">
          <div className="mx-auto max-w-[1300px] border-l-2 border-[#D5292F] bg-white/50 px-6 py-6 md:px-8 md:py-7">
            <p className="mb-2 font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-black/50">
              {content.keyTakeaway.title}
            </p>
            <p className="max-w-[820px] font-montserrat text-[15px] leading-7 text-black/80 md:text-[16px]">
              {content.keyTakeaway.text}
            </p>
          </div>
        </section>
      )}

      {/* BODY */}
      <section className="border-t border-[#e7e2d9] py-16 md:py-24">
        <div className="mx-auto max-w-[1300px] px-5 md:px-8">
          <div className="grid gap-14 xl:grid-cols-[1fr_780px_1fr]">
            <div className="col-start-2 space-y-14">
              {content.sections.map(section => (
                <div key={section.heading}>
                  {section.level === 'h2' ? (
                    <h2 className="font-tenor text-[28px] leading-[1.1] tracking-[-0.02em] text-black md:text-[38px]">
                      {section.heading}
                    </h2>
                  ) : (
                    <h3 className="font-tenor text-[22px] leading-[1.1] tracking-[-0.01em] text-black md:text-[28px]">
                      {section.heading}
                    </h3>
                  )}

                  <div className="mt-5 space-y-4">
                    {section.paragraphs.map(p => (
                      <p
                        key={p.slice(0, 40)}
                        className="font-montserrat text-[15px] leading-8 text-neutral-600 md:text-[16px]"
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {section.checklist && (
                    <ul className="mt-6 space-y-3 border-t border-[#e7e2d9] pt-6">
                      {section.checklist.map(item => (
                        <li
                          key={item.slice(0, 40)}
                          className="grid grid-cols-[18px_1fr] items-start gap-x-4"
                        >
                          <span className="mt-[9px] block h-[6px] w-[6px] rounded-full bg-[#D5292F]" />
                          <span className="font-montserrat text-[15px] leading-7 text-neutral-600 md:text-[16px]">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}

              {/* SOURCES */}
              {content.sources && content.sources.length > 0 && (
                <div className="border-t border-[#e7e2d9] pt-8">
                  <p className="mb-3 font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40">
                    {content.ui.sourcesLabel}
                  </p>
                  <ul className="space-y-2">
                    {content.sources.map(source => (
                      <li key={source.url}>
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-montserrat text-[13px] leading-6 text-neutral-500 underline-offset-4 transition duration-300 hover:text-black hover:underline"
                        >
                          {source.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {content.faq && (
        <section className="border-t border-[#e7e2d9] py-16 md:py-24">
          <div className="mx-auto max-w-[1300px] px-5 md:px-8">
            <div className="mx-auto max-w-[780px]">
              <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                {content.faq.kicker}
              </p>
              <h2 className="font-tenor text-[30px] leading-[1.05] tracking-[-0.02em] text-black md:text-[42px]">
                {content.faq.title}
              </h2>

              <div className="mt-10 divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
                {content.faq.items.map(item => (
                  <details key={item.question} className="group py-6">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                      <span className="font-tenor text-[19px] leading-[1.15] tracking-[-0.01em] text-black md:text-[24px]">
                        {item.question}
                      </span>
                      <HelpCircle
                        size={20}
                        strokeWidth={1.1}
                        className="mt-1 shrink-0 text-black/40 transition duration-300 group-open:rotate-45"
                      />
                    </summary>
                    <p className="mt-4 font-montserrat text-[14px] leading-7 text-neutral-500 md:text-[15px]">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1300px] bg-[#111111] px-6 py-12 text-center text-white shadow-[0_30px_70px_rgba(0,0,0,0.12)] md:px-10 md:py-16">
          <h2 className="mx-auto max-w-[760px] font-tenor text-[30px] leading-[1.1] tracking-[-0.02em] md:text-[46px]">
            {content.relatedService.label}
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] font-montserrat text-[14px] leading-7 text-white/70 md:text-[16px]">
            {content.relatedService.description}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <LocalizedLink
              href={content.relatedService.href}
              className="inline-flex min-h-[52px] items-center justify-center border border-white bg-white px-7 font-montserrat text-[13px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px]"
            >
              {content.relatedService.linkLabel}
            </LocalizedLink>
            {content.secondaryLink && (
              <LocalizedLink
                href={content.secondaryLink.href}
                className="inline-flex min-h-[52px] items-center justify-center border border-white/40 bg-transparent px-7 font-montserrat text-[13px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
              >
                {content.secondaryLink.label}
              </LocalizedLink>
            )}
          </div>
        </div>
      </section>

      {/* RELATED ARTICLES */}
      {content.relatedArticles.length > 0 && (
        <section className="border-t border-[#e7e2d9] py-16 md:py-20">
          <div className="mx-auto max-w-[1300px] px-5 md:px-8">
            <p className="mb-6 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
              {content.ui.moreArticlesLabel}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {content.relatedArticles.map(related => (
                <LocalizedLink
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group flex items-center justify-between gap-4 border border-[#e7e2d9] bg-white/40 px-6 py-5 transition duration-300 hover:bg-white/70"
                >
                  <span className="font-montserrat text-[14px] leading-6 text-neutral-700">
                    {related.title}
                  </span>
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.6}
                    className="shrink-0 text-black/50 transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
                  />
                </LocalizedLink>
              ))}
            </div>

            <LocalizedLink
              href="/blog"
              className="mt-8 inline-block font-montserrat text-[12px] uppercase tracking-[0.14em] text-black/50 underline-offset-4 transition duration-300 hover:text-black hover:underline"
            >
              {content.ui.allArticlesLabel}
            </LocalizedLink>
          </div>
        </section>
      )}
    </main>
  );
}
