import { ChevronRight } from 'lucide-react';

import { LocalizedLink } from '@/components/ui/LocalizedLink';

export type BreadcrumbsProps = {
  parentLabel: string;
  parentHref: string;
  currentLabel: string;
  /** `swiss`: red hover/focus on the link, marked current page. */
  variant?: 'default' | 'swiss';
};

// Minimal, Labrity-styled return path — not a Bootstrap-style breadcrumb bar.
// Small tracked uppercase type, a single hairline chevron, no background/border.
export function Breadcrumbs({
  parentLabel,
  parentHref,
  currentLabel,
  variant = 'default',
}: BreadcrumbsProps) {
  if (variant === 'swiss') {
    return (
      <nav
        aria-label="Breadcrumb"
        className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-montserrat text-xs uppercase tracking-[0.22em]"
      >
        <LocalizedLink
          href={parentHref}
          className="relative inline-flex min-h-[32px] items-center text-black/65 transition-colors duration-300 after:absolute after:bottom-[4px] after:left-0 after:h-px after:w-0 after:bg-[#FF3830] after:transition-[width] after:duration-300 hover:text-[#FF3830] hover:after:w-full focus-visible:text-[#FF3830] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111] focus-visible:after:w-full"
        >
          {parentLabel}
        </LocalizedLink>

        <ChevronRight size={12} strokeWidth={1.6} className="text-black/35" />

        <span
          aria-current="page"
          className="inline-flex items-center gap-2 font-semibold text-[#111111]"
        >
          <span aria-hidden="true" className="h-[6px] w-[6px] bg-[#FF3830]" />
          {currentLabel}
        </span>
      </nav>
    );
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 font-montserrat text-xs uppercase tracking-[0.22em] text-black/60 md:text-xs"
    >
      <LocalizedLink
        href={parentHref}
        className="transition duration-300 hover:text-black"
      >
        {parentLabel}
      </LocalizedLink>

      <ChevronRight size={12} strokeWidth={1.6} className="text-black/25" />

      <span aria-current="page" className="text-black/70">
        {currentLabel}
      </span>
    </nav>
  );
}
