'use client';

import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { useQuiz } from '@/components/quiz';
import { classnames } from '@/utils/classnames';

import type { Service } from './types';

export type ServicesListProps = {
  services: Service[];
  buttonLabel: string;
};

type Tone = 'light' | 'tint' | 'dark';

// Rhythm of the block grid: light/graphite/tint surfaces alternate so that no
// two graphite blocks touch. A lone last service closes the list full-width.
const PATTERN: Tone[] = ['light', 'dark', 'dark', 'tint', 'tint', 'dark'];

const EASE = [0.22, 1, 0.36, 1] as const;

const TONE: Record<
  Tone,
  { surface: string; sub: string; line: string; button: string }
> = {
  light: {
    surface: 'bg-[#F7F7F5] text-[#111111] hover:bg-[#EEEEEB]',
    sub: 'text-[#111111]/70',
    line: 'border-[#111111]/25',
    button: 'border-[#111111] bg-[#111111] text-[#F7F7F5]',
  },
  tint: {
    surface: 'bg-[#EEEEEB] text-[#111111] hover:bg-[#F7F7F5]',
    sub: 'text-[#111111]/70',
    line: 'border-[#111111]/25',
    button: 'border-[#111111] bg-[#111111] text-[#F7F7F5]',
  },
  dark: {
    surface: 'bg-[#111111] text-[#F7F7F5] hover:bg-[#191919]',
    sub: 'text-[#F7F7F5]/72',
    line: 'border-[#F7F7F5]/25',
    button: 'border-[#F7F7F5] bg-[#F7F7F5] text-[#111111]',
  },
};

export function ServicesList({ services, buttonLabel }: ServicesListProps) {
  const { openQuiz } = useQuiz();
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState(44);

  // Shorter entrance travel on phones.
  useEffect(() => {
    const update = () => setOffset(window.innerWidth < 768 ? 16 : 44);

    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  const rows: Service[][] = [];

  for (let i = 0; i < services.length; i += 2) {
    rows.push(services.slice(i, i + 2));
  }

  const card = (side: -1 | 1): Variants => ({
    hidden: reduce ? { opacity: 1 } : { opacity: 0, x: side * offset },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.85,
        ease: EASE,
        when: 'beforeChildren',
        staggerChildren: 0.09,
      },
    },
  });

  const child: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  const draw: Variants = {
    hidden: reduce ? { scaleX: 1 } : { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
  };

  const accent: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, scale: 0.3 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: EASE, delay: 0.45 },
    },
  };

  return (
    <div className="border-x border-t border-[#111111]" style={{ opacity: 1 }}>
      {rows.map((row, rowIndex) => {
        const single = row.length === 1;
        // Even rows: wide card left (60/40); odd rows: narrow left (40/60).
        const cols = single
          ? 'lg:grid-cols-1'
          : rowIndex % 2 === 0
            ? 'lg:grid-cols-[3fr_2fr]'
            : 'lg:grid-cols-[2fr_3fr]';

        return (
          <div key={rowIndex} className={classnames('grid', cols)}>
            {row.map((service, colIndex) => {
              const index = rowIndex * 2 + colIndex;
              const wide =
                single ||
                (rowIndex % 2 === 0 ? colIndex === 0 : colIndex === 1);
              const tone: Tone = single ? 'light' : PATTERN[index % 6];
              const t = TONE[tone];

              return (
                <motion.article
                  key={service._id}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  variants={card(single ? -1 : colIndex === 0 ? -1 : 1)}
                  className={classnames(
                    'relative flex flex-col border-b border-[#111111] px-6 py-9 transition-colors duration-500 md:px-10 md:py-12 xl:px-14 xl:py-16',
                    colIndex === 0 && !single ? 'lg:border-r' : 'lg:border-r-0',
                    t.surface,
                  )}
                >
                  <motion.span
                    variants={accent}
                    aria-hidden="true"
                    className="absolute right-6 top-6 h-[8px] w-[8px] bg-[#FF3830] md:right-10 md:top-10 xl:right-14 xl:top-14"
                  />

                  <div
                    className={classnames(
                      single &&
                        'lg:grid lg:grid-cols-[2fr_3fr] lg:gap-x-16 xl:gap-x-24',
                    )}
                  >
                    <div>
                      <motion.p
                        variants={child}
                        className={classnames(
                          'mb-4 pr-8 font-montserrat text-xs uppercase tracking-[0.24em]',
                          t.sub,
                        )}
                      >
                        {service.location}
                      </motion.p>

                      <motion.h3
                        variants={child}
                        className={classnames(
                          'font-montserrat font-semibold leading-[1.05] tracking-[-0.03em]',
                          wide
                            ? 'text-[28px] md:text-[36px] xl:text-[44px]'
                            : 'text-[26px] md:text-[32px] xl:text-[34px]',
                        )}
                      >
                        {service.title}
                      </motion.h3>
                    </div>

                    <ul
                      className={classnames(
                        'mt-8 flex flex-col',
                        single && 'lg:mt-0',
                      )}
                    >
                      {service.card?.map((item, i) => (
                        <motion.li
                          key={i}
                          variants={child}
                          className={classnames(
                            'group/item relative grid grid-cols-[18px_1fr] items-start gap-x-3 border-t py-5',
                            t.line,
                          )}
                        >
                          <motion.span
                            variants={draw}
                            aria-hidden="true"
                            className={classnames(
                              'absolute -top-px left-0 h-px w-full origin-left border-0',
                              'transition-colors duration-500 group-hover/item:bg-[#FF3830]',
                              tone === 'dark'
                                ? 'bg-[#F7F7F5]/40'
                                : 'bg-[#111111]/50',
                            )}
                          />
                          <span
                            aria-hidden="true"
                            className="mt-[9px] block h-[6px] w-[6px] bg-[#FF3830] transition-all duration-500 group-hover/item:w-[14px]"
                          />
                          <div className="min-w-0">
                            <p className="font-montserrat text-[16px] font-semibold leading-6 md:text-[17px]">
                              {item.subtitle}
                            </p>

                            {item.description && (
                              <p
                                className={classnames(
                                  'mt-2 font-montserrat text-sm leading-6 md:text-[15px]',
                                  t.sub,
                                )}
                              >
                                {item.description}
                              </p>
                            )}
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <motion.div variants={child} className="mt-auto pt-8">
                    <button
                      type="button"
                      onClick={openQuiz}
                      className={classnames(
                        'group/btn inline-flex min-h-[52px] items-center justify-center gap-3 border px-7 font-montserrat text-[13px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300 hover:border-[#FF3830] hover:bg-[#FF3830] hover:text-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4',
                        tone === 'dark'
                          ? 'focus-visible:outline-[#F7F7F5]'
                          : 'focus-visible:outline-[#111111]',
                        t.button,
                      )}
                    >
                      <span className="underline-offset-4 group-hover/btn:underline">
                        {buttonLabel}
                      </span>
                      <ArrowUpRight
                        size={16}
                        strokeWidth={1.6}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover/btn:-translate-y-[2px] group-hover/btn:translate-x-[2px]"
                      />
                    </button>
                  </motion.div>
                </motion.article>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
