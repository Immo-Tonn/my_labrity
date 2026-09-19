import { ChevronRight } from 'lucide-react';

import { LocalizedLink } from '@/components/ui/LocalizedLink';

export type BreadcrumbsProps = {
  parentLabel: string;
  parentHref: string;
  currentLabel: string;
};

// Minimal, Labrity-styled return path — not a Bootstrap-style breadcrumb bar.
// Small tracked uppercase type, a single hairline chevron, no background/border.
export function Breadcrumbs({
  parentLabel,
  parentHref,
  currentLabel,
}: BreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex items-center gap-2 font-montserrat text-[11px] uppercase tracking-[0.22em] text-black/45 md:text-xs"
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
