'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useQuiz } from '@/components/quiz';
import { InnerPhoto } from '@/components/common/InnerPhoto';
import { ServicesList } from '@/components/common/ServicesList';
import type { Service } from '@/components/common/ServicesList/types';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

import ServicesTiles from './ServicesTiles';
import { SpecializedGrid } from './SpecializedGrid';

type ServiceLinkItem = {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
};

export type ServicesPageData = {
  servicesSection: {
    kicker: string;
    title: string;
    description: string;
  };
  services: Service[];
  buttonLabel: string;
  serviceLinks: {
    h1?: string;
    kicker: string;
    title: string;
    description?: string;
    items: ServiceLinkItem[];
  };
  cta: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
  };
};

export default function ServicesPageClient({
  initialData,
}: {
  initialData: ServicesPageData;
}) {
  const { openQuiz } = useQuiz();
  const content = initialData;

  return (
    <main className="swiss min-h-screen bg-[#F7F7F5]/65 pt-[120px] md:pt-[140px] xl:pt-[170px]">
      {/* Without JavaScript the entrance animations never run, so keep every
          element that starts transparent visible. */}
      <noscript>
        <style>{`main [style*=opacity\\:0]{opacity:1!important;transform:none!important}`}</style>
      </noscript>

      <section className="container pb-[90px] md:pb-[110px] xl:pb-[150px]">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto max-w-[900px] text-center lg:mx-0 lg:max-w-none lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mb-4 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400 md:text-xs"
            >
              {content.servicesSection.kicker}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="2xl:text-[72px] font-tenor text-[38px] leading-[1.02] text-black md:text-[56px] lg:text-[48px] xl:text-[64px]"
            >
              {content.serviceLinks.h1 ?? content.servicesSection.title}
            </motion.h1>

            <p className="mt-5 max-w-[760px] font-tenor text-[22px] leading-[1.15] tracking-[-0.02em] text-black/80 md:text-[28px]">
              {content.servicesSection.title}
            </p>

            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-6 max-w-[760px] font-montserrat text-sm leading-7 text-neutral-600 md:text-base lg:mx-0 xl:text-lg"
            >
              {content.servicesSection.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-8 h-px w-[140px] origin-center bg-[#111111] md:w-[180px] lg:mx-0 xl:mt-10 xl:w-[220px]"
            />
          </motion.div>

          <ServicesTiles className="aspect-[5/4] w-full md:aspect-[16/10] lg:aspect-[1/1]" />
        </div>

        <div className="mt-16 md:mt-20 xl:mt-24" style={{ opacity: 1 }}>
          <ServicesList
            services={content.services}
            buttonLabel={content.buttonLabel}
          />
        </div>

        {/* Photo block: two frames in the page's 60/40 rhythm, no text. */}
        <div className="mt-16 grid border border-[#111111] md:mt-20 lg:grid-cols-[3fr_2fr] xl:mt-24">
          <InnerPhoto
            src="/images/inner/concrete-interior-laptop.webp"
            width={1536}
            height={1024}
            sizes="(min-width: 1280px) 730px, (min-width: 1024px) 58vw, 100vw"
            position="42% 55%"
            frame={false}
            hoverZoom
            className="aspect-[3/2] w-full lg:aspect-auto lg:min-h-[540px] lg:border-r lg:border-[#111111]"
          />
          <InnerPhoto
            src="/images/inner/aluminium-frame-red-corner.webp"
            width={1122}
            height={1402}
            sizes="(min-width: 1280px) 490px, (min-width: 1024px) 40vw, 100vw"
            position="50% 38%"
            frame={false}
            hoverZoom
            className="aspect-[4/5] w-full border-t border-[#111111] lg:aspect-auto lg:border-t-0"
          />
        </div>

        {/* NEW: links to the 5 dedicated service pages — added alongside the
            existing content above, never replacing it. */}
        <div className="sw-tint mt-20 border border-[#111] px-6 py-12 md:mt-24 md:px-10 md:py-16 xl:mt-28 xl:px-14 xl:py-20">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.32em] text-neutral-400 md:text-xs">
            {content.serviceLinks.kicker}
          </p>

          <h2 className="max-w-[820px] font-tenor text-[30px] leading-[1.05] text-black md:text-[46px] xl:text-[56px]">
            {content.serviceLinks.title}
          </h2>

          {content.serviceLinks.description && (
            <p className="mt-5 max-w-[680px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.serviceLinks.description}
            </p>
          )}

          <SpecializedGrid items={content.serviceLinks.items} />
        </div>

        {/* FINAL CTA */}
        <div className="mt-20 border border-[#111]/[0.12] bg-[#111111] px-6 py-14 text-center shadow-[0_30px_70px_rgba(0,0,0,0.12)] md:mt-24 md:px-10 md:py-16 xl:mt-28 xl:px-16 xl:py-20">
          <p className="mb-4 font-montserrat text-xs uppercase tracking-[0.28em] text-white/60 md:text-xs">
            {content.cta.kicker}
          </p>

          <h2 className="mx-auto max-w-[820px] font-tenor text-[36px] leading-[1.04] text-white md:text-[52px] xl:text-[72px]">
            {content.cta.title}
          </h2>

          <p className="mx-auto mt-5 max-w-[620px] font-montserrat text-sm leading-7 text-white/70 md:text-base xl:text-lg">
            {content.cta.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:mt-10">
            <button
              type="button"
              onClick={openQuiz}
              className="inline-flex min-h-[56px] items-center justify-center border border-white bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition-colors duration-300 hover:border-[#FF3830] hover:bg-[#FF3830] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {content.cta.primaryButton}
            </button>

            <LocalizedLink
              href="/contact"
              className="inline-flex min-h-[56px] items-center justify-center border border-white/40 bg-transparent px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition-colors duration-300 hover:border-[#FF3830] hover:text-[#FF3830] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              {content.cta.secondaryButton}
            </LocalizedLink>
          </div>
        </div>
      </section>
    </main>
  );
}
