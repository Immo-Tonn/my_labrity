import React from 'react';

import { Logo, LocalizedLink } from '@/components/ui';
import { BackToTop } from '@/components/ui/BackToTop';

interface FooterProps {
  toTopLabel: string;
  webLabel: string;
  policyLabel: string;
  impressumLabel: string;
}

// Layout, classes and spacing are identical to the footer in `main`. The only
// addition is the back-to-top arrow, which is absolutely positioned on the top
// border so it never moves or overlaps any original element.
export const Footer: React.FC<FooterProps> = ({
  toTopLabel,
  webLabel,
  policyLabel,
  impressumLabel,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-[#18352b]/10 bg-[#f8f6f1] py-6 md:py-7 xl:py-8">
      <div className="container pointer-events-none absolute inset-x-0 top-0 flex justify-end">
        <div className="pointer-events-auto -translate-y-1/2">
          <BackToTop label={toTopLabel} />
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:flex-1">
            <Logo path="footer" className="text-[#18352b] smOnly:text-center" />

            <p className="font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#18352b]/45 smOnly:text-center">
              © {currentYear} Labrity
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between xl:flex-1 xl:justify-end xl:gap-6">
            <div className="flex items-center gap-3">
              <LocalizedLink
                href="/privacy"
                className="text-[12px] uppercase tracking-[0.14em] text-[#18352b]/55 transition duration-300 hover:text-[#18352b] smOnly:mb-3"
              >
                {policyLabel}
              </LocalizedLink>

              <span className="text-[#18352b]/20">|</span>

              <LocalizedLink
                href="/impressum"
                className="block font-montserrat text-[12px] font-normal uppercase not-italic tracking-[0.14em] text-[#18352b]/55 transition duration-300 hover:text-[#18352b]"
              >
                {impressumLabel}
              </LocalizedLink>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-[#18352b]/10 md:gap-4 xl:border-l xl:pl-6">
              <a
                href="https://labrity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#18352b]/55 transition duration-300 hover:text-[#18352b]"
              >
                {webLabel}
              </a>

              {/* Same invisible spacer as the two empty partner slots in main
                  (keeps the exact spacing without dead '#' links). */}
              <ul
                aria-hidden="true"
                className="flex items-center gap-3 xl:gap-5"
              >
                <li />
                <li />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
