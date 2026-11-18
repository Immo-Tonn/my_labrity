'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { BLOG_COVER_IMAGES } from '@/utils/blogImages';

import styles from './Blog.module.css';

export type BlogArticleSummary = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readMinutes: number;
};

export type BlogIndexData = {
  hero: { kicker: string; title: string; description: string };
  heroAlt: string;
  editorialAlt: string;
  articles: BlogArticleSummary[];
  readLabel: string;
  readTimeLabel: string;
  featuredSlug: string;
  featuredLabel: string;
  cta: { kicker: string; title: string; text: string; button: string };
};

const EASE = [0.23, 1, 0.32, 1] as const;

// Page photographs (1536×1024, WebP).
const HERO_IMAGE = {
  src: '/images/inner/blog-journal-open.webp',
  width: 1536,
  height: 1024,
};
const EDITORIAL_IMAGE = {
  src: '/images/inner/blog-folded-paper.webp',
  width: 1536,
  height: 1024,
};

const cx = (...names: (string | false | undefined)[]) =>
  names.filter(Boolean).join(' ');

function MetaLine({
  article,
  readTimeLabel,
}: {
  article: BlogArticleSummary;
  readTimeLabel: string;
}) {
  return (
    <p className={`${styles.meta} font-montserrat`}>
      {article.category && <span>{article.category}</span>}
      {article.category && (
        <span aria-hidden="true" className={styles.metaDot} />
      )}
      <span>
        {article.readMinutes} {readTimeLabel}
      </span>
    </p>
  );
}

function ArticleCard({
  article,
  readLabel,
  readTimeLabel,
  index,
}: {
  article: BlogArticleSummary;
  readLabel: string;
  readTimeLabel: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  const cover = BLOG_COVER_IMAGES[article.slug];
  const col = index % 3;

  return (
    <motion.div
      {...(reduce
        ? {}
        : {
            initial: {
              opacity: 0,
              x: col === 1 ? 0 : col === 0 ? -14 : 14,
              y: 16,
            },
            whileInView: { opacity: 1, x: 0, y: 0 },
            viewport: { once: true, amount: 0.12 },
            transition: { duration: 0.45, delay: col * 0.05, ease: EASE },
          })}
    >
      <LocalizedLink href={`/blog/${article.slug}`} className={styles.link}>
        <article className={styles.card}>
          {cover && (
            <div className={styles.cover}>
              <Image
                src={cover.src}
                alt=""
                width={cover.width}
                height={cover.height}
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 92vw"
                className="h-full w-full"
              />
            </div>
          )}

          <div className={styles.body}>
            <MetaLine article={article} readTimeLabel={readTimeLabel} />
            <h2 className="font-tenor text-[26px] leading-[1.08] tracking-[-0.02em] md:text-[30px]">
              {article.title}
            </h2>
            <p
              className={`${styles.sub} mt-3 font-montserrat text-[14px] leading-7`}
            >
              {article.description}
            </p>

            <span className={`${styles.read} font-montserrat`}>
              <span className={styles.underline}>{readLabel}</span>
              <span aria-hidden="true" className={styles.arrow}>
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </span>
            </span>
          </div>
        </article>
      </LocalizedLink>
    </motion.div>
  );
}

function FeaturedArticle({
  article,
  label,
  readLabel,
  readTimeLabel,
}: {
  article: BlogArticleSummary;
  label: string;
  readLabel: string;
  readTimeLabel: string;
}) {
  const cover = BLOG_COVER_IMAGES[article.slug];

  return (
    <LocalizedLink
      href={`/blog/${article.slug}`}
      className={`${styles.link} ${styles.featured}`}
    >
      <div className={`${styles.featuredImage} ${styles.cover}`}>
        {cover && (
          <Image
            src={cover.src}
            alt=""
            width={cover.width}
            height={cover.height}
            sizes="(min-width: 1280px) 55vw, 100vw"
            className="h-full w-full"
          />
        )}
      </div>
      <article
        className={`${styles.card} ${styles.featuredBody} ${styles.dark}`}
      >
        <p className={`${styles.kicker} font-montserrat`}>{label}</p>
        <MetaLine article={article} readTimeLabel={readTimeLabel} />
        <h2 className="font-tenor text-[30px] leading-[1.05] tracking-[-0.03em] md:text-[44px]">
          {article.title}
        </h2>
        <p
          className={`${styles.sub} mt-5 max-w-[520px] font-montserrat text-[15px] leading-7 md:text-[16px]`}
        >
          {article.description}
        </p>
        <span className={`${styles.read} font-montserrat`}>
          <span className={styles.underline}>{readLabel}</span>
          <span aria-hidden="true" className={styles.arrow}>
            <ArrowUpRight size={16} strokeWidth={1.8} />
          </span>
        </span>
      </article>
    </LocalizedLink>
  );
}

function CtaCard({ cta }: { cta: BlogIndexData['cta'] }) {
  return (
    <div className={styles.ctaWrap}>
      <LocalizedLink href="/contact" className={styles.link}>
        <div className={`${styles.card} ${styles.ctaCard}`}>
          <div className={styles.body}>
            <p className={`${styles.meta} font-montserrat`}>{cta.kicker}</p>
            <h2 className="font-tenor text-[30px] leading-[1.05] tracking-[-0.03em] md:text-[38px]">
              {cta.title}
            </h2>
            <p className="mt-4 font-montserrat text-[15px] leading-7">
              {cta.text}
            </p>
            <span className={`${styles.read} font-montserrat`}>
              <span className={styles.underline}>{cta.button}</span>
              <span aria-hidden="true" className={styles.arrow}>
                <ArrowUpRight size={16} strokeWidth={1.8} />
              </span>
            </span>
          </div>
        </div>
      </LocalizedLink>
    </div>
  );
}

export default function BlogIndexPageClient({
  initialData,
}: {
  initialData: BlogIndexData;
}) {
  const content = initialData;
  const featured = content.articles.find(a => a.slug === content.featuredSlug);
  const rest = content.articles.filter(a => a.slug !== content.featuredSlug);
  const splitIndex = Math.ceil(rest.length / 2);
  const firstHalf = rest.slice(0, splitIndex);
  const secondHalf = rest.slice(splitIndex);

  return (
    <main
      className={`${styles.page} swiss min-h-screen overflow-x-clip bg-[#F7F7F5]/65 text-black`}
    >
      {/* HERO — graphite title, photo beside it */}
      <section className="mx-auto max-w-[1700px] px-5 pb-8 pt-[110px] md:px-8 md:pb-12 md:pt-[140px]">
        <div className={styles.hero}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className={cx(
              styles.block,
              styles.dark,
              styles.pad,
              'flex flex-col justify-end',
            )}
          >
            <p className={`${styles.kicker} font-montserrat`}>
              {content.hero.kicker}
            </p>
            <h1 className="font-tenor text-[46px] leading-[0.98] tracking-[-0.045em] md:text-[80px] xl:text-[104px]">
              {content.hero.title}
            </h1>
            <p
              className={`${styles.sub} mt-8 max-w-[640px] font-montserrat text-[15px] leading-8 md:text-[18px]`}
            >
              {content.hero.description}
            </p>
          </motion.div>

          <div className={`${styles.heroImage} sw-open`}>
            <Image
              src={HERO_IMAGE.src}
              alt={content.heroAlt}
              width={HERO_IMAGE.width}
              height={HERO_IMAGE.height}
              sizes="(min-width: 1280px) 45vw, 100vw"
              style={{ objectPosition: '50% 50%' }}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* FEATURED ARTICLE */}
      {featured && (
        <section className="mx-auto max-w-[1700px] px-5 pb-2 md:px-8 md:pb-4">
          <FeaturedArticle
            article={featured}
            label={content.featuredLabel}
            readLabel={content.readLabel}
            readTimeLabel={content.readTimeLabel}
          />
        </section>
      )}

      {/* ARTICLES — first half */}
      <section className="mx-auto max-w-[1700px] px-5 pb-2 md:px-8 md:pb-4">
        <div className={styles.cards} style={{ opacity: 1 }}>
          {firstHalf.map((article, index) => (
            <ArticleCard
              key={article.slug}
              article={article}
              readLabel={content.readLabel}
              readTimeLabel={content.readTimeLabel}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* EDITORIAL IMAGE */}
      <section className="mx-auto max-w-[1700px] px-5 py-2 md:px-8 md:py-4">
        <div className="overflow-hidden border border-[#111]">
          <Image
            src={EDITORIAL_IMAGE.src}
            alt={content.editorialAlt}
            width={EDITORIAL_IMAGE.width}
            height={EDITORIAL_IMAGE.height}
            sizes="(min-width: 1700px) 1700px, 100vw"
            loading="lazy"
            style={{ objectPosition: '60% 55%' }}
            className="aspect-[4/3] w-full object-cover md:aspect-[21/9]"
          />
        </div>
      </section>

      {/* ARTICLES — second half */}
      <section className="mx-auto max-w-[1700px] px-5 pb-24 pt-2 md:px-8 md:pb-32 md:pt-4">
        <div className={styles.cards} style={{ opacity: 1 }}>
          {secondHalf.map((article, index) => (
            <ArticleCard
              key={article.slug}
              article={article}
              readLabel={content.readLabel}
              readTimeLabel={content.readTimeLabel}
              index={index}
            />
          ))}
          <CtaCard cta={content.cta} />
        </div>
      </section>
    </main>
  );
}
