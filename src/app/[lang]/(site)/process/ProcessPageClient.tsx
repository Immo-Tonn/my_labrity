'use client';

import { type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { InnerPhoto } from '@/components/common/InnerPhoto';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

import styles from './Process.module.css';

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type ProcessCard = {
  title: string;
  description: string;
};

type RelatedArticleItem = { label: string; linkLabel: string; href: string };

export type ProcessData = {
  hero: {
    kicker: string;
    title: string;
    description: string;
  };
  stepsSection: {
    kicker: string;
    title: string;
    description: string;
    items: ProcessStep[];
  };
  clientSection: {
    kicker: string;
    title: string;
    description: string;
    items: ProcessCard[];
  };
  relatedArticles?: {
    kicker: string;
    title: string;
    items: RelatedArticleItem[];
  };
  resultSection: {
    kicker: string;
    title: string;
    description: string;
    items: ProcessCard[];
  };
  calmSection: {
    kicker: string;
    title: string;
    description: string;
  };
  cta: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
};

// Photographs (all decorative): the hero shows the team at work, each step
// gets its own large picture beside its text.
const HERO_PHOTO = {
  src: '/images/inner/about-team-work.webp',
  width: 1536,
  height: 1024,
};

const STEP_PHOTOS = [
  {
    src: '/images/blog/landingpage-dauer-launch.jpg',
    width: 1536,
    height: 1024,
    position: '50% 60%',
  },
  {
    src: '/images/inner/aluminium-frame-red-corner.webp',
    width: 1122,
    height: 1402,
    position: '50% 18%',
  },
  {
    src: '/images/blog/landingpage-oder-website.jpg',
    width: 1374,
    height: 1145,
    position: '50% 50%',
  },
  {
    src: '/images/inner/concrete-interior-laptop.webp',
    width: 1536,
    height: 1024,
    position: '50% 50%',
  },
  {
    src: '/images/blog/website-ladezeit-performance.jpg',
    width: 1374,
    height: 1145,
    position: '40% 50%',
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const STEP_EASE = [0.23, 1, 0.32, 1] as const;

// Short entrance from a given side; with reduced motion the finished
// composition simply renders in place.
function useReveal() {
  const reduce = useReducedMotion();

  return (x: number, y: number, delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x, y },
          whileInView: { opacity: 1, x: 0, y: 0 },
          viewport: { once: true, amount: 0.12 },
          transition: { duration: 0.75, delay, ease: EASE },
        };
}

const cx = (...names: (string | false | undefined)[]) =>
  names.filter(Boolean).join(' ');

function Kicker({ children }: { children: ReactNode }) {
  return <p className={`${styles.kicker} font-montserrat`}>{children}</p>;
}

export default function ProcessPageClient({
  initialData,
}: {
  initialData: ProcessData;
}) {
  const content = initialData;
  const reveal = useReveal();
  const reduce = useReducedMotion();
  const steps = content.stepsSection.items;

  // Steps: short 20px slide from alternating sides, ease-out, converging
  // into the grid. Nothing moves with reduced motion.
  const stepReveal = (x: number, delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.45, delay, ease: STEP_EASE },
        };

  return (
    <main
      className={`${styles.page} swiss min-h-screen overflow-x-clip bg-[#F7F7F5]/65 text-black`}
    >
      <section className="mx-auto max-w-[1700px] px-5 pb-20 pt-[110px] md:px-8 md:pb-28 md:pt-[140px]">
        <div className={styles.stack} style={{ opacity: 1 }}>
          {/* HERO — graphite title beside a photo, then the process line */}
          <div className={styles.heroGrid}>
            <motion.div
              {...reveal(-48, 0)}
              className={cx(
                styles.block,
                styles.dark,
                styles.pad,
                'flex flex-col justify-end',
              )}
            >
              <motion.p
                {...reveal(-24, 0, 0.1)}
                className="mb-6 font-montserrat text-[12px] font-semibold uppercase tracking-[0.38em] md:text-[13px]"
              >
                {content.hero.kicker}
              </motion.p>

              <motion.h1
                {...reveal(-40, 0, 0.2)}
                className="max-w-[1180px] font-tenor text-[44px] leading-[0.98] tracking-[-0.045em] md:text-[72px] xl:text-[88px]"
              >
                {content.hero.title}
              </motion.h1>

              <motion.p
                {...reveal(40, 0, 0.35)}
                className={`${styles.sub} mt-8 max-w-[760px] font-montserrat text-[15px] leading-8 md:text-[18px]`}
              >
                {content.hero.description}
              </motion.p>
            </motion.div>

            <InnerPhoto
              src={HERO_PHOTO.src}
              width={HERO_PHOTO.width}
              height={HERO_PHOTO.height}
              sizes="(min-width: 1280px) 45vw, 100vw"
              position="50% 50%"
              open
              priority
              className={styles.heroPhoto}
            />
          </div>

          <motion.div
            {...reveal(48, 0, 0.1)}
            className={cx(styles.block, styles.light, styles.line)}
          >
            {steps.map(item => (
              <div
                key={`${item.number}-${item.title}`}
                className={styles.lineItem}
              >
                <span className="font-montserrat text-xs font-semibold uppercase tracking-[0.28em]">
                  {item.number}
                </span>

                <span
                  className={`${styles.sub} font-montserrat text-xs font-medium uppercase tracking-[0.22em]`}
                >
                  {item.title}
                </span>
              </div>
            ))}
          </motion.div>

          {/* STEPS — graphite intro, then five rows of two equal blocks:
              text beside a large photo, sides alternating. */}
          <motion.div
            {...stepReveal(-20)}
            className={cx(styles.block, styles.dark, styles.pad)}
          >
            <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-end xl:gap-16">
              <div>
                <Kicker>{content.stepsSection.kicker}</Kicker>

                <h2 className="font-tenor text-[40px] leading-[1] tracking-[-0.04em] md:text-[68px]">
                  {content.stepsSection.title}
                </h2>
              </div>

              <p
                className={`${styles.sub} max-w-[560px] font-montserrat text-[15px] leading-8 md:text-[17px]`}
              >
                {content.stepsSection.description}
              </p>
            </div>
          </motion.div>

          {steps.map((item, index) => {
            const photo = STEP_PHOTOS[index];
            const photoFirst = index % 2 === 1;

            return (
              <div
                key={`${item.number}-${item.title}`}
                className={styles.stepRow}
              >
                <motion.div
                  {...stepReveal(photoFirst ? 20 : -20, 0.04)}
                  className={cx(
                    styles.block,
                    styles.step,
                    index % 2 === 0 ? styles.light : styles.dark,
                  )}
                >
                  <p className={`${styles.stepNum} font-tenor`}>
                    {item.number}
                  </p>

                  <div>
                    <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em] md:text-[42px]">
                      {item.title}
                    </h3>

                    <motion.span
                      aria-hidden="true"
                      initial={{ opacity: 0, scaleX: 0 }}
                      whileInView={{ opacity: 1, scaleX: 1 }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.2,
                        ease: STEP_EASE,
                      }}
                      className={cx(styles.rule, 'mt-5 max-w-[320px]')}
                    />

                    <p
                      className={`${styles.sub} mt-5 max-w-[520px] font-montserrat text-[14px] leading-7 md:text-[16px]`}
                    >
                      {item.description}
                    </p>
                  </div>
                </motion.div>

                {photo && (
                  <InnerPhoto
                    src={photo.src}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 768px) 50vw, 100vw"
                    position={photo.position}
                    hoverZoom
                    className={cx(
                      styles.stepPhoto,
                      photoFirst && 'md:order-first',
                    )}
                  />
                )}
              </div>
            );
          })}

          {/* CLIENT NEEDS — starts graphite (previous block ended light) */}
          <motion.div
            {...reveal(-48, 0)}
            className={cx(styles.block, styles.dark, styles.pad)}
          >
            <div className="mx-auto max-w-[860px]">
              <Kicker>{content.clientSection.kicker}</Kicker>

              <h2 className="font-tenor text-[40px] leading-[1] tracking-[-0.04em] md:text-[68px]">
                {content.clientSection.title}
              </h2>

              <p
                className={`${styles.sub} mt-7 font-montserrat text-[15px] leading-8 md:text-[17px]`}
              >
                {content.clientSection.description}
              </p>
            </div>
          </motion.div>

          <div className={cx(styles.grid, 'md:grid-cols-3')}>
            {content.clientSection.items.map((item, index) => (
              <motion.div
                key={item.title}
                {...reveal(
                  index === 1 ? 0 : index === 0 ? -48 : 48,
                  index === 1 ? 40 : 0,
                  index * 0.1,
                )}
                className={cx(
                  styles.block,
                  styles.hoverable,
                  styles.pad,
                  index % 2 === 0 ? styles.light : styles.dark,
                )}
              >
                <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em]">
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

          {/* RELATED ARTICLES — graphite header, light link cards */}
          {content.relatedArticles && (
            <div
              className={cx(styles.grid, styles.split)}
              style={{ '--cols': '0.8fr 1.2fr' } as React.CSSProperties}
            >
              <motion.div
                {...reveal(-48, 0)}
                className={cx(styles.block, styles.dark, styles.pad)}
              >
                <Kicker>{content.relatedArticles.kicker}</Kicker>

                <h2 className="font-tenor text-[26px] leading-[1.1] md:text-[34px]">
                  {content.relatedArticles.title}
                </h2>
              </motion.div>

              <div className={styles.stack}>
                {content.relatedArticles.items.map((item, index) => (
                  <motion.div
                    key={item.href}
                    {...reveal(48, 0, index * 0.1)}
                    className="flex-1"
                  >
                    <LocalizedLink
                      href={item.href}
                      className={cx(styles.linkCard, styles.light)}
                    >
                      <span className="font-montserrat text-[14px] leading-6">
                        {item.label}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-2 font-montserrat text-[13px] font-semibold uppercase tracking-[0.06em]">
                        <span className={styles.linkText}>
                          {item.linkLabel}
                        </span>
                        <span aria-hidden="true" className={styles.arrow}>
                          <ArrowUpRight size={16} strokeWidth={1.8} />
                        </span>
                      </span>
                    </LocalizedLink>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* CALM — graphite (previous ended light) */}
          <motion.div
            {...reveal(0, 40)}
            className={cx(styles.block, styles.dark, styles.pad)}
          >
            <div className="grid gap-12 xl:grid-cols-[1fr_0.9fr] xl:gap-20">
              <div>
                <Kicker>{content.calmSection.kicker}</Kicker>

                <h2 className="font-tenor text-[50px] leading-[0.92] tracking-[-0.05em] md:text-[104px]">
                  {content.calmSection.title}
                </h2>
              </div>

              <div className="flex items-end">
                <p
                  className={`${styles.sub} max-w-[620px] font-montserrat text-[16px] leading-9 md:text-[19px]`}
                >
                  {content.calmSection.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* RESULT — light title, then graphite / light checkerboard */}
          <div
            className={cx(styles.grid, styles.split)}
            style={{ '--cols': '0.8fr 1.2fr' } as React.CSSProperties}
          >
            <motion.div
              {...reveal(-56, 0)}
              className={cx(styles.block, styles.light, styles.pad)}
            >
              <Kicker>{content.resultSection.kicker}</Kicker>

              <h2 className="font-tenor text-[40px] leading-[1] tracking-[-0.04em] md:text-[68px]">
                {content.resultSection.title}
              </h2>

              <p
                className={`${styles.sub} mt-7 max-w-[560px] font-montserrat text-[15px] leading-8 md:text-[17px]`}
              >
                {content.resultSection.description}
              </p>
            </motion.div>

            <div className={cx(styles.grid, 'md:grid-cols-2')}>
              {content.resultSection.items.map((item, index) => (
                <motion.div
                  key={item.title}
                  {...reveal(index % 2 === 0 ? 48 : -48, 0, index * 0.08)}
                  className={cx(
                    styles.block,
                    styles.hoverable,
                    styles.pad,
                    'min-h-[210px]',
                    index === 0 || index === 3 ? styles.dark : styles.light,
                  )}
                >
                  <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em]">
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
          </div>

          {/* CTA — light (previous ended graphite) */}
          <motion.div
            {...reveal(0, 40)}
            className={cx(styles.block, styles.light, styles.pad, 'md:py-20')}
          >
            <div>
              <Kicker>{content.cta.kicker}</Kicker>

              <h2 className="max-w-[900px] font-tenor text-[40px] leading-[1] tracking-[-0.04em] md:text-[76px]">
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

                <LocalizedLink
                  href="/portfolio"
                  className={`${styles.btn} ${styles.ghost} font-montserrat`}
                >
                  {content.cta.secondaryButton}
                </LocalizedLink>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
