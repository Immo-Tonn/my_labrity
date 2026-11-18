'use client';

import { ArrowUp } from 'lucide-react';

// Compact square arrow button in the footer's existing style (hairline
// border, graphite background). Icon-only, labelled for assistive tech.
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
      className="group flex h-11 w-11 items-center justify-center border border-[#F7F7F5]/35 bg-[#111111] text-[#F7F7F5]/80 transition duration-300 hover:border-[#F7F7F5] hover:bg-[#F7F7F5] hover:text-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7F7F5]"
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
