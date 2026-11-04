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

  const isSeniorProject = (title: string) =>
    title.toLowerCase().includes('alltags') ||
    title.toLowerCase().includes('senior');

  return (
    // reducedMotion="user" makes framer-motion automatically shorten/skip
    // these transform/opacity animations for visitors with
    // prefers-reduced-motion enabled, and leaves everyone else unchanged.
    <MotionConfig reducedMotion="user">
      <main className="swiss min-h-screen overflow-hidden bg-[#F7F7F5]/65 text-black">
        {/* HERO — the video is the background, shown at its own 16:9 on
            desktop; light text over a dimming layer. */}
        <section
          className={`${styles.hero} relative isolate flex flex-col overflow-hidden bg-[#111111] text-[#F7F7F5] lg:min-h-[56.25vw]`}
        >
          <div className="absolute inset-0 -z-10">
            <BackgroundVideo
              webm="/videos/software-bg.webm"
              mp4="/videos/software-bg.mp4"
              poster="/videos/software-bg-poster.jpg"
              pauseLabel={video.pauseLabel}
              playLabel={video.playLabel}
              className="h-full w-full border-0"
              overlayClassName="bg-[#111111]/55 [background-image:linear-gradient(to_bottom,rgba(17,17,17,0.55),rgba(17,17,17,0.15)_35%,rgba(17,17,17,0.65))]"
              controlClassName="right-5 top-24 md:right-8 md:top-28"
            />
          </div>

          <div className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col px-5 pb-10 pt-[125px] md:px-8 md:pb-10 md:pt-[130px]">
            <div className="grid gap-10 xl:grid-cols-[1.15fr_0.65fr] xl:items-end xl:gap-16">
              <div>
                <motion.p
                  {...reveal(-28, 0)}
                  className="mb-6 flex items-center gap-3 font-montserrat text-[13px] font-semibold uppercase tracking-[0.34em] text-[#F7F7F5]"
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

        {/* PROJECTS */}
        <section className="mx-auto max-w-[1700px] px-5 pb-28 pt-12 md:px-8 md:pb-40 md:pt-16">
          <div className="space-y-10 md:space-y-14" style={{ opacity: 1 }}>
            {content.items.map((item, index) => {
              const seniorProject = isSeniorProject(item.title);
              const delay = Math.min(index, 3) * 0.05;

              return (
                <article
                  key={`${item.title}-${index}`}
                  className={`group ${styles.card}`}
                >
                  {/* SCREENSHOT — the frame opens through a mask from the left
                      (SwissMotion). */}
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.shot}
                  >
                    <div className={styles.frame}>
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={`${item.title} Premium Website Projekt`}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 1280px) 100vw, 58vw"
                          className="object-contain p-3 transition duration-700 group-hover:scale-[1.025] md:p-5"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-500">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                  </a>

                  {/* DESCRIPTION — slides in from the right. */}
                  <motion.div
                    {...reveal(56, 0, 0.12 + delay)}
                    className={`font-montserrat ${styles.panel}`}
                  >
                    <div className={styles.head}>
                      <div className="min-w-0">
                        <p className={styles.meta}>
                          {String(index + 1).padStart(2, '0')} /{' '}
                          {content.categories[item.title] ||
                            content.projectLabel}
                        </p>

                        <p className={styles.metaSub}>{content.projectLabel}</p>

                        {item.kind === 'concept' && (
                          <p className={styles.concept}>
                            {content.conceptLabel}
                          </p>
                        )}
                      </div>

                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${content.projectButton}: ${item.title}`}
                        className={styles.arrow}
                      >
                        <svg
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7 17L17 7M17 7H8M17 7V16"
                          />
                        </svg>
                      </a>
                    </div>

                    <div className={styles.body}>
                      <h2
                        className={`${styles.title} font-tenor leading-[0.95] tracking-[-0.04em] ${
                          seniorProject
                            ? 'text-[32px] sm:text-[40px]'
                            : 'text-[36px] sm:text-[44px]'
                        } md:text-[64px] lg:text-[52px] xl:text-[68px]`}
                      >
                        {item.title}
                      </h2>

                      <p
                        className={`${styles.desc} text-[14px] leading-8 md:text-[16px] ${
                          seniorProject
                            ? '[overflow-wrap:anywhere]'
                            : 'break-words'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    <div className={styles.foot}>
                      <div className={styles.tagsRow}>
                        {content.projectTags.map((tag, tagIndex) => (
                          <div key={tag} className="flex items-center gap-4">
                            {tagIndex > 0 && (
                              <span aria-hidden="true" className={styles.dot} />
                            )}
                            <span>{tag}</span>
                          </div>
                        ))}
                      </div>

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
                        <div>
                          <LocalizedLink
                            href={item.detailHref}
                            className={styles.detail}
                          >
                            {item.detailLabel}
                            <span aria-hidden="true">→</span>
                          </LocalizedLink>
                        </div>
                      )}
                    </div>
                  </motion.div>
                </article>
              );
            })}
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
