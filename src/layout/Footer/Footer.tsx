import React from 'react';

import { Logo, LocalizedLink } from '@/components/ui';

interface FooterProps {
  webLabel: string;
  policyLabel: string;
  impressumLabel: string;
}

export const Footer: React.FC<FooterProps> = ({
  webLabel,
  policyLabel,
  impressumLabel,
}) => {
  const currentYear = new Date().getFullYear();
  const linkClasses =
    'text-[12px] uppercase tracking-[0.14em] text-[#18352b]/55 transition duration-300 hover:text-[#18352b]';

  return (
    <footer className="w-full border-t border-[#18352b]/10 bg-[#f8f6f1] py-6 md:py-7 xl:py-8">
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
                className={`${linkClasses} smOnly:mb-3`}
              >
                {policyLabel}
              </LocalizedLink>

              <span className="text-[#18352b]/20">|</span>

              <LocalizedLink
                href="/impressum"
                className={`${linkClasses} font-montserrat smOnly:mb-3`}
              >
                {impressumLabel}
              </LocalizedLink>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-[#18352b]/10 md:gap-4 xl:border-l xl:pl-6">
              <a
                href="https://www.labrity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#18352b]/55 transition duration-300 hover:text-[#18352b]"
              >
                {webLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
