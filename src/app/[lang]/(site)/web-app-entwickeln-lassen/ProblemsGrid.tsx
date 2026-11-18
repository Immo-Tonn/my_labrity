'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

import { classnames } from '@/utils/classnames';

import styles from './ProblemsGrid.module.css';

type Pair = { problem: string; solution: string };

type ProblemsGridProps = {
  items: Pair[];
  problemLabel: string;
  solutionLabel: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

// Rows alternate 60/40 and 40/60; surfaces alternate so that a graphite card
// always sits diagonally from the next one.
export function ProblemsGrid({
  items,
  problemLabel,
  solutionLabel,
}: ProblemsGridProps) {
  const reduce = useReducedMotion();
  const [offset, setOffset] = useState(48);

  useEffect(() => {
    const update = () => setOffset(window.innerWidth < 768 ? 16 : 48);

    update();
    window.addEventListener('resize', update);

    return () => window.removeEventListener('resize', update);
  }, []);

  const card = (side: -1 | 1): Variants => ({
    hidden: reduce ? { opacity: 1 } : { opacity: 0, x: side * offset },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.85,
        ease: EASE,
        when: 'beforeChildren',
        staggerChildren: 0.08,
      },
    },
  });

  const child: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  };

  const line: Variants = {
    hidden: reduce ? { scaleX: 1 } : { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.9, ease: EASE } },
  };

  const badge: Variants = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, scale: 0.6 },
    show: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: EASE, delay: 0.35 },
    },
  };

  return (
    <ol
      className={classnames(
        styles.grid,
        'mt-12 list-none border-x border-t border-[#111] p-0',
      )}
      style={{ opacity: 1 }}
    >
      {items.map((pair, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const dark = (row + col) % 2 === 1;
        const wide = row % 2 === 0 ? col === 0 : col === 1;
        return (
          <motion.li
            key={pair.problem}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            variants={card(col === 0 ? -1 : 1)}
            className={classnames(
              styles.card,
              dark ? styles.dark : styles.light,
              wide ? styles.wide : styles.narrow,
              col === 0 && styles.left,
            )}
          >
            <div className={styles.inner}>
              <motion.span
                variants={badge}
                className={styles.number}
                aria-hidden="false"
              >
                {String(index + 1).padStart(2, '0')}
              </motion.span>

              <motion.p variants={child} className={styles.label}>
                {problemLabel}
              </motion.p>

              <motion.p variants={child} className={styles.problem}>
                {pair.problem}
              </motion.p>

              <motion.span variants={line} className={styles.rule} />

              <motion.p variants={child} className={styles.label}>
                <span className={styles.dot} aria-hidden="true" />
                {solutionLabel}
              </motion.p>

              <motion.p variants={child} className={styles.solution}>
                {pair.solution}
              </motion.p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
