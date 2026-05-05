'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type ProjectItem = {
  title: string;
  description: string;
  imageVariant: 'first' | 'second';
  href: string;
  image?: string;
};

type PortfolioData = {
  kicker: string;
  title: string;
  description: string;
  items: ProjectItem[];
};

const fallbackPortfolioData: PortfolioData = {
  kicker: 'Portfolio',
  title: 'Entdecken Sie unsere Arbeiten',
  description:
    'Ausgewählte Projekte, die zeigen, wie wir Ästhetik, Strategie und Performance zu einer digitalen Präsenz auf Premium-Niveau verbinden.',
  items: [],
};

export default function PortfolioPage() {
  const { lang } = useLanguage();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('home', lang);

        setPortfolio({
          ...fallbackPortfolioData,
          ...(data?.portfolio || {}),
          items: data?.portfolio?.items?.length
            ? data.portfolio.items
            : fallbackPortfolioData.items,
        });
      } catch {
        setPortfolio(fallbackPortfolioData);
      }
    };

    loadData();
  }, [lang]);

  const content = useMemo(
    () => portfolio ?? fallbackPortfolioData,
    [portfolio],
  );

  return (
    <main className="min-h-screen bg-[#f8f6f1] pt-[120px] md:pt-[140px] xl:pt-[170px]">
      <section className="container pb-[90px] md:pb-[110px] xl:pb-[150px]">
        <div className="mb-14 max-w-[720px]">
          <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
            {content.kicker}
          </p>

          <h1 className="font-tenor text-[40px] leading-[1.02] text-black md:text-[56px] xl:text-[74px]">
            {content.title}
          </h1>

          <p className="mt-5 max-w-[580px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base">
            {content.description}
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-2 xl:gap-8">
          {content.items.map((item, index) => (
            <a
              key={`${item.title}-${index}`}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group block overflow-hidden border border-[#e7e2d9] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_28px_60px_rgba(0,0,0,0.09)]"
            >
              <div className="relative flex h-[260px] items-center justify-center overflow-hidden border-b border-[#e7e2d9] bg-[#f3efe7] p-4 md:h-[285px] xl:h-[330px]">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    className="object-contain p-4 transition duration-500 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div
                    className={`h-full w-full ${
                      item.imageVariant === 'second'
                        ? 'bg-[linear-gradient(135deg,#e6ddd0_0%,#faf7f1_50%,#d4c6b3_100%)]'
                        : 'bg-[linear-gradient(135deg,#ddd3c4_0%,#f8f4ec_55%,#cdbda8_100%)]'
                    }`}
                  />
                )}
              </div>

              <div className="p-6 md:p-7">
                <p className="mb-3 font-montserrat text-[10px] uppercase tracking-[0.22em] text-neutral-400">
                  Website Project
                </p>

                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-tenor text-[28px] leading-none text-black md:text-[32px]">
                    {item.title}
                  </h3>

                  <span className="shrink-0 font-montserrat text-[10px] uppercase tracking-[0.16em] text-[#18352b] transition duration-300 group-hover:translate-x-[2px]">
                    Projekt ansehen
                  </span>
                </div>

                <p className="mt-4 font-montserrat text-sm leading-6 text-neutral-600">
                  {item.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
