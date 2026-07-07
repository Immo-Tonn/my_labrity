'use client';

import { useEffect, useState } from 'react';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type Condition = {
  _id: string;
  title: string;
  description: {
    children: {
      text: string;
    }[];
  }[];
};

const fallbackTitle: Record<string, string> = {
  de: 'Datenschutz',
  en: 'Privacy Policy',
  ru: 'Политика конфиденциальности',
  ua: 'Політика конфіденційності',
};

export default function PrivacyPage() {
  const { lang } = useLanguage();
  const [title, setTitle] = useState(fallbackTitle.de);
  const [conditions, setConditions] = useState<Condition[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [common, privacy] = await Promise.all([
          getData('common', lang),
          getData('privacy', lang),
        ]);

        setTitle(
          common?.footerLabelPolicy || fallbackTitle[lang] || fallbackTitle.de,
        );

        setConditions(privacy ?? []);
      } catch {
        setTitle(fallbackTitle[lang] || fallbackTitle.de);
        setConditions([]);
      }
    };

    loadData();
  }, [lang]);

  return (
    <main className="min-h-screen bg-[#f8f6f1] pt-[120px] md:pt-[140px] xl:pt-[170px]">
      <section className="container pb-[90px] md:pb-[110px] xl:pb-[140px]">
        <div className="overflow-hidden border border-[#e7e2d9] bg-white px-6 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.05)] md:px-10 md:py-14 xl:px-14 xl:py-16">
          <h1 className="max-w-[720px] font-tenor text-[36px] leading-[1.04] text-black md:text-[52px] xl:text-[64px]">
            {title}
          </h1>

          <div className="mt-10 max-w-[820px]">
            {conditions.map(item => (
              <div key={item._id} className="mb-8">
                <h3 className="font-tenor text-xl font-semibold text-[#18352b]">
                  {item.title}
                </h3>

                {Array.isArray(item.description) &&
                  item.description.length > 0 && (
                    <div className="mt-2 font-montserrat text-sm leading-7 text-[#18352b]/75">
                      {item.description.map((block, index) => (
                        <p key={index} className="whitespace-pre-line">
                          {Array.isArray(block.children) &&
                          block.children.length > 0
                            ? block.children[0].text || ''
                            : ''}
                        </p>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
