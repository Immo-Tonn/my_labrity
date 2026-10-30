'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import SeasonalSnow from '@/components/SeasonalSnow';
import SeasonalHearts from '@/components/SeasonalHearts';
import { useQuiz } from '@/components/quiz';
import { Preloader } from '@/components/ui';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { Accordion } from '@/components/ui/Accordion';
import { useLanguage } from '@/utils/LanguageContext';

import s from './home.module.css';

type StatItem = {
  value: string;
  label: string;
  description: string;
};

type ProjectItem = {
  title: string;
  description: string;
  imageVariant: 'first' | 'second';
  href: string;
  kind?: 'client' | 'concept';
};

type FeaturedProjectItem = {
  title: string;
  category: string;
  image: string;
  kind?: 'client' | 'concept';
};

type FeaturedProjectsData = {
  kicker: string;
  title: string;
  scrollLabel: string;
  button: string;
  projectButton: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  items: FeaturedProjectItem[];
};

type AudienceItem = {
  title: string;
  description: string;
};

type DifferenceItem = {
  title: string;
  description: string;
  icon: string;
};

type ProcessPreviewItem = {
  title: string;
};

export type HomeData = {
  hero: {
    kicker: string;
    titleFirst: string;
    titleSecond: string;
    description: string;
    tagline: string;
    primaryButton: string;
    secondaryButton: string;
  };
  quizPreview: {
    kicker: string;
    title: string;
    description: string;
    leftTitle?: string;
    leftDescription?: string;
    button: string;
    note: string;
    steps: string[];
  };
  featuredProjects: FeaturedProjectsData;
  audience: {
    kicker: string;
    title: string;
    description: string;
    items: AudienceItem[];
  };
  differences: {
    kicker: string;
    title: string;
    description: string;
    items: DifferenceItem[];
  };
  servicesSection: {
    kicker: string;
    title: string;
    description: string;
  };
  stats: {
    kicker: string;
    title: string;
    description: string;
    items: StatItem[];
  };
  webAppsShowcase: {
    kicker: string;
    title: string;
    subtitle: string;
    pairsTitle: string;
    problemLabel: string;
    solutionLabel: string;
    pairs: { problem: string; solution: string }[];
    capabilitiesTitle: string;
    capabilities: { title: string; description: string }[];
    primary: string;
    secondary: string;
    caption: string;
    alt1: string;
    alt2: string;
    finalCta: {
      title: string;
      description: string;
      primary: string;
      secondary: string;
    };
  };
  processPreview: {
    kicker: string;
    title: string;
    description: string;
    button: string;
    items: ProcessPreviewItem[];
  };
  portfolio: {
    kicker: string;
    title: string;
    description: string;
    button: string;
    conceptLabel: string;
    items: ProjectItem[];
  };
  cta: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
};

const STATS_STEP = 200;
const STATS_PAUSE = 2000;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const parseStatTarget = (value: string) => Number(value.match(/\d+/)?.[0] || 1);

const formatStatValue = (value: string, count: number) => {
  if (value.includes('%')) return `${count}%`;
  if (value.includes('/')) return `${count}/7`;
  if (value.includes('°')) return `${count}°`;
  if (value.includes('+')) return `${count}+`;

  return `${count}`;
};

// Leader/follower pair: the follower (24/7) finishes first and holds at its
// max value until the leader (100%) also reaches its max, then both reset
// together and the cycle restarts.
function usePairedStatCounters(
  leaderTarget: number,
  followerTarget: number,
): [number, number] {
  const [leaderCount, setLeaderCount] = useState(1);
  const [followerCount, setFollowerCount] = useState(1);

  useEffect(() => {
    let leader = 1;
    let follower = 1;
    let leaderInterval: number;
    let followerInterval: number;
    let timeoutId: number;

    // Reduced motion: show the final values, no looping count-up.
    if (prefersReducedMotion()) {
      setLeaderCount(leaderTarget);
      setFollowerCount(followerTarget);
      return;
    }

    const startCycle = () => {
      leader = 1;
      follower = 1;
      setLeaderCount(1);
      setFollowerCount(1);

      followerInterval = window.setInterval(() => {
        follower += 1;

        if (follower >= followerTarget) {
          follower = followerTarget;
          setFollowerCount(follower);
          window.clearInterval(followerInterval);
          return;
        }

        setFollowerCount(follower);
      }, STATS_STEP);

      leaderInterval = window.setInterval(() => {
        leader += 1;

        if (leader >= leaderTarget) {
          leader = leaderTarget;
          setLeaderCount(leader);
          window.clearInterval(leaderInterval);
          window.clearInterval(followerInterval);
          setFollowerCount(followerTarget);

          timeoutId = window.setTimeout(startCycle, STATS_PAUSE);

          return;
        }

        setLeaderCount(leader);
      }, STATS_STEP);
    };

    startCycle();

    return () => {
      window.clearInterval(leaderInterval);
      window.clearInterval(followerInterval);
      window.clearTimeout(timeoutId);
    };
  }, [leaderTarget, followerTarget]);

  return [leaderCount, followerCount];
}

// Runs on its own independent loop, unrelated to the paired counters.
function useSoloStatCounter(target: number): number {
  const [count, setCount] = useState(1);

  useEffect(() => {
    let current = 1;
    let intervalId: number;
    let timeoutId: number;

    if (prefersReducedMotion()) {
      setCount(target);
      return;
    }

    const startCounting = () => {
      current = 1;
      setCount(1);

      intervalId = window.setInterval(() => {
        current += 1;

        if (current >= target) {
          current = target;
          setCount(current);
          window.clearInterval(intervalId);

          timeoutId = window.setTimeout(startCounting, STATS_PAUSE);

          return;
        }

        setCount(current);
      }, STATS_STEP);
    };

    startCounting();

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [target]);

  return count;
}

function StatsCounters({ items }: { items: StatItem[] }) {
  const [leaderCount, followerCount] = usePairedStatCounters(
    parseStatTarget(items[0]?.value ?? '1'),
    parseStatTarget(items[1]?.value ?? '1'),
  );

  const soloCount = useSoloStatCounter(parseStatTarget(items[2]?.value ?? '1'));

  const counts = [leaderCount, followerCount, soloCount];

  return (
    <>
      {items.map((item, index) => (
        <div
          key={`${item.value}-${index}`}
          className="border-b border-[#111]/40 py-8 last:border-b-0 md:border-b-0 md:border-r md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
        >
          <p className="whitespace-nowrap font-tenor text-[88px] tabular-nums leading-none tracking-[-0.04em] md:text-[clamp(64px,8.6vw,150px)]">
            {formatStatValue(item.value, counts[index] ?? 1)}
          </p>

          <p className="mt-6 font-montserrat text-[12px] font-semibold uppercase tracking-[0.2em]">
            {item.label}
          </p>

          <p className="mt-3 max-w-[320px] font-montserrat text-[14px] leading-7">
            {item.description}
          </p>
        </div>
      ))}
    </>
  );
}

const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  article: motion.article,
} as const;

// Scroll-reveal wrapper. Skips the animation entirely for visitors who asked
// for reduced motion (content is simply visible).
function Reveal({
  as = 'div',
  delay = 0,
  className,
  children,
}: {
  as?: keyof typeof MOTION_TAGS;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const Tag = MOTION_TAGS[as] as typeof motion.div;

  return (
    <Tag
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

// Numbered section label. The brand red is a non-text mark here (a small dot):
// red on the paper background does not reach AA for small text.
function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <p className="flex items-center gap-4 font-montserrat text-[11px] uppercase tracking-[0.3em] text-neutral-500">
      <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#FF3830]" />
      <span className="text-[#111]">{index}</span>
      <span aria-hidden="true" className="h-px w-10 bg-[#111]/30" />
      {children}
    </p>
  );
}

const btnBase =
  'group inline-flex min-h-[58px] items-center justify-center gap-6 px-7 text-center font-montserrat text-[13px] font-semibold uppercase tracking-[0.12em] transition-colors duration-300';

const btnPrimary = `${btnBase} bg-[#111] text-white hover:bg-[#FF3830] hover:text-[#111]`;
const btnGhost = `${btnBase} border border-[#111] text-[#111] hover:bg-[#111] hover:text-white`;
const btnRed = `${btnBase} bg-[#FF3830] text-[#111] hover:bg-white`;
const textLink =
  'group inline-flex items-center gap-4 font-montserrat text-[11px] font-semibold uppercase tracking-[0.28em] text-[#111]';

type GlyphKind = 'circle' | 'square' | 'arch' | 'triangle';

// Small geometric glyphs: one shared shape language (circle / square / arch /
// triangle) used across the page instead of generic icons.
function Glyph({ kind, className }: { kind: GlyphKind; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="currentColor"
      className={className}
    >
      {kind === 'circle' && <circle cx="24" cy="24" r="18" />}
      {kind === 'square' && <rect x="8" y="8" width="32" height="32" />}
      {kind === 'arch' && <path d="M10 42V22a14 14 0 0 1 28 0v20z" />}
      {kind === 'triangle' && <path d="M24 7 43 41H5z" />}
    </svg>
  );
}

const glyphOrder: GlyphKind[] = ['circle', 'square', 'arch', 'triangle'];

// Browser-window frame for real project screenshots.
function BrowserFrame({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[6px] bg-white shadow-[0_28px_60px_-24px_rgba(17,17,17,0.45)] ${className}`}
    >
      <div
        aria-hidden="true"
        className="flex h-[22px] items-center gap-[5px] bg-[#111] px-3"
      >
        <span className="h-[6px] w-[6px] rounded-full bg-[#FF3830]" />
        <span className="h-[6px] w-[6px] rounded-full bg-white/35" />
        <span className="h-[6px] w-[6px] rounded-full bg-white/35" />
      </div>

      {children}
    </div>
  );
}

const HERO_STAGE = [
  {
    image: '/images/projects/immo-tonn.webp',
    box: 'left-0 top-[8%] w-[57%] z-20',
    float: 'floatA',
    shift: 'group-hover:-translate-x-3 group-hover:-translate-y-2',
  },
  {
    image: '/images/projects/massage.webp',
    box: 'right-0 top-[43%] w-[47%] z-30',
    float: 'floatB',
    shift: 'group-hover:translate-x-3 group-hover:translate-y-2',
  },
  {
    image: '/images/projects/tlsg.webp',
    box: 'left-[19%] bottom-[2%] w-[40%] z-10',
    float: 'floatC',
    shift: 'group-hover:-translate-x-2 group-hover:translate-y-3',
  },
] as const;

export default function HomePageClient({
  initialData,
}: {
  initialData: HomeData;
}) {
  const { lang } = useLanguage();
  const { openQuiz } = useQuiz();
  const content = initialData;

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    const timer = setTimeout(() => {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        window.history.replaceState(null, '', window.location.pathname);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const isCyrillic = lang === 'ru' || lang === 'ua';

  const heroFirstSize = isCyrillic
    ? 'text-[24px] md:text-[30px] xl:text-[34px]'
    : 'text-[26px] md:text-[34px] xl:text-[40px]';

  const heroSecondSize = isCyrillic
    ? 'text-[34px] md:text-[56px] xl:text-[clamp(52px,4.8vw,72px)]'
    : 'text-[48px] md:text-[80px] xl:text-[clamp(72px,6.8vw,104px)]';

  // The red full stop is glued to the last word so it can never wrap onto a
  // line of its own (long Russian/Ukrainian lines).
  const lastSpace = content.hero.titleSecond.lastIndexOf(' ');
  const heroSecondHead =
    lastSpace === -1 ? '' : content.hero.titleSecond.slice(0, lastSpace + 1);
  const heroSecondTail =
    lastSpace === -1
      ? content.hero.titleSecond
      : content.hero.titleSecond.slice(lastSpace + 1);

  // Hero stage shows real client projects from the portfolio data.
  const stageProjects = HERO_STAGE.map(slot => ({
    slot,
    project: content.featuredProjects.items.find(
      item => item.image === slot.image,
    ),
  })).filter(entry => entry.project);

  // Words for the decorative ticker: reuses the existing "why Labrity" titles.
  const tickerWords = content.differences.items.map(item => item.title);

  return (
    <>
      <Preloader />

      <SeasonalSnow />

      <SeasonalHearts />

      <main className="relative min-h-screen overflow-x-clip bg-[#F5F2EB]">
        {/* HERO */}
        <section className="relative">
          <div className="container grid items-center gap-14 pb-16 pt-[124px] md:pb-20 md:pt-[148px] xl:min-h-[820px] xl:grid-cols-12 xl:gap-10 xl:pb-20 xl:pt-[132px]">
            <div className="xl:col-span-6">
              <p
                className={`${s.rise} inline-flex items-center gap-3 font-montserrat text-[11px] uppercase tracking-[0.28em] text-[#111]`}
              >
                <span aria-hidden="true" className={s.live} />
                {content.hero.kicker}
              </p>

              <h1 className="mt-8 md:mt-10">
                <span
                  className={`${s.rise} block font-tenor leading-[1.05] text-neutral-500 ${heroFirstSize}`}
                  style={{ ['--d' as string]: '0.12s' }}
                >
                  {content.hero.titleFirst}
                </span>{' '}
                <span
                  className={`${s.rise} mt-2 block font-tenor leading-[0.96] tracking-[-0.03em] text-[#111] md:mt-3 ${heroSecondSize}`}
                  style={{ ['--d' as string]: '0.24s' }}
                >
                  {heroSecondHead}
                  <span className="whitespace-nowrap">
                    {heroSecondTail}
                    <span
                      aria-hidden="true"
                      className="ml-[0.1em] inline-block h-[0.13em] w-[0.13em] bg-[#FF3830] align-baseline"
                    />
                  </span>
                </span>
              </h1>

              <p
                className={`${s.rise} mt-8 max-w-[480px] font-montserrat text-[15px] leading-8 text-neutral-600 md:text-base xl:text-[17px]`}
                style={{ ['--d' as string]: '0.4s' }}
              >
                {content.hero.description}
              </p>

              <div
                className={`${s.rise} mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap`}
                style={{ ['--d' as string]: '0.5s' }}
              >
                <LocalizedLink href="/contact" className={btnPrimary}>
                  {content.hero.primaryButton}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </LocalizedLink>

                <LocalizedLink href="/portfolio" className={btnGhost}>
                  {content.hero.secondaryButton}
                  <ArrowRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </LocalizedLink>
              </div>

              <p
                className={`${s.rise} mt-12 flex items-center gap-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-500`}
                style={{ ['--d' as string]: '0.6s' }}
              >
                <span aria-hidden="true" className="h-px w-10 bg-[#111]/40" />
                {content.hero.tagline}
              </p>
            </div>

            {/* HERO STAGE — real client projects over a geometric backdrop */}
            <div
              className={`${s.rise} group relative mx-auto aspect-[1/1.02] w-full max-w-[600px] xl:col-span-6 xl:mx-0 xl:ml-auto xl:max-w-[640px]`}
              style={{ ['--d' as string]: '0.35s' }}
            >
              <Image
                src="/images/home/art-stage.svg"
                alt=""
                aria-hidden="true"
                fill
                unoptimized
                priority
                className="object-contain"
              />

              {stageProjects.map(({ slot, project }, index) => (
                <div
                  key={slot.image}
                  className={`absolute transition-transform duration-700 ease-out ${slot.box} ${slot.shift}`}
                >
                  <div className={s[slot.float]}>
                    <BrowserFrame>
                      <div className="relative aspect-[16/11] overflow-hidden bg-[#111]">
                        <Image
                          src={slot.image}
                          alt={`${project?.title ?? ''} Website Projekt`}
                          fill
                          priority={index === 0}
                          sizes="(min-width: 1280px) 400px, 62vw"
                          className="object-cover object-top"
                        />
                      </div>
                    </BrowserFrame>

                    <p className="absolute -bottom-3 left-3 flex items-center gap-2 whitespace-nowrap bg-[#111] px-2 py-[6px] font-montserrat text-[8px] uppercase tracking-[0.14em] text-white md:px-3 md:py-[7px] md:text-[10px] md:tracking-[0.2em]">
                      <span className="h-[5px] w-[5px] bg-[#FF3830]" />
                      {project?.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TICKER — decorative only */}
          <div
            aria-hidden="true"
            className="overflow-hidden bg-[#111] py-4 text-white md:py-5"
          >
            <div className={s.ticker}>
              {[0, 1].map(copy => (
                <div key={copy} className="flex shrink-0 items-center">
                  {[...tickerWords, ...tickerWords].map((word, index) => (
                    <span
                      key={`${copy}-${index}`}
                      className="flex items-center whitespace-nowrap font-tenor text-[22px] uppercase tracking-[0.06em] md:text-[30px]"
                    >
                      <span className="px-6 md:px-10">{word}</span>
                      <span className="h-2 w-2 bg-[#FF3830]" />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 01 — FEATURED PROJECTS */}
        <section className="bg-[#ECE7DC] py-[80px] md:py-[110px] xl:py-[140px]">
          <div className="container">
            <Reveal className="grid gap-8 md:grid-cols-12 md:items-end">
              <div className="md:col-span-8">
                <SectionLabel index="01">
                  {content.featuredProjects.kicker}
                </SectionLabel>

                <h2 className="mt-6 max-w-[900px] font-tenor text-[38px] leading-[1] tracking-[-0.025em] text-[#111] md:text-[60px] xl:text-[84px]">
                  {content.featuredProjects.title}
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-4 md:justify-end">
                <span className="inline-flex items-center gap-3 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                  {content.featuredProjects.scrollLabel}
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={1.4} />
                </span>

                <LocalizedLink href="/portfolio" className={textLink}>
                  {content.featuredProjects.button}
                  <span className="h-px w-10 bg-current transition-all duration-300 group-hover:w-16" />
                </LocalizedLink>
              </div>
            </Reveal>
          </div>

          <div
            role="region"
            aria-label={content.featuredProjects.title}
            tabIndex={0}
            className={`${s.rail} mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-10 md:mt-16 md:gap-6`}
          >
            {content.featuredProjects.items.map((project, index) => (
              <LocalizedLink
                key={project.title}
                href="/portfolio"
                className={`group flex w-[78vw] max-w-[340px] shrink-0 snap-start flex-col md:w-[380px] md:max-w-none xl:w-[430px] ${
                  index % 2 === 1 ? 'md:mt-14' : ''
                }`}
              >
                <BrowserFrame className="transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-[0_40px_70px_-26px_rgba(17,17,17,0.55)]">
                  <div className="relative aspect-[16/11] overflow-hidden bg-[#111]">
                    <Image
                      src={project.image}
                      alt={`${project.title} Website Projekt`}
                      fill
                      sizes="(max-width: 480px) 78vw, (max-width: 1280px) 380px, 430px"
                      className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                </BrowserFrame>

                <div className="flex items-start justify-between gap-4 pt-6">
                  <div>
                    <p className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                      {project.category}
                    </p>

                    <h3 className="mt-3 font-tenor text-[28px] leading-[1.02] text-[#111] md:text-[34px]">
                      {project.title}
                    </h3>

                    {project.kind === 'concept' && (
                      <p className="mt-3 inline-block border border-[#111]/50 px-2 py-1 font-montserrat text-[9px] uppercase tracking-[0.2em] text-neutral-600">
                        {content.portfolio.conceptLabel}
                      </p>
                    )}
                  </div>

                  <span
                    aria-hidden="true"
                    className="shrink-0 font-tenor text-[44px] leading-none text-[#111]/25 transition-colors duration-500 group-hover:text-[#FF3830] md:text-[56px]"
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <span className="mt-5 inline-flex items-center gap-4 font-montserrat text-[10px] uppercase tracking-[0.28em] text-neutral-600 transition-colors duration-300 group-hover:text-[#111]">
                  {content.featuredProjects.projectButton}
                  <span className="h-px w-9 bg-current transition-all duration-300 group-hover:w-16" />
                </span>
              </LocalizedLink>
            ))}

            <button
              type="button"
              onClick={openQuiz}
              className="group relative flex min-h-[380px] w-[78vw] max-w-[340px] shrink-0 snap-start flex-col justify-between overflow-hidden bg-[#111] p-7 text-left text-white transition-colors duration-500 md:w-[380px] md:max-w-none xl:w-[430px] xl:p-9"
            >
              <Image
                src="/images/home/art-orbit-dark.svg"
                alt=""
                aria-hidden="true"
                width={520}
                height={520}
                unoptimized
                className="pointer-events-none absolute -bottom-24 -right-24 w-[300px] transition-transform duration-1000 ease-out group-hover:rotate-45"
              />

              <div className="relative">
                <p className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-white/70">
                  {content.featuredProjects.ctaKicker}
                </p>

                <h3 className="mt-6 max-w-[300px] font-tenor text-[36px] leading-[0.98] tracking-[-0.02em] md:text-[44px]">
                  {content.featuredProjects.ctaTitle}
                </h3>
              </div>

              <div className="relative">
                <p className="max-w-[300px] font-montserrat text-[14px] leading-7 text-white/70">
                  {content.featuredProjects.ctaDescription}
                </p>

                <span className="mt-8 inline-flex items-center gap-4 font-montserrat text-[11px] font-semibold uppercase tracking-[0.24em] text-[#FF3830]">
                  {content.featuredProjects.ctaButton}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* 02 — AUDIENCE (bento) */}
        <section className="py-[80px] md:py-[110px] xl:py-[140px]">
          <div className="container">
            <Reveal className="max-w-[900px]">
              <SectionLabel index="02">{content.audience.kicker}</SectionLabel>

              <h2 className="mt-6 font-tenor text-[36px] leading-[1.02] tracking-[-0.02em] text-[#111] md:text-[56px] xl:text-[72px]">
                {content.audience.title}
              </h2>

              <p className="mt-7 max-w-[620px] font-montserrat text-[15px] leading-8 text-neutral-600 md:text-base">
                {content.audience.description}
              </p>
            </Reveal>

            <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-2 md:grid-rows-[auto_auto_auto]">
              {content.audience.items.map((item, index) => {
                const tones = [
                  'bg-[#111] text-white md:row-span-2 md:min-h-[420px]',
                  'bg-[#ECE7DC] text-[#111]',
                  'bg-[#ECE7DC] text-[#111]',
                  'bg-[#FF3830] text-[#111] md:col-span-2',
                ];
                const isDark = index === 0;
                const isRed = index === 3;

                return (
                  <Reveal
                    as="article"
                    key={`${item.title}-${index}`}
                    delay={index * 0.07}
                    className={`group relative flex min-h-[220px] flex-col justify-between overflow-hidden p-7 md:p-9 ${
                      tones[index] ?? tones[1]
                    }`}
                  >
                    <Glyph
                      kind={glyphOrder[index] ?? 'circle'}
                      className={`h-12 w-12 transition-transform duration-700 ease-out group-hover:rotate-[20deg] group-hover:scale-110 md:h-14 md:w-14 ${
                        isDark
                          ? 'text-[#FF3830]'
                          : isRed
                            ? 'text-[#111]'
                            : 'text-[#FF3830]'
                      }`}
                    />

                    <div className="mt-12">
                      <h3 className="font-tenor text-[30px] leading-[1.02] md:text-[44px]">
                        {item.title}
                      </h3>

                      <p
                        className={`mt-4 max-w-[420px] font-montserrat text-[14px] leading-7 md:text-[15px] ${
                          isDark
                            ? 'text-white/70'
                            : isRed
                              ? 'text-[#111]'
                              : 'text-neutral-600'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    {isDark && (
                      <Image
                        src="/images/home/art-orbit-dark.svg"
                        alt=""
                        aria-hidden="true"
                        width={520}
                        height={520}
                        unoptimized
                        className="pointer-events-none absolute -bottom-20 -right-20 w-[320px] opacity-80 transition-transform duration-1000 ease-out group-hover:rotate-12"
                      />
                    )}
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 03 — PROJECT CALCULATOR */}
        <section className="bg-[#ECE7DC] py-[60px] md:py-[90px] xl:py-[110px]">
          <div className="container">
            <div className="grid shadow-[0_40px_80px_-40px_rgba(17,17,17,0.35)] lg:grid-cols-12">
              <Reveal className="relative flex flex-col justify-between overflow-hidden bg-[#111] p-7 text-white md:p-12 lg:col-span-7 xl:p-16">
                <Image
                  src="/images/home/art-orbit-dark.svg"
                  alt=""
                  aria-hidden="true"
                  width={520}
                  height={520}
                  unoptimized
                  className="pointer-events-none absolute -right-28 -top-28 w-[380px] md:w-[460px]"
                />

                <div className="relative">
                  <p className="font-tenor text-[22px] uppercase tracking-[0.04em] text-white">
                    LABRITY
                  </p>

                  <p className="mt-14 inline-flex items-center gap-3 font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/70 md:mt-24">
                    <span className="h-2 w-2 rounded-full bg-[#FF3830]" />
                    {content.quizPreview.kicker}
                  </p>

                  <h2 className="mt-6 max-w-[640px] font-tenor text-[42px] leading-[0.97] tracking-[-0.03em] text-white md:text-[64px] xl:text-[80px]">
                    {content.quizPreview.leftTitle ?? content.quizPreview.title}
                  </h2>

                  <p className="mt-8 max-w-[520px] font-montserrat text-[15px] leading-8 text-white/70 md:text-[16px]">
                    {content.quizPreview.leftDescription ??
                      content.quizPreview.description}
                  </p>
                </div>

                <p className="relative mt-14 border-t border-white/20 pt-6 font-montserrat text-[11px] uppercase tracking-[0.24em] text-white/70">
                  {content.quizPreview.note}
                </p>
              </Reveal>

              <Reveal
                delay={0.1}
                className="flex flex-col justify-between bg-[#F8F6F1] p-7 md:p-12 lg:col-span-5 xl:p-14"
              >
                <div>
                  <h3 className="font-tenor text-[28px] leading-[1.08] tracking-[-0.01em] text-[#111] md:text-[36px]">
                    {content.quizPreview.title}
                  </h3>

                  <p className="mt-5 font-montserrat text-[14px] leading-7 text-neutral-600 md:text-[15px]">
                    {content.quizPreview.description}
                  </p>

                  <ol className="mt-10">
                    {content.quizPreview.steps.map((item, index) => (
                      <li
                        key={item}
                        className="group flex items-center gap-5 border-t border-[#111]/15 py-5 last:border-b"
                      >
                        <Glyph
                          kind={glyphOrder[index] ?? 'circle'}
                          className="h-7 w-7 text-[#111]/25 transition-colors duration-300 group-hover:text-[#FF3830]"
                        />

                        <span className="font-montserrat text-[12px] font-medium uppercase tracking-[0.2em] text-[#111]">
                          {String(index + 1).padStart(2, '0')} — {item}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>

                <button
                  type="button"
                  onClick={openQuiz}
                  className={`${btnRed} mt-10 w-full justify-between`}
                >
                  {content.quizPreview.button}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 04 — DIFFERENCES */}
        <section className="py-[80px] md:py-[110px] xl:py-[140px]">
          <div className="container">
            <Reveal className="max-w-[900px]">
              <SectionLabel index="04">
                {content.differences.kicker}
              </SectionLabel>

              <h2 className="mt-6 font-tenor text-[38px] leading-[1] tracking-[-0.025em] text-[#111] md:text-[60px] xl:text-[80px]">
                {content.differences.title}
              </h2>
            </Reveal>

            <div className="mt-12 grid border-l border-t border-[#111]/20 md:mt-16 md:grid-cols-2 xl:grid-cols-4">
              {content.differences.items.map((item, index) => (
                <Reveal
                  as="article"
                  key={`${item.title}-${index}`}
                  delay={index * 0.07}
                  className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden border-b border-r border-[#111]/20 p-6 transition-colors duration-500 hover:bg-[#111] hover:text-white md:min-h-[360px] md:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-montserrat text-[11px] tracking-[0.2em] text-neutral-500 transition-colors duration-500 group-hover:text-white/70">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <Glyph
                      kind={glyphOrder[index] ?? 'circle'}
                      className="h-14 w-14 text-[#111] transition-all duration-700 ease-out group-hover:rotate-[24deg] group-hover:text-[#FF3830] md:h-16 md:w-16"
                    />
                  </div>

                  <div>
                    <h3 className="font-tenor text-[30px] leading-[1.02] md:text-[36px]">
                      {item.title}
                    </h3>

                    <span className="mt-5 block h-[2px] w-8 bg-[#FF3830] transition-all duration-500 group-hover:w-20" />

                    <p className="mt-5 max-w-[280px] font-montserrat text-[14px] leading-7 text-neutral-600 transition-colors duration-500 group-hover:text-white/70">
                      {item.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 05 — STATS (single full-bleed brand-red moment; black type, AA) */}
        <section className="relative overflow-hidden bg-[#FF3830] text-[#111]">
          <Image
            src="/images/home/art-orbit-ink.svg"
            alt=""
            aria-hidden="true"
            width={520}
            height={520}
            unoptimized
            className="pointer-events-none absolute -right-40 -top-40 w-[520px] opacity-70 md:w-[640px]"
          />

          <div className="container relative py-[80px] md:py-[110px] xl:py-[140px]">
            <Reveal className="grid gap-8 xl:grid-cols-12 xl:items-end">
              <div className="xl:col-span-8">
                <p className="flex items-center gap-4 font-montserrat text-[11px] uppercase tracking-[0.3em]">
                  <span>05</span>
                  <span className="h-px w-10 bg-current opacity-40" />
                  {content.stats.kicker}
                </p>

                <h2 className="mt-6 font-tenor text-[36px] leading-[1] tracking-[-0.025em] md:text-[60px] xl:text-[72px]">
                  {content.stats.title}
                </h2>
              </div>

              <p className="max-w-[460px] font-montserrat text-[15px] leading-8 xl:col-span-4">
                {content.stats.description}
              </p>
            </Reveal>

            <div className="mt-14 grid border-t-2 border-[#111] md:mt-20 md:grid-cols-3">
              <StatsCounters items={content.stats.items} />
            </div>
          </div>
        </section>

        {/* 06 — PROCESS PREVIEW */}
        <section className="py-[80px] md:py-[110px] xl:py-[140px]">
          <div className="container">
            <Reveal className="grid gap-8 xl:grid-cols-12 xl:items-end">
              <div className="xl:col-span-8">
                <SectionLabel index="06">
                  {content.processPreview.kicker}
                </SectionLabel>

                <h2 className="mt-6 font-tenor text-[38px] leading-[1] tracking-[-0.025em] text-[#111] md:text-[60px] xl:text-[76px]">
                  {content.processPreview.title}
                </h2>
              </div>

              <div className="xl:col-span-4">
                <p className="max-w-[460px] font-montserrat text-[15px] leading-8 text-neutral-600">
                  {content.processPreview.description}
                </p>

                <LocalizedLink href="/process" className={`${btnPrimary} mt-8`}>
                  {content.processPreview.button}
                  <ArrowRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </LocalizedLink>
              </div>
            </Reveal>

            <ol className="mt-14 grid gap-4 md:mt-20 md:grid-cols-5">
              {content.processPreview.items.map((item, index) => (
                <Reveal
                  as="li"
                  key={`${item.title}-${index}`}
                  delay={index * 0.08}
                  className="group flex items-center gap-5 bg-[#ECE7DC] p-5 transition-colors duration-500 hover:bg-[#111] hover:text-white md:min-h-[220px] md:flex-col md:items-start md:justify-between md:gap-14 md:p-6"
                >
                  <Glyph
                    kind={glyphOrder[index % glyphOrder.length]}
                    className="h-10 w-10 shrink-0 text-[#FF3830] transition-transform duration-700 ease-out group-hover:rotate-[24deg] md:h-12 md:w-12"
                  />

                  <div>
                    <span className="block font-tenor text-[34px] leading-none text-[#111]/25 transition-colors duration-500 group-hover:text-white/40 md:text-[44px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="mt-3 block font-montserrat text-[12px] font-semibold uppercase tracking-[0.22em]">
                      {item.title}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 07 — WEB APPS / CUSTOM SOFTWARE SHOWCASE */}
        <section className="relative overflow-hidden bg-[#111] text-white">
          <div className="container relative py-[80px] md:py-[110px] xl:py-[140px]">
            <div className="grid gap-14 xl:grid-cols-12 xl:items-center xl:gap-16">
              <Reveal className="xl:col-span-7">
                <p className="flex items-center gap-4 font-montserrat text-[11px] uppercase tracking-[0.3em] text-white/70">
                  <span className="h-2 w-2 rounded-full bg-[#FF3830]" />
                  <span>07</span>
                  <span className="h-px w-10 bg-white/30" />
                  {content.webAppsShowcase.kicker}
                </p>

                <h2 className="mt-6 font-tenor text-[38px] leading-[1] tracking-[-0.03em] md:text-[60px] xl:text-[76px]">
                  {content.webAppsShowcase.title}
                </h2>

                <p className="mt-8 max-w-[600px] font-montserrat text-[15px] leading-8 text-white/70 md:text-[17px]">
                  {content.webAppsShowcase.subtitle}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                  <LocalizedLink href="/contact" className={btnRed}>
                    {content.webAppsShowcase.primary}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={18}
                      strokeWidth={1.6}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </LocalizedLink>

                  <LocalizedLink
                    href="/web-app-entwickeln-lassen"
                    className="group inline-flex min-h-[44px] items-center gap-3 font-montserrat text-[12px] uppercase tracking-[0.16em] text-white/80 underline decoration-white/30 underline-offset-8 transition duration-300 hover:text-white hover:decoration-[#FF3830]"
                  >
                    {content.webAppsShowcase.secondary}
                  </LocalizedLink>
                </div>
              </Reveal>

              <Reveal delay={0.1} className="xl:col-span-5">
                <div className="group relative mx-auto w-full max-w-[520px] xl:max-w-none">
                  <span
                    aria-hidden="true"
                    className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-[#FF3830] transition-transform duration-700 ease-out group-hover:-translate-y-2 group-hover:translate-x-2 md:h-32 md:w-32"
                  />

                  <Image
                    src="/images/web-apps/booking-calendar-mobile.webp"
                    alt={content.webAppsShowcase.alt2}
                    width={882}
                    height={887}
                    sizes="(min-width: 1280px) 36vw, (min-width: 768px) 520px, 88vw"
                    className="relative h-auto w-full rounded-[6px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
                  />
                </div>
              </Reveal>
            </div>

            <div className="mt-20 border-t border-white/15 pt-14 md:mt-28 md:pt-20">
              <Reveal>
                <h3 className="max-w-[760px] font-tenor text-[28px] leading-[1.08] md:text-[44px]">
                  {content.webAppsShowcase.pairsTitle}
                </h3>
              </Reveal>

              <div className="mt-10 grid gap-px border border-white/15 bg-white/15 md:grid-cols-2 xl:grid-cols-4">
                {content.webAppsShowcase.pairs.map(pair => (
                  <div
                    key={pair.problem}
                    className="group flex flex-col bg-[#111] p-6 transition-colors duration-500 hover:bg-[#1b1b1b] md:p-7"
                  >
                    <p className="font-montserrat text-[11px] uppercase tracking-[0.24em] text-white/60">
                      {content.webAppsShowcase.problemLabel}
                    </p>

                    <p className="mt-3 flex-1 font-montserrat text-[14px] leading-7 text-white/70">
                      {pair.problem}
                    </p>

                    <div className="my-5 h-[2px] w-8 bg-[#FF3830] transition-all duration-500 group-hover:w-16" />

                    <p className="font-montserrat text-[11px] uppercase tracking-[0.24em] text-[#FF3830]">
                      {content.webAppsShowcase.solutionLabel}
                    </p>

                    <p className="mt-3 font-tenor text-[20px] leading-[1.3] text-white">
                      {pair.solution}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-20 grid gap-10 md:mt-28 xl:grid-cols-12 xl:gap-16">
              <h3 className="font-tenor text-[30px] leading-[1.08] md:text-[44px] xl:col-span-4">
                {content.webAppsShowcase.capabilitiesTitle}
              </h3>

              <div className="xl:col-span-8">
                <Accordion
                  items={content.webAppsShowcase.capabilities}
                  defaultOpen={0}
                />
              </div>
            </div>

            <Reveal className="mx-auto mt-20 w-full max-w-[680px] md:mt-28">
              <Image
                src="/images/web-apps/dashboard-overview.webp"
                alt={content.webAppsShowcase.alt1}
                width={882}
                height={887}
                sizes="(min-width: 768px) 680px, 88vw"
                className="h-auto w-full rounded-[6px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)]"
              />

              <p className="mt-6 font-montserrat text-xs leading-6 text-white/60">
                {content.webAppsShowcase.caption}
              </p>
            </Reveal>

            <Reveal className="mt-20 border-t border-white/15 pt-16 md:mt-28 md:pt-24">
              <h3 className="max-w-[900px] font-tenor text-[34px] leading-[1.02] tracking-[-0.03em] md:text-[60px] xl:text-[72px]">
                {content.webAppsShowcase.finalCta.title}
              </h3>

              <p className="mt-6 max-w-[600px] font-montserrat text-[15px] leading-8 text-white/70 md:text-[17px]">
                {content.webAppsShowcase.finalCta.description}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <LocalizedLink href="/contact" className={btnRed}>
                  {content.webAppsShowcase.finalCta.primary}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </LocalizedLink>

                <LocalizedLink
                  href="/web-app-entwickeln-lassen"
                  className="group inline-flex min-h-[58px] items-center justify-center gap-3 border border-white/40 px-7 text-center font-montserrat text-[13px] font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#111]"
                >
                  {content.webAppsShowcase.finalCta.secondary}
                </LocalizedLink>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 08 — CTA */}
        <section className="relative overflow-hidden bg-[#ECE7DC]">
          <div className="container grid items-center gap-12 py-[80px] md:py-[110px] xl:grid-cols-12 xl:gap-10 xl:py-[130px]">
            <Reveal className="xl:col-span-7">
              <p className="flex items-center gap-4 font-montserrat text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-[#FF3830]" />
                <span className="text-[#111]">08</span>
                <span className="h-px w-10 bg-[#111]/30" />
                {content.cta.kicker}
              </p>

              <h2 className="mt-6 font-tenor text-[40px] leading-[0.98] tracking-[-0.03em] text-[#111] md:text-[68px] xl:text-[88px]">
                {content.cta.title}
              </h2>

              <p className="mt-8 max-w-[480px] font-montserrat text-[15px] leading-8 text-neutral-600">
                {content.cta.description}
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <LocalizedLink href="/contact" className={btnRed}>
                  {content.cta.primaryButton}
                  <ArrowUpRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </LocalizedLink>

                <button type="button" onClick={openQuiz} className={btnGhost}>
                  {content.cta.secondaryButton}
                  <ArrowRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </button>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="xl:col-span-5">
              <div className="group relative mx-auto aspect-square w-full max-w-[460px] xl:max-w-none">
                <Image
                  src="/images/home/art-arches.svg"
                  alt=""
                  aria-hidden="true"
                  fill
                  unoptimized
                  className="object-contain transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                />
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}
