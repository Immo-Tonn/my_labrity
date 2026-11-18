'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Calm scroll reveals for the inner pages (<main class="swiss">): blocks fade
// up in sequence, photos open through a mask, hairlines draw themselves.
// Only elements that start below the fold are hidden, so the first screen
// never flashes, and nothing is hidden at all without JS or with reduced
// motion (the CSS only applies to the classes added here).
const BLOCKS = [
  '.swiss section > *',
  '.swiss section > .container > *',
  '.swiss section > div:only-child > *',
].join(',');

export default function SwissMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.querySelector('main.swiss');

    if (!root) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) return;

    const fold = window.innerHeight * 0.92;
    const touched: HTMLElement[] = [];
    const seen = new Set<Element>();
    const timers: number[] = [];

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;

          target.classList.add('sw-in');
          observer.unobserve(target);

          // Once revealed, hand the element back to its own hover/transition
          // classes.
          timers.push(
            window.setTimeout(() => {
              target.classList.remove(
                'sw-r',
                'sw-l',
                'sw-rt',
                'sw-b',
                'sw-mask',
                'sw-line',
                'sw-in',
              );
              target.style.removeProperty('--sw-d');
            }, 1600),
          );
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0 },
    );

    // Direction follows the composition: a pair of columns enters from its
    // own sides, rows of cards rise one after another.
    const direction = (el: HTMLElement) => {
      const parent = el.parentElement;

      if (!parent) return 'sw-b';

      const style = window.getComputedStyle(parent);
      const row =
        style.display === 'grid'
          ? style.gridTemplateColumns.split(' ').length > 1
          : style.display === 'flex' && style.flexDirection.startsWith('row');
      const kids = [...parent.children].filter(
        node => node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE',
      );

      if (row && kids.length === 2) {
        return kids.indexOf(el) === 0 ? 'sw-l' : 'sw-rt';
      }

      return 'sw-b';
    };

    const arm = (el: HTMLElement, kind: string, index = 0) => {
      if (seen.has(el)) return;
      seen.add(el);

      // Framer-motion elements animate themselves.
      if (/opacity/.test(el.getAttribute('style') ?? '')) return;
      if (el.getBoundingClientRect().top < fold) return;

      el.classList.add(kind);
      if (kind === 'sw-r') el.classList.add(direction(el));
      el.style.setProperty('--sw-d', `${Math.min(index, 4) * 80}ms`);
      touched.push(el);
      observer.observe(el);
    };

    // 1. Blocks (siblings are staggered).
    root.querySelectorAll<HTMLElement>(BLOCKS).forEach(el => {
      if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
      const siblings = el.parentElement ? [...el.parentElement.children] : [];
      arm(el, 'sw-r', siblings.indexOf(el));
    });

    // 2. Photos open through a rectangular mask.
    root.querySelectorAll<HTMLElement>('img').forEach(img => {
      const wrap = img.parentElement;

      if (wrap && /overflow-hidden/.test(wrap.className)) arm(wrap, 'sw-mask');
    });

    // 3. Hairlines draw themselves.
    root.querySelectorAll<HTMLElement>('[class*="h-px"]').forEach(el => {
      if (el.children.length === 0) arm(el, 'sw-line');
    });

    return () => {
      observer.disconnect();
      timers.forEach(id => window.clearTimeout(id));
      touched.forEach(el => {
        el.classList.remove(
          'sw-r',
          'sw-l',
          'sw-rt',
          'sw-b',
          'sw-mask',
          'sw-line',
          'sw-in',
        );
        el.style.removeProperty('--sw-d');
      });
    };
  }, [pathname]);

  return null;
}
