'use client';

import { motion, MotionConfig } from 'framer-motion';
import Image from 'next/image';

import { BackgroundVideo } from '@/components/common/BackgroundVideo';

import { LocalizedLink } from '@/components/ui/LocalizedLink';

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
      <main className="swiss min-h-screen overflow-hidden bg-[#F7F7F5]/65 text-black">
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
              controlClassName="right-5 top-24 md:right-8 md:top-28"
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

          {/* PROJECTS — gallery on the video */}
          <section className="relative mx-auto max-w-[1700px] px-5 pb-20 pt-10 md:px-8 md:pb-28 md:pt-14">
            <div className={styles.gallery}>
              {content.items.map((item, index) => {
                const delay = (index % 3) * 0.06;

                return (
                  <motion.article
                    key={`${item.title}-${index}`}
                    {...reveal(0, 28, delay)}
                    className={`group font-montserrat ${styles.gcard}`}
                  >
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${content.projectButton}: ${item.title}`}
                      className={styles.gshot}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={`${item.title} Premium Website Projekt`}
                          fill
                          priority={index < 3}
                          sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className={styles.gimg}
                        />
                      ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.32em] text-neutral-500">
                          Coming Soon
                        </span>
                      )}
                      <span aria-hidden="true" className={styles.garrow}>
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 17L17 7M17 7H8M17 7V16"
                          />
                        </svg>
                      </span>
                    </a>

                    <div className={styles.gbody}>
                      <p className={styles.gmeta}>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                        <span aria-hidden="true" className={styles.gdot} />
                        <span>
                          {content.categories[item.title] ||
                            content.projectLabel}
                        </span>
                        {item.kind === 'concept' && (
                          <span className={styles.gconcept}>
                            {content.conceptLabel}
                          </span>
                        )}
                      </p>

                      <h2 className="mt-3 font-tenor text-[28px] leading-[1.02] tracking-[-0.035em] md:text-[32px]">
                        {item.title}
                      </h2>

                      <p className={styles.gdesc}>{item.description}</p>

                      <div className={styles.gfoot}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.open}
                        >
                          {content.projectButton}
                          <span
                            aria-hidden="true"
                            className={styles.openLine}
                          />
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
                    </div>
                  </motion.article>
                );
              })}
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
