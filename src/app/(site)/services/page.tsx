'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { ServicesList } from '@/components/common/ServicesList';
import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type ServicesPageData = {
  servicesSection: {
    kicker: string;
    title: string;
    description: string;
  };
  cta: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
};

const fallbackServicesData: ServicesPageData = {
  servicesSection: {
    kicker: 'Leistungen',
    title: 'Digitale Leistungen für Marken mit Anspruch',
    description:
      'Von starken Landingpages bis zu exklusiven Webauftritten entwickeln wir digitale Lösungen, die Vertrauen schaffen, Wirkung erzeugen und neue Kunden gewinnen.',
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

export default function ServicesPage() {
  const { lang } = useLanguage();
  const [services, setServices] = useState<ServicesPageData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('home', lang);

        setServices({
          ...fallbackServicesData,

          servicesSection: {
            ...fallbackServicesData.servicesSection,
            ...(data?.servicesSection || {}),
          },

          cta: {
            ...fallbackServicesData.cta,
            ...(data?.cta || {}),
          },
        });
      } catch {
        setServices(fallbackServicesData);
      }
    };

    loadData();
  }, [lang]);

  const content = useMemo(() => services ?? fallbackServicesData, [services]);

  return (
    <main className="min-h-screen bg-[#f8f6f1] pt-[120px] md:pt-[140px] xl:pt-[170px]">
      <section className="container pb-[90px] md:pb-[110px] xl:pb-[150px]">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400 md:text-xs">
            {content.servicesSection.kicker}
          </p>

          <h1 className="font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] xl:text-[80px]">
            {content.servicesSection.title}
          </h1>

          <p className="mx-auto mt-6 max-w-[760px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base xl:text-lg">
            {content.servicesSection.description}
          </p>

          <div className="mx-auto mt-8 h-px w-[140px] bg-[linear-gradient(90deg,transparent,rgba(24,53,43,0.28),transparent)] md:w-[180px] xl:mt-10 xl:w-[220px]" />
        </div>

        <div className="mt-16 md:mt-20 xl:mt-24">
          <ServicesList />
        </div>

        {/* FINAL CTA */}
        <div className="mt-20 border border-[#e7e2d9] bg-[#111111] px-6 py-14 text-center shadow-[0_30px_70px_rgba(0,0,0,0.12)] md:mt-24 md:px-10 md:py-16 xl:mt-28 xl:px-16 xl:py-20">
          <p className="mb-4 font-montserrat text-[11px] uppercase tracking-[0.28em] text-white/45 md:text-xs">
            {content.cta.kicker}
          </p>

          <h2 className="mx-auto max-w-[820px] font-tenor text-[36px] leading-[1.04] text-white md:text-[52px] xl:text-[72px]">
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
    </main>
  );
}
