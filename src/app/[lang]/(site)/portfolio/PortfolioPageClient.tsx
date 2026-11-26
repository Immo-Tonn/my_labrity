'use client';

import { motion, MotionConfig } from 'framer-motion';
import Image from 'next/image';

import { BackgroundVideo } from '@/components/common/BackgroundVideo';
import { InnerPhoto } from '@/components/common/InnerPhoto';

import { LocalizedLink } from '@/components/ui/LocalizedLink';
import ParallaxProjectsGallery from '@/components/ui/ParallaxProjectsGallery';

import styles from './PortfolioPage.module.css';

type ProjectItem = {
  title: string;
  description: string;
  imageVariant: 'first' | 'second';
  href: string;
  image?: string;
  kind?: 'client' | 'concept';
  // Optional internal link to a service page that relates to this project.
  detailLabel?: string;
  detailHref?: string;
};

type SeoBlockItem = {
  kicker: string;
  title: string;
};

type BlackSection = {
  kicker: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
};

export type PortfolioData = {
  kicker: string;
  title: string;
  description: string;
  button: string;
  topTags: string[];
  seoBlock: SeoBlockItem[];
  marquee: string[];
  projectLabel: string;
  conceptLabel: string;
  projectButton: string;
  catalogKicker: string;
  catalogTitle: string;
  projectTags: string[];
  categories: Record<string, string>;
  blackSection: BlackSection;
  items: ProjectItem[];
};

export type PortfolioVideo = { pauseLabel: string; playLabel: string };

const EASE = [0.22, 1, 0.36, 1] as const;

// Sequential entrance from different sides; framer-motion's reduced-motion
// setting drops the offsets, and the noscript rule in the layout keeps the
// content visible without JavaScript.
const reveal = (x: number, y: number, delay = 0) => ({
  initial: { opacity: 0, x, y },
  whileInView: { opacity: 1, x: 0, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.8, delay, ease: EASE },
});

export default function PortfolioPageClient({
  initialData,
  video,
}: {
  initialData: PortfolioData;
  video: PortfolioVideo;
}) {
  const content = initialData;

  return (
    // reducedMotion="user" makes framer-motion automatically shorten/skip
    // these transform/opacity animations for visitors with
    // prefers-reduced-motion enabled, and leaves everyone else unchanged.
    <MotionConfig reducedMotion="user">
      <main className="swiss min-h-screen overflow-x-clip bg-[#F7F7F5]/65 text-black">
        {/* STAGE — one video stays fixed behind the compact intro and the
            project gallery, so the screenshots sit on the moving background
            right away. */}
        <div
          className={`${styles.stage} relative isolate bg-[#111111] text-[#F7F7F5]`}
        >
          <div className={styles.stageBg} aria-hidden="false">
            <BackgroundVideo
              webm="/videos/software-bg.webm"
              mp4="/videos/software-bg.mp4"
              poster="/videos/software-bg-poster.jpg"
              pauseLabel={video.pauseLabel}
              playLabel={video.playLabel}
              className="h-full w-full border-0"
              overlayClassName="bg-[#111111]/45 [background-image:linear-gradient(to_bottom,rgba(17,17,17,0.6),rgba(17,17,17,0.2)_40%,rgba(17,17,17,0.5))]"
              floatingControl
              playbackRate={0.55}
              controlClassName="right-5 top-24 !h-5 !w-5 md:right-8 md:top-28 [&_svg]:!h-[10px] [&_svg]:!w-[10px]"
            />
          </div>

          {/* INTRO */}
          <section className={`${styles.hero} relative flex flex-col`}>
            <div className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col px-5 pb-8 pt-[110px] md:px-8 md:pb-10 md:pt-[130px]">
              <div className="grid gap-6 xl:grid-cols-[1.15fr_0.65fr] xl:items-end xl:gap-16">
                <div>
                  <motion.p
                    {...reveal(-28, 0)}
                    className="mb-5 flex items-center gap-3 font-montserrat text-[13px] font-semibold uppercase tracking-[0.34em] text-[#F7F7F5]"
                  >
                    {content.kicker}
                  </motion.p>

                  <motion.h1
                    {...reveal(-48, 0, 0.12)}
                    className="max-w-[1050px] font-tenor text-[54px] leading-[0.95] tracking-[-0.045em] text-[#F7F7F5] md:text-[90px] xl:text-[126px]"
                  >
                    {content.title}
                  </motion.h1>
                </div>

                <motion.div
                  {...reveal(48, 0, 0.28)}
                  className="max-w-[640px] border-t border-[#F7F7F5]/60 pt-6 xl:mb-3 xl:border-l xl:border-t-0 xl:pl-8 xl:pt-0"
                >
                  <p className="font-montserrat text-[15px] leading-8 text-[#F7F7F5]/90 md:text-[18px]">
                    {content.description}
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="relative z-10 overflow-hidden border-t border-[#F7F7F5]/45 bg-[#111111]/55 py-4">
              <div className="marquee-wrapper">
                <div className="marquee-track">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div
                      key={index}
                      className="flex shrink-0 items-center gap-14 pr-14"
                    >
                      {content.marquee.map(text => (
                        <span
                          key={text}
                          className="whitespace-nowrap font-montserrat text-xs font-semibold uppercase tracking-[0.34em] text-[#F7F7F5]"
                        >
                          {text}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* SHOWCASE — scroll-driven 3D gallery of the same projects */}
          <ParallaxProjectsGallery
            title={content.kicker}
            showTitle={false}
            scrollLabel="Scroll"
            projects={content.items
              .filter(item => item.image)
              .map(item => ({
                title: item.title,
                category: content.categories[item.title] ?? '',
                image: item.image as string,
                href: item.href,
              }))}
          />

          {/* CATALOG — compact list with descriptions (the gallery above is
              the showcase, this is the reference) */}
          <section className="relative mx-auto max-w-[1700px] px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
            <motion.div {...reveal(0, 24)} className="mb-8 md:mb-12">
              <p className="mb-4 font-montserrat text-[12px] font-semibold uppercase tracking-[0.34em] text-[#F7F7F5]/80">
                {content.catalogKicker}
              </p>
              <h2 className="font-tenor text-[34px] leading-[1.02] tracking-[-0.035em] text-[#F7F7F5] md:text-[56px]">
                {content.catalogTitle}
              </h2>
            </motion.div>

            <div className={styles.catalog}>
              {content.items.map((item, index) => (
                <motion.article
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.35 }}
                  transition={{ duration: 1.1, ease: EASE }}
                  className={`group font-montserrat ${styles.crow}`}
                >
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${content.projectButton}: ${item.title}`}
                    className={styles.cthumb}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={`${item.title} Premium Website Projekt`}
                        fill
                        sizes="(min-width: 768px) 200px, 96px"
                        className={styles.cimg}
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center text-[9px] uppercase tracking-[0.2em] text-neutral-500">
                        Coming Soon
                      </span>
                    )}
                  </a>

                  <div className={styles.cmain}>
                    <p className={styles.gmeta}>
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span aria-hidden="true" className={styles.gdot} />
                      <span>
                        {content.categories[item.title] || content.projectLabel}
                      </span>
                      {item.kind === 'concept' && (
                        <span className={styles.gconcept}>
                          {content.conceptLabel}
                        </span>
                      )}
                    </p>

                    <h3 className="mt-2 font-tenor text-[24px] leading-[1.05] tracking-[-0.03em] md:text-[28px]">
                      {item.title}
                    </h3>

                    <p className={styles.cdesc}>{item.description}</p>
                  </div>

                  <div className={styles.cactions}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.open}
                    >
                      {content.projectButton}
                      <span aria-hidden="true" className={styles.openLine} />
                    </a>

                    {item.detailHref && item.detailLabel && (
                      <LocalizedLink
                        href={item.detailHref}
                        className={styles.detail}
                      >
                        {item.detailLabel}
                        <span aria-hidden="true">→</span>
                      </LocalizedLink>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          </section>
        </div>

        {/* TAGS + SEO CELLS — moved below the gallery */}
        <section className="mx-auto max-w-[1700px] px-5 py-16 md:px-8 md:py-24">
          <motion.div
            {...reveal(0, 32, 0.4)}
            className={`mt-10 md:mt-10 ${styles.tags}`}
          >
            {content.topTags.map(tag => (
              <div key={tag} className={`font-montserrat ${styles.tag}`}>
                <span aria-hidden="true" className={styles.mark} />
                <span className={styles.text}>{tag}</span>
              </div>
            ))}
          </motion.div>

          {/* SEO BLOCK */}
          <div className={styles.cells}>
            {content.seoBlock.map((item, itemIndex) => (
              <motion.div
                key={item.kicker}
                {...reveal(
                  itemIndex === 1 ? 0 : itemIndex === 0 ? -36 : 36,
                  itemIndex === 1 ? 36 : 0,
                  0.15 + itemIndex * 0.12,
                )}
                className={`${styles.cell} ${itemIndex === 1 ? styles.dark : ''}`}
              >
                <p className={`font-montserrat ${styles.cellKicker}`}>
                  {item.kicker}
                </p>

                <p className="mt-6 hyphens-manual break-words font-tenor text-[30px] leading-[1.08] md:text-[34px] xl:text-[40px]">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </div>

          <InnerPhoto
            src="/images/inner/portfolio-concrete-forms.webp"
            width={1536}
            height={1024}
            sizes="(min-width: 1700px) 1700px, 92vw"
            position="50% 58%"
            className="mt-10 aspect-[4/3] w-full md:mt-14 md:aspect-[21/9]"
          />
        </section>

        {/* BLACK SECTION */}
        <section className="relative overflow-hidden bg-black py-28 text-white md:py-40">
          <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-48 left-0 h-[420px] w-[420px] rounded-full bg-white/5 blur-[110px]" />

          <div className="relative mx-auto max-w-[1650px] px-5 md:px-8">
            <div className="grid gap-16 xl:grid-cols-[1fr_0.8fr] xl:items-end">
              <div>
                <p className="mb-5 font-montserrat text-xs uppercase tracking-[0.34em] text-white/60">
                  {content.blackSection.kicker}
                </p>

                <h2 className="font-tenor text-[58px] leading-[0.9] tracking-[-0.05em] md:text-[118px] xl:text-[138px]">
                  {content.blackSection.title}
                </h2>
              </div>

              <div className="flex flex-col justify-end">
                <p className="max-w-[620px] font-montserrat text-[16px] leading-8 text-white/75 md:text-[19px] md:leading-9">
                  {content.blackSection.description}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4 font-montserrat text-xs uppercase tracking-[0.28em] text-white/60">
                  {content.blackSection.tags.map((tag, tagIndex) => (
                    <div key={tag} className="flex items-center gap-4">
                      {tagIndex > 0 && (
                        <span className="h-1 w-1 rounded-full bg-white/35" />
                      )}
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-white" />

                  <span className="font-montserrat text-xs uppercase tracking-[0.34em] text-white/60">
                    {content.blackSection.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INLINE CSS */}
        <style jsx>{`
          .marquee-wrapper {
            overflow: hidden;
            width: 100%;
          }

          .marquee-track {
            display: flex;
            width: max-content;
            animation: marquee 28s linear infinite;
            will-change: transform;
          }

          @keyframes marquee {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }

          @media (max-width: 768px) {
            .marquee-track {
              animation-duration: 24s;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .marquee-track {
              animation: none;
            }
          }
        `}</style>
      </main>
    </MotionConfig>
  );
}
