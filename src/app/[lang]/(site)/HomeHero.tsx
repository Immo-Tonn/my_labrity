'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Pause, Play } from 'lucide-react';

import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { useLanguage } from '@/utils/LanguageContext';

import s from './home.module.css';

type HeroData = {
  kicker: string;
  titleFirst: string;
  titleSecond: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
  blockWords: string[];
  pauseLabel: string;
  resumeLabel: string;
};

type ProjectInfo = { title: string; category: string; image: string };

type Slide = {
  src: string;
  /** CSS object-position per breakpoint: phone / tablet / desktop. */
  posSm: string;
  posMd: string;
  pos: string;
};

type Cell = {
  id: 'tall' | 'wide' | 'mid';
  cellClass: string;
  enter: string;
  delay: string;
  sizes: string;
  slides: Slide[];
};

// Decorative studio photography (concept mock-ups, not client work). The first
// slide of every cell is the one shown after the assembly; each photo is used
// in exactly one cell, so the same picture never appears twice at once.
// Portrait → big block, wide interiors → wide block, device mock-ups → mid.
const CELLS: Cell[] = [
  {
    id: 'tall',
    cellClass: s.cTall,
    enter: s.fromTop,
    delay: '0.62s',
    sizes: '(min-width: 1024px) 38vw, 100vw',
    slides: [
      {
        src: '/images/home/hero-tablet.jpg',
        posSm: '50% 55%',
        posMd: '50% 52%',
        pos: '50% 62%',
      },
      {
        src: '/images/home/hero-posters.jpg',
        posSm: '32% 50%',
        posMd: '50% 40%',
        pos: '34% 50%',
      },
    ],
  },
  {
    id: 'wide',
    cellClass: s.cWide,
    enter: s.fromLeft,
    delay: '0.82s',
    sizes: '(min-width: 1024px) 50vw, 60vw',
    slides: [
      {
        src: '/images/home/hero-hall.jpg',
        posSm: '45% 50%',
        posMd: '50% 40%',
        pos: '50% 6%',
      },
      {
        src: '/images/home/hero-living.jpg',
        posSm: '62% 50%',
        posMd: '50% 50%',
        pos: '50% 42%',
      },
    ],
  },
  {
    id: 'mid',
    cellClass: s.cMid,
    enter: s.fromRight,
    delay: '1.02s',
    sizes: '(min-width: 1024px) 32vw, 40vw',
    slides: [
      {
        src: '/images/home/hero-monitor.jpg',
        posSm: '50% 50%',
        posMd: '50% 45%',
        pos: '50% 42%',
      },
      {
        src: '/images/home/hero-laptop.jpg',
        posSm: '24% 50%',
        posMd: '22% 45%',
        pos: '50% 40%',
      },
    ],
  },
];

// One cell changes at a time, in this order (indices into CELLS).
const ROTATION_ORDER = [2, 1, 0];
const ROTATION_MS = 7000;
const FADE_MS = 1200;
const PRELOADER_KEY = 'labrity-preloader-seen';

// Runs while the HTML is parsed (before first paint): marks a first visit of
// the session so the CSS assembly waits for the preloader to leave.
const FRESH_SCRIPT = `try{if(!sessionStorage.getItem('${PRELOADER_KEY}')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.currentScript.parentElement.setAttribute('data-fresh','1')}}catch(e){}`;

export default function HomeHero({
  hero,
}: {
  hero: HeroData;
  projects?: ProjectInfo[];
}) {
  const { lang } = useLanguage();
  const isCyrillic = lang === 'ru' || lang === 'ua';

  const [active, setActive] = useState<number[]>([0, 0, 0]);
  const [leaving, setLeaving] = useState<(number | null)[]>([null, null, null]);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [started, setStarted] = useState(false);
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);
  const [tick, setTick] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<Record<string, HTMLImageElement | null>>({});
  const activeRef = useRef<number[]>([0, 0, 0]);
  const cursor = useRef(0);
  const remaining = useRef(ROTATION_MS);
  const leaveTimers = useRef<number[]>([]);

  // Reduced motion + start after the assembly has finished (≈2.4 s, +1.7 s
  // behind the preloader on a first visit).
  useEffect(() => {
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    setReduced(reducedMotion);
    if (reducedMotion) return;

    let fresh = false;
    try {
      fresh = window.sessionStorage.getItem(PRELOADER_KEY) !== '1';
    } catch {
      // Storage blocked: treat as a repeat visit.
    }

    const startId = window.setTimeout(
      () => {
        remaining.current = ROTATION_MS;
        setStarted(true);
      },
      (fresh ? 1700 : 0) + 3800,
    );

    return () => window.clearTimeout(startId);
  }, []);

  // Pause while the hero is off screen or the tab is in the background.
  useEffect(() => {
    const node = rootRef.current;
    const onVisibility = () => setTabVisible(!document.hidden);

    onVisibility();
    document.addEventListener('visibilitychange', onVisibility);

    let observer: IntersectionObserver | undefined;
    if (node && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(([entry]) =>
        setInView(entry.isIntersecting),
      );
      observer.observe(node);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      observer?.disconnect();
    };
  }, []);

  useEffect(
    () => () => {
      leaveTimers.current.forEach(id => window.clearTimeout(id));
    },
    [],
  );

  const running = started && !reduced && !paused && inView && tabVisible;

  const advance = useCallback(async () => {
    const cellIndex = ROTATION_ORDER[cursor.current % CELLS.length];
    const count = CELLS[cellIndex].slides.length;
    const from = activeRef.current[cellIndex];
    const next = (from + 1) % count;
    const img = imgRefs.current[`${cellIndex}-${next}`];

    // The next photo must be loaded and decoded before the fade starts;
    // otherwise keep the current one and look again shortly.
    let ready = false;
    try {
      if (img && img.complete && img.naturalWidth > 0) {
        await img.decode();
        ready = true;
      }
    } catch {
      ready = false;
    }

    if (!ready) {
      remaining.current = 600;
      setTick(value => value + 1);
      return;
    }

    cursor.current += 1;
    remaining.current = ROTATION_MS;

    activeRef.current = activeRef.current.map((value, index) =>
      index === cellIndex ? next : value,
    );
    setActive([...activeRef.current]);
    setLeaving(prev =>
      prev.map((value, index) => (index === cellIndex ? from : value)),
    );

    leaveTimers.current.push(
      window.setTimeout(
        () =>
          setLeaving(prev =>
            prev.map((value, index) => (index === cellIndex ? null : value)),
          ),
        FADE_MS + 200,
      ),
    );

    setTick(value => value + 1);
  }, []);

  // Timer that survives pause/resume: the remaining time is kept, so resuming
  // continues the countdown instead of restarting or firing at once.
  useEffect(() => {
    if (!running) return;

    const begin = performance.now();
    let fired = false;

    const id = window.setTimeout(() => {
      fired = true;
      void advance();
    }, remaining.current);

    return () => {
      window.clearTimeout(id);
      if (!fired) {
        remaining.current = Math.max(
          300,
          remaining.current - (performance.now() - begin),
        );
      }
    };
  }, [running, tick, advance]);

  const line1Size = isCyrillic
    ? 'text-[34px] md:text-[48px] xl:text-[clamp(44px,3.9vw,66px)]'
    : 'text-[40px] md:text-[58px] xl:text-[clamp(52px,4.7vw,80px)]';

  const line2Size = isCyrillic
    ? 'text-[19px] md:text-[24px] xl:text-[clamp(20px,1.9vw,30px)]'
    : 'text-[20px] md:text-[26px] xl:text-[clamp(22px,2.1vw,34px)]';

  return (
    <div
      ref={rootRef}
      className={`${s.hero} ${s.a} ${s.fade}`}
      data-still={running ? undefined : '1'}
      style={{ ['--d' as string]: '0.1s' }}
      suppressHydrationWarning
    >
      <script dangerouslySetInnerHTML={{ __html: FRESH_SCRIPT }} />

      <div className={s.cText}>
        <div className="flex flex-col justify-between gap-10 bg-[#F7F7F5] p-5 md:p-8 xl:p-12">
          <p
            className={`${s.a} ${s.up} font-montserrat text-[14px] text-[#111] md:text-[16px]`}
            style={{ ['--d' as string]: '0.3s' }}
          >
            {hero.kicker}
          </p>

          <h1>
            <span
              className={`${s.a} ${s.up} block font-montserrat font-semibold leading-[1.02] tracking-[-0.035em] text-[#111] ${line1Size}`}
              style={{ ['--d' as string]: '0.42s' }}
            >
              {hero.titleFirst}
            </span>{' '}
            <span
              className={`${s.a} ${s.up} mt-4 block max-w-[34ch] font-montserrat font-normal leading-[1.25] tracking-[-0.01em] text-neutral-600 md:mt-5 ${line2Size}`}
              style={{ ['--d' as string]: '0.56s' }}
            >
              {hero.titleSecond}
            </span>
          </h1>
        </div>

        <div className="bg-[#F7F7F5] p-5 md:p-8 xl:px-12 xl:py-7">
          <div
            className={`${s.a} ${s.up} grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center`}
            style={{ ['--d' as string]: '1.5s' }}
          >
            <p className="max-w-[56ch] font-montserrat text-[14px] leading-[1.7] text-neutral-700 md:text-[15px]">
              {hero.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <LocalizedLink
                href="/contact"
                className="group inline-flex min-h-[52px] items-center justify-center gap-4 border border-[#111] bg-[#111] px-7 font-montserrat text-[14px] font-medium text-white transition-colors duration-300 hover:border-[#FF3830] hover:bg-[#FF3830] hover:text-[#111]"
              >
                {hero.primaryButton}
                <ArrowUpRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </LocalizedLink>

              <LocalizedLink
                href="/portfolio"
                className="group inline-flex min-h-[52px] items-center justify-center gap-4 border border-[#111] px-7 font-montserrat text-[14px] font-medium text-[#111] transition-colors duration-300 hover:bg-[#111] hover:text-white"
              >
                {hero.secondaryButton}
                <ArrowUpRight
                  aria-hidden="true"
                  size={16}
                  strokeWidth={1.6}
                  className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>

      {CELLS.map((cell, cellIndex) => (
        <div key={cell.id} className={cell.cellClass}>
          <div
            className={`${s.fill} ${s.a} ${s.dur1} ${cell.enter}`}
            style={{ ['--d' as string]: cell.delay }}
          >
            {cell.slides.map((slide, slideIndex) => {
              const isOn = active[cellIndex] === slideIndex;
              const isLeaving = leaving[cellIndex] === slideIndex;
              const state = isOn ? s.slideOn : isLeaving ? s.slideOut : '';

              return (
                <div
                  key={slide.src}
                  className={`${s.slide} ${state}`}
                  aria-hidden="true"
                >
                  <div
                    className={`${s.kb} ${isOn || isLeaving ? s.kbRun : ''}`}
                  >
                    <Image
                      ref={node => {
                        imgRefs.current[`${cellIndex}-${slideIndex}`] = node;
                      }}
                      src={slide.src}
                      alt=""
                      fill
                      priority={slideIndex === 0}
                      loading={slideIndex === 0 || started ? 'eager' : 'lazy'}
                      fetchPriority={slideIndex === 0 ? 'high' : 'low'}
                      sizes={cell.sizes}
                      className={`${s.img} object-cover`}
                      style={
                        {
                          ['--pos-sm' as string]: slide.posSm,
                          ['--pos-md' as string]: slide.posMd,
                          ['--pos' as string]: slide.pos,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                </div>
              );
            })}

            {cell.id === 'tall' && !reduced && (
              <button
                type="button"
                onClick={() => setPaused(value => !value)}
                aria-pressed={paused}
                aria-label={paused ? hero.resumeLabel : hero.pauseLabel}
                className="absolute right-0 top-0 z-10 flex h-11 w-11 items-center justify-center border-b border-l border-[#111] bg-[#F7F7F5] text-[#111] transition-colors duration-300 hover:bg-[#111] hover:text-white"
              >
                {paused ? (
                  <Play aria-hidden="true" size={15} strokeWidth={1.8} />
                ) : (
                  <Pause aria-hidden="true" size={15} strokeWidth={1.8} />
                )}
              </button>
            )}
          </div>
        </div>
      ))}

      <div className={s.cBlack}>
        <div
          className={`${s.fill} ${s.a} ${s.dur1} ${s.fromRight} flex flex-col justify-between p-5 md:p-4 xl:p-7`}
          style={{ ['--d' as string]: '1.22s' }}
        >
          <ul className="font-montserrat text-[15px] font-normal leading-[1.3] tracking-[-0.01em] text-white md:text-[clamp(13px,1.35vw,22px)]">
            {hero.blockWords.map(word => (
              <li key={word}>{word}</li>
            ))}
          </ul>

          <span
            aria-hidden="true"
            className="ml-auto mt-4 block h-4 w-4 bg-[#FF3830] md:h-5 md:w-5"
          />
        </div>
      </div>
    </div>
  );
}
