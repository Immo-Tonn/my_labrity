'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { Preloader } from '@/components/ui';
import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type StatItem = {
  value: string;
  label: string;
  description: string;
};

type ProjectItem = {
  title: string;
  description: string;
  imageVariant: 'first' | 'second';
  href: string;
};

type AudienceItem = {
  title: string;
  description: string;
};

type ProcessPreviewItem = {
  title: string;
};

type HomeData = {
  hero: {
    kicker: string;
    titleFirst: string;
    titleSecond: string;
    description: string;
    tagline: string;
    primaryButton: string;
    secondaryButton: string;
  };
  audience: {
    kicker: string;
    title: string;
    description: string;
    items: AudienceItem[];
  };
  servicesSection: {
    kicker: string;
    title: string;
    description: string;
  };
  stats: {
    kicker: string;
    title: string;
    description: string;
    items: StatItem[];
  };
  processPreview: {
    kicker: string;
    title: string;
    description: string;
    button: string;
    items: ProcessPreviewItem[];
  };
  portfolio: {
    kicker: string;
    title: string;
    description: string;
    button: string;
    items: ProjectItem[];
  };
  cta: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
};

function AnimatedStat({ value }: { value: string }) {
  const [count, setCount] = useState(1);

  useEffect(() => {
    const target = Number(value.match(/\d+/)?.[0] || 1);

    let current = 1;
    let intervalId: number;
    let timeoutId: number;

    const speed = 100;
    const pause = 1800;

    const startCounting = () => {
      intervalId = window.setInterval(() => {
        current += 1;

        if (current >= target) {
          current = target;
          setCount(current);
          window.clearInterval(intervalId);

          timeoutId = window.setTimeout(() => {
            current = 1;
            setCount(current);
            startCounting();
          }, pause);

          return;
        }

        setCount(current);
      }, speed);
    };

    setCount(1);
    startCounting();

    return () => {
      window.clearInterval(intervalId);
      window.clearTimeout(timeoutId);
    };
  }, [value]);

  if (value.includes('%')) return <>{count}%</>;
  if (value.includes('/')) return <>{count}/7</>;
  if (value.includes('°')) return <>{count}°</>;
  if (value.includes('+')) return <>{count}+</>;

  return <>{count}</>;
}

const fallbackHomeData: HomeData = {
  hero: {
    kicker: 'Premium Web Studio',
    titleFirst: 'Websites,',
    titleSecond: 'die verkaufen.',
    description:
      'Wir entwickeln moderne Websites für Unternehmen, Experten und Marken.',
    tagline: 'Minimal. Modern. Effektiv.',
    primaryButton: 'Kontakt',
    secondaryButton: 'Portfolio',
  },

  audience: {
    kicker: 'Für wen wir arbeiten',
    title: 'Für Selbstständige, Unternehmen und Marken mit Anspruch.',
    description:
      'Ob Einzelunternehmer, wachsendes Unternehmen oder etablierte Marke — wir entwickeln Websites für alle, die professioneller, stärker und überzeugender auftreten wollen.',
    items: [
      {
        title: 'Selbstständige',
        description:
          'Für alle, die professionell auftreten und Vertrauen aufbauen wollen.',
      },
      {
        title: 'Unternehmen',
        description:
          'Für Firmen, die klarer, stärker und hochwertiger wahrgenommen werden möchten.',
      },
      {
        title: 'Marken',
        description:
          'Für Brands, die Individualität, Stil und eine starke digitale Präsenz brauchen.',
      },
      {
        title: 'Individuelle Projekte',
        description:
          'Für besondere Konzepte, die mehr brauchen als eine gewöhnliche Website.',
      },
    ],
  },

  servicesSection: {
    kicker: 'Leistungen',
    title: 'Digitale Leistungen für Marken mit Anspruch',
    description:
      'Von starken Landingpages bis zu exklusiven Webauftritten entwickeln wir digitale Lösungen, die Vertrauen schaffen, Wirkung erzeugen und neue Kunden gewinnen.',
  },

  stats: {
    kicker: 'Digitale Stärke',
    title: 'Sichtbarkeit, Vertrauen und Wachstum — in einem System',
    description:
      'Wir entwickeln Websites, bei denen individuelles Design, permanente Online-Verfügbarkeit und eine ganzheitliche Struktur gemeinsam für eine starke digitale Präsenz arbeiten.',
    items: [
      {
        value: '100%',
        label: 'Individuelles Design',
        description:
          'Jede Website wird passend zu Business, Zielgruppe und Positionierung entwickelt — ohne generische Templates.',
      },
      {
        value: '24/7',
        label: 'Online-Verfügbarkeit',
        description:
          'Ihre Website arbeitet dauerhaft für Ihr Unternehmen und hilft Kunden, Sie jederzeit online zu finden.',
      },
      {
        value: '360°',
        label: 'Ganzheitlicher Ansatz',
        description:
          'Struktur, Design, Vertrauen, SEO und Nutzerführung werden als ein zusammenhängendes System gedacht.',
      },
    ],
  },

  processPreview: {
    kicker: 'Ablauf',
    title: 'Ein klarer Prozess für ein starkes Ergebnis.',
    description:
      'Wir führen Ihr Projekt Schritt für Schritt — von der ersten Idee über Struktur und Design bis zum fertigen digitalen Auftritt.',
    button: 'Ablauf ansehen',
    items: [
      { title: 'Analyse' },
      { title: 'Struktur' },
      { title: 'Design' },
      { title: 'Entwicklung' },
      { title: 'Launch' },
    ],
  },

  portfolio: {
    kicker: 'Portfolio',
    title: 'Entdecken Sie unsere Arbeiten',
    description:
      'Ausgewählte Projekte, die zeigen, wie wir Ästhetik, Strategie und Performance zu einer digitalen Präsenz auf Premium-Niveau verbinden.',
    button: 'Portfolio ansehen',
    items: [
      {
        title: 'Immo Tonn',
        description:
          'Hochwertige Immobilien-Website mit klarem Aufbau, professioneller Objektpräsentation und starkem Vertrauenseffekt für Kauf und Verkauf.',
        imageVariant: 'first',
        href: 'https://immo-tonn.de/',
      },
      {
        title: 'TLSG Studio',
        description:
          'Moderner digitaler Auftritt für ein Musik- und Sounddesign-Studio mit Fokus auf Markenwirkung, Klarheit und kreativer Identität.',
        imageVariant: 'second',
        href: 'https://tlsglabel.com/',
      },
      {
        title: 'Massage Studio',
        description:
          'Beruhigende Website für ein Massage-Angebot mit klarer Nutzerführung, eleganter Service-Präsentation und vertrauensvoller Buchungsstruktur.',
        imageVariant: 'first',
        href: 'https://massage-landing-swart.vercel.app/#services',
      },
      {
        title: 'BeautyTime',
        description:
          'Eleganter Online-Auftritt für einen Beauty-Salon mit Premium-Look, klarer Angebotsstruktur und starker lokaler Wirkung.',
        imageVariant: 'second',
        href: 'https://beautylanding1.vercel.app/ru/index.html',
      },
    ],
  },

  cta: {
    kicker: 'Starten wir',
    title: 'Bereit, gemeinsam etwas Starkes aufzubauen?',
    description:
      'Wir entwickeln Websites, die hochwertig aussehen, Vertrauen schaffen und Ihr Unternehmen digital klar positionieren.',
    primaryButton: 'Projekt starten',
    secondaryButton: 'Individuelles Angebot',
  },
};

export default function Home() {
  const { lang } = useLanguage();
  const [home, setHome] = useState<HomeData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('home', lang);

        setHome({
          ...fallbackHomeData,
          ...data,

          hero: {
            ...fallbackHomeData.hero,
            ...(data?.hero || {}),
          },

          audience: {
            ...fallbackHomeData.audience,
            ...(data?.audience || {}),
            items: data?.audience?.items?.length
              ? data.audience.items
              : fallbackHomeData.audience.items,
          },

          servicesSection: {
            ...fallbackHomeData.servicesSection,
            ...(data?.servicesSection || {}),
          },

          stats: {
            ...fallbackHomeData.stats,
            ...(data?.stats || {}),
            items: data?.stats?.items?.length
              ? data.stats.items
              : fallbackHomeData.stats.items,
          },

          processPreview: {
            ...fallbackHomeData.processPreview,
            ...(data?.processPreview || {}),
            items: data?.processPreview?.items?.length
              ? data.processPreview.items
              : fallbackHomeData.processPreview.items,
          },

          portfolio: {
            ...fallbackHomeData.portfolio,
            ...(data?.portfolio || {}),
            items: data?.portfolio?.items?.length
              ? data.portfolio.items
              : fallbackHomeData.portfolio.items,
          },

          cta: {
            ...fallbackHomeData.cta,
            ...(data?.cta || {}),
          },
        });
      } catch {
        setHome(fallbackHomeData);
      }
    };

    loadData();
  }, [lang]);

  const content = useMemo(() => home ?? fallbackHomeData, [home]);

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash) return;

    const timer = setTimeout(() => {
      const element = document.querySelector(hash);

      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });

        window.history.replaceState(null, '', window.location.pathname);
      }
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Preloader />

      <main className="min-h-screen bg-[#f8f6f1]">
        <div className="container">
          {/* HERO */}
          <section className="flex min-h-[calc(100vh-100px)] flex-col pb-[60px] pt-[150px] md:min-h-[calc(100vh-120px)] md:pb-[80px] md:pt-[165px] xl:min-h-screen xl:pb-[110px] xl:pt-[210px]">
            <div className="flex flex-1 flex-col gap-16 xl:flex-row xl:items-center xl:justify-between">
              <div className="w-full max-w-[700px]">
                <p className="mb-6 font-montserrat text-[11px] uppercase tracking-[0.34em] text-neutral-400 md:text-xs">
                  {content.hero.kicker}
                </p>

                <h1
                  className={`font-tenor leading-[0.96] text-black ${
                    lang === 'ru' || lang === 'ua'
                      ? 'text-[42px] md:text-[62px] xl:text-[88px]'
                      : 'text-[48px] md:text-[72px] xl:text-[108px]'
                  }`}
                >
                  {content.hero.titleFirst}
                  <br />
                  {content.hero.titleSecond}
                </h1>

                <p className="mt-7 max-w-[520px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:mt-9 xl:text-lg">
                  {content.hero.description}
                </p>

                <p className="mt-4 font-montserrat text-[12px] uppercase tracking-[0.28em] text-neutral-400 md:text-[13px]">
                  {content.hero.tagline}
                </p>

                <div className="mt-10 flex flex-wrap gap-4 md:mt-12">
                  <Link
                    href="/contact"
                    className="inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                  >
                    {content.hero.primaryButton}
                  </Link>

                  <Link
                    href="/portfolio"
                    className="inline-flex min-h-[56px] items-center justify-center border border-black bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px] hover:bg-black hover:text-white"
                  >
                    {content.hero.secondaryButton}
                  </Link>
                </div>
              </div>

              {/* HERO IMAGE */}
              <div className="2xl:min-w-[950px] 2xl:max-w-[1300px] relative mx-auto w-full xl:mx-0 xl:w-[52vw] xl:min-w-[680px] xl:max-w-[900px]">
                <div className="2xl:-translate-y-[70px] relative w-full -translate-y-[20px] xl:-translate-y-[55px]">
                  <Image
                    src="/images/hero/hero-devices.png"
                    alt="Modern responsive website design"
                    width={886}
                    height={670}
                    priority
                    className="h-auto w-full object-contain drop-shadow-[0_28px_60px_rgba(0,0,0,0.10)]"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* AUDIENCE */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[140px]">
            <div className="mx-auto max-w-[980px]">
              <div className="mx-auto max-w-[860px] text-center">
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                  {content.audience.kicker}
                </p>

                <h2 className="font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[78px]">
                  {content.audience.title}
                </h2>

                <p className="mx-auto mt-6 max-w-[760px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
                  {content.audience.description}
                </p>
              </div>

              <div className="mt-14 grid gap-4 md:mt-16 md:grid-cols-2 xl:mt-20 xl:grid-cols-4">
                {content.audience.items.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex min-h-[220px] flex-col justify-between border border-[#e7e2d9] bg-white px-4 py-8 text-center shadow-[0_10px_28px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_18px_40px_rgba(0,0,0,0.05)] md:min-h-[230px] xl:min-h-[240px]"
                  >
                    <div className="flex min-h-[64px] items-center justify-center md:min-h-[68px] xl:min-h-[72px]">
                      <h3
                        className={`text-center font-tenor text-[22px] leading-[1.02] text-black md:text-[24px] xl:text-[26px] ${
                          index === 3
                            ? 'mx-auto whitespace-normal xl:max-w-[165px]'
                            : 'whitespace-nowrap'
                        }`}
                      >
                        {item.title}
                      </h3>
                    </div>

                    <p className="mt-4 text-center font-montserrat text-sm leading-6 text-neutral-600">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* STATS */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[150px]">
            <div className="mx-auto max-w-[760px] text-center">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                {content.stats.kicker}
              </p>

              <h2 className="font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[78px]">
                {content.stats.title}
              </h2>

              <p className="mt-5 font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
                {content.stats.description}
              </p>
            </div>

            <div className="mt-14 grid gap-6 border-t border-[#e7e2d9] pt-10 md:mt-16 md:grid-cols-3 md:gap-6 md:pt-12 xl:mt-20 xl:gap-8 xl:pt-14">
              {content.stats.items.map((item, index) => (
                <div
                  key={`${item.value}-${index}`}
                  className="px-4 py-6 text-center"
                >
                  <p className="font-tenor text-[56px] leading-none text-black md:text-[72px] xl:text-[96px]">
                    <AnimatedStat value={item.value} />
                  </p>

                  <p className="mt-4 font-montserrat text-sm font-medium text-black md:text-base">
                    {item.label}
                  </p>

                  <p className="mt-2 font-montserrat text-sm leading-6 text-neutral-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* PROCESS PREVIEW */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[140px]">
            <div className="grid gap-12 xl:grid-cols-[0.85fr_1.15fr] xl:items-end xl:gap-20">
              <div>
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                  {content.processPreview.kicker}
                </p>

                <h2 className="font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[78px]">
                  {content.processPreview.title}
                </h2>

                <p className="mt-6 max-w-[620px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
                  {content.processPreview.description}
                </p>

                <Link
                  href="/process"
                  className="mt-9 inline-flex min-h-[56px] items-center justify-center border border-black bg-black px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]"
                >
                  {content.processPreview.button}
                </Link>
              </div>

              <div className="border-y border-[#e7e2d9]">
                {content.processPreview.items.map((item, index) => (
                  <div
                    key={`${item.title}-${index}`}
                    className="flex items-center justify-between border-b border-[#e7e2d9] py-5 last:border-b-0"
                  >
                    <div className="flex items-center gap-5">
                      <span className="font-tenor text-[34px] leading-none text-black/20 md:text-[46px]">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <span className="font-montserrat text-[12px] font-medium uppercase tracking-[0.24em] text-black">
                        {item.title}
                      </span>
                    </div>

                    <span className="h-px w-10 bg-black/20" />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-[90px] md:py-[110px] xl:py-[150px]">
            <div className="bg-[#111111] px-6 py-12 text-center shadow-[0_30px_70px_rgba(0,0,0,0.12)] transition duration-500 hover:shadow-[0_38px_80px_rgba(0,0,0,0.16)] md:px-10 md:py-16 xl:px-16 xl:py-20">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-white/45 md:text-xs">
                {content.cta.kicker}
              </p>

              <h2 className="mx-auto max-w-[820px] font-tenor text-[36px] leading-[1.04] text-white md:text-[52px] xl:text-[76px]">
                {content.cta.title}
              </h2>

              <p className="mx-auto mt-5 max-w-[620px] font-montserrat text-sm leading-7 text-white/70 md:text-base xl:text-lg">
                {content.cta.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:mt-10">
                <Link
                  href="/contact"
                  className="inline-flex min-h-[56px] items-center justify-center border border-white bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px]"
                >
                  {content.cta.primaryButton}
                </Link>

                <Link
                  href="/contact"
                  className="inline-flex min-h-[56px] items-center justify-center border border-white/40 bg-transparent px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  {content.cta.secondaryButton}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
