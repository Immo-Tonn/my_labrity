'use client';

import { motion } from 'framer-motion';
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

type SeoBlockItem = {
  kicker: string;
  title: string;
};

type BlackSection = {
  kicker: string;
  title: string;
  description: string;
  tags: string[];
  status: string;
};

type PortfolioData = {
  kicker: string;
  title: string;
  description: string;
  button: string;
  topTags: string[];
  seoBlock: SeoBlockItem[];
  marquee: string[];
  projectLabel: string;
  projectButton: string;
  projectTags: string[];
  categories: Record<string, string>;
  blackSection: BlackSection;
  items: ProjectItem[];
};

const fallbackPortfolioData: PortfolioData = {
  kicker: 'Portfolio',
  title: 'Entdecken Sie unsere Arbeiten',
  description:
    'Ausgewählte Projekte, die zeigen, wie wir Ästhetik, Strategie und Performance zu einer digitalen Präsenz auf Premium-Niveau verbinden.',
  button: 'Portfolio ansehen',
  topTags: ['SEO READY', 'AI VISIBILITY', 'HIGH-END FRONTEND'],
  seoBlock: [
    {
      kicker: 'SEO OPTIMIZATION',
      title: 'Entwickelt für moderne Sichtbarkeit.',
    },
    {
      kicker: 'AI VISIBILITY',
      title: 'Optimiert für GPT und KI-Suche.',
    },
    {
      kicker: 'PERFORMANCE',
      title: 'Schnell. Modern. Hochwertig.',
    },
  ],
  marquee: [
    'SEO OPTIMIZATION',
    'AI VISIBILITY',
    'PREMIUM WEBDESIGN',
    'MODERNE DIGITALE PRÄSENZ',
    'RESPONSIVE EXPERIENCE',
    'HIGH-END FRONTEND',
    'MINIMAL. MODERN. EFFEKTIV.',
  ],
  projectLabel: 'Website Project',
  projectButton: 'Projekt ansehen',
  projectTags: ['SEO READY', 'AI OPTIMIERT', 'RESPONSIVE'],
  categories: {
    'Immo Tonn': 'Immobilien',
    'TLSG Studio': 'Musikindustrie',
    Pizzeria: 'Restaurant',
    'Massage Studio': 'Wellness & Spa',
    BeautyTime: 'Beautyindustrie',
    Werkstatt: 'Automobilindustrie',
    'Alltagsbegleitung für Senioren': 'Seniorenbegleitung',
  },
  blackSection: {
    kicker: 'In Entwicklung',
    title: 'Neue Premium Projekte',
    description:
      'Weitere moderne Business-Websites, digitale Markenauftritte und exklusive Projekte befinden sich derzeit in Entwicklung.',
    tags: ['Brand Websites', 'SEO Struktur', 'AI Visibility'],
    status: 'Stay Tuned',
  },
  items: [],
};

export default function PortfolioPage() {
  const { lang } = useLanguage();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('home', lang);
        const portfolioData = data?.portfolio || {};

        setPortfolio({
          ...fallbackPortfolioData,
          ...portfolioData,
          topTags: portfolioData.topTags?.length
            ? portfolioData.topTags
            : fallbackPortfolioData.topTags,
          seoBlock: portfolioData.seoBlock?.length
            ? portfolioData.seoBlock
            : fallbackPortfolioData.seoBlock,
          marquee: portfolioData.marquee?.length
            ? portfolioData.marquee
            : fallbackPortfolioData.marquee,
          projectTags: portfolioData.projectTags?.length
            ? portfolioData.projectTags
            : fallbackPortfolioData.projectTags,
          categories:
            portfolioData.categories || fallbackPortfolioData.categories,
          blackSection:
            portfolioData.blackSection || fallbackPortfolioData.blackSection,
          items: portfolioData.items?.length
            ? portfolioData.items
            : fallbackPortfolioData.items,
        });
      } catch {
        setPortfolio(fallbackPortfolioData);
      }
    };

    loadData();
  }, [lang]);

  const content = useMemo(() => portfolio, [portfolio]);

  if (!content) {
    return <main className="min-h-screen bg-[#f8f6f1]" />;
  }

  const isSeniorProject = (title: string) =>
    title.toLowerCase().includes('alltags') ||
    title.toLowerCase().includes('senior');

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f1] text-black">
      {/* HERO */}
      <section className="relative mx-auto max-w-[1700px] px-5 pb-16 pt-[125px] md:px-8 md:pb-24 md:pt-[165px]">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-12 xl:grid-cols-[1.1fr_0.7fr] xl:items-end"
        >
          <div>
            <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.34em] text-neutral-500">
              {content.kicker}
            </p>

            <h1 className="max-w-[1050px] break-words font-tenor text-[54px] leading-[0.95] tracking-[-0.045em] text-black md:text-[90px] xl:text-[126px]">
              {content.title}
            </h1>
          </div>

          <div className="max-w-[640px] xl:pb-4">
            <p className="font-montserrat text-[15px] leading-8 text-neutral-600 md:text-[18px]">
              {content.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4 font-montserrat text-[10px] uppercase tracking-[0.28em] text-neutral-500">
              {content.topTags.map((tag, tagIndex) => (
                <div key={tag} className="flex items-center gap-4">
                  {tagIndex > 0 && (
                    <span className="h-1 w-1 rounded-full bg-neutral-400" />
                  )}
                  <span>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* SEO BLOCK */}
        <div className="mt-20 border-t border-[#e7e2d9] pt-10">
          <div className="grid grid-cols-1 gap-y-12 xl:grid-cols-3 xl:gap-x-16 xl:gap-y-0">
            {content.seoBlock.map(item => (
              <div key={item.kicker} className="min-w-0">
                <p className="break-words font-montserrat text-[10px] uppercase tracking-[0.32em] text-neutral-500">
                  {item.kicker}
                </p>

                <p className="mt-5 hyphens-auto break-words font-tenor text-[30px] leading-[1.08] text-black md:text-[34px] xl:text-[40px]">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="overflow-hidden border-y border-[#e7e2d9] bg-[#f8f6f1] py-5">
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex shrink-0 items-center gap-14 pr-14"
              >
                {content.marquee.map(text => (
                  <span
                    key={text}
                    className="whitespace-nowrap font-montserrat text-[11px] uppercase tracking-[0.34em] text-neutral-500 md:text-[12px]"
                  >
                    {text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="mx-auto max-w-[1700px] px-5 pb-28 pt-16 md:px-8 md:pb-40 md:pt-24">
        <div className="space-y-10 md:space-y-14">
          {content.items.map((item, index) => {
            const seniorProject = isSeniorProject(item.title);

            return (
              <motion.article
                key={`${item.title}-${index}`}
                initial={{ opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.18 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.04,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group overflow-hidden border border-[#e4ddd3] bg-[#fbfaf7] transition duration-500 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_28px_90px_rgba(0,0,0,0.08)]"
              >
                <div className="grid min-w-0 md:min-h-[50vh] xl:grid-cols-[0.58fr_0.42fr]">
                  {/* SCREENSHOT */}
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`relative flex items-center justify-center overflow-hidden bg-[#ede7dd] p-4 md:min-h-[430px] md:p-6 xl:min-h-[520px] ${
                      seniorProject ? 'min-h-[250px]' : 'min-h-[300px]'
                    }`}
                  >
                    <div
                      className={`relative h-full w-full overflow-hidden border border-black/10 bg-[#f8f6f1] shadow-[0_20px_70px_rgba(0,0,0,0.10)] md:min-h-[370px] xl:min-h-[440px] ${
                        seniorProject ? 'min-h-[220px]' : 'min-h-[260px]'
                      }`}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={`${item.title} Premium Website Projekt`}
                          fill
                          priority={index === 0}
                          sizes="(max-width: 1280px) 100vw, 58vw"
                          className="object-contain p-3 transition duration-700 group-hover:scale-[1.025] md:p-5"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="font-montserrat text-[10px] uppercase tracking-[0.32em] text-neutral-500">
                            Coming Soon
                          </span>
                        </div>
                      )}
                    </div>
                  </a>

                  {/* CONTENT */}
                  <div
                    className={`flex min-w-0 flex-col justify-between md:p-9 xl:p-12 ${
                      seniorProject ? 'p-5' : 'p-6'
                    }`}
                  >
                    <div className="min-w-0">
                      <div
                        className={`flex items-start justify-between gap-6 ${
                          seniorProject ? 'mb-6' : 'mb-8'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="break-words font-montserrat text-[10px] uppercase tracking-[0.34em] text-neutral-500">
                            {String(index + 1).padStart(2, '0')} /{' '}
                            {content.categories[item.title] ||
                              content.projectLabel}
                          </p>

                          <p className="mt-3 break-words font-montserrat text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                            {content.projectLabel}
                          </p>
                        </div>

                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${content.projectButton}: ${item.title}`}
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#d9cfbe] transition duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7 17L17 7M17 7H8M17 7V16"
                            />
                          </svg>
                        </a>
                      </div>

                      <h2
                        className={`max-w-full font-tenor leading-[0.95] tracking-[-0.04em] text-black md:text-[70px] xl:text-[84px] ${
                          seniorProject
                            ? 'hyphens-auto text-[36px] [overflow-wrap:anywhere] sm:text-[44px]'
                            : 'break-words text-[44px]'
                        }`}
                      >
                        {item.title}
                      </h2>

                      <p
                        className={`mt-7 max-w-[620px] font-montserrat text-[14px] leading-8 text-neutral-700 md:text-[16px] ${
                          seniorProject
                            ? '[overflow-wrap:anywhere]'
                            : 'break-words'
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-10 min-w-0">
                      <div className="mb-8 flex flex-wrap items-center gap-4 font-montserrat text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                        {content.projectTags.map((tag, tagIndex) => (
                          <div key={tag} className="flex items-center gap-4">
                            {tagIndex > 0 && (
                              <span className="h-1 w-1 rounded-full bg-neutral-400" />
                            )}
                            <span>{tag}</span>
                          </div>
                        ))}
                      </div>

                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-4 font-montserrat text-[11px] uppercase tracking-[0.34em] text-neutral-600 transition duration-300 hover:text-black"
                      >
                        {content.projectButton}
                        <span className="h-px w-12 bg-neutral-400 transition duration-300 group-hover:w-20 group-hover:bg-black" />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* BLACK SECTION */}
      <section className="relative overflow-hidden bg-black py-28 text-white md:py-40">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-48 left-0 h-[420px] w-[420px] rounded-full bg-white/5 blur-[110px]" />

        <div className="relative mx-auto max-w-[1650px] px-5 md:px-8">
          <div className="grid gap-16 xl:grid-cols-[1fr_0.8fr] xl:items-end">
            <div>
              <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.34em] text-white/45">
                {content.blackSection.kicker}
              </p>

              <h2 className="break-words font-tenor text-[58px] leading-[0.9] tracking-[-0.05em] md:text-[118px] xl:text-[138px]">
                {content.blackSection.title}
              </h2>
            </div>

            <div className="flex flex-col justify-end">
              <p className="max-w-[620px] font-montserrat text-[16px] leading-8 text-white/75 md:text-[19px] md:leading-9">
                {content.blackSection.description}
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4 font-montserrat text-[10px] uppercase tracking-[0.28em] text-white/55">
                {content.blackSection.tags.map((tag, tagIndex) => (
                  <div key={tag} className="flex items-center gap-4">
                    {tagIndex > 0 && (
                      <span className="h-1 w-1 rounded-full bg-white/35" />
                    )}
                    <span>{tag}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 flex items-center gap-4">
                <div className="h-2 w-2 rounded-full bg-white" />

                <span className="font-montserrat text-[11px] uppercase tracking-[0.34em] text-white/55">
                  {content.blackSection.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INLINE CSS */}
      <style jsx>{`
        .marquee-wrapper {
          overflow: hidden;
          width: 100%;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 28s linear infinite;
          will-change: transform;
        }

        @keyframes marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          .marquee-track {
            animation-duration: 24s;
          }
        }
      `}</style>
    </main>
  );
}
