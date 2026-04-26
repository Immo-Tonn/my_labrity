'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

import { Preloader } from '@/components/ui';
import { ServicesList } from '@/components/common/ServicesList';
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

    const speed = 100; // скорость счёта
    const pause = 1800; // пауза на финальном числе

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
    title: 'Entwickelt für Sichtbarkeit, Vertrauen und Wachstum',
    description:
      'Wir verbinden Design, Struktur und klare Kommunikation zu einem digitalen Auftritt, der hochwertig wirkt und langfristig unterstützt.',
    items: [
      {
        value: '100%',
        label: 'Custom Design',
        description:
          'Jede Website wird individuell gestaltet — ohne generische Templates.',
      },
      {
        value: '24/7',
        label: 'Digitale Präsenz',
        description:
          'Ihr Unternehmen bleibt online sichtbar, erreichbar und professionell präsent.',
      },
      {
        value: '360°',
        label: 'Ganzheitlicher Blick',
        description:
          'Design, Struktur, Vertrauen und Nutzerführung werden zusammen gedacht.',
      },
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

                <h1 className="font-tenor text-[52px] leading-[0.94] text-black md:text-[78px] xl:text-[124px]">
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
                    href="/#portfolio"
                    className="inline-flex min-h-[56px] items-center justify-center border border-black bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px] hover:bg-black hover:text-white"
                  >
                    {content.hero.secondaryButton}
                  </Link>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[860px] xl:mx-0">
                <div className="relative ml-auto h-[320px] w-full transition duration-500 hover:-translate-y-[2px] md:h-[430px] xl:h-[560px]">
                  <div className="relative h-[88%] w-full rounded-[18px] border border-[#cfc8bd] bg-[#dcd5c9] px-[10px] pt-[10px] shadow-[0_28px_60px_rgba(0,0,0,0.10)] transition duration-500 hover:shadow-[0_34px_70px_rgba(0,0,0,0.14)] md:rounded-[22px] md:px-[12px] md:pt-[12px] xl:rounded-[26px] xl:px-[14px] xl:pt-[14px]">
                    <div className="relative h-full w-full overflow-hidden rounded-[12px] border border-[#e8e1d7] bg-[linear-gradient(180deg,#f7f4ee_0%,#ece4d8_100%)] md:rounded-[16px] xl:rounded-[18px]">
                      <div className="absolute left-0 top-0 h-[34px] w-full border-b border-[#e6dfd5] bg-[rgba(255,255,255,0.45)] md:h-[40px] xl:h-[46px]" />

                      <div className="absolute left-[14px] top-[12px] flex gap-2 md:left-[18px] md:top-[14px] xl:left-[20px] xl:top-[16px]">
                        <span className="h-[6px] w-[6px] rounded-full bg-[#d8d0c2]" />
                        <span className="h-[6px] w-[6px] rounded-full bg-[#ddd5c8]" />
                        <span className="h-[6px] w-[6px] rounded-full bg-[#e4ddd2]" />
                      </div>

                      <div className="grid h-full grid-cols-[1.35fr_0.65fr] gap-3 px-3 pb-3 pt-[46px] md:gap-4 md:px-4 md:pb-4 md:pt-[56px] xl:gap-5 xl:px-5 xl:pb-5 xl:pt-[64px]">
                        <div className="overflow-hidden rounded-[16px] bg-[linear-gradient(135deg,#d8cebf_0%,#f7f2ea_48%,#cabaa3_100%)]" />

                        <div className="flex flex-col gap-3 md:gap-4">
                          <div className="h-[24%] rounded-[14px] bg-[#ebe4d9]" />
                          <div className="h-[14%] rounded-[14px] bg-[#f7f3ed]" />
                          <div className="h-[18%] rounded-[14px] bg-[#e1d9cc]" />
                          <div className="flex-1 rounded-[14px] bg-[#f3eee6]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-1/2 h-[12%] w-[92%] -translate-x-1/2">
                    <div className="h-[70%] w-full rounded-b-[28px] border border-[#d6cfc3] bg-[linear-gradient(180deg,#ddd5c9_0%,#cfc6b8_100%)] shadow-[0_18px_30px_rgba(0,0,0,0.08)]" />
                    <div className="mx-auto mt-[-2px] h-[4px] w-[20%] rounded-b-full bg-[#bbb09f]" />
                  </div>
                </div>

                <div className="absolute -bottom-3 right-[8%] h-[170px] w-[240px] rotate-[-6deg] rounded-[20px] border border-[#cfc8bd] bg-[#e7dfd3] p-[8px] shadow-[0_18px_50px_rgba(0,0,0,0.12)] transition duration-500 hover:-translate-y-[3px] hover:shadow-[0_24px_56px_rgba(0,0,0,0.16)] md:-bottom-5 md:h-[220px] md:w-[310px] md:rounded-[24px] md:p-[10px] xl:-bottom-8 xl:h-[270px] xl:w-[380px] xl:rounded-[28px]">
                  <div className="relative h-full w-full overflow-hidden rounded-[14px] border border-[#e5ddd1] bg-[linear-gradient(180deg,#f7f3ec_0%,#ece5da_100%)] md:rounded-[18px] xl:rounded-[20px]">
                    <div className="grid h-full grid-cols-[1fr_1fr] gap-2 p-3 md:gap-3 md:p-4 xl:gap-4 xl:p-5">
                      <div className="rounded-[12px] bg-[linear-gradient(135deg,#d9cfbf_0%,#f5efe6_100%)]" />
                      <div className="flex flex-col gap-2 md:gap-3">
                        <div className="h-[20%] rounded-[10px] bg-[#e8e0d4]" />
                        <div className="h-[14%] rounded-[10px] bg-[#f7f3ed]" />
                        <div className="flex-1 rounded-[10px] bg-[#dfd6c8]" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 left-3 h-[185px] w-[96px] rotate-[8deg] rounded-[24px] border border-[#d4ccc0] bg-[#ece5da] p-[7px] shadow-[0_18px_45px_rgba(0,0,0,0.14)] transition duration-500 hover:-translate-y-[4px] hover:shadow-[0_22px_55px_rgba(0,0,0,0.18)] md:-bottom-12 md:left-8 md:h-[240px] md:w-[124px] md:rounded-[28px] md:p-[8px] xl:-bottom-14 xl:left-10 xl:h-[300px] xl:w-[152px]">
                  <div className="relative h-full w-full overflow-hidden rounded-[18px] border border-[#e7e0d5] bg-[linear-gradient(180deg,#faf7f2_0%,#ede5d9_100%)]">
                    <div className="absolute left-1/2 top-[8px] h-[4px] w-[34px] -translate-x-1/2 rounded-full bg-[#d3cabd] md:top-[10px] md:w-[42px]" />

                    <div className="flex h-full flex-col gap-2 p-3 pt-5 md:gap-3 md:p-4 md:pt-6">
                      <div className="h-[12%] rounded-[10px] bg-[#e3dacd]" />
                      <div className="h-[42%] rounded-[14px] bg-[linear-gradient(135deg,#d7ccbc_0%,#f5efe5_100%)]" />
                      <div className="h-[10%] rounded-[10px] bg-[#eee7dd]" />
                      <div className="flex-1 rounded-[12px] bg-[#f8f5ef]" />
                    </div>
                  </div>
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

          {/* SERVICES */}
          <section
            id="services"
            className="scroll-mt-[110px] border-t border-[#e7e2d9] py-[90px] md:scroll-mt-[120px] md:py-[110px] xl:scroll-mt-[140px] xl:py-[150px]"
          >
            <div className="mx-auto max-w-[900px] text-center">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400 md:text-xs">
                {content.servicesSection.kicker}
              </p>

              <h2 className="font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[80px]">
                {content.servicesSection.title}
              </h2>

              <p className="mx-auto mt-6 max-w-[760px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
                {content.servicesSection.description}
              </p>

              <div className="mx-auto mt-8 h-px w-[140px] bg-[linear-gradient(90deg,transparent,rgba(24,53,43,0.28),transparent)] md:w-[180px] xl:mt-10 xl:w-[220px]" />
            </div>

            <div className="mt-14 md:mt-16 xl:mt-20">
              <ServicesList />
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
                  className="group border border-transparent px-4 py-6 text-center transition duration-300 hover:border-[#e7e2d9] hover:bg-white/50 hover:shadow-[0_16px_36px_rgba(0,0,0,0.04)]"
                >
                  <p className="font-tenor text-[56px] leading-none text-black transition duration-300 group-hover:-translate-y-[2px] md:text-[72px] xl:text-[96px]">
                    <AnimatedStat value={item.value} />
                  </p>

                  <p className="mt-4 font-montserrat text-sm font-medium text-[#18352b] md:text-base">
                    {item.label}
                  </p>

                  <p className="mt-2 font-montserrat text-sm leading-6 text-neutral-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* PORTFOLIO */}
          <section
            id="portfolio"
            className="scroll-mt-[110px] border-t border-[#e7e2d9] py-[90px] md:scroll-mt-[120px] md:py-[110px] xl:scroll-mt-[140px] xl:py-[150px]"
          >
            <div className="grid gap-12 xl:grid-cols-[0.95fr_1.05fr] xl:items-start xl:gap-16">
              <div>
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                  {content.portfolio.kicker}
                </p>

                <h2 className="max-w-[560px] font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[74px]">
                  {content.portfolio.title}
                </h2>

                <p className="mt-5 max-w-[460px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
                  {content.portfolio.description}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {content.portfolio.items.map((item, index) => (
                  <a
                    key={`${item.title}-${index}`}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block overflow-hidden border border-[#e7e2d9] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-[3px] hover:shadow-[0_24px_52px_rgba(0,0,0,0.08)]"
                  >
                    <div
                      className={`h-[240px] border-b border-[#e7e2d9] transition duration-500 md:h-[260px] xl:h-[300px] ${
                        item.imageVariant === 'second'
                          ? 'bg-[linear-gradient(135deg,#e6ddd0_0%,#faf7f1_50%,#d4c6b3_100%)]'
                          : 'bg-[linear-gradient(135deg,#ddd3c4_0%,#f8f4ec_55%,#cdbda8_100%)]'
                      } group-hover:scale-[1.02]`}
                    />

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="font-tenor text-[28px] leading-none text-black md:text-[32px]">
                          {item.title}
                        </h3>

                        <span className="font-montserrat text-[11px] uppercase tracking-[0.16em] text-[#18352b] transition duration-300 group-hover:translate-x-[2px]">
                          Open
                        </span>
                      </div>

                      <p className="mt-3 font-montserrat text-sm leading-6 text-neutral-600">
                        {item.description}
                      </p>
                    </div>
                  </a>
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
