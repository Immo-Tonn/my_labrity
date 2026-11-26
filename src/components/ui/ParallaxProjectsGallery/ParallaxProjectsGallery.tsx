'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  type MotionValue,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

export type GalleryProject = {
  title: string;
  category: string;
  image: string;
  /** External project URL; opens in a new tab. */
  href?: string;
};

type Props = {
  projects: GalleryProject[];
  title: string;
  scrollLabel?: string;
  /** Visible heading inside the frame; the title is still the section's accessible name. */
  showTitle?: boolean;
};

const COLUMNS = 4;

// Scroll-driven offset (in %) plus the idle sway (in px) as one CSS length.
function useDrift(scrollY: MotionValue<string>, idle: MotionValue<number>) {
  return useTransform(
    [scrollY, idle] as MotionValue<string | number>[],
    ([a, b]) => `calc(${a} + ${b}px)`,
  );
}

function Card({
  project,
  hidden,
  eager,
}: {
  project: GalleryProject;
  hidden?: boolean;
  eager?: boolean;
}) {
  const dark = project.image.includes('immo-tonn');

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={`group relative block h-[200px] w-full shrink-0 overflow-hidden border border-white/15 sm:h-[300px] md:h-[400px] ${
        dark ? 'bg-[#101326]' : 'bg-[#111]'
      }`}
    >
      <Image
        src={project.image}
        alt={hidden ? '' : `${project.title} Website Projekt`}
        fill
        loading={eager ? 'eager' : 'lazy'}
        sizes="(max-width: 768px) 50vw, 22vw"
        className={`transition duration-500 group-hover:scale-[1.03] ${
          dark ? 'object-contain' : 'object-cover object-top'
        }`}
      />
      <span className="absolute inset-x-0 bottom-0 translate-y-full bg-white p-3 font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#111] transition-transform duration-300 group-hover:translate-y-0 group-focus-visible:translate-y-0">
        {project.title}
        <span className="block text-[#111]/60">{project.category}</span>
      </span>
    </a>
  );
}

export default function ParallaxProjectsGallery({
  projects,
  title,
  scrollLabel = 'Scroll',
  showTitle = true,
}: Props) {
  const containerRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [preload, setPreload] = useState(false);

  // Native lazy loading fires too late for cards parked outside the 3D frame,
  // so load them all once the section is about a screen away.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setPreload(true);
        observer.disconnect();
      },
      { rootMargin: '100% 0px' },
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [reduce]);

  const columns = useMemo(() => {
    // Every column gets the same number of cards (the last slots wrap around
    // to the first projects) so all four columns have equal height and line
    // up in one even row when the scroll animation settles.
    const perColumn = Math.ceil(projects.length / COLUMNS);
    const cols = Array.from({ length: COLUMNS }, (_, c) =>
      Array.from(
        { length: perColumn },
        (_, k) => projects[(c + COLUMNS * k) % projects.length],
      ),
    );

    // Doubled so the moving columns never run out of cards; the copies are
    // hidden from assistive tech and the tab order.
    return cols.map(col => [...col, ...col]);
  }, [projects]);

  // Page scroll (not an inner scroller): progress through this section only.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const p = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 20,
    mass: 0.5,
  });

  const bannerWidth = useTransform(p, [0, 0.15], ['92vw', '100vw']);
  const bannerHeight = useTransform(p, [0, 0.15], ['80vh', '100vh']);

  const rotateY = useTransform(p, [0.15, 0.8], [-45, 0]);
  const rotateX = useTransform(p, [0.15, 0.8], [25, 0]);
  const rotateZ = useTransform(p, [0.15, 0.8], [15, 0]);
  const translateZ = useTransform(p, [0.15, 0.8], [-800, 0]);

  const yCol1 = useTransform(p, [0.15, 0.8], ['0%', '-20%']);
  const yCol2 = useTransform(p, [0.15, 0.8], ['-20%', '-20%']);
  const yCol3 = useTransform(p, [0.15, 0.8], ['0%', '-20%']);
  const yCol4 = useTransform(p, [0.15, 0.8], ['-10%', '-20%']);
  // Idle drift: columns sway in opposite directions so the gallery reads as
  // alive (and hints at scrolling) even when nothing is being scrolled.
  const idle0 = useMotionValue(0);
  const idle1 = useMotionValue(0);
  const idle2 = useMotionValue(0);
  const idle3 = useMotionValue(0);
  const idles = [idle0, idle1, idle2, idle3];

  useAnimationFrame(time => {
    if (reduce) return;
    const t = time / 1000;

    idles.forEach((v, i) => {
      v.set(Math.sin(t * 0.7 + i * 1.3) * 26 * (i % 2 === 0 ? 1 : -1));
    });
  });

  const ys = [
    useDrift(yCol1, idle0),
    useDrift(yCol2, idle1),
    useDrift(yCol3, idle2),
    useDrift(yCol4, idle3),
  ];
  const hintOpacity = useTransform(p, [0, 0.06], [1, 0]);

  // No motion: plain, readable grid.
  if (reduce) {
    return (
      <section
        aria-label={title}
        className="border border-white/20 bg-[#050505] p-4 text-white md:p-8"
      >
        <h2 className="mb-6 font-montserrat text-[28px] font-semibold md:text-[44px]">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {projects.map(project => (
            <Card key={project.title} project={project} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      aria-label={title}
      className="relative h-[320vh] w-full bg-[#050505] text-white"
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          style={{ width: bannerWidth, height: bannerHeight }}
          className="relative mx-auto flex max-w-[1920px] items-center justify-center overflow-hidden border border-white/20 bg-[#050505]"
        >
          <h2
            className={`pointer-events-none absolute left-6 top-6 z-30 max-w-[70%] font-montserrat text-[22px] font-semibold leading-tight tracking-[-0.03em] md:left-10 md:top-10 md:text-[40px] ${
              showTitle ? '' : 'sr-only'
            }`}
          >
            {title}
          </h2>

          <motion.span
            aria-hidden="true"
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 font-montserrat text-[11px] uppercase tracking-[0.22em] text-white/80"
          >
            {scrollLabel} ↓
          </motion.span>

          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: '1000px' }}
          >
            <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_100px_120px_-50px_#050505,inset_0_-100px_120px_-50px_#050505,inset_120px_0_120px_-50px_#050505,inset_-120px_0_120px_-50px_#050505]" />

            <motion.div
              style={{
                rotateX,
                rotateY,
                rotateZ,
                z: translateZ,
                transformStyle: 'preserve-3d',
              }}
              className="flex h-[150vh] w-[120vw] origin-center items-center justify-center gap-4 will-change-transform md:gap-6"
            >
              {columns.map((col, c) => (
                <motion.div
                  key={c}
                  style={{ y: ys[c] }}
                  className="flex w-[22vw] min-w-[200px] flex-col gap-4 md:gap-6"
                >
                  {col.map((project, i) => (
                    <Card
                      key={`${c}-${i}`}
                      project={project}
                      eager={preload}
                      hidden={i >= col.length / 2}
                    />
                  ))}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
