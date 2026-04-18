'use client';

import React, { useEffect, useState } from 'react';

import { Logo, ModalPolicy, FooterItem } from '@/components/ui';
import { ModalImpressum } from '@/components/ui/ModalImpressum';
import { FooterItemProps } from '@/components/ui/FooterItem/types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

interface FooterData {
  layout: {
    footer: {
      web: string;
    };
  };
  footerLabelPolicy: string;
  footerLabelImpressum: string;
  footer: {
    name: string;
    path: string;
    ariaLabel: string;
  }[];
}

export const Footer: React.FC<FooterItemProps> = () => {
  const { lang } = useLanguage();
  const [data, setData] = useState<FooterData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getData('common', lang);
      setData(result);
    };

    loadData();
  }, [lang]);

  if (!data) return null;

  const { footer } = data;

  return (
    <footer className="relative w-full overflow-hidden bg-[#1a130f] pb-[19px] pt-6 md:pb-6 xl:pt-8">
      {/* GOLD SHIMMER LINE */}
      <div className="absolute left-0 top-0 h-[2px] w-full overflow-hidden bg-[#8c6a1a]">
        <div className="shimmer"></div>
      </div>

      <div className="container">
        <div className="flex flex-col xl:flex-row">
          <Logo
            path="footer"
            className="xl:flex-auto smOnly:mb-6 smOnly:text-center mdOnly:mb-12"
          />

          <div className="flex flex-col items-center md:flex-row-reverse md:justify-between xl:flex-row">
            {/* DATENSCHUTZ + IMPRESSUM */}
            <div className="flex items-baseline gap-3">
              <ModalPolicy variant="footer" nameBtn={data.footerLabelPolicy} />

              <span className="text-borderCheckbox">|</span>

              <ModalImpressum nameBtn={data.footerLabelImpressum} />
            </div>

            <div className="flex items-center gap-3 border-borderCheckbox/40 xl:ml-6 xl:border-l-[1px] xl:border-solid xl:pl-6 xl:pt-0">
              {/* WEBSITE BY LABRITY */}
              <a
                href="https://labrity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-montserrat text-white/70 transition hover:text-accent"
              >
                {data.layout.footer.web}
              </a>

              {/* SOCIAL LINKS */}
              <ul className="flex items-center gap-3 xl:gap-6">
                {footer.map(item => (
                  <FooterItem
                    key={item.name}
                    name={item.name}
                    href={item.path}
                    ariaL={item.ariaLabel}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
