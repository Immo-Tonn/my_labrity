'use client';

import { ArrowUp } from 'lucide-react';

export function BackToTop({ label }: { label: string }) {
  const handleClick = () => {
    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="group inline-flex min-h-[44px] items-center gap-3 font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#18352b]/55 transition duration-300 hover:text-[#18352b]"
    >
      {label}
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center border border-[#18352b]/25 text-[#18352b] transition duration-300 group-hover:-translate-y-[2px] group-hover:border-[#18352b]"
      >
        <ArrowUp size={16} strokeWidth={1.6} />
      </span>
    </button>
  );
}
