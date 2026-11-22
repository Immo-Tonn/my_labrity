'use client';

import { type ReactNode, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BadgeCheck,
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
} from 'lucide-react';

import { BackgroundVideo } from '@/components/common/BackgroundVideo';
import { InnerPhoto } from '@/components/common/InnerPhoto';
import { useQuiz } from '@/components/quiz';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

import styles from './Prices.module.css';

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
    h1?: string;
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
  webApps?: {
    kicker: string;
    title: string;
    price: string;
    description: string;
    button: string;
    linkLabel: string;
    href: string;
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

const EASE = [0.22, 1, 0.36, 1] as const;

// Hero background video, shown behind a dimming layer.
const HERO_VIDEO = {
  webm: '/videos/gold-bg.webm',
  mp4: '/videos/gold-bg.mp4',
  poster: '/videos/gold-bg-poster.jpg',
};

const packageIcons = [
  Palette,
  PanelsTopLeft,
  BadgeCheck,
  Gem,
  Rocket,
  Sparkles,
];
const priceFactorIcons = [Target, Sparkles, ShieldCheck];

// A number and its euro sign (either order) never break across lines.
const nb = (text: string) =>
  text.replace(/(\d)\s+€/g, '$1 €').replace(/€\s+(\d)/g, '€ $1');

// Short, staggered entrance from a given side. Without motion (reduced
// motion) the grid simply renders in place.
function useReveal() {
  const reduce = useReducedMotion();

  return (x: number, y: number, delay = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, x, y },
          whileInView: { opacity: 1, x: 0, y: 0 },
          viewport: { once: true, amount: 0.12 },
          transition: { duration: 0.75, delay, ease: EASE },
        };
}

const cx = (...names: (string | false | undefined)[]) =>
  names.filter(Boolean).join(' ');

function getSectionClasses(extraClasses = '') {
  return `border-t border-[#111] px-5 py-16 md:px-8 md:py-24 ${extraClasses}`;
}

function Kicker({ children }: { children: ReactNode }) {
  return <p className={styles.kicker}>{children}</p>;
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
          ? 'mx-auto flex max-w-[900px] flex-col items-center text-center'
          : 'max-w-[780px]'
      }
    >
      <Kicker>{kicker}</Kicker>

      <h2 className="font-tenor text-[40px] leading-[1] tracking-[-0.04em] md:text-[68px]">
        {title}
      </h2>

      {description && (
        <p
          className={`${styles.sub} mt-7 font-montserrat text-[15px] leading-8 md:text-[17px]`}
        >
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
  ghost = false,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  ghost?: boolean;
  className?: string;
}) {
  const classes = cx(
    styles.btn,
    ghost && styles.ghost,
    'font-montserrat',
    className,
  );

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

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className={`${styles.list} font-montserrat`}>
      {items.map(feature => (
        <li key={feature}>
          <span>{nb(feature)}</span>
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
      <p
        className={`${styles.fg} font-montserrat text-xs font-semibold uppercase tracking-[0.22em]`}
      >
        {label}
      </p>

      <p className={`${styles.sub} mt-2 font-montserrat text-[13px] leading-6`}>
        {nb(value)}
      </p>
    </div>
  );
}

function PackageCard({
  item,
  index,
  ui,
  onClick,
  reveal,
}: {
  item: PackageItem;
  index: number;
  ui: PricesData['ui'];
  onClick: () => void;
  reveal: ReturnType<typeof useReveal>;
}) {
  const Icon = packageIcons[index] || PanelsTopLeft;
  const [isOpen, setIsOpen] = useState(false);
  const col = index % 3;
  const side = col === 0 ? -48 : col === 2 ? 48 : 0;

  return (
    <motion.article
      {...reveal(side, side === 0 ? 40 : 0, (index % 3) * 0.08)}
      className={cx(styles.cell, styles.pkg)}
    >
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className={styles.pkgToggle}
      >
        <div className="mb-8 flex items-start justify-between gap-4">
          <Icon size={42} strokeWidth={1.1} className={styles.sub} />

          {item.badge && <span className={styles.badge}>{item.badge}</span>}
        </div>

        <div className="flex items-start justify-between gap-4">
          <h3 className="max-w-[420px] break-words font-tenor text-[32px] leading-[1] tracking-[-0.035em] xl:text-[34px]">
            {item.name}
          </h3>

          <ChevronDown
            size={22}
            strokeWidth={1.4}
            className={`mt-2 shrink-0 transition-transform duration-300 md:hidden ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div
        className={`${isOpen ? 'flex flex-1 flex-col' : 'hidden'} md:flex md:flex-1 md:flex-col`}
      >
        <p
          className={`${styles.sub} mt-5 font-montserrat text-[14px] leading-7`}
        >
          {nb(item.shortDescription)}
        </p>

        <p className="mt-8 break-words font-tenor text-[40px] leading-none tracking-[-0.04em]">
          {nb(item.price)}
        </p>

        <p
          className={`${styles.sub} mt-6 border-t pt-5 font-montserrat text-[13px] leading-6`}
          style={{ borderColor: 'var(--line)' }}
        >
          {nb(item.idealFor)}
        </p>

        <div className="mt-7">
          <FeatureList items={item.features} />
        </div>

        {(item.suitableFor ||
          item.notSuitableFor ||
          item.duration ||
          item.support) && (
          <div
            className="mb-5 mt-8 space-y-4 border-t pt-6"
            style={{ borderColor: 'var(--line)' }}
          >
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
          ghost={index % 2 === 1}
          className="mt-8 w-full"
        >
          {item.button}
        </ActionButton>
      </div>
    </motion.article>
  );
}

export default function PricesPageClient({
  initialData,
  video,
}: {
  initialData: PricesData;
  video: { pauseLabel: string; playLabel: string };
}) {
  const { openQuiz } = useQuiz();
  const content = initialData;
  const reveal = useReveal();

  const sectionWrap = { style: { opacity: 1 } };

  return (
    <main
      className={`${styles.page} swiss min-h-screen overflow-x-clip bg-[#F7F7F5]/65 text-black`}
    >
      {/* HERO — graphite, light text; the optional video sits behind. */}
      <section
        className={cx(
          styles.hero,
          styles.dark,
          'px-5 pb-14 pt-[135px] md:px-8 md:pb-20 md:pt-[160px] xl:pb-24 xl:pt-[185px]',
        )}
      >
        <div className={styles.heroMedia}>
          <BackgroundVideo
            {...HERO_VIDEO}
            pauseLabel={video.pauseLabel}
            playLabel={video.playLabel}
            className="h-full w-full border-0"
            videoClassName="saturate-[0.7]"
            overlayClassName="bg-[#111111]/70"
            controlClassName="right-5 top-24 md:right-8 md:top-28"
          />
        </div>

        <div className="mx-auto max-w-[1700px]">
          <motion.p
            {...reveal(-28, 0, 0.05)}
            className="mb-6 flex items-center gap-3 font-montserrat text-[12px] font-semibold uppercase tracking-[0.38em] text-[#F7F7F5] md:text-[13px]"
          >
            {content.hero.kicker}
          </motion.p>

          <motion.h1
            {...reveal(-48, 0, 0.15)}
            className="2xl:text-[96px] max-w-[1100px] font-tenor text-[40px] leading-[1.02] tracking-[-0.04em] text-[#F7F7F5] md:text-[64px] xl:text-[80px]"
          >
            {content.hero.h1 ?? content.hero.title}
          </motion.h1>

          <motion.p
            {...reveal(48, 0, 0.22)}
            className="mt-6 max-w-[900px] font-tenor text-[22px] leading-[1.15] tracking-[-0.02em] text-[#F7F7F5]/90 md:text-[32px]"
          >
            {content.hero.title}
          </motion.p>

          <motion.p
            {...reveal(48, 0, 0.3)}
            className="mt-8 max-w-[780px] font-montserrat text-[15px] leading-8 text-[#F7F7F5]/90 md:text-[18px]"
          >
            {nb(content.hero.description)}
          </motion.p>

          <motion.div
            {...reveal(0, 28, 0.45)}
            className="mt-10 flex flex-wrap gap-4"
          >
            <ActionButton onClick={openQuiz}>
              {content.hero.primaryButton}
            </ActionButton>

            <ActionButton href="#packages" ghost>
              {content.hero.secondaryButton}
            </ActionButton>
          </motion.div>
        </div>
      </section>

      {/* NOTE + STATS — starts light after the graphite hero */}
      <section className="border-t border-[#111] px-5 py-12 md:px-8 md:py-16">
        <div className="mx-auto max-w-[1700px]" {...sectionWrap}>
          <div className={cx(styles.mosaic, styles.band)}>
            <motion.div
              {...reveal(0, 40)}
              className={cx(styles.cell, styles.light, styles.note)}
            >
              <p className="font-tenor text-[34px] leading-[1.02] tracking-[-0.04em] md:text-[40px] xl:text-[44px]">
                {nb(content.hero.note)}
              </p>
            </motion.div>

            {(content.hero.stats ?? []).map((stat, index) => (
              <motion.div
                key={`${stat.value}-${stat.label}`}
                data-i={index}
                {...reveal(index % 2 === 0 ? -56 : 56, 0, 0.1 + index * 0.1)}
                className={cx(styles.cell, styles.light, styles.stat)}
              >
                <p className="font-tenor text-[44px] leading-none tracking-[-0.04em] md:text-[56px]">
                  {stat.value}
                </p>

                <div>
                  <span
                    aria-hidden="true"
                    className={cx(styles.rule, styles.statLine, 'mb-5')}
                  />
                  <p className="font-montserrat text-xs font-medium uppercase tracking-[0.24em]">
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ORIENTATION — starts graphite, ends light */}
      <section className={getSectionClasses()}>
        <div className="mx-auto max-w-[1500px]" {...sectionWrap}>
          <div
            className={cx(styles.mosaic, styles.split)}
            style={{ '--cols': '0.8fr 1.2fr' } as React.CSSProperties}
          >
            <motion.div
              {...reveal(-48, 0)}
              className={cx(styles.cell, styles.dark, styles.pad)}
            >
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

                <ActionButton onClick={openQuiz} ghost>
                  {content.hero.primaryButton}
                </ActionButton>
              </div>
            </motion.div>

            <div className={styles.mosaic} style={{ border: 0 }}>
              {content.priceFactors.items.map((item, index) => {
                const Icon = priceFactorIcons[index] || Target;

                return (
                  <motion.article
                    key={item.title}
                    {...reveal(48, 0, 0.1 + index * 0.1)}
                    className={cx(
                      styles.cell,
                      styles.factor,
                      index % 2 === 0 ? styles.light : styles.dark,
                    )}
                  >
                    <p className="font-montserrat text-xs font-semibold uppercase tracking-[0.28em]">
                      {String(index + 1).padStart(2, '0')}
                    </p>

                    <Icon
                      size={38}
                      strokeWidth={1.1}
                      className={styles.factorIcon}
                    />

                    <div>
                      <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em] md:text-[38px]">
                        {item.title}
                      </h3>

                      <p
                        className={`${styles.sub} mt-4 max-w-[720px] font-montserrat text-[14px] leading-7 md:text-[16px]`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO — three materials, one per package tier */}
      <section className="border-t border-[#111] px-5 pt-10 md:px-8 md:pt-14">
        <div className="mx-auto max-w-[1700px]">
          <InnerPhoto
            src="/images/inner/prices-material-tiers.webp"
            width={1536}
            height={1024}
            sizes="(min-width: 1700px) 1700px, 92vw"
            position="50% 50%"
            className="aspect-[4/3] w-full md:aspect-[21/9]"
          />
        </div>
      </section>

      {/* PACKAGES — starts graphite, whole card swaps palette on hover */}
      <section id="packages" className={getSectionClasses()}>
        <div className="mx-auto max-w-[1700px]" {...sectionWrap}>
          <SectionTitle
            kicker={content.packages.kicker}
            title={content.packages.title}
            description={content.packages.description}
          />

          <div className={cx(styles.mosaic, styles.pkgGrid, 'mt-14')}>
            {content.packages.items.map((item, index) => (
              <PackageCard
                key={item.name}
                item={item}
                index={index}
                ui={content.ui}
                onClick={openQuiz}
                reveal={reveal}
              />
            ))}
          </div>
        </div>
      </section>

      {/* WEB APPS — graphite | light */}
      {content.webApps && (
        <section className={getSectionClasses()}>
          <div className="mx-auto max-w-[1500px]" {...sectionWrap}>
            <div
              className={cx(styles.mosaic, styles.split)}
              style={{ '--cols': '0.9fr 1.1fr' } as React.CSSProperties}
            >
              <motion.div
                {...reveal(-48, 0)}
                className={cx(styles.cell, styles.dark, styles.pad)}
              >
                <Kicker>{content.webApps.kicker}</Kicker>

                <h2 className="font-tenor text-[38px] leading-[1] tracking-[-0.04em] md:text-[60px]">
                  {content.webApps.title}
                </h2>

                <p className="mt-6 font-tenor text-[26px] md:text-[32px]">
                  {nb(content.webApps.price)}
                </p>
              </motion.div>

              <motion.div
                {...reveal(48, 0, 0.12)}
                className={cx(
                  styles.cell,
                  styles.light,
                  styles.pad,
                  'flex flex-col justify-center',
                )}
              >
                <p
                  className={`${styles.sub} font-montserrat text-[15px] leading-8 md:text-[17px]`}
                >
                  {content.webApps.description}
                </p>

                <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <ActionButton onClick={openQuiz}>
                    {content.webApps.button}
                  </ActionButton>
                  <LocalizedLink
                    href={content.webApps.href}
                    className={`${styles.link} font-montserrat`}
                  >
                    {content.webApps.linkLabel}
                  </LocalizedLink>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* CUSTOM SOLUTION — graphite | light */}
      {content.customSolution && (
        <section className={getSectionClasses()}>
          <div className="mx-auto max-w-[1500px]" {...sectionWrap}>
            <div
              className={cx(styles.mosaic, styles.split)}
              style={{ '--cols': '0.9fr 1.1fr' } as React.CSSProperties}
            >
              <motion.div
                {...reveal(-48, 0)}
                className={cx(styles.cell, styles.dark, styles.pad)}
              >
                <Kicker>{content.customSolution.kicker}</Kicker>

                <h2 className="font-tenor text-[40px] leading-[1] tracking-[-0.04em] md:text-[64px]">
                  {content.customSolution.title}
                </h2>
              </motion.div>

              <motion.div
                {...reveal(48, 0, 0.12)}
                className={cx(
                  styles.cell,
                  styles.light,
                  styles.pad,
                  'flex flex-col justify-center',
                )}
              >
                <p
                  className={`${styles.sub} font-montserrat text-[15px] leading-8 md:text-[17px]`}
                >
                  {content.customSolution.description}
                </p>

                <p
                  className={`${styles.sub} mt-6 border-l-2 border-[#FF3830] pl-5 font-montserrat text-[13px] leading-7`}
                >
                  {nb(content.customSolution.note)}
                </p>

                <div className="mt-9">
                  <ActionButton onClick={openQuiz}>
                    {content.customSolution.button}
                  </ActionButton>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* PROJECT CALCULATOR — graphite | light */}
      <section className={getSectionClasses()}>
        <div className="mx-auto max-w-[1500px]" {...sectionWrap}>
          <div
            className={cx(styles.mosaic, styles.split)}
            style={{ '--cols': '0.85fr 1.15fr' } as React.CSSProperties}
          >
            <motion.div
              {...reveal(-48, 0)}
              className={cx(
                styles.cell,
                styles.dark,
                styles.pad,
                'flex flex-col justify-between',
              )}
            >
              <div>
                <p className="font-tenor text-[24px] uppercase tracking-[-0.03em]">
                  LABRITY
                </p>

                <span
                  aria-hidden="true"
                  className={cx(styles.rule, 'mt-2 w-10')}
                />

                <div className="mt-12">
                  <Kicker>{content.quizPreview.kicker}</Kicker>

                  <h2 className="max-w-[560px] font-tenor text-[42px] leading-[0.96] tracking-[-0.05em] md:text-[60px]">
                    {content.quizPreview.leftTitle ?? content.quizPreview.title}
                  </h2>

                  <p
                    className={`${styles.sub} mt-7 max-w-[560px] font-montserrat text-[15px] leading-8 md:text-[17px]`}
                  >
                    {content.quizPreview.leftDescription ??
                      content.quizPreview.description}
                  </p>
                </div>
              </div>

              <div
                className="mt-12 border-t pt-7"
                style={{ borderColor: 'var(--line)' }}
              >
                <p
                  className={`${styles.sub} font-montserrat text-xs uppercase tracking-[0.26em]`}
                >
                  {content.quizPreview.note}
                </p>
              </div>
            </motion.div>

            <motion.div
              {...reveal(48, 0, 0.12)}
              className={cx(
                styles.cell,
                styles.light,
                styles.pad,
                'flex flex-col justify-between',
              )}
            >
              <div>
                <Kicker>{content.quizPreview.kicker}</Kicker>

                <h3 className="max-w-[760px] font-tenor text-[38px] leading-[1] tracking-[-0.04em] md:text-[60px]">
                  {content.quizPreview.title}
                </h3>

                <p
                  className={`${styles.sub} mt-7 max-w-[720px] font-montserrat text-[15px] leading-8 md:text-[17px]`}
                >
                  {content.quizPreview.description}
                </p>

                <div
                  className="mt-10 divide-y border-y"
                  style={{ borderColor: 'var(--line)' }}
                >
                  {content.quizPreview.steps.map((item, index) => (
                    <div
                      key={item}
                      className="flex items-center justify-between gap-5 py-5"
                      style={{ borderColor: 'var(--line)' }}
                    >
                      <div className="flex items-center gap-5">
                        <span className="font-tenor text-[34px] leading-none opacity-30">
                          {String(index + 1).padStart(2, '0')}
                        </span>

                        <span className="font-montserrat text-[12px] font-medium uppercase tracking-[0.22em]">
                          {item}
                        </span>
                      </div>

                      <span
                        aria-hidden="true"
                        className={cx(styles.rule, 'w-10')}
                      />
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* WEBSITE IM ABO — graphite title, then light / graphite / light */}
      <section className={getSectionClasses()}>
        <div className="mx-auto max-w-[1600px]" {...sectionWrap}>
          <div
            className={cx(styles.mosaic, styles.split)}
            style={{ '--cols': '0.75fr 1.25fr' } as React.CSSProperties}
          >
            <motion.div
              {...reveal(-48, 0)}
              className={cx(styles.cell, styles.dark, styles.pad)}
            >
              <SectionTitle
                kicker={content.subscription.kicker}
                title={content.subscription.title}
                description={content.subscription.description}
                align="left"
              />

              <p
                className={`${styles.sub} mt-8 border-l-2 border-[#FF3830] pl-5 font-montserrat text-[13px] leading-7`}
              >
                {nb(content.subscription.note)}
              </p>

              <div className="mt-9">
                <ActionButton onClick={openQuiz}>
                  {content.hero.primaryButton}
                </ActionButton>
              </div>
            </motion.div>

            <div
              className={cx(styles.mosaic, styles.cards3)}
              style={{ border: 0 }}
            >
              {content.subscription.items.map((item, index) => (
                <motion.article
                  key={item.name}
                  {...reveal(
                    index === 1 ? 0 : 48,
                    index === 1 ? 40 : 0,
                    0.1 + index * 0.1,
                  )}
                  className={cx(styles.cell, styles.card)}
                >
                  <span aria-hidden="true" className={styles.cardDot} />

                  <h3 className="break-words font-tenor text-[28px] leading-[1] tracking-[-0.03em]">
                    {item.name}
                  </h3>

                  <p className="mt-6 break-words font-tenor text-[28px] leading-none tracking-[-0.04em]">
                    {nb(item.price)}
                  </p>

                  <p
                    className={`${styles.sub} mt-3 font-montserrat text-xs font-medium uppercase tracking-[0.18em]`}
                  >
                    {nb(item.setup)}
                  </p>

                  <p
                    className={`${styles.sub} mt-6 font-montserrat text-[14px] leading-7`}
                  >
                    {nb(item.description)}
                  </p>

                  <div className="mt-7">
                    <FeatureList items={item.features} />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* REDESIGN — graphite | light */}
      <section className={getSectionClasses()}>
        <div className="mx-auto max-w-[1500px]" {...sectionWrap}>
          <div
            className={cx(styles.mosaic, styles.split)}
            style={{ '--cols': '1fr 0.8fr' } as React.CSSProperties}
          >
            <motion.div
              {...reveal(-48, 0)}
              className={cx(styles.cell, styles.dark, styles.pad)}
            >
              <Kicker>{content.redesign.kicker}</Kicker>

              <h2 className="font-tenor text-[40px] leading-[1] tracking-[-0.04em] md:text-[68px]">
                {content.redesign.title}
              </h2>

              <p
                className={`${styles.sub} mt-7 max-w-[760px] font-montserrat text-[15px] leading-8 md:text-[17px]`}
              >
                {content.redesign.description}
              </p>
            </motion.div>

            <motion.div
              {...reveal(48, 0, 0.12)}
              className={cx(styles.cell, styles.light, styles.pad)}
            >
              <p className="break-words font-tenor text-[44px] leading-none tracking-[-0.04em] md:text-[60px]">
                {nb(content.redesign.price)}
              </p>

              <div className="mt-8">
                <FeatureList items={content.redesign.features} />
              </div>

              <div className="mt-9">
                <ActionButton onClick={openQuiz}>
                  {content.redesign.button}
                </ActionButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ADDITIONAL SERVICES — checkerboard, starts graphite */}
      <section className={getSectionClasses()}>
        <div className="mx-auto max-w-[1500px]" {...sectionWrap}>
          <SectionTitle
            kicker={content.additionalServices.kicker}
            title={content.additionalServices.title}
            description={content.additionalServices.description}
          />

          <div className={cx(styles.mosaic, styles.addGrid, 'mt-14')}>
            {content.additionalServices.items.map((item, index) => (
              <motion.article
                key={item.name}
                {...reveal(index % 2 === 0 ? -40 : 40, 0, (index % 4) * 0.07)}
                className={cx(styles.cell, styles.add)}
              >
                <p
                  className={`${styles.addPrice} font-montserrat text-xs font-medium uppercase tracking-[0.22em]`}
                >
                  {nb(item.price)}
                </p>

                <h3 className="mt-5 break-words font-tenor text-[28px] leading-[1] tracking-[-0.03em]">
                  {item.name}
                </h3>

                <p
                  className={`${styles.sub} mt-5 font-montserrat text-[14px] leading-7`}
                >
                  {nb(item.description)}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CARE — starts light after the graphite grid */}
      <section className={getSectionClasses()}>
        <div className="mx-auto max-w-[1600px]" {...sectionWrap}>
          <div
            className={cx(styles.mosaic, styles.split)}
            style={{ '--cols': '0.75fr 1.25fr' } as React.CSSProperties}
          >
            <motion.div
              {...reveal(-48, 0)}
              className={cx(styles.cell, styles.light, styles.pad)}
            >
              <SectionTitle
                kicker={content.care.kicker}
                title={content.care.title}
                description={content.care.description}
                align="left"
              />
            </motion.div>

            <div
              className={cx(styles.mosaic, styles.cards3, styles.startDark)}
              style={{ border: 0 }}
            >
              {content.care.items.map((item, index) => (
                <motion.article
                  key={item.name}
                  {...reveal(
                    index === 1 ? 0 : 48,
                    index === 1 ? 40 : 0,
                    0.1 + index * 0.1,
                  )}
                  className={cx(styles.cell, styles.card)}
                >
                  <span aria-hidden="true" className={styles.cardDot} />

                  <h3 className="break-words font-tenor text-[28px] leading-[1] tracking-[-0.03em]">
                    {item.name}
                  </h3>

                  <p className="mt-6 break-words font-tenor text-[28px] leading-none tracking-[-0.04em]">
                    {nb(item.price)}
                  </p>

                  <p
                    className={`${styles.sub} mt-6 font-montserrat text-[14px] leading-7`}
                  >
                    {nb(item.description)}
                  </p>

                  <div className="mt-7">
                    <FeatureList items={item.features} />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className={getSectionClasses('py-20 md:py-28')}>
        <div className="mx-auto max-w-[1300px]" {...sectionWrap}>
          <SectionTitle kicker={content.faq.kicker} title={content.faq.title} />

          <div
            className={`${styles.faq} mt-14 divide-y divide-[#111] border-y border-[#111]`}
          >
            {content.faq.items.map(item => (
              <details key={item.question} className="group py-7">
                <summary className="flex min-h-[44px] cursor-pointer list-none items-start justify-between gap-6">
                  <span className="font-tenor text-[26px] leading-[1] tracking-[-0.03em] text-black md:text-[38px]">
                    {item.question}
                  </span>

                  <HelpCircle
                    size={28}
                    strokeWidth={1.1}
                    className="mt-1 shrink-0 text-black/50 transition duration-300 group-open:rotate-45"
                  />
                </summary>

                <p className="mt-5 max-w-[820px] font-montserrat text-[14px] leading-8 text-neutral-600 md:text-[16px]">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — graphite */}
      <section className="px-5 pb-24 md:px-8 md:pb-32">
        <motion.div
          {...reveal(0, 40)}
          className={cx(
            styles.cell,
            styles.dark,
            'mx-auto max-w-[1500px] border border-[#111] px-6 py-14 text-center md:px-10 md:py-20',
          )}
        >
          <div className="flex flex-col items-center">
            <Kicker>{content.cta.kicker}</Kicker>
          </div>

          <h2 className="mx-auto max-w-[900px] font-tenor text-[40px] leading-[1] tracking-[-0.04em] md:text-[76px]">
            {content.cta.title}
          </h2>

          <p
            className={`${styles.sub} mx-auto mt-6 max-w-[680px] font-montserrat text-[15px] leading-8 md:text-[18px]`}
          >
            {content.cta.description}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <ActionButton onClick={openQuiz}>
              {content.cta.primaryButton}
            </ActionButton>

            <LocalizedLink
              href="/contact"
              className={`${styles.btn} ${styles.ghost} font-montserrat`}
            >
              {content.cta.secondaryButton}
            </LocalizedLink>
          </div>

          <p
            className={`${styles.sub} mx-auto mt-8 max-w-[620px] font-montserrat text-[12px] leading-6`}
          >
            {content.cta.note}
          </p>
        </motion.div>
      </section>
    </main>
  );
}
