'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Check,
  Gem,
  HelpCircle,
  PanelsTopLeft,
  RefreshCcw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
} from 'lucide-react';

import { useQuiz } from '@/components/quiz';
import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';
import fallbackPricesData from '@/data/de/prices.json';

type PriceFactorItem = {
  title: string;
  description: string;
};

type PackageItem = {
  name: string;
  badge: string;
  price: string;
  shortDescription: string;
  idealFor: string;
  features: string[];
  button: string;
};

type SubscriptionItem = {
  name: string;
  price: string;
  setup: string;
  description: string;
  features: string[];
};

type AdditionalServiceItem = {
  name: string;
  price: string;
  description: string;
};

type CareItem = {
  name: string;
  price: string;
  description: string;
  features: string[];
};

type FaqItem = {
  question: string;
  answer: string;
};

type PricesData = {
  hero: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    note: string;
  };
  priceFactors: {
    kicker: string;
    title: string;
    description: string;
    items: PriceFactorItem[];
  };
  packages: {
    kicker: string;
    title: string;
    description: string;
    items: PackageItem[];
  };
  subscription: {
    kicker: string;
    title: string;
    description: string;
    note: string;
    items: SubscriptionItem[];
  };
  redesign: {
    kicker: string;
    title: string;
    description: string;
    price: string;
    features: string[];
    button: string;
  };
  additionalServices: {
    kicker: string;
    title: string;
    description: string;
    items: AdditionalServiceItem[];
  };
  care: {
    kicker: string;
    title: string;
    description: string;
    items: CareItem[];
  };
  faq: {
    kicker: string;
    title: string;
    items: FaqItem[];
  };
  cta: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    note: string;
  };
};

const fallbackData = fallbackPricesData as PricesData;

const heroEase = [0.22, 1, 0.36, 1] as const;

const packageIcons = [PanelsTopLeft, BadgeCheck, Gem, Rocket];
const priceFactorIcons = [Target, Sparkles, ShieldCheck];

function hasPricesData(data: Partial<PricesData>) {
  return Boolean(
    data?.hero &&
      data?.priceFactors &&
      data?.packages &&
      data?.subscription &&
      data?.cta,
  );
}

function SectionTitle({
  kicker,
  title,
  description,
  align = 'center',
}: {
  kicker: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
}) {
  return (
    <div
      className={
        align === 'center'
          ? 'mx-auto max-w-[900px] text-center'
          : 'max-w-[780px]'
      }
    >
      <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
        {kicker}
      </p>

      <h2 className="font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[72px]">
        {title}
      </h2>

      {description && (
        <p className="mt-7 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
          {description}
        </p>
      )}
    </div>
  );
}

function QuizButton({
  children,
  onClick,
  variant = 'dark',
  className = '',
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: 'dark' | 'light' | 'outlineDark';
  className?: string;
}) {
  const variants = {
    dark:
      'border-black bg-black text-white hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]',
    light: 'border-white bg-white text-black hover:-translate-y-[1px]',
    outlineDark:
      'border-black bg-transparent text-black hover:bg-black hover:text-white',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-[56px] items-center justify-center border px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] transition duration-300 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export default function PricesPage() {
  const { lang } = useLanguage();
  const { openQuiz } = useQuiz();
  const [prices, setPrices] = useState<PricesData>(fallbackData);

  useEffect(() => {
    document.title = 'Preise & Pakete | Labrity';

    const description =
      'Transparente Preise für professionelle Websites, Landingpages, Redesigns, Website im Abo und laufende Betreuung.';

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute('content', description);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('prices', lang);

        if (hasPricesData(data)) {
          setPrices(data as PricesData);
          return;
        }

        setPrices(fallbackData);
      } catch {
        setPrices(fallbackData);
      }
    };

    loadData();
  }, [lang]);

  const content = useMemo(() => prices ?? fallbackData, [prices]);

  return (
    <main className="min-h-screen bg-[#f8f6f1]">
      {/* HERO */}
      <section className="px-5 pb-16 pt-[140px] md:px-8 md:pb-20 md:pt-[160px] xl:pb-24 xl:pt-[195px]">
        <div className="mx-auto max-w-[1700px]">
          <div className="grid gap-12 xl:grid-cols-[1.08fr_0.82fr] xl:items-center xl:gap-20">
            <motion.div>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                  ease: heroEase,
                }}
                className="mb-6 font-montserrat text-[12px] font-medium uppercase tracking-[0.38em] text-black/45 md:text-[13px]"
              >
                {content.hero.kicker}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  delay: 0.18,
                  ease: heroEase,
                }}
                className="max-w-[1120px] font-tenor text-[48px] leading-[0.96] tracking-[-0.045em] text-black md:text-[84px] xl:text-[112px]"
              >
                {content.hero.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.32,
                  ease: heroEase,
                }}
                className="mt-8 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[18px]"
              >
                {content.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.45,
                  ease: heroEase,
                }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <QuizButton onClick={openQuiz}>
                  {content.hero.primaryButton}
                </QuizButton>

                <a
                  href="#packages"
                  className="inline-flex min-h-[56px] items-center justify-center border border-black bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px] hover:bg-black hover:text-white"
                >
                  {content.hero.secondaryButton}
                </a>
              </motion.div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.3,
                ease: heroEase,
              }}
              className="border border-[#e7e2d9] bg-white/65 p-7 shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:p-9 xl:-translate-y-4"
            >
              <p className="font-montserrat text-[11px] uppercase tracking-[0.3em] text-neutral-400">
                {content.hero.kicker}
              </p>

              <p className="mt-6 font-tenor text-[42px] leading-[0.95] tracking-[-0.04em] text-black md:text-[58px]">
                {content.hero.note}
              </p>

              <p className="mt-7 font-montserrat text-[15px] leading-8 text-neutral-500">
                {content.hero.description}
              </p>

              <div className="mt-8 grid gap-4 border-t border-[#e7e2d9] pt-6 sm:grid-cols-2">
                <div>
                  <p className="font-tenor text-[34px] leading-none text-black">
                    4
                  </p>
                  <p className="mt-2 font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/45">
                    {content.packages.kicker}
                  </p>
                </div>

                <div>
                  <p className="font-tenor text-[34px] leading-none text-black">
                    24M
                  </p>
                  <p className="mt-2 font-montserrat text-[10px] uppercase tracking-[0.2em] text-black/45">
                    {content.subscription.kicker}
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ORIENTATION */}
      <section className="border-t border-[#e7e2d9] px-5 py-16 md:px-8 md:py-20 xl:py-24">
        <div className="mx-auto grid max-w-[1500px] gap-12 xl:grid-cols-[0.82fr_1.18fr] xl:items-start xl:gap-20">
          <div>
            <SectionTitle
              kicker={content.priceFactors.kicker}
              title={content.priceFactors.title}
              description={content.priceFactors.description}
              align="left"
            />

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#packages"
                className="inline-flex min-h-[54px] items-center justify-center border border-black bg-black px-7 font-montserrat text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px]"
              >
                {content.hero.secondaryButton}
              </a>

              <button
                type="button"
                onClick={openQuiz}
                className="inline-flex min-h-[54px] items-center justify-center border border-black bg-transparent px-7 font-montserrat text-[12px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:bg-black hover:text-white"
              >
                {content.hero.primaryButton}
              </button>
            </div>
          </div>

          <div className="divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
            {content.priceFactors.items.map((item, index) => {
              const Icon = priceFactorIcons[index] || Target;

              return (
                <article
                  key={item.title}
                  className="grid gap-5 py-7 md:grid-cols-[90px_70px_1fr] md:items-start md:gap-7"
                >
                  <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.28em] text-black/30">
                    0{index + 1}
                  </p>

                  <Icon
                    size={38}
                    strokeWidth={1.1}
                    className="text-black/35"
                  />

                  <div>
                    <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black md:text-[38px]">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-[720px] font-montserrat text-[14px] leading-7 text-neutral-500 md:text-[16px]">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section
        id="packages"
        className="border-t border-[#e7e2d9] px-5 py-24 md:px-8 md:py-32"
      >
        <div className="mx-auto max-w-[1700px]">
          <SectionTitle
            kicker={content.packages.kicker}
            title={content.packages.title}
            description={content.packages.description}
          />

          <div className="mt-16 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.packages.items.map((item, index) => {
              const Icon = packageIcons[index] || PanelsTopLeft;
              const isRecommended = Boolean(item.badge);

              return (
                <article
                  key={item.name}
                  className={`relative flex min-h-[660px] flex-col border p-7 transition duration-300 hover:-translate-y-[2px] ${
                    isRecommended
                      ? 'border-black bg-white shadow-[0_24px_70px_rgba(0,0,0,0.09)]'
                      : 'border-[#e7e2d9] bg-white/45 shadow-[0_14px_36px_rgba(0,0,0,0.03)] hover:bg-white/70'
                  }`}
                >
                  {item.badge && (
                    <span className="absolute right-5 top-5 bg-black px-3 py-1.5 font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
                      {item.badge}
                    </span>
                  )}

                  <Icon
                    size={42}
                    strokeWidth={1.1}
                    className="mb-8 text-black/40"
                  />

                  <h3 className="font-tenor text-[34px] leading-[1] tracking-[-0.035em] text-black">
                    {item.name}
                  </h3>

                  <p className="mt-5 font-montserrat text-[14px] leading-7 text-neutral-500">
                    {item.shortDescription}
                  </p>

                  <p className="mt-8 font-tenor text-[40px] leading-none tracking-[-0.04em] text-black">
                    {item.price}
                  </p>

                  <p className="mt-6 border-t border-[#e7e2d9] pt-5 font-montserrat text-[13px] leading-6 text-neutral-500">
                    {item.idealFor}
                  </p>

                  <ul className="mt-7 space-y-3">
                    {item.features.map(feature => (
                      <li
                        key={feature}
                        className="flex gap-3 font-montserrat text-[13px] leading-6 text-neutral-600"
                      >
                        <Check
                          size={16}
                          strokeWidth={1.6}
                          className="mt-1 shrink-0 text-black"
                        />

                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={openQuiz}
                    className={`mt-auto inline-flex min-h-[52px] items-center justify-center border px-6 font-montserrat text-[12px] font-semibold uppercase tracking-[0.08em] transition duration-300 ${
                      isRecommended
                        ? 'border-black bg-black text-white hover:-translate-y-[1px]'
                        : 'border-black bg-transparent text-black hover:bg-black hover:text-white'
                    }`}
                  >
                    {item.button}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* WEBSITE IM ABO */}
      <section className="border-t border-[#e7e2d9] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-12 xl:grid-cols-[0.75fr_1.25fr] xl:gap-20">
          <div>
            <SectionTitle
              kicker={content.subscription.kicker}
              title={content.subscription.title}
              description={content.subscription.description}
              align="left"
            />

            <p className="mt-8 border-l border-black pl-5 font-montserrat text-[13px] leading-7 text-neutral-500">
              {content.subscription.note}
            </p>

            <button
              type="button"
              onClick={openQuiz}
              className="mt-9 inline-flex min-h-[54px] items-center justify-center border border-black bg-black px-7 font-montserrat text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px]"
            >
              {content.hero.primaryButton}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {content.subscription.items.map(item => (
              <article
                key={item.name}
                className="flex min-h-[460px] flex-col border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/75"
              >
                <RefreshCcw
                  size={38}
                  strokeWidth={1.1}
                  className="mb-7 text-black/40"
                />

                <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black">
                  {item.name}
                </h3>

                <p className="mt-6 font-tenor text-[34px] leading-none tracking-[-0.04em] text-black">
                  {item.price}
                </p>

                <p className="mt-3 font-montserrat text-[11px] font-medium uppercase tracking-[0.18em] text-black/35">
                  {item.setup}
                </p>

                <p className="mt-6 font-montserrat text-[14px] leading-7 text-neutral-500">
                  {item.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {item.features.map(feature => (
                    <li
                      key={feature}
                      className="flex gap-3 font-montserrat text-[13px] leading-6 text-neutral-600"
                    >
                      <Check
                        size={16}
                        strokeWidth={1.6}
                        className="mt-1 shrink-0 text-black"
                      />

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REDESIGN */}
      <section className="border-t border-[#e7e2d9] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 border border-[#e7e2d9] bg-white/55 p-7 shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:p-10 xl:grid-cols-[1fr_0.8fr] xl:p-14">
            <div>
              <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                {content.redesign.kicker}
              </p>

              <h2 className="font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[72px]">
                {content.redesign.title}
              </h2>

              <p className="mt-7 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
                {content.redesign.description}
              </p>
            </div>

            <div className="border-t border-[#e7e2d9] pt-8 xl:border-l xl:border-t-0 xl:pl-12 xl:pt-0">
              <p className="font-tenor text-[46px] leading-none tracking-[-0.04em] text-black md:text-[62px]">
                {content.redesign.price}
              </p>

              <ul className="mt-8 space-y-3">
                {content.redesign.features.map(feature => (
                  <li
                    key={feature}
                    className="flex gap-3 font-montserrat text-[14px] leading-7 text-neutral-600"
                  >
                    <Check
                      size={16}
                      strokeWidth={1.6}
                      className="mt-1 shrink-0 text-black"
                    />

                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={openQuiz}
                className="mt-9 inline-flex min-h-[54px] items-center justify-center border border-black bg-black px-7 font-montserrat text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:-translate-y-[1px]"
              >
                {content.redesign.button}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL SERVICES */}
      <section className="border-t border-[#e7e2d9] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            kicker={content.additionalServices.kicker}
            title={content.additionalServices.title}
            description={content.additionalServices.description}
          />

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {content.additionalServices.items.map(item => (
              <article
                key={item.name}
                className="min-h-[230px] border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/75"
              >
                <p className="font-montserrat text-[11px] font-medium uppercase tracking-[0.22em] text-black/35">
                  {item.price}
                </p>

                <h3 className="mt-5 font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black">
                  {item.name}
                </h3>

                <p className="mt-5 font-montserrat text-[14px] leading-7 text-neutral-500">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CARE */}
      <section className="border-t border-[#e7e2d9] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-12 xl:grid-cols-[0.75fr_1.25fr] xl:gap-20">
          <div>
            <SectionTitle
              kicker={content.care.kicker}
              title={content.care.title}
              description={content.care.description}
              align="left"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {content.care.items.map(item => (
              <article
                key={item.name}
                className="flex min-h-[390px] flex-col border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/75"
              >
                <ShieldCheck
                  size={38}
                  strokeWidth={1.1}
                  className="mb-7 text-black/40"
                />

                <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black">
                  {item.name}
                </h3>

                <p className="mt-6 font-tenor text-[34px] leading-none tracking-[-0.04em] text-black">
                  {item.price}
                </p>

                <p className="mt-6 font-montserrat text-[14px] leading-7 text-neutral-500">
                  {item.description}
                </p>

                <ul className="mt-7 space-y-3">
                  {item.features.map(feature => (
                    <li
                      key={feature}
                      className="flex gap-3 font-montserrat text-[13px] leading-6 text-neutral-600"
                    >
                      <Check
                        size={16}
                        strokeWidth={1.6}
                        className="mt-1 shrink-0 text-black"
                      />

                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-[#e7e2d9] px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1300px]">
          <SectionTitle
            kicker={content.faq.kicker}
            title={content.faq.title}
          />

          <div className="mt-14 divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
            {content.faq.items.map(item => (
              <details key={item.question} className="group py-7">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6">
                  <span className="font-tenor text-[28px] leading-[1] tracking-[-0.03em] text-black md:text-[40px]">
                    {item.question}
                  </span>

                  <HelpCircle
                    size={28}
                    strokeWidth={1.1}
                    className="mt-1 shrink-0 text-black/40 transition duration-300 group-open:rotate-45"
                  />
                </summary>

                <p className="mt-5 max-w-[820px] font-montserrat text-[14px] leading-8 text-neutral-500 md:text-[16px]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24 md:px-8 md:py-32">
        <div className="mx-auto max-w-[1500px] bg-[#111111] px-6 py-14 text-center text-white shadow-[0_30px_70px_rgba(0,0,0,0.12)] md:px-10 md:py-20">
          <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-white/40">
            {content.cta.kicker}
          </p>

          <h2 className="mx-auto max-w-[900px] font-tenor text-[42px] leading-[1] tracking-[-0.04em] md:text-[78px]">
            {content.cta.title}
          </h2>

          <p className="mx-auto mt-6 max-w-[680px] font-montserrat text-[15px] leading-8 text-white/70 md:text-[18px]">
            {content.cta.description}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <QuizButton onClick={openQuiz} variant="light">
              {content.cta.primaryButton}
            </QuizButton>

            <Link
              href="/contact"
              className="inline-flex min-h-[56px] items-center justify-center border border-white/40 bg-transparent px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              {content.cta.secondaryButton}
            </Link>
          </div>

          <p className="mx-auto mt-8 max-w-[620px] font-montserrat text-[12px] leading-6 text-white/45">
            {content.cta.note}
          </p>
        </div>
      </section>
    </main>
  );
}
