'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Thin progress line at the top while a page change is loading, so a click on
// a link gives instant feedback (and nobody clicks twice while Next fetches
// or, in dev, compiles the next page).
export default function NavProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

      const link = (event.target as Element | null)?.closest?.('a');

      if (!link || (link.target && link.target !== '_self')) return;

      const url = new URL(link.href, window.location.href);

      if (url.origin !== window.location.origin) return;
      if (
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      )
        return;

      setState('loading');
    };

    document.addEventListener('click', onClick, true);

    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    setState(current => (current === 'loading' ? 'done' : current));

    const timer = window.setTimeout(() => setState('idle'), 600);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[400] h-[3px] bg-[#FF3830]"
      style={{
        width: state === 'loading' ? '85%' : state === 'done' ? '100%' : '0%',
        opacity: state === 'done' || state === 'idle' ? 0 : 1,
        transition:
          state === 'loading'
            ? 'width 6s cubic-bezier(0.1, 0.6, 0.2, 1), opacity 0.1s'
            : 'width 0.25s ease, opacity 0.4s ease 0.2s',
      }}
    />
  );
}
