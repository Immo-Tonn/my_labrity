'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { BadgeCheck, Gem, PanelsTopLeft, Telescope } from 'lucide-react';

import SeasonalSnow from '@/components/SeasonalSnow';
import SeasonalHearts from '@/components/SeasonalHearts';
import { useQuiz } from '@/components/quiz';
import { Preloader } from '@/components/ui';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { useLanguage } from '@/utils/LanguageContext';

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
};

type FeaturedProjectItem = {
  title: string;
  category: string;
  image: string;
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
        <div key={`${item.value}-${index}`} className="px-4 py-6 text-center">
          <p className="font-tenor text-[56px] leading-none text-black md:text-[72px] xl:text-[96px]">
            {formatStatValue(item.value, counts[index] ?? 1)}
          </p>

          <p className="mt-4 font-montserrat text-sm font-medium text-black md:text-base">
            {item.label}
          </p>

          <p className="mt-2 font-montserrat text-sm leading-6 text-neutral-500">
            {item.description}
          </p>
        </div>
      ))}
    </>
  );
}

const differenceIcons = [Telescope, PanelsTopLeft, Gem, BadgeCheck];

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

  return (
    <>
      <Preloader />

      <SeasonalSnow />

      <SeasonalHearts />

      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 -z-10 h-full w-full object-cover opacity-40"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      <main className="relative min-h-screen">
        <div className="container">
          {/* HERO */}
          <section className="flex min-h-[calc(100vh-100px)] flex-col pb-[60px] pt-[150px] md:min-h-[calc(100vh-120px)] md:pb-[80px] md:pt-[165px] xl:min-h-screen xl:pb-[110px] xl:pt-[210px]">
            <div className="flex flex-1 flex-col gap-16 xl:flex-row xl:items-center xl:justify-between">
              <div className="w-full max-w-[700px]">
                <p className="mb-6 font-montserrat text-[11px] uppercase tracking-[0.34em] text-neutral-400 md:text-xs">
                  {content.hero.kicker}
                </p>

                <h1
                  className={`font-tenor leading-[0.96] text-black ${
                    lang === 'ru' || lang === 'ua'
                      ? 'text-[42px] md:text-[62px] xl:text-[88px]'
                      : 'text-[48px] md:text-[72px] xl:text-[108px]'
                  }`}
                >
                  {content.hero.titleFirst}
                  <br />
                  {content.hero.titleSecond}
                </h1>

                <p className="mt-7 max-w-[520px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:mt-9 xl:text-lg">
                  {content.hero.description}
                </p>

                <p className="mt-4 font-montserrat text-[12px] uppercase tracking-[0.28em] text-neutral-400 md:text-[13px]">
                  {content.hero.tagline}
                </p>

                <div className="mt-10 flex flex-wrap gap-4 md:mt-12">
                  <LocalizedLink
                    href="/contact"
                    className="inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                  >
                    {content.hero.primaryButton}
                  </LocalizedLink>

                  <LocalizedLink
                    href="/portfolio"
                    className="inline-flex min-h-[56px] items-center justify-center border border-black bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px] hover:bg-black hover:text-white"
                  >
                    {content.hero.secondaryButton}
                  </LocalizedLink>
                </div>
              </div>

              {/* HERO IMAGE */}
              <div className="2xl:min-w-[950px] 2xl:max-w-[1300px] relative mx-auto w-full xl:mx-0 xl:w-[52vw] xl:min-w-[680px] xl:max-w-[900px]">
                <div className="2xl:-translate-y-[70px] relative w-full -translate-y-[20px] xl:-translate-y-[55px]">
                  <Image
                    src="/images/hero/hero-devices.png"
                    alt="Modern responsive website design"
                    width={886}
                    height={670}
                    priority
                    className="h-auto w-full object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.10)]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* FEATURED PROJECTS */}
          <section className="border-t border-[#e7e2d9] py-[64px] md:py-[82px] xl:py-[96px]">
            <div className="mb-9 flex flex-col gap-6 md:mb-11 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                  {content.featuredProjects.kicker}
                </p>

                <h2 className="max-w-[760px] font-tenor text-[36px] leading-[1.02] text-black md:text-[52px] xl:text-[68px]">
                  {content.featuredProjects.title}
                </h2>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-neutral-400">
                    {content.featuredProjects.scrollLabel}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cfbe] bg-[#f8f6f1] text-neutral-500">
                    →
                  </span>
                </div>

                <LocalizedLink
                  href="/portfolio"
                  className="hidden w-fit items-center gap-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-600 transition duration-300 hover:text-black md:inline-flex"
                >
                  {content.featuredProjects.button}
                  <span className="h-px w-12 bg-neutral-400 transition duration-300 hover:w-20 hover:bg-black" />
                </LocalizedLink>
              </div>
            </div>

            <div className="-mx-5 flex snap-x gap-4 overflow-x-auto scroll-smooth px-5 pb-5 md:-mx-8 md:gap-5 md:px-8 xl:mx-0 xl:gap-5 xl:px-0">
              {content.featuredProjects.items.map((project, index) => (
                <LocalizedLink
                  key={project.title}
                  href="/portfolio"
                  className="group w-[245px] shrink-0 snap-start overflow-hidden border border-[#e7e2d9] bg-white shadow-[0_14px_38px_rgba(0,0,0,0.035)] transition duration-500 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_22px_58px_rgba(0,0,0,0.075)] sm:w-[270px] md:w-[300px] xl:w-[315px]"
                >
                  <div className="relative bg-[#ede7dd] p-3">
                    <div className="relative aspect-[4/3] overflow-hidden border border-black/10 bg-[#f8f6f1]">
                      <Image
                        src={project.image}
                        alt={`${project.title} Website Projekt`}
                        fill
                        sizes="(max-width: 640px) 245px, (max-width: 768px) 270px, (max-width: 1280px) 300px, 315px"
                        className="object-contain p-2 transition duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  <div className="px-5 py-5">
                    <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                      {String(index + 1).padStart(2, '0')} / {project.category}
                    </p>

                    <h3 className="mt-4 font-tenor text-[27px] leading-none text-black md:text-[30px]">
                      {project.title}
                    </h3>

                    <div className="mt-5 flex items-center gap-4 font-montserrat text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                      <span>{content.featuredProjects.projectButton}</span>
                      <span className="h-px w-9 bg-neutral-400 transition duration-300 group-hover:w-14 group-hover:bg-black" />
                    </div>
                  </div>
                </LocalizedLink>
              ))}

              <button
                type="button"
                onClick={openQuiz}
                className="group flex min-h-[300px] w-[245px] shrink-0 snap-start flex-col justify-between overflow-hidden bg-black px-5 py-6 text-left text-white shadow-[0_14px_38px_rgba(0,0,0,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(0,0,0,0.14)] sm:w-[270px] md:w-[300px] xl:w-[315px]"
              >
                <div>
                  <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-white/40">
                    {content.featuredProjects.ctaKicker}
                  </p>

                  <h3 className="mt-6 max-w-[250px] font-tenor text-[32px] leading-[0.95] tracking-[-0.04em] text-white md:text-[36px]">
                    {content.featuredProjects.ctaTitle}
                  </h3>
                </div>

                <div>
                  <p className="max-w-[250px] font-montserrat text-[13px] leading-6 text-white/60">
                    {content.featuredProjects.ctaDescription}
                  </p>

                  <div className="mt-7 flex items-center gap-4 font-montserrat text-[10px] uppercase tracking-[0.28em] text-white/70">
                    <span>{content.featuredProjects.ctaButton}</span>
                    <span className="h-px w-10 bg-white/50 transition duration-300 group-hover:w-16 group-hover:bg-white" />
                  </div>
                </div>
              </button>
            </div>

            <LocalizedLink
              href="/portfolio"
              className="mt-6 inline-flex w-fit items-center gap-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-600 transition duration-300 hover:text-black md:hidden"
            >
              {content.featuredProjects.button}
              <span className="h-px w-12 bg-neutral-400 transition duration-300 hover:w-20 hover:bg-black" />
            </LocalizedLink>
          </section>

          {/* AUDIENCE */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[140px]">
            <div className="mx-auto max-w-[1024px]">
              <div className="mx-auto max-w-[860px] text-center">
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                  {content.audience.kicker}
                </p>

                <h2 className="font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[78px]">
                  {content.audience.title}
                </h2>

                <p className="mx-auto mt-6 max-w-[760px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
                  {content.audience.description}
                </p>
              </div>

              <div className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2 xl:mt-20 xl:grid-cols-4">
                {content.audience.items.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex min-h-[220px] flex-col justify-between border border-[#e7e2d9] bg-white px-4 py-8 text-center shadow-[0_10px_28px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)] md:min-h-[230px] xl:min-h-[240px]"
                  >
                    <div className="flex min-h-[64px] items-center justify-center md:min-h-[68px] xl:min-h-[72px]">
                      <h3
                        className={`text-center font-tenor text-[22px] leading-[1.02] text-black md:text-[24px] xl:text-[26px] ${
                          index === 3
                          // ? 'mx-auto whitespace-normal xl:max-w-[165px]'
                          // : 'whitespace-nowrap'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-4 text-center font-montserrat text-sm leading-6 text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* PROJECT CALCULATOR */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[130px]">
            <div className="mx-auto max-w-[1500px]">
              <div className="grid overflow-hidden border border-[#e7e2d9] bg-[#f8f6f1] shadow-[0_24px_70px_rgba(0,0,0,0.06)] lg:grid-cols-[1fr_1.1fr]">
                <div className="relative overflow-hidden bg-[#111111] px-7 py-10 text-white md:px-6 md:py-14 xl:px-12 xl:py-16">
                  <p className="font-tenor text-[24px] uppercase tracking-[-0.03em] text-white">
                    LABRITY
                  </p>

                  <div className="mt-2 h-px w-10 bg-white/35" />

                  <div className="mt-12">
                    <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-white/35">
                      {content.quizPreview.kicker}
                    </p>

                    <h2 className="max-w-[560px] font-tenor text-[44px] leading-[0.96] tracking-[-0.05em] text-white md:text-[64px]">
                      {content.quizPreview.leftTitle ??
                        content.quizPreview.title}
                    </h2>

                    <p className="mt-7 max-w-[560px] font-montserrat text-[15px] leading-8 text-white/65 md:text-[17px]">
                      {content.quizPreview.leftDescription ??
                        content.quizPreview.description}
                    </p>
                  </div>

                  <div className="mt-12 border-t border-white/20 pt-7">
                    <p className="font-montserrat text-[11px] uppercase tracking-[0.26em] text-white/35">
                      {content.quizPreview.note}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between px-7 py-10 md:px-10 md:py-14 xl:px-12 xl:py-16">
                  <div>
                    <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                      {content.quizPreview.kicker}
                    </p>

                    <h3 className="max-w-[760px] font-tenor text-[40px] leading-[1] tracking-[-0.04em] text-black md:text-[66px]">
                      {content.quizPreview.title}
                    </h3>

                    <p className="mt-7 max-w-[720px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
                      {content.quizPreview.description}
                    </p>

                    <div className="mt-10 divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
                      {content.quizPreview.steps.map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between gap-5 py-5"
                        >
                          <div className="flex items-center gap-5">
                            <span className="font-tenor text-[34px] leading-none text-black/20">
                              {String(index + 1).padStart(2, '0')}
                            </span>

                            <span className="font-montserrat text-[12px] font-medium uppercase tracking-[0.22em] text-black/70">
                              {item}
                            </span>
                          </div>

                          <span className="h-px w-10 bg-black/15" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openQuiz}
                    className="mt-10 inline-flex min-h-[56px] w-full items-center justify-center border border-black bg-black px-8 text-center font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] md:w-fit"
                  >
                    {content.quizPreview.button}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* DIFFERENCES */}
          <section className="border-t border-[#e7e2d9] py-[88px] md:py-[108px] xl:py-[124px]">
            <div className="mx-auto max-w-[860px] text-center">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                {content.differences.kicker}
              </p>

              <h2 className="font-tenor text-[34px] leading-[1.08] text-black md:text-[52px] xl:text-[62px]">
                {content.differences.title}
              </h2>
            </div>

            <div className="mx-auto mt-14 grid max-w-[1180px] gap-y-14 md:mt-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16 xl:mt-20 xl:grid-cols-4 xl:gap-x-10">
              {content.differences.items.map((item, index) => {
                const Icon = differenceIcons[index] || Gem;

                return (
                  <article
                    key={`${item.title}-${index}`}
                    className="group relative flex min-h-[210px] flex-col items-center overflow-hidden px-4 py-2 text-center transition duration-500 hover:-translate-y-[4px]"
                  >
                    <span className="pointer-events-none absolute top-5 h-24 w-24 rounded-full bg-black/[0.025] opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

                    <div className="relative mb-6 flex h-[60px] items-center justify-center">
                      <Icon
                        size={44}
                        strokeWidth={1.15}
                        className="text-black/45 transition duration-500 group-hover:-translate-y-[3px] group-hover:text-black/75"
                      />
                    </div>

                    <h3 className="font-tenor text-[24px] leading-[1.08] text-black md:text-[28px]">
                      {item.title}
                    </h3>

                    <span className="mt-4 h-px w-8 bg-black/20 transition-all duration-500 group-hover:w-14 group-hover:bg-black/45" />

                    <p className="mt-4 max-w-[250px] font-montserrat text-[14px] leading-7 text-neutral-500 transition duration-500 group-hover:text-neutral-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          {/* STATS */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[150px]">
            <div className="mx-auto max-w-[760px] text-center">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                {content.stats.kicker}
              </p>

              <h2 className="font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[78px]">
                {content.stats.title}
              </h2>

              <p className="mt-5 font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
                {content.stats.description}
              </p>
            </div>

            <div className="mt-14 grid gap-6 border-t border-[#e7e2d9] pt-10 md:mt-16 md:grid-cols-3 md:gap-6 md:pt-12 xl:mt-20 xl:gap-8 xl:pt-14">
              <StatsCounters items={content.stats.items} />
            </div>
          </section>

          {/* PROCESS PREVIEW */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[140px]">
            <div className="grid gap-12 xl:grid-cols-[0.85fr_1.15fr] xl:items-end xl:gap-20">
              <div>
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                  {content.processPreview.kicker}
                </p>

                <h2 className="font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[78px]">
                  {content.processPreview.title}
                </h2>

                <p className="mt-6 max-w-[620px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
                  {content.processPreview.description}
                </p>

                <LocalizedLink
                  href="/process"
                  className="mt-9 inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                >
                  {content.processPreview.button}
                </LocalizedLink>
              </div>

              <div className="border-y border-[#e7e2d9]">
                {content.processPreview.items.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex items-center justify-between border-b border-[#e7e2d9] py-5 last:border-b-0"
                  >
                    <div className="flex items-center gap-5">
                      <span className="font-tenor text-[34px] leading-none text-black/20 md:text-[46px]">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="font-montserrat text-[12px] font-medium uppercase tracking-[0.24em] text-black">
                        {item.title}
                      </span>
                    </div>

                    <span className="h-px w-10 bg-black/20" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-[90px] md:py-[110px] xl:py-[150px]">
            <div className="bg-[#111111] px-6 py-12 text-center shadow-[0_30px_70px_rgba(0,0,0,0.12)] transition duration-500 hover:shadow-[0_38px_80px_rgba(0,0,0,0.16)] md:px-10 md:py-16 xl:px-16 xl:py-20">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-white/45 md:text-xs">
                {content.cta.kicker}
              </p>

              <h2 className="mx-auto max-w-[820px] font-tenor text-[36px] leading-[1.04] text-white md:text-[52px] xl:text-[76px]">
                {content.cta.title}
              </h2>

              <p className="mx-auto mt-5 max-w-[620px] font-montserrat text-sm leading-7 text-white/70 md:text-base xl:text-lg">
                {content.cta.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:mt-10">
                <LocalizedLink
                  href="/contact"
                  className="inline-flex min-h-[56px] items-center justify-center border border-white bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px]"
                >
                  {content.cta.primaryButton}
                </LocalizedLink>

                <button
                  type="button"
                  onClick={openQuiz}
                  className="inline-flex min-h-[56px] items-center justify-center border border-white/40 bg-transparent px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  {content.cta.secondaryButton}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
