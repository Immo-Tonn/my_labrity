'use client';

import { type ComponentType, type ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  Check,
  ChevronDown,
  Gem,
  HelpCircle,
  PanelsTopLeft,
  Palette,
  RefreshCcw,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  type LucideProps,
} from 'lucide-react';

import { useQuiz } from '@/components/quiz';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

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
  suitableFor?: string;
  notSuitableFor?: string;
  duration?: string;
  support?: string;
};

type CustomSolution = {
  kicker: string;
  title: string;
  description: string;
  note: string;
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

export type PricesData = {
  meta: {
    title: string;
    description: string;
  };
  ui: {
    suitableFor: string;
    notSuitableFor: string;
    duration: string;
    support: string;
    loading: string;
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
  hero: {
    kicker: string;
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
    note: string;
    stats?: {
      value: string;
      label: string;
    }[];
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
  customSolution?: CustomSolution;
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

const heroEase = [0.22, 1, 0.36, 1] as const;

const packageIcons = [
  Palette,
  PanelsTopLeft,
  BadgeCheck,
  Gem,
  Rocket,
  Sparkles,
];
const priceFactorIcons = [Target, Sparkles, ShieldCheck];

function getSectionClasses(extraClasses = '') {
  return `border-t border-[#e7e2d9] px-5 py-20 md:px-8 md:py-28 ${extraClasses}`;
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

function ActionButton({
  children,
  onClick,
  href,
  variant = 'dark',
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'dark' | 'light' | 'outlineDark' | 'outlineLight';
  className?: string;
}) {
  const variants = {
    dark: 'border-black bg-black text-white hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]',
    light: 'border-white bg-white text-black hover:-translate-y-[1px]',
    outlineDark:
      'border-black bg-transparent text-black hover:bg-black hover:text-white',
    outlineLight:
      'border-white/40 bg-transparent text-white hover:border-white hover:bg-white hover:text-black',
  };

  const classes = `inline-flex min-h-[56px] items-center justify-center border px-8 text-center font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] transition duration-300 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {children}
    </button>
  );
}

function IconBox({
  icon: Icon,
  dark = false,
}: {
  icon: ComponentType<LucideProps>;
  dark?: boolean;
}) {
  return (
    <span
      className={`flex size-12 shrink-0 items-center justify-center border ${
        dark
          ? 'border-white/15 text-white/70'
          : 'border-[#e7e2d9] text-black/40'
      }`}
    >
      <Icon size={24} strokeWidth={1.15} />
    </span>
  );
}
function FeatureList({
  items,
  light = false,
}: {
  items: string[];
  light?: boolean;
}) {
  return (
    <ul className="space-y-3">
      {items.map(feature => (
        <li
          key={feature}
          className={`flex gap-3 font-montserrat text-[13px] leading-6 ${
            light ? 'text-white/70' : 'text-neutral-600'
          }`}
        >
          <Check
            size={16}
            strokeWidth={1.6}
            className={`mt-1 shrink-0 ${light ? 'text-white' : 'text-black'}`}
          />

          <span>{feature}</span>
        </li>
      ))}
    </ul>
  );
}

function InfoBlock({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <div>
      <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.22em] text-black/35">
        {label}
      </p>

      <p className="mt-2 font-montserrat text-[13px] leading-6 text-neutral-500">
        {value}
      </p>
    </div>
  );
}

function PackageCard({
  item,
  index,
  ui,
  onClick,
}: {
  item: PackageItem;
  index: number;
  ui: PricesData['ui'];
  onClick: () => void;
}) {
  const Icon = packageIcons[index] || PanelsTopLeft;
  const isRecommended = Boolean(item.badge);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <article
      className={`relative flex h-full min-w-0 flex-col border p-7 transition duration-300 hover:-translate-y-[2px] ${
        isRecommended
          ? 'border-black bg-white shadow-[0_24px_70px_rgba(0,0,0,0.09)]'
          : 'border-[#e7e2d9] bg-white/45 shadow-[0_14px_36px_rgba(0,0,0,0.03)] hover:bg-white/70'
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="flex w-full flex-col text-left md:pointer-events-none"
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <Icon size={42} strokeWidth={1.1} className="text-black/40" />

          {item.badge && (
            <span className="bg-black px-3 py-1.5 font-montserrat text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
              {item.badge}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[420px] break-words font-tenor text-[34px] leading-[1] tracking-[-0.035em] text-black">
            {item.name}
          </h3>

          <ChevronDown
            size={22}
            strokeWidth={1.4}
            className={`mt-2 shrink-0 text-black/40 transition-transform duration-300 md:hidden ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div
        className={`${isOpen ? 'flex flex-1 flex-col' : 'hidden'} md:flex md:flex-1 md:flex-col`}
      >
        <p className="mt-5 font-montserrat text-[14px] leading-7 text-neutral-500">
          {item.shortDescription}
        </p>

        <p className="mt-8 break-words font-tenor text-[40px] leading-none tracking-[-0.04em] text-black">
          {item.price}
        </p>

        <p className="mt-6 border-t border-[#e7e2d9] pt-5 font-montserrat text-[13px] leading-6 text-neutral-500">
          {item.idealFor}
        </p>

        <div className="mt-7">
          <FeatureList items={item.features} />
        </div>

        {(item.suitableFor ||
          item.notSuitableFor ||
          item.duration ||
          item.support) && (
          <div className="mb-5 mt-8 space-y-4 border-t border-[#e7e2d9] pt-6">
            <InfoBlock label={ui.suitableFor} value={item.suitableFor} />
            <InfoBlock label={ui.notSuitableFor} value={item.notSuitableFor} />

            {(item.duration || item.support) && (
              <div className="grid gap-3 pt-1 sm:grid-cols-2">
                <InfoBlock label={ui.duration} value={item.duration} />
                <InfoBlock label={ui.support} value={item.support} />
              </div>
            )}
          </div>
        )}

        <ActionButton
          onClick={onClick}
          variant={isRecommended ? 'dark' : 'outlineDark'}
          className="mt-auto w-full"
        >
          {item.button}
        </ActionButton>
      </div>
    </article>
  );
}

function SubscriptionCard({ item }: { item: SubscriptionItem }) {
  return (
    <article className="flex h-full min-w-0 flex-col border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/75">
      <RefreshCcw size={38} strokeWidth={1.1} className="mb-7 text-black/40" />

      <h3 className="break-words font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black">
        {item.name}
      </h3>

      <p className="2xl:text-[34px] mt-6 break-words font-tenor text-[30px] leading-none tracking-[-0.04em] text-black">
        {item.price}
      </p>

      <p className="mt-3 font-montserrat text-[11px] font-medium uppercase tracking-[0.18em] text-black/35">
        {item.setup}
      </p>

      <p className="mt-6 font-montserrat text-[14px] leading-7 text-neutral-500">
        {item.description}
      </p>

      <div className="mt-7">
        <FeatureList items={item.features} />
      </div>
    </article>
  );
}

function CareCard({ item }: { item: CareItem }) {
  return (
    <article className="flex h-full min-w-0 flex-col border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/75">
      <ShieldCheck size={38} strokeWidth={1.1} className="mb-7 text-black/40" />

      <h3 className="break-words font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black">
        {item.name}
      </h3>

      <p className="2xl:text-[34px] mt-6 break-words font-tenor text-[30px] leading-none tracking-[-0.04em] text-black">
        {item.price}
      </p>

      <p className="mt-6 font-montserrat text-[14px] leading-7 text-neutral-500">
        {item.description}
      </p>

      <div className="mt-7">
        <FeatureList items={item.features} />
      </div>
    </article>
  );
}

function AdditionalServiceCard({ item }: { item: AdditionalServiceItem }) {
  return (
    <article className="min-w-0 border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/75">
      <p className="font-montserrat text-[11px] font-medium uppercase tracking-[0.22em] text-black/35">
        {item.price}
      </p>

      <h3 className="mt-5 break-words font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black">
        {item.name}
      </h3>

      <p className="mt-5 font-montserrat text-[14px] leading-7 text-neutral-500">
        {item.description}
      </p>
    </article>
  );
}

export default function PricesPageClient({
  initialData,
}: {
  initialData: PricesData;
}) {
  const { openQuiz } = useQuiz();
  const content = initialData;

  return (
    <main className="min-h-screen bg-[#f8f6f1] text-black">
      {/* HERO */}
      <section className="md:pb-18 2xl:pb-24 2xl:pt-[195px] px-5 pb-14 pt-[135px] md:px-8 md:pt-[155px] xl:pb-20 xl:pt-[180px]">
        <div className="mx-auto max-w-[1700px]">
          <div className="2xl:grid-cols-[1.08fr_0.82fr] 2xl:items-center 2xl:gap-20 grid gap-12">
            <motion.div>
              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: heroEase }}
                className="mb-6 font-montserrat text-[12px] font-medium uppercase tracking-[0.38em] text-black/45 md:text-[13px]"
              >
                {content.hero.kicker}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.18, ease: heroEase }}
                className="2xl:text-[98px] max-w-[1040px] font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[64px] xl:text-[78px]"
              >
                {content.hero.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.32, ease: heroEase }}
                className="mt-8 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[18px]"
              >
                {content.hero.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.45, ease: heroEase }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <ActionButton onClick={openQuiz}>
                  {content.hero.primaryButton}
                </ActionButton>

                <ActionButton href="#packages" variant="outlineDark">
                  {content.hero.secondaryButton}
                </ActionButton>
              </motion.div>
            </motion.div>

            <motion.aside
              initial={{ opacity: 0, y: 36 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: heroEase }}
              className="2xl:-translate-y-4 border border-[#e7e2d9] bg-white/35 shadow-[0_14px_36px_rgba(0,0,0,0.025)]"
            >
              <div className="px-7 py-8 md:px-9 md:py-10">
                <p className="font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                  {content.hero.kicker}
                </p>

                <p className="mt-7 max-w-[820px] font-tenor text-[38px] leading-[1] tracking-[-0.04em] text-black md:text-[54px]">
                  {content.hero.note}
                </p>
              </div>

              <div className="grid divide-y divide-[#e7e2d9] border-t border-[#e7e2d9] sm:grid-cols-2 sm:divide-x sm:divide-y-0 xl:grid-cols-4">
                {(content.hero.stats ?? []).map(stat => (
                  <div
                    key={`${stat.value}-${stat.label}`}
                    className="px-7 py-7 md:px-9 md:py-9"
                  >
                    <p className="font-tenor text-[38px] leading-none tracking-[-0.04em] text-black">
                      {stat.value}
                    </p>

                    <p className="mt-5 font-montserrat text-[10px] font-medium uppercase tracking-[0.24em] text-black/45">
                      {stat.label}
                    </p>

                    <div className="mt-7 h-px w-20 bg-black/20" />
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>

      {/* ORIENTATION */}
      <section className={getSectionClasses('xl:py-24')}>
        <div className="mx-auto grid max-w-[1500px] gap-12 xl:grid-cols-[0.82fr_1.18fr] xl:items-start xl:gap-20">
          <div>
            <SectionTitle
              kicker={content.priceFactors.kicker}
              title={content.priceFactors.title}
              description={content.priceFactors.description}
              align="left"
            />

            <div className="mt-9 flex flex-wrap gap-4">
              <ActionButton href="#packages">
                {content.hero.secondaryButton}
              </ActionButton>

              <ActionButton onClick={openQuiz} variant="outlineDark">
                {content.hero.primaryButton}
              </ActionButton>
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
                    {String(index + 1).padStart(2, '0')}
                  </p>

                  <Icon size={38} strokeWidth={1.1} className="text-black/35" />

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
      <section id="packages" className={getSectionClasses()}>
        <div className="mx-auto max-w-[1700px]">
          <SectionTitle
            kicker={content.packages.kicker}
            title={content.packages.title}
            description={content.packages.description}
          />

          <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-4 md:auto-rows-fr">
            {content.packages.items.map((item, index) => (
              <PackageCard
                key={item.name}
                item={item}
                index={index}
                ui={content.ui}
                onClick={openQuiz}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CUSTOM SOLUTION */}
      {content.customSolution && (
        <section className={getSectionClasses('py-20 md:py-24')}>
          <div className="mx-auto max-w-[1500px]">
            <div className="grid gap-10 border border-[#e7e2d9] bg-white/55 p-7 shadow-[0_18px_45px_rgba(0,0,0,0.04)] md:p-10 xl:grid-cols-[0.9fr_1.1fr] xl:items-center xl:p-14">
              <div>
                <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                  {content.customSolution.kicker}
                </p>

                <h2 className="font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[68px]">
                  {content.customSolution.title}
                </h2>
              </div>

              <div className="xl:border-l xl:border-[#e7e2d9] xl:pl-12">
                <p className="font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
                  {content.customSolution.description}
                </p>

                <p className="mt-6 border-l border-black pl-5 font-montserrat text-[13px] leading-7 text-neutral-500">
                  {content.customSolution.note}
                </p>

                <ActionButton onClick={openQuiz} className="mt-9">
                  {content.customSolution.button}
                </ActionButton>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* PROJECT CALCULATOR */}
      <section className={getSectionClasses()}>
        <div className="mx-auto max-w-[1500px]">
          <div className="grid overflow-hidden border border-[#e7e2d9] bg-[#f8f6f1] shadow-[0_24px_70px_rgba(0,0,0,0.06)] xl:grid-cols-[0.85fr_1.15fr]">
            <div className="relative overflow-hidden bg-[#111111] px-7 py-10 text-white md:px-10 md:py-14 xl:px-12 xl:py-16">
              <p className="font-tenor text-[24px] uppercase tracking-[-0.03em] text-white">
                LABRITY
              </p>

              <div className="mt-2 h-px w-10 bg-white/35" />

              <div className="mt-12">
                <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-white/35">
                  {content.quizPreview.kicker}
                </p>

                <h2 className="max-w-[560px] font-tenor text-[44px] leading-[0.96] tracking-[-0.05em] text-white md:text-[64px]">
                  {content.quizPreview.leftTitle ?? content.quizPreview.title}
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

              <ActionButton
                onClick={openQuiz}
                className="mt-10 w-full md:w-fit"
              >
                {content.quizPreview.button}
              </ActionButton>
            </div>
          </div>
        </div>
      </section>

      {/* WEBSITE IM ABO */}
      <section className={getSectionClasses()}>
        <div className="mx-auto max-w-[1600px]">
          <div className="2xl:grid-cols-[0.75fr_1.25fr] 2xl:gap-20 grid gap-12">
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

              <ActionButton onClick={openQuiz} className="mt-9">
                {content.hero.primaryButton}
              </ActionButton>
            </div>

            <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
              {content.subscription.items.map(item => (
                <SubscriptionCard key={item.name} item={item} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REDESIGN */}
      <section className={getSectionClasses('py-24 md:py-32')}>
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
              <p className="break-words font-tenor text-[46px] leading-none tracking-[-0.04em] text-black md:text-[62px]">
                {content.redesign.price}
              </p>

              <div className="mt-8">
                <FeatureList items={content.redesign.features} />
              </div>

              <ActionButton onClick={openQuiz} className="mt-9">
                {content.redesign.button}
              </ActionButton>
            </div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL SERVICES */}
      <section className={getSectionClasses('py-24 md:py-32')}>
        <div className="mx-auto max-w-[1500px]">
          <SectionTitle
            kicker={content.additionalServices.kicker}
            title={content.additionalServices.title}
            description={content.additionalServices.description}
          />

          <div className="mt-14 grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
            {content.additionalServices.items.map(item => (
              <AdditionalServiceCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* CARE */}
      <section className={getSectionClasses('py-24 md:py-32')}>
        <div className="2xl:grid-cols-[0.75fr_1.25fr] 2xl:gap-20 mx-auto grid max-w-[1600px] gap-12">
          <div>
            <SectionTitle
              kicker={content.care.kicker}
              title={content.care.title}
              description={content.care.description}
              align="left"
            />
          </div>

          <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
            {content.care.items.map(item => (
              <CareCard key={item.name} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={getSectionClasses('py-24 md:py-32')}>
        <div className="mx-auto max-w-[1300px]">
          <SectionTitle kicker={content.faq.kicker} title={content.faq.title} />

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
            <ActionButton onClick={openQuiz} variant="light">
              {content.cta.primaryButton}
            </ActionButton>

            <LocalizedLink
              href="/contact"
              className="inline-flex min-h-[56px] items-center justify-center border border-white/40 bg-transparent px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              {content.cta.secondaryButton}
            </LocalizedLink>
          </div>

          <p className="mx-auto mt-8 max-w-[620px] font-montserrat text-[12px] leading-6 text-white/45">
            {content.cta.note}
          </p>
        </div>
      </section>
    </main>
  );
}
