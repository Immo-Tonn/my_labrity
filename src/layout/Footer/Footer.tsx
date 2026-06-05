'use client';

import React, { useEffect, useState } from 'react';

import { Logo, ModalPolicy, FooterItem } from '@/components/ui';
import { ModalImpressum } from '@/components/ui/ModalImpressum';

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

export const Footer: React.FC = () => {
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
  const currentYear = new Date().getFullYear();

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
              <ModalPolicy variant="footer" nameBtn={data.footerLabelPolicy} />

              <span className="text-[#18352b]/20">|</span>

              <ModalImpressum nameBtn={data.footerLabelImpressum} />
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 border-[#18352b]/10 md:gap-4 xl:border-l xl:pl-6">
              <a
                href="https://labrity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-montserrat text-[12px] uppercase tracking-[0.14em] text-[#18352b]/55 transition duration-300 hover:text-[#18352b]"
              >
                {data.layout.footer.web}
              </a>

              <ul className="flex items-center gap-3 xl:gap-5">
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
