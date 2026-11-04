'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Image from 'next/image';
import { ArrowRight, ArrowUpRight } from 'lucide-react';

import SeasonalSnow from '@/components/SeasonalSnow';
import SeasonalHearts from '@/components/SeasonalHearts';
import { useQuiz } from '@/components/quiz';
import { Preloader } from '@/components/ui';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { Accordion } from '@/components/ui/Accordion';
import HomeHero from './HomeHero';
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
    blockWords: string[];
    pauseLabel: string;
    resumeLabel: string;
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
          data-rv
          style={{ ['--d' as string]: `${index * 0.12}s` }}
          className={`${s.rv} border-b border-white/25 p-6 last:border-b-0 md:p-8 md:last:border-r-0 lg:border-b-0 lg:border-r lg:p-10`}
        >
          <p className="whitespace-nowrap font-montserrat text-[72px] font-semibold tabular-nums leading-none tracking-[-0.05em] text-white md:text-[clamp(56px,7.4vw,128px)]">
            {formatStatValue(item.value, counts[index] ?? 1)}
          </p>

          <p className="mt-6 flex items-center gap-3 font-montserrat text-[12px] font-semibold uppercase tracking-[0.18em] text-white">
            <span className="h-[7px] w-[7px] bg-[#FF3830]" />
            {item.label}
          </p>

          <p className="mt-3 max-w-[320px] font-montserrat text-[14px] leading-7 text-white/70">
            {item.description}
          </p>
        </div>
      ))}
    </>
  );
}

// Numbered section tag: red square + number + hairline + kicker.
function Tag({
  index,
  children,
  dark = false,
}: {
  index: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={`flex items-center gap-3 font-montserrat text-[11px] uppercase tracking-[0.22em] ${
        dark ? 'text-white/70' : 'text-neutral-600'
      }`}
    >
      <span aria-hidden="true" className="h-[7px] w-[7px] bg-[#FF3830]" />
      <span className={dark ? 'text-white' : 'text-[#111]'}>{index}</span>
      <span aria-hidden="true" className="h-px w-8 bg-current opacity-40" />
      {children}
    </p>
  );
}

const btnBase =
  'group inline-flex min-h-[52px] items-center justify-center gap-4 border px-7 font-montserrat text-[14px] font-medium transition-colors duration-300';

const btnDark = `${btnBase} border-[#111] bg-[#111] text-white hover:border-[#FF3830] hover:bg-[#FF3830] hover:text-[#111]`;
const btnLine = `${btnBase} border-[#111] text-[#111] hover:bg-[#111] hover:text-white`;
const btnRed = `${btnBase} border-[#FF3830] bg-[#FF3830] text-[#111] hover:border-white hover:bg-white`;
const btnLineLight = `${btnBase} border-white/50 text-white hover:border-white hover:bg-white hover:text-[#111]`;

const arrowCls =
  'transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5';

// Underlined text link with a growing hairline.
const linkCls =
  'group inline-flex items-center gap-3 font-montserrat text-[13px] font-medium text-[#111]';

export default function HomePageClient({
  initialData,
}: {
  initialData: HomeData;
}) {
  const { openQuiz } = useQuiz();
  const content = initialData;
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [motionReady, setMotionReady] = useState(false);

  // Scroll reveals: content is visible by default (no JS / reduced motion);
  // once enabled, each [data-rv] element is shown once when it enters view.
  useEffect(() => {
    const root = rootRef.current;

    if (
      !root ||
      prefersReducedMotion() ||
      !('IntersectionObserver' in window)
    ) {
      return;
    }

    setMotionReady(true);

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add(s.in);
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0 },
    );

    root
      .querySelectorAll('[data-rv]')
      .forEach(element => observer.observe(element));

    return () => observer.disconnect();
  }, []);

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

  const rv = (delay = 0) => ({
    'data-rv': true,
    style: { ['--d' as string]: `${delay}s` },
  });

  return (
    <>
      <Preloader />

      <SeasonalSnow />

      <SeasonalHearts />

      <main
        ref={rootRef}
        className={`relative min-h-screen overflow-x-clip bg-[#F7F7F5]/65 text-[#111] ${
          motionReady ? s.js : ''
        }`}
      >
        <div className="px-2 pb-2 pt-[77px] md:px-3 md:pb-3 md:pt-[83px] xl:pt-[73px]">
          {/* HERO */}
          <HomeHero
            hero={content.hero}
            projects={content.featuredProjects.items}
          />

          {/* 01 — FEATURED PROJECTS */}
          <section className="-mt-px border border-[#111]">
            <div className="grid border-b border-[#111] lg:grid-cols-12">
              <div className="flex flex-col justify-between gap-8 border-b border-[#111] p-6 md:p-8 lg:col-span-3 lg:border-b-0 lg:border-r">
                <div {...rv()} className={s.rv}>
                  <Tag index="01">{content.featuredProjects.kicker}</Tag>
                </div>

                <div {...rv(0.1)} className={`${s.rv} flex flex-col gap-4`}>
                  <span className="inline-flex items-center gap-3 font-montserrat text-[11px] uppercase tracking-[0.22em] text-neutral-600">
                    {content.featuredProjects.scrollLabel}
                    <ArrowRight
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.4}
                    />
                  </span>

                  <LocalizedLink href="/portfolio" className={linkCls}>
                    {content.featuredProjects.button}
                    <span className="h-px w-8 bg-current transition-all duration-300 group-hover:w-14" />
                  </LocalizedLink>
                </div>
              </div>

              <div className="p-6 md:p-10 lg:col-span-9 xl:p-14">
                <h2
                  {...rv(0.05)}
                  className={`${s.rv} max-w-[920px] font-montserrat text-[34px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[56px] xl:text-[76px]`}
                >
                  {content.featuredProjects.title}
                </h2>
              </div>
            </div>

            <div
              role="region"
              aria-label={content.featuredProjects.title}
              tabIndex={0}
              className="flex snap-x snap-mandatory divide-x divide-[#111] overflow-x-auto scroll-smooth"
            >
              {content.featuredProjects.items.map((project, index) => (
                <LocalizedLink
                  key={project.title}
                  href="/portfolio"
                  className="group flex w-[78vw] max-w-[360px] shrink-0 snap-start flex-col md:w-[380px] md:max-w-none xl:w-[420px]"
                >
                  <div
                    data-rv
                    className={`${s.mask} relative aspect-[4/3] overflow-hidden border-b border-[#111] bg-[#EEEEEB]`}
                  >
                    <div className={`${s.zoom} absolute inset-0`}>
                      <Image
                        src={project.image}
                        alt={`${project.title} Website Projekt`}
                        fill
                        sizes="(max-width: 480px) 78vw, (max-width: 1280px) 380px, 420px"
                        className="object-cover object-top transition duration-700 ease-out group-hover:scale-[1.05]"
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <p className="flex items-center justify-between font-montserrat text-[11px] uppercase tracking-[0.16em] text-neutral-600">
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <span>{project.category}</span>
                    </p>

                    <h3 className="mt-8 font-montserrat text-[24px] font-semibold leading-[1.1] tracking-[-0.025em] md:text-[28px]">
                      {project.title}
                    </h3>

                    {project.kind === 'concept' && (
                      <p className="mt-3 inline-block w-fit border border-[#111]/50 px-2 py-1 font-montserrat text-[9px] uppercase tracking-[0.2em] text-neutral-600">
                        {content.portfolio.conceptLabel}
                      </p>
                    )}

                    <span className="mt-auto flex items-center gap-3 pt-8 font-montserrat text-[12px] font-medium text-[#111]">
                      {content.featuredProjects.projectButton}
                      <ArrowUpRight
                        aria-hidden="true"
                        size={15}
                        strokeWidth={1.6}
                        className={arrowCls}
                      />
                    </span>
                  </div>
                </LocalizedLink>
              ))}

              <button
                type="button"
                onClick={openQuiz}
                className="group flex w-[78vw] max-w-[360px] shrink-0 snap-start flex-col justify-between bg-[#111] p-6 text-left text-white transition-colors duration-500 hover:bg-[#FF3830] hover:text-[#111] md:w-[380px] md:max-w-none md:p-8 xl:w-[420px]"
              >
                <div>
                  <span
                    aria-hidden="true"
                    className="block h-4 w-4 bg-[#FF3830] transition-colors duration-500 group-hover:bg-[#111]"
                  />

                  <p className="mt-8 font-montserrat text-[11px] uppercase tracking-[0.22em] opacity-70">
                    {content.featuredProjects.ctaKicker}
                  </p>

                  <h3 className="mt-5 max-w-[320px] font-montserrat text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[34px]">
                    {content.featuredProjects.ctaTitle}
                  </h3>
                </div>

                <div className="mt-10">
                  <p className="max-w-[320px] font-montserrat text-[14px] leading-7 opacity-80">
                    {content.featuredProjects.ctaDescription}
                  </p>

                  <span className="mt-8 flex items-center gap-3 font-montserrat text-[13px] font-medium">
                    {content.featuredProjects.ctaButton}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.6}
                      className={arrowCls}
                    />
                  </span>
                </div>
              </button>
            </div>
          </section>

          {/* 02 — AUDIENCE */}
          <section className="-mt-px grid border border-[#111] lg:grid-cols-12">
            <div className="border-b border-[#111] p-6 md:p-10 lg:col-span-5 lg:border-b-0 lg:border-r xl:p-14">
              <div {...rv()} className={`${s.rv} lg:sticky lg:top-28`}>
                <Tag index="02">{content.audience.kicker}</Tag>

                <h2 className="mt-8 font-montserrat text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[48px] xl:text-[60px]">
                  {content.audience.title}
                </h2>

                <p className="mt-7 max-w-[460px] font-montserrat text-[15px] leading-8 text-neutral-600">
                  {content.audience.description}
                </p>
              </div>
            </div>

            <ol className="lg:col-span-7">
              {content.audience.items.map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  {...rv(index * 0.08)}
                  className={`${s.rv} group grid grid-cols-[44px_1fr_auto] items-start gap-x-4 border-b border-[#111] p-6 transition-colors duration-500 last:border-b-0 hover:bg-[#111] hover:text-white md:grid-cols-[64px_1fr_auto] md:p-8 xl:p-10`}
                >
                  <span className="pt-2 font-montserrat text-[11px] tracking-[0.2em] text-neutral-600 transition-colors duration-500 group-hover:text-white/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>

                  <div>
                    <h3 className="font-montserrat text-[26px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[38px]">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-[440px] font-montserrat text-[14px] leading-7 text-neutral-600 transition-colors duration-500 group-hover:text-white/70 md:text-[15px]">
                      {item.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mt-2 block h-3 w-3 scale-0 bg-[#FF3830] transition-transform duration-500 group-hover:scale-100"
                  />
                </li>
              ))}
            </ol>
          </section>

          {/* 03 — PROJECT CALCULATOR */}
          <section className="-mt-px grid border border-[#111] lg:grid-cols-12">
            <div className="relative flex flex-col justify-between bg-[#111] p-6 text-white md:p-10 lg:col-span-7 xl:p-14">
              <div {...rv()} className={s.rv}>
                <p className="flex items-center justify-between font-montserrat text-[22px] font-semibold uppercase tracking-[-0.01em]">
                  LABRITY
                  <span aria-hidden="true" className="h-5 w-5 bg-[#FF3830]" />
                </p>

                <div className="mt-16 md:mt-28">
                  <Tag index="03" dark>
                    {content.quizPreview.kicker}
                  </Tag>

                  <h2 className="mt-8 max-w-[680px] font-montserrat text-[38px] font-semibold leading-[1] tracking-[-0.04em] md:text-[60px] xl:text-[76px]">
                    {content.quizPreview.leftTitle ?? content.quizPreview.title}
                  </h2>

                  <p className="mt-8 max-w-[500px] font-montserrat text-[15px] leading-8 text-white/70">
                    {content.quizPreview.leftDescription ??
                      content.quizPreview.description}
                  </p>
                </div>
              </div>

              <p className="mt-14 border-t border-white/25 pt-6 font-montserrat text-[11px] uppercase tracking-[0.2em] text-white/70">
                {content.quizPreview.note}
              </p>
            </div>

            <div className="flex flex-col justify-between border-t border-[#111] p-6 md:p-10 lg:col-span-5 lg:border-l lg:border-t-0 xl:p-14">
              <div {...rv(0.1)} className={s.rv}>
                <h3 className="font-montserrat text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[34px]">
                  {content.quizPreview.title}
                </h3>

                <p className="mt-5 font-montserrat text-[14px] leading-7 text-neutral-600 md:text-[15px]">
                  {content.quizPreview.description}
                </p>

                <ol className="mt-10 border-t border-[#111]">
                  {content.quizPreview.steps.map((item, index) => (
                    <li
                      key={item}
                      className="group flex items-center gap-5 border-b border-[#111] py-5"
                    >
                      <span
                        aria-hidden="true"
                        className="h-[9px] w-[9px] bg-[#111]/25 transition-colors duration-300 group-hover:bg-[#FF3830]"
                      />

                      <span className="font-montserrat text-[12px] font-medium uppercase tracking-[0.18em]">
                        {String(index + 1).padStart(2, '0')} — {item}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>

              <button
                type="button"
                onClick={openQuiz}
                className={`${btnDark} mt-10 w-full justify-between`}
              >
                {content.quizPreview.button}
                <ArrowUpRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.6}
                  className={arrowCls}
                />
              </button>
            </div>
          </section>

          {/* 04 — DIFFERENCES */}
          <section className="-mt-px border border-[#111]">
            <div className="grid border-b border-[#111] lg:grid-cols-12">
              <div className="border-b border-[#111] p-6 md:p-8 lg:col-span-3 lg:border-b-0 lg:border-r">
                <div {...rv()} className={s.rv}>
                  <Tag index="04">{content.differences.kicker}</Tag>
                </div>
              </div>

              <div className="p-6 md:p-10 lg:col-span-9 xl:p-14">
                <h2
                  {...rv(0.05)}
                  className={`${s.rv} max-w-[900px] font-montserrat text-[34px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[56px] xl:text-[72px]`}
                >
                  {content.differences.title}
                </h2>
              </div>
            </div>

            <div
              data-rv
              className={`${s.mask} relative h-[160px] overflow-hidden border-b border-[#111] md:h-[240px] xl:h-[300px]`}
            >
              <div className={`${s.zoom} absolute inset-0`}>
                <Image
                  src="/images/home/photo-architecture.jpg"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-4">
              {content.differences.items.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  {...rv(index * 0.08)}
                  className={`${s.rv} group flex min-h-[260px] flex-col justify-between border-b border-[#111] p-6 transition-colors duration-500 hover:bg-[#111] hover:text-white md:min-h-[320px] md:p-8 ${
                    index % 2 === 0 ? 'md:border-r' : ''
                  } ${index < 3 ? 'xl:border-r' : 'xl:border-r-0'} ${
                    index >= 2 ? 'xl:border-b' : ''
                  } last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 xl:[&:nth-last-child(-n+2)]:border-b`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-montserrat text-[48px] font-semibold leading-none tracking-[-0.05em] md:text-[64px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span
                      aria-hidden="true"
                      className="mt-2 block h-3 w-3 bg-[#FF3830] transition-transform duration-500 group-hover:rotate-90 group-hover:scale-150"
                    />
                  </div>

                  <div>
                    <h3 className="font-montserrat text-[24px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[28px]">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-[280px] font-montserrat text-[14px] leading-7 text-neutral-600 transition-colors duration-500 group-hover:text-white/70">
                      {item.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* 05 — STATS */}
          <section className="-mt-px border border-[#111] bg-[#111] text-white">
            <div className="grid border-b border-white/25 lg:grid-cols-12">
              <div className="p-6 md:p-10 lg:col-span-8 xl:p-14">
                <div {...rv()} className={s.rv}>
                  <Tag index="05" dark>
                    {content.stats.kicker}
                  </Tag>

                  <h2 className="mt-8 font-montserrat text-[32px] font-semibold leading-[1.04] tracking-[-0.035em] md:text-[52px] xl:text-[64px]">
                    {content.stats.title}
                  </h2>
                </div>
              </div>

              <div className="border-t border-white/25 p-6 md:p-10 lg:col-span-4 lg:border-l lg:border-t-0 xl:p-14">
                <p
                  {...rv(0.1)}
                  className={`${s.rv} max-w-[420px] font-montserrat text-[15px] leading-8 text-white/70`}
                >
                  {content.stats.description}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3">
              <StatsCounters items={content.stats.items} />
            </div>
          </section>

          {/* 06 — PROCESS PREVIEW */}
          <section className="-mt-px border border-[#111]">
            <div className="grid border-b border-[#111] lg:grid-cols-12">
              <div className="p-6 md:p-10 lg:col-span-8 xl:p-14">
                <div {...rv()} className={s.rv}>
                  <Tag index="06">{content.processPreview.kicker}</Tag>

                  <h2 className="mt-8 font-montserrat text-[34px] font-semibold leading-[1.02] tracking-[-0.035em] md:text-[56px] xl:text-[68px]">
                    {content.processPreview.title}
                  </h2>
                </div>
              </div>

              <div className="flex flex-col justify-end border-t border-[#111] p-6 md:p-10 lg:col-span-4 lg:border-l lg:border-t-0 xl:p-14">
                <div {...rv(0.1)} className={s.rv}>
                  <p className="max-w-[420px] font-montserrat text-[15px] leading-8 text-neutral-600">
                    {content.processPreview.description}
                  </p>

                  <LocalizedLink href="/process" className={`${btnDark} mt-8`}>
                    {content.processPreview.button}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.6}
                      className={arrowCls}
                    />
                  </LocalizedLink>
                </div>
              </div>
            </div>

            <ol className="grid md:grid-cols-5">
              {content.processPreview.items.map((item, index) => (
                <li
                  key={`${item.title}-${index}`}
                  className="group relative p-6 pt-8 md:min-h-[260px] md:p-8 md:pt-10"
                >
                  <span
                    data-rv
                    style={{ ['--d' as string]: `${index * 0.16}s` }}
                    className={`${s.line} absolute inset-x-0 top-0 h-[2px] bg-[#111]`}
                  />

                  <span
                    aria-hidden="true"
                    className="absolute left-6 top-0 block h-3 w-3 -translate-y-1/2 bg-[#FF3830] transition-transform duration-500 group-hover:scale-150 md:left-8"
                  />

                  <div
                    {...rv(index * 0.16 + 0.15)}
                    className={`${s.rv} flex items-baseline gap-5 md:block`}
                  >
                    <span className="block font-montserrat text-[44px] font-semibold leading-none tracking-[-0.05em] text-[#111]/20 transition-colors duration-500 group-hover:text-[#111] md:text-[64px]">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <span className="block font-montserrat text-[12px] font-semibold uppercase tracking-[0.2em] md:mt-14">
                      {item.title}
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {/* 07 — WEB APPS / CUSTOM SOFTWARE SHOWCASE */}
          <section className="-mt-px border border-[#111] bg-[#111] text-white">
            <div className="grid lg:grid-cols-12">
              <div className="p-6 md:p-10 lg:col-span-7 xl:p-14">
                <div {...rv()} className={s.rv}>
                  <Tag index="07" dark>
                    {content.webAppsShowcase.kicker}
                  </Tag>

                  <h2 className="mt-8 font-montserrat text-[34px] font-semibold leading-[1.02] tracking-[-0.04em] md:text-[56px] xl:text-[68px]">
                    {content.webAppsShowcase.title}
                  </h2>

                  <p className="mt-8 max-w-[560px] font-montserrat text-[15px] leading-8 text-white/70 md:text-[16px]">
                    {content.webAppsShowcase.subtitle}
                  </p>

                  <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
                    <LocalizedLink href="/contact" className={btnRed}>
                      {content.webAppsShowcase.primary}
                      <ArrowUpRight
                        aria-hidden="true"
                        size={16}
                        strokeWidth={1.6}
                        className={arrowCls}
                      />
                    </LocalizedLink>

                    <LocalizedLink
                      href="/web-app-entwickeln-lassen"
                      className="group inline-flex min-h-[44px] items-center gap-3 font-montserrat text-[13px] font-medium text-white/80 underline decoration-white/30 underline-offset-8 transition duration-300 hover:text-white hover:decoration-[#FF3830]"
                    >
                      {content.webAppsShowcase.secondary}
                    </LocalizedLink>
                  </div>
                </div>
              </div>

              <div
                data-rv
                className={`${s.mask} relative min-h-[320px] border-t border-white/25 lg:col-span-5 lg:border-l lg:border-t-0`}
              >
                <div className={`${s.zoom} absolute inset-0`}>
                  <Image
                    src="/images/web-apps/booking-calendar-mobile.webp"
                    alt={content.webAppsShowcase.alt2}
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-white/25 p-6 md:p-10 xl:p-14">
              <h3
                {...rv()}
                className={`${s.rv} max-w-[760px] font-montserrat text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[40px]`}
              >
                {content.webAppsShowcase.pairsTitle}
              </h3>
            </div>

            <div className="grid border-t border-white/25 md:grid-cols-2 xl:grid-cols-4">
              {content.webAppsShowcase.pairs.map((pair, index) => (
                <div
                  key={pair.problem}
                  {...rv(index * 0.08)}
                  className={`${s.rv} group flex flex-col border-b border-white/25 p-6 transition-colors duration-500 hover:bg-[#1c1c1c] md:p-7 md:odd:border-r xl:border-b-0 xl:border-r xl:last:border-r-0`}
                >
                  <p className="font-montserrat text-[11px] uppercase tracking-[0.2em] text-white/60">
                    {content.webAppsShowcase.problemLabel}
                  </p>

                  <p className="mt-3 flex-1 font-montserrat text-[14px] leading-7 text-white/70">
                    {pair.problem}
                  </p>

                  <div className="my-5 h-[2px] w-8 bg-[#FF3830] transition-all duration-500 group-hover:w-16" />

                  <p className="font-montserrat text-[11px] uppercase tracking-[0.2em] text-[#FF3830]">
                    {content.webAppsShowcase.solutionLabel}
                  </p>

                  <p className="mt-3 font-montserrat text-[18px] font-medium leading-[1.35] text-white">
                    {pair.solution}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-10 border-t border-white/25 p-6 md:p-10 xl:grid-cols-12 xl:gap-16 xl:p-14">
              <h3 className="font-montserrat text-[28px] font-semibold leading-[1.08] tracking-[-0.03em] md:text-[40px] xl:col-span-4">
                {content.webAppsShowcase.capabilitiesTitle}
              </h3>

              <div className="xl:col-span-8">
                <Accordion
                  items={content.webAppsShowcase.capabilities}
                  defaultOpen={0}
                />
              </div>
            </div>

            <div className="border-t border-white/25 p-6 md:p-10 xl:p-14">
              <div
                data-rv
                className={`${s.mask} mx-auto max-w-[680px] border border-white/25`}
              >
                <div className={s.zoom}>
                  <Image
                    src="/images/web-apps/dashboard-overview.webp"
                    alt={content.webAppsShowcase.alt1}
                    width={882}
                    height={887}
                    sizes="(min-width: 768px) 680px, 88vw"
                    className="h-auto w-full"
                  />
                </div>
              </div>

              <p className="mx-auto mt-6 max-w-[680px] font-montserrat text-xs leading-6 text-white/60">
                {content.webAppsShowcase.caption}
              </p>
            </div>

            <div className="border-t border-white/25 p-6 md:p-10 xl:p-14">
              <div {...rv()} className={s.rv}>
                <h3 className="max-w-[900px] font-montserrat text-[30px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[52px] xl:text-[64px]">
                  {content.webAppsShowcase.finalCta.title}
                </h3>

                <p className="mt-6 max-w-[560px] font-montserrat text-[15px] leading-8 text-white/70">
                  {content.webAppsShowcase.finalCta.description}
                </p>

                <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <LocalizedLink href="/contact" className={btnRed}>
                    {content.webAppsShowcase.finalCta.primary}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.6}
                      className={arrowCls}
                    />
                  </LocalizedLink>

                  <LocalizedLink
                    href="/web-app-entwickeln-lassen"
                    className={btnLineLight}
                  >
                    {content.webAppsShowcase.finalCta.secondary}
                  </LocalizedLink>
                </div>
              </div>
            </div>
          </section>

          {/* 08 — CTA */}
          <section className="-mt-px grid border border-[#111] lg:grid-cols-12">
            <div className="flex flex-col justify-between p-6 md:p-10 lg:col-span-7 xl:p-14">
              <div {...rv()} className={s.rv}>
                <Tag index="08">{content.cta.kicker}</Tag>

                <h2 className="mt-8 font-montserrat text-[36px] font-semibold leading-[1] tracking-[-0.04em] md:text-[64px] xl:text-[84px]">
                  {content.cta.title}
                </h2>
              </div>

              <div {...rv(0.1)} className={`${s.rv} mt-12`}>
                <p className="max-w-[460px] font-montserrat text-[15px] leading-8 text-neutral-600">
                  {content.cta.description}
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <LocalizedLink href="/contact" className={btnDark}>
                    {content.cta.primaryButton}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.6}
                      className={arrowCls}
                    />
                  </LocalizedLink>

                  <button type="button" onClick={openQuiz} className={btnLine}>
                    {content.cta.secondaryButton}
                    <ArrowUpRight
                      aria-hidden="true"
                      size={16}
                      strokeWidth={1.6}
                      className={arrowCls}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div
              data-rv
              className={`${s.mask} relative min-h-[340px] border-t border-[#111] lg:col-span-5 lg:border-l lg:border-t-0`}
            >
              <div className={`${s.zoom} absolute inset-0`}>
                <Image
                  src="/images/home/photo-sculpture.jpg"
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>

              <span
                aria-hidden="true"
                className="absolute bottom-0 right-0 block h-8 w-8 bg-[#FF3830]"
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
