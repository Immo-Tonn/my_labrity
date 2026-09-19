'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { BLOG_HERO_IMAGE, BLOG_EDITORIAL_IMAGE } from '@/utils/blogImages';

export type BlogArticleSummary = {
  slug: string;
  title: string;
  description: string;
};

export type BlogIndexData = {
  hero: { kicker: string; title: string; description: string };
  heroAlt: string;
  editorialAlt: string;
  articles: BlogArticleSummary[];
  readLabel: string;
};

function ArticleRow({
  article,
  readLabel,
}: {
  article: BlogArticleSummary;
  readLabel: string;
}) {
  return (
    <LocalizedLink
      href={`/blog/${article.slug}`}
      className="group flex flex-col gap-4 py-10 md:flex-row md:items-center md:justify-between md:gap-8"
    >
      <div className="max-w-[760px]">
        <h2 className="font-tenor text-[28px] leading-[1.05] tracking-[-0.02em] text-black transition-colors duration-300 group-hover:text-[#18352b] md:text-[38px]">
          {article.title}
        </h2>
        <p className="mt-3 font-montserrat text-[14px] leading-7 text-neutral-500 md:text-[15px]">
          {article.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 font-montserrat text-[13px] font-semibold uppercase tracking-[0.08em] text-black">
        {readLabel}
        <ArrowUpRight
          size={16}
          strokeWidth={1.6}
          className="transition-transform duration-300 group-hover:-translate-y-[2px] group-hover:translate-x-[2px]"
        />
      </div>
    </LocalizedLink>
  );
}

export default function BlogIndexPageClient({
  initialData,
}: {
  initialData: BlogIndexData;
}) {
  const content = initialData;
  const splitIndex = Math.ceil(content.articles.length / 2);
  const firstHalf = content.articles.slice(0, splitIndex);
  const secondHalf = content.articles.slice(splitIndex);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f1] text-black">
      {/* HERO */}
      <section className="mx-auto max-w-[1700px] px-5 pb-16 pt-[130px] md:px-8 md:pb-24 md:pt-[170px]">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1180px]"
        >
          <p className="mb-6 font-montserrat text-[12px] font-medium uppercase tracking-[0.38em] text-black/45 md:text-[13px]">
            {content.hero.kicker}
          </p>
          <h1 className="font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[72px] xl:text-[96px]">
            {content.hero.title}
          </h1>
          <p className="mt-8 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[18px]">
            {content.hero.description}
          </p>
        </motion.div>

        {/* HERO IMAGE */}
        <div className="mx-auto mt-14 max-w-[1400px] overflow-hidden border border-[#e7e2d9] md:mt-20">
          <Image
            src={BLOG_HERO_IMAGE.src}
            alt={content.heroAlt}
            width={BLOG_HERO_IMAGE.width}
            height={BLOG_HERO_IMAGE.height}
            sizes="(min-width: 1400px) 1400px, 100vw"
            className="h-auto w-full"
            priority
          />
        </div>
      </section>

      {/* ARTICLE LIST — FIRST HALF */}
      <section className="border-t border-[#e7e2d9] py-16 md:py-24">
        <div className="mx-auto max-w-[1300px] px-5 md:px-8">
          <div className="divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
            {firstHalf.map(article => (
              <ArticleRow
                key={article.slug}
                article={article}
                readLabel={content.readLabel}
              />
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL IMAGE */}
      <section className="border-t border-[#e7e2d9] bg-[#f2efe8] py-16 md:py-24">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="overflow-hidden border border-[#e7e2d9]">
            <Image
              src={BLOG_EDITORIAL_IMAGE.src}
              alt={content.editorialAlt}
              width={BLOG_EDITORIAL_IMAGE.width}
              height={BLOG_EDITORIAL_IMAGE.height}
              sizes="(min-width: 1500px) 1500px, 100vw"
              loading="lazy"
              className="h-auto w-full"
            />
          </div>
        </div>
      </section>

      {/* ARTICLE LIST — SECOND HALF */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1300px] px-5 md:px-8">
          <div className="divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
            {secondHalf.map(article => (
              <ArticleRow
                key={article.slug}
                article={article}
                readLabel={content.readLabel}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
