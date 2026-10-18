'use client';

import { ArrowUp } from 'lucide-react';

// Compact square arrow button in the footer's existing style (thin green
// border, #f8f6f1 background). Icon-only, labelled for assistive tech.
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
      aria-label={label}
      title={label}
      className="group flex h-11 w-11 items-center justify-center border border-[#18352b]/25 bg-[#f8f6f1] text-[#18352b]/70 transition duration-300 hover:border-[#18352b] hover:text-[#18352b]"
    >
      <ArrowUp
        size={18}
        strokeWidth={1.5}
        aria-hidden="true"
        className="transition duration-300 group-hover:-translate-y-[2px]"
      />
    </button>
  );
}
