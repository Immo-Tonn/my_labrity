'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BadgeCheck, Gem, PanelsTopLeft, Telescope } from 'lucide-react';

import SeasonalSnow from '@/components/SeasonalSnow';
import SeasonalHearts from '@/components/SeasonalHearts';
import { useQuiz } from '@/components/quiz';
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

type FeaturedProjectItem = {
  title: string;
  category: string;
  image: string;
};

type FeaturedProjectsData = {
  kicker: string;
  title: string;
  scrollLabel: string;
  button: string;
  projectButton: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  items: FeaturedProjectItem[];
};

type AudienceItem = {
  title: string;
  description: string;
};

type DifferenceItem = {
  title: string;
  description: string;
  icon: string;
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
  quizPreview: {
    kicker: string;
    title: string;
    description: string;
    leftTitle?: string;
    leftDescription?: string;
    button: string;
    note: string;
    steps: string[];
  };
  featuredProjects: FeaturedProjectsData;
  audience: {
    kicker: string;
    title: string;
    description: string;
    items: AudienceItem[];
  };
  differences: {
    kicker: string;
    title: string;
    description: string;
    items: DifferenceItem[];
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

  quizPreview: {
    kicker: 'Projekt-Kalkulator',
    title: 'Nicht sicher, welche Website zu Ihrem Projekt passt?',
    description:
      'Beantworten Sie ein paar kurze Fragen und erhalten Sie eine klarere Orientierung für Ihr Website-Projekt.',
    leftTitle: 'Finden Sie das passende Website-Paket.',
    leftDescription:
      'Unser kurzer Projekt-Kalkulator hilft Ihnen, den passenden Umfang für Ihr Projekt besser einzuschätzen.',
    button: 'Kalkulator starten',
    note: '3 kurze Schritte. Eine klare Empfehlung.',
    steps: ['Projektart', 'Umfang', 'Empfehlung'],
  },

  featuredProjects: {
    kicker: 'Ausgewählte Projekte',
    title: 'Websites, die Vertrauen schaffen.',
    scrollLabel: 'Scroll',
    button: 'Portfolio ansehen',
    projectButton: 'Portfolio ansehen',
    ctaKicker: 'Nächstes Projekt',
    ctaTitle: 'Das nächste Projekt könnte Ihres sein.',
    ctaDescription:
      'Erzählen Sie uns von Ihrer Idee — wir entwickeln daraus einen starken digitalen Auftritt.',
    ctaButton: 'Kalkulator starten',
    items: [
      {
        title: 'Immo Tonn',
        category: 'Immobilien',
        image: '/images/projects/immo-tonn.png',
      },
      {
        title: 'TLSG Studio',
        category: 'Musikindustrie',
        image: '/images/projects/tlsg.png',
      },
      {
        title: 'Massage Studio',
        category: 'Wellness & Spa',
        image: '/images/projects/massage.png',
      },
      {
        title: 'Pizzeria',
        category: 'Restaurant',
        image: '/images/projects/pizzeria.png',
      },
      {
        title: 'Alltagsbegleitung',
        category: 'Seniorenbegleitung',
        image: '/images/projects/seniorenbegleitung.png',
      },
      {
        title: 'BeautyTime',
        category: 'Beautyindustrie',
        image: '/images/projects/beautytime.png',
      },
      {
        title: 'Werkstatt',
        category: 'Automobilindustrie',
        image: '/images/projects/werk.png',
      },
    ],
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

  differences: {
    kicker: 'WARUM LABRITY?',
    title: 'Starke Websites für starke Marken.',
    description: '',
    items: [
      {
        title: 'Strategisch',
        description: 'Wir denken mit — von der Idee bis zur Conversion.',
        icon: '/images/home-icons/strategy.svg',
      },
      {
        title: 'Minimalistisch',
        description:
          'Klares Design, das sich auf das Wesentliche konzentriert.',
        icon: '/images/home-icons/minimalism.svg',
      },
      {
        title: 'Maßgeschneidert',
        description: 'Jedes Projekt ist einzigartig — wie dein Business.',
        icon: '/images/home-icons/custom.svg',
      },
      {
        title: 'Zuverlässig',
        description: 'Termintreu, transparent und auf Augenhöhe.',
        icon: '/images/home-icons/reliable.svg',
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
        title: 'Alltagsbegleitung für Senioren',
        description:
          'Eine kleine und einfache Landingpage für eine selbstständige Alltagsbegleiterin. Das Projekt zeigt eine schnell realisierbare Website-Lösung für ein kleines Budget — klar, ruhig und auf direkte Kontaktaufnahme ausgerichtet.',
        imageVariant: 'first',
        href: 'https://pflege-landing-1.vercel.app/',
      },
      {
        title: 'BeautyTime',
        description:
          'Eleganter Online-Auftritt für einen Beauty-Salon mit Premium-Look, klarer Angebotsstruktur und starker lokaler Wirkung.',
        imageVariant: 'second',
        href: 'https://beautylanding1.vercel.app/de/index.html',
      },
      {
        title: 'Werkstatt',
        description:
          'Moderner Webauftritt für eine KFZ-Werkstatt mit Fokus auf Vertrauen, klare Kommunikation und professionelle Service-Präsentation.',
        imageVariant: 'second',
        href: 'https://auto-service-landing-five.vercel.app/de',
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

const differenceIcons = [Telescope, PanelsTopLeft, Gem, BadgeCheck];

export default function Home() {
  const { lang } = useLanguage();
  const { openQuiz } = useQuiz();
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

          quizPreview: {
            ...fallbackHomeData.quizPreview,
            ...(data?.quizPreview || {}),
            steps: data?.quizPreview?.steps?.length
              ? data.quizPreview.steps
              : fallbackHomeData.quizPreview.steps,
          },

          featuredProjects: {
            ...fallbackHomeData.featuredProjects,
            ...(data?.featuredProjects || {}),
            items: data?.featuredProjects?.items?.length
              ? data.featuredProjects.items
              : fallbackHomeData.featuredProjects.items,
          },

          audience: {
            ...fallbackHomeData.audience,
            ...(data?.audience || {}),
            items: data?.audience?.items?.length
              ? data.audience.items
              : fallbackHomeData.audience.items,
          },

          differences: {
            ...fallbackHomeData.differences,
            ...(data?.differences || {}),
            items: data?.differences?.items?.length
              ? data.differences.items
              : fallbackHomeData.differences.items,
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

      <SeasonalSnow />

      <SeasonalHearts />

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

          {/* FEATURED PROJECTS */}
          <section className="border-t border-[#e7e2d9] py-[64px] md:py-[82px] xl:py-[96px]">
            <div className="mb-9 flex flex-col gap-6 md:mb-11 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                  {content.featuredProjects.kicker}
                </p>

                <h2 className="max-w-[760px] font-tenor text-[36px] leading-[1.02] text-black md:text-[52px] xl:text-[68px]">
                  {content.featuredProjects.title}
                </h2>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="font-montserrat text-[10px] uppercase tracking-[0.28em] text-neutral-400">
                    {content.featuredProjects.scrollLabel}
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9cfbe] bg-[#f8f6f1] text-neutral-500">
                    →
                  </span>
                </div>

                <Link
                  href="/portfolio"
                  className="hidden w-fit items-center gap-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-600 transition duration-300 hover:text-black md:inline-flex"
                >
                  {content.featuredProjects.button}
                  <span className="h-px w-12 bg-neutral-400 transition duration-300 hover:w-20 hover:bg-black" />
                </Link>
              </div>
            </div>

            <div className="-mx-5 flex snap-x gap-4 overflow-x-auto scroll-smooth px-5 pb-5 md:-mx-8 md:gap-5 md:px-8 xl:mx-0 xl:gap-5 xl:px-0">
              {content.featuredProjects.items.map((project, index) => (
                <Link
                  key={project.title}
                  href="/portfolio"
                  className="group w-[245px] shrink-0 snap-start overflow-hidden border border-[#e7e2d9] bg-white shadow-[0_14px_38px_rgba(0,0,0,0.035)] transition duration-500 hover:-translate-y-1 hover:border-black/20 hover:shadow-[0_22px_58px_rgba(0,0,0,0.075)] sm:w-[270px] md:w-[300px] xl:w-[315px]"
                >
                  <div className="relative bg-[#ede7dd] p-3">
                    <div className="relative aspect-[4/3] overflow-hidden border border-black/10 bg-[#f8f6f1]">
                      <Image
                        src={project.image}
                        alt={`${project.title} Website Projekt`}
                        fill
                        sizes="(max-width: 640px) 245px, (max-width: 768px) 270px, (max-width: 1280px) 300px, 315px"
                        className="object-contain p-2 transition duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                  </div>

                  <div className="px-5 py-5">
                    <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-neutral-400">
                      {String(index + 1).padStart(2, '0')} / {project.category}
                    </p>

                    <h3 className="mt-4 font-tenor text-[27px] leading-none text-black md:text-[30px]">
                      {project.title}
                    </h3>

                    <div className="mt-5 flex items-center gap-4 font-montserrat text-[10px] uppercase tracking-[0.28em] text-neutral-500">
                      <span>{content.featuredProjects.projectButton}</span>
                      <span className="h-px w-9 bg-neutral-400 transition duration-300 group-hover:w-14 group-hover:bg-black" />
                    </div>
                  </div>
                </Link>
              ))}

              <button
                type="button"
                onClick={openQuiz}
                className="group flex min-h-[300px] w-[245px] shrink-0 snap-start flex-col justify-between overflow-hidden bg-black px-5 py-6 text-left text-white shadow-[0_14px_38px_rgba(0,0,0,0.08)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_58px_rgba(0,0,0,0.14)] sm:w-[270px] md:w-[300px] xl:w-[315px]"
              >
                <div>
                  <p className="font-montserrat text-[9px] uppercase tracking-[0.3em] text-white/40">
                    {content.featuredProjects.ctaKicker}
                  </p>

                  <h3 className="mt-6 max-w-[250px] font-tenor text-[32px] leading-[0.95] tracking-[-0.04em] text-white md:text-[36px]">
                    {content.featuredProjects.ctaTitle}
                  </h3>
                </div>

                <div>
                  <p className="max-w-[250px] font-montserrat text-[13px] leading-6 text-white/60">
                    {content.featuredProjects.ctaDescription}
                  </p>

                  <div className="mt-7 flex items-center gap-4 font-montserrat text-[10px] uppercase tracking-[0.28em] text-white/70">
                    <span>{content.featuredProjects.ctaButton}</span>
                    <span className="h-px w-10 bg-white/50 transition duration-300 group-hover:w-16 group-hover:bg-white" />
                  </div>
                </div>
              </button>
            </div>

            <Link
              href="/portfolio"
              className="mt-6 inline-flex w-fit items-center gap-4 font-montserrat text-[11px] font-medium uppercase tracking-[0.3em] text-neutral-600 transition duration-300 hover:text-black md:hidden"
            >
              {content.featuredProjects.button}
              <span className="h-px w-12 bg-neutral-400 transition duration-300 hover:w-20 hover:bg-black" />
            </Link>
          </section>

          {/* AUDIENCE */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[140px]">
            <div className="mx-auto max-w-[1024px]">
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
                            // ? 'mx-auto whitespace-normal xl:max-w-[165px]'
                            // : 'whitespace-nowrap'
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

          {/* PROJECT CALCULATOR */}
          <section className="border-t border-[#e7e2d9] py-[90px] md:py-[110px] xl:py-[130px]">
            <div className="mx-auto max-w-[1500px]">
              <div className="grid overflow-hidden border border-[#e7e2d9] bg-[#f8f6f1] shadow-[0_24px_70px_rgba(0,0,0,0.06)] lg:grid-cols-[1fr_1.1fr]">
                <div className="relative overflow-hidden bg-[#111111] px-7 py-10 text-white md:px-6 md:py-14 xl:px-12 xl:py-16">
                  <p className="font-tenor text-[24px] uppercase tracking-[-0.03em] text-white">
                    LABRITY
                  </p>

                  <div className="mt-2 h-px w-10 bg-white/35" />

                  <div className="mt-12">
                    <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-white/35">
                      {content.quizPreview.kicker}
                    </p>

                    <h2 className="max-w-[560px] font-tenor text-[44px] leading-[0.96] tracking-[-0.05em] text-white md:text-[64px]">
                      {content.quizPreview.leftTitle ??
                        content.quizPreview.title}
                    </h2>

                    <p className="mt-7 max-w-[560px] font-montserrat text-[15px] leading-8 text-white/65 md:text-[17px]">
                      {content.quizPreview.leftDescription ??
                        content.quizPreview.description}
                    </p>
                  </div>

                  <div className="mt-12 border-t border-white/20 pt-7">
                    <p className="font-montserrat text-[11px] uppercase tracking-[0.26em] text-white/35">
                      {content.quizPreview.note}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between px-7 py-10 md:px-10 md:py-14 xl:px-12 xl:py-16">
                  <div>
                    <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                      {content.quizPreview.kicker}
                    </p>

                    <h3 className="max-w-[760px] font-tenor text-[40px] leading-[1] tracking-[-0.04em] text-black md:text-[66px]">
                      {content.quizPreview.title}
                    </h3>

                    <p className="mt-7 max-w-[720px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
                      {content.quizPreview.description}
                    </p>

                    <div className="mt-10 divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
                      {content.quizPreview.steps.map((item, index) => (
                        <div
                          key={item}
                          className="flex items-center justify-between gap-5 py-5"
                        >
                          <div className="flex items-center gap-5">
                            <span className="font-tenor text-[34px] leading-none text-black/20">
                              {String(index + 1).padStart(2, '0')}
                            </span>

                            <span className="font-montserrat text-[12px] font-medium uppercase tracking-[0.22em] text-black/70">
                              {item}
                            </span>
                          </div>

                          <span className="h-px w-10 bg-black/15" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={openQuiz}
                    className="mt-10 inline-flex min-h-[56px] w-full items-center justify-center border border-black bg-black px-8 text-center font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)] md:w-fit"
                  >
                    {content.quizPreview.button}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* DIFFERENCES */}
          <section className="border-t border-[#e7e2d9] py-[88px] md:py-[108px] xl:py-[124px]">
            <div className="mx-auto max-w-[860px] text-center">
              <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-neutral-400 md:text-xs">
                {content.differences.kicker}
              </p>

              <h2 className="font-tenor text-[34px] leading-[1.08] text-black md:text-[52px] xl:text-[62px]">
                {content.differences.title}
              </h2>
            </div>

            <div className="mx-auto mt-14 grid max-w-[1180px] gap-y-14 md:mt-16 md:grid-cols-2 md:gap-x-12 md:gap-y-16 xl:mt-20 xl:grid-cols-4 xl:gap-x-10">
              {content.differences.items.map((item, index) => {
                const Icon = differenceIcons[index] || Gem;

                return (
                  <article
                    key={`${item.title}-${index}`}
                    className="group relative flex min-h-[210px] flex-col items-center overflow-hidden px-4 py-2 text-center transition duration-500 hover:-translate-y-[4px]"
                  >
                    <span className="pointer-events-none absolute top-5 h-24 w-24 rounded-full bg-black/[0.025] opacity-0 blur-2xl transition duration-500 group-hover:opacity-100" />

                    <div className="relative mb-6 flex h-[60px] items-center justify-center">
                      <Icon
                        size={44}
                        strokeWidth={1.15}
                        className="text-black/45 transition duration-500 group-hover:-translate-y-[3px] group-hover:text-black/75"
                      />
                    </div>

                    <h3 className="font-tenor text-[24px] leading-[1.08] text-black md:text-[28px]">
                      {item.title}
                    </h3>

                    <span className="mt-4 h-px w-8 bg-black/20 transition-all duration-500 group-hover:w-14 group-hover:bg-black/45" />

                    <p className="mt-4 max-w-[250px] font-montserrat text-[14px] leading-7 text-neutral-500 transition duration-500 group-hover:text-neutral-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
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

                <button
                  type="button"
                  onClick={openQuiz}
                  className="inline-flex min-h-[56px] items-center justify-center border border-white/40 bg-transparent px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
                >
                  {content.cta.secondaryButton}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
