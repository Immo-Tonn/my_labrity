'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { classnames } from '@/utils/classnames';

import styles from './SpecializedGrid.module.css';

type Item = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

const EASE = [0.22, 1, 0.36, 1] as const;

// Which cells carry the small red corner: sparingly, not on every card.
const MARKED = new Set([0, 3, 4, 6]);

export function SpecializedGrid({ items }: { items: Item[] }) {
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

  const lastIsSingle = items.length % 2 === 1;

  return (
    <ul
      className={classnames(
        styles.grid,
        'mt-10 list-none border-x border-t border-[#111] p-0',
      )}
      style={{ opacity: 1 }}
    >
      {items.map((item, index) => {
        const row = Math.floor(index / 2);
        const col = index % 2;
        const single = lastIsSingle && index === items.length - 1;
        // Graphite never sits directly under graphite: the closing block is light.
        const dark = !single && (row + col) % 2 === 1;
        const wide = single || (row % 2 === 0 ? col === 0 : col === 1);

        return (
          <motion.li
            key={item.href}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            variants={card(single || col === 0 ? -1 : 1)}
            className={classnames(
              styles.card,
              dark ? styles.dark : styles.light,
              single ? styles.single : wide ? styles.wide : styles.narrow,
              col === 0 && !single && styles.left,
              MARKED.has(index) && styles.mark,
            )}
          >
            <LocalizedLink href={item.href} className={styles.link}>
              <motion.span
                variants={badge}
                className={styles.number}
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, '0')}
              </motion.span>

              <motion.h3 variants={child} className={styles.title}>
                {item.title}
              </motion.h3>

              <motion.p variants={child} className={styles.desc}>
                {item.description}
              </motion.p>

              <motion.span variants={line} className={styles.rule} />

              <motion.span variants={child} className={styles.cta}>
                <span>{item.linkLabel}</span>
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.6}
                  aria-hidden="true"
                  className={styles.arrow}
                />
              </motion.span>
            </LocalizedLink>
          </motion.li>
        );
      })}
    </ul>
  );
}
