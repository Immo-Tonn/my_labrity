import React from 'react';
import Image from 'next/image';

import { LocalizedLink } from '@/components/ui';
import CookieSettingsButton from '@/components/common/CookieSettingsButton';
import { BackToTop } from '@/components/ui/BackToTop';
import BackgroundVideoToggle from '@/components/common/BackgroundVideoToggle';

interface FooterProps {
  toTopLabel: string;
  webLabel: string;
  policyLabel: string;
  impressumLabel: string;
  cookiesLabel: string;
  bgPauseLabel: string;
  bgPlayLabel: string;
}

// Layout, classes and spacing are identical to the footer in `main`. The only
// addition is the back-to-top arrow, which is absolutely positioned on the top
// border so it never moves or overlaps any original element.
export const Footer: React.FC<FooterProps> = ({
  toTopLabel,
  webLabel,
  policyLabel,
  impressumLabel,
  cookiesLabel,
  bgPauseLabel,
  bgPlayLabel,
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-[#F7F7F5]/15 bg-[#111111] py-6 md:py-7 xl:py-8">
      <div className="container pointer-events-none absolute inset-x-0 top-0 flex justify-end">
        <div className="pointer-events-auto -translate-y-1/2">
          <BackToTop label={toTopLabel} />
        </div>
      </div>

      <div className="container">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-baseline xl:justify-between">
          <div className="flex flex-col gap-4 md:flex-row md:items-baseline md:justify-between xl:flex-1">
            <LocalizedLink
              href="/"
              aria-label="Labrity"
              className="brand-link flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7F7F5]"
            >
              <Image
                src="/images/mark-labrity-light.png"
                alt=""
                width={256}
                height={256}
                unoptimized
                className="h-[44px] w-[44px] md:h-[52px] md:w-[52px]"
              />
            </LocalizedLink>

            <div className="flex items-center gap-4 smOnly:justify-center">
              <p className="font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#F7F7F5]/60 smOnly:text-center">
                © {currentYear} Labrity
              </p>

              <BackgroundVideoToggle
                pauseLabel={bgPauseLabel}
                playLabel={bgPlayLabel}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 md:flex-row md:items-baseline md:justify-between xl:flex-1 xl:justify-end xl:gap-6">
            <div className="flex flex-col items-center gap-3 md:flex-row md:flex-wrap md:justify-center md:gap-x-3 md:gap-y-2 xl:flex-nowrap">
              <LocalizedLink
                href="/privacy"
                className="whitespace-nowrap font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#F7F7F5]/70 transition duration-300 hover:text-[#F7F7F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7F7F5]"
              >
                {policyLabel}
              </LocalizedLink>

              <span
                aria-hidden="true"
                className="hidden text-[#F7F7F5]/25 md:inline"
              >
                |
              </span>

              <LocalizedLink
                href="/impressum"
                className="block whitespace-nowrap font-montserrat text-[12px] font-normal uppercase not-italic tracking-[0.14em] text-[#F7F7F5]/70 transition duration-300 hover:text-[#F7F7F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7F7F5]"
              >
                {impressumLabel}
              </LocalizedLink>

              <span
                aria-hidden="true"
                className="hidden text-[#F7F7F5]/25 md:inline"
              >
                |
              </span>

              <CookieSettingsButton
                label={cookiesLabel}
                className="whitespace-nowrap font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#F7F7F5]/70 transition duration-300 hover:text-[#F7F7F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7F7F5]"
              />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-[#F7F7F5]/15 md:gap-4 xl:border-l xl:pl-6">
              <a
                href="https://labrity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#F7F7F5]/70 transition duration-300 hover:text-[#F7F7F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7F7F5] xl:whitespace-nowrap"
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
