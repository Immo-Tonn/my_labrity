'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type ProcessCard = {
  title: string;
  description: string;
};

type ProcessData = {
  hero: {
    kicker: string;
    title: string;
    description: string;
  };
  stepsSection: {
    kicker: string;
    title: string;
    description: string;
    items: ProcessStep[];
  };
  clientSection: {
    kicker: string;
    title: string;
    description: string;
    items: ProcessCard[];
  };
  resultSection: {
    kicker: string;
    title: string;
    description: string;
    items: ProcessCard[];
  };
  calmSection: {
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

const fallbackProcessData: ProcessData = {
  hero: {
    kicker: 'Ablauf',
    title: 'Von der ersten Idee bis zum fertigen digitalen Auftritt.',
    description:
      'Wir begleiten Ihr Projekt Schritt für Schritt — mit klarer Struktur, modernem Design und einem Prozess, der verständlich bleibt.',
  },
  stepsSection: {
    kicker: 'Unser Prozess',
    title: 'Ein klarer Ablauf für ein starkes Ergebnis.',
    description:
      'Ein gutes Website-Projekt entsteht nicht zufällig. Es braucht Analyse, Struktur, Design, Entwicklung und einen sauberen Launch.',
    items: [
      {
        number: '01',
        title: 'Projektanalyse',
        description:
          'Wir verstehen Ihr Business, Ihre Zielgruppe, Ihre Ziele und die gewünschte Wirkung Ihrer Website.',
      },
      {
        number: '02',
        title: 'Struktur & Strategie',
        description:
          'Wir planen Seiten, Inhalte, Nutzerführung und eine saubere SEO-Basis.',
      },
      {
        number: '03',
        title: 'Designrichtung',
        description:
          'Wir entwickeln eine visuelle Richtung mit Stil, Klarheit und hochwertiger Wirkung.',
      },
      {
        number: '04',
        title: 'Entwicklung',
        description:
          'Wir setzen die Website modern, responsive und performant um.',
      },
      {
        number: '05',
        title: 'Launch & Feinschliff',
        description:
          'Wir prüfen Details, optimieren Darstellung und bereiten die Website für die Veröffentlichung vor.',
      },
    ],
  },
  clientSection: {
    kicker: 'Vorbereitung',
    title: 'Was wir von Ihnen brauchen.',
    description:
      'Sie müssen nicht alles perfekt vorbereitet haben. Für den Start reichen oft eine kurze Beschreibung Ihres Unternehmens, Beispiele, die Ihnen gefallen, und vorhandene Materialien.',
    items: [
      {
        title: 'Ihre Idee',
        description:
          'Eine kurze Beschreibung Ihres Unternehmens, Ihrer Ziele und der gewünschten Wirkung reicht für den Anfang.',
      },
      {
        title: 'Beispiele',
        description:
          'Websites, Farben oder Stile, die Ihnen gefallen, helfen uns, die richtige Richtung schneller zu verstehen.',
      },
      {
        title: 'Materialien',
        description:
          'Texte, Bilder, Logo oder Inhalte können Sie bereitstellen — falls etwas fehlt, helfen wir bei Struktur und Formulierung.',
      },
    ],
  },
  resultSection: {
    kicker: 'Ergebnis',
    title: 'Was Sie am Ende erhalten.',
    description:
      'Am Ende entsteht eine Website, die nicht nur gut aussieht, sondern klar strukturiert ist, Vertrauen aufbaut und Ihr Unternehmen professionell präsentiert.',
    items: [
      {
        title: 'Responsive Website',
        description:
          'Ihre Website funktioniert sauber auf Smartphone, Tablet und Desktop.',
      },
      {
        title: 'Klare Struktur',
        description:
          'Besucher verstehen schnell, wer Sie sind, was Sie anbieten und wie sie Kontakt aufnehmen können.',
      },
      {
        title: 'Premium Design',
        description:
          'Ein hochwertiger visueller Auftritt stärkt Vertrauen und Markenwahrnehmung.',
      },
      {
        title: 'SEO Basis',
        description:
          'Die Website erhält eine saubere technische und inhaltliche Grundlage für bessere Sichtbarkeit.',
      },
    ],
  },
  calmSection: {
    kicker: 'Keine Zufälle',
    title: 'Kein Chaos. Kein Rätselraten.',
    description:
      'Ein gutes Website-Projekt braucht nicht nur Design, sondern einen klaren Ablauf. Deshalb arbeiten wir Schritt für Schritt, damit Entscheidungen verständlich bleiben und das Ergebnis gezielt entsteht.',
  },
  cta: {
    kicker: 'Nächster Schritt',
    title: 'Bereit, Ihr Projekt zu starten?',
    description:
      'Erzählen Sie uns kurz von Ihrem Projekt — wir prüfen, welche Website-Lösung zu Ihrem Ziel passt.',
    primaryButton: 'Projekt starten',
    secondaryButton: 'Kontakt aufnehmen',
  },
};

export default function ProcessPageClient() {
  const { lang } = useLanguage();
  const [processData, setProcessData] = useState<ProcessData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('process', lang);

        setProcessData({
          ...fallbackProcessData,
          ...data,

          hero: {
            ...fallbackProcessData.hero,
            ...(data?.hero || {}),
          },

          stepsSection: {
            ...fallbackProcessData.stepsSection,
            ...(data?.stepsSection || {}),
            items: data?.stepsSection?.items?.length
              ? data.stepsSection.items
              : fallbackProcessData.stepsSection.items,
          },

          clientSection: {
            ...fallbackProcessData.clientSection,
            ...(data?.clientSection || {}),
            items: data?.clientSection?.items?.length
              ? data.clientSection.items
              : fallbackProcessData.clientSection.items,
          },

          resultSection: {
            ...fallbackProcessData.resultSection,
            ...(data?.resultSection || {}),
            items: data?.resultSection?.items?.length
              ? data.resultSection.items
              : fallbackProcessData.resultSection.items,
          },

          calmSection: {
            ...fallbackProcessData.calmSection,
            ...(data?.calmSection || {}),
          },

          cta: {
            ...fallbackProcessData.cta,
            ...(data?.cta || {}),
          },
        });
      } catch {
        setProcessData(fallbackProcessData);
      }
    };

    loadData();
  }, [lang]);

  const content = useMemo(
    () => processData ?? fallbackProcessData,
    [processData],
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f6f1] text-black">
      {/* HERO */}
      <section className="mx-auto max-w-[1700px] px-5 pb-16 pt-[130px] md:px-8 md:pb-24 md:pt-[170px]">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-[1180px]"
        >
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
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
              ease: [0.22, 1, 0.36, 1],
            }}
            className="font-tenor text-[48px] leading-[0.96] tracking-[-0.045em] text-black md:text-[84px] xl:text-[118px]"
          >
            {content.hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-8 max-w-[760px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[18px]"
          >
            {content.hero.description}
          </motion.p>
        </motion.div>

        {/* PROCESS LINE */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-16 border-y border-[#e7e2d9] py-6 md:mt-20"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {content.stepsSection.items.map((item, index) => (
              <div
                key={`${item.number}-${item.title}`}
                className="flex items-center gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.28em] text-black/35">
                    {item.number}
                  </span>

                  <span className="font-montserrat text-[11px] font-medium uppercase tracking-[0.22em] text-black/70">
                    {item.title}
                  </span>
                </div>

                {index < content.stepsSection.items.length - 1 && (
                  <span className="hidden h-px w-10 bg-black/15 md:block" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* STEPS */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1700px] px-5 md:px-8">
          <div className="grid gap-12 xl:grid-cols-[0.8fr_1.2fr] xl:gap-20">
            <div>
              <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                {content.stepsSection.kicker}
              </p>

              <h2 className="font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[72px]">
                {content.stepsSection.title}
              </h2>

              <p className="mt-7 max-w-[560px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
                {content.stepsSection.description}
              </p>
            </div>

            <div className="divide-y divide-[#e7e2d9] border-y border-[#e7e2d9]">
              {content.stepsSection.items.map(item => (
                <div
                  key={`${item.number}-${item.title}`}
                  className="grid gap-5 py-8 md:grid-cols-[110px_1fr] md:gap-8"
                >
                  <p className="font-tenor text-[46px] leading-none text-black/20 md:text-[64px]">
                    {item.number}
                  </p>

                  <div>
                    <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black md:text-[42px]">
                      {item.title}
                    </h3>

                    <p className="mt-4 max-w-[720px] font-montserrat text-[14px] leading-7 text-neutral-500 md:text-[16px]">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT NEEDS */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="mx-auto max-w-[860px] text-center">
            <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
              {content.clientSection.kicker}
            </p>

            <h2 className="font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[72px]">
              {content.clientSection.title}
            </h2>

            <p className="mt-7 font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
              {content.clientSection.description}
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-3">
            {content.clientSection.items.map(item => (
              <div
                key={item.title}
                className="border border-[#e7e2d9] bg-white/45 p-7 shadow-[0_14px_36px_rgba(0,0,0,0.03)] transition duration-300 hover:-translate-y-[2px] hover:bg-white/70 hover:shadow-[0_20px_48px_rgba(0,0,0,0.05)]"
              >
                <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black">
                  {item.title}
                </h3>

                <p className="mt-5 font-montserrat text-[14px] leading-7 text-neutral-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CALM SECTION */}
      <section className="bg-black py-24 text-white md:py-32">
        <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:px-8 xl:grid-cols-[1fr_0.9fr] xl:gap-20">
          <div>
            <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-white/35">
              {content.calmSection.kicker}
            </p>

            <h2 className="font-tenor text-[54px] leading-[0.9] tracking-[-0.05em] md:text-[110px]">
              {content.calmSection.title}
            </h2>
          </div>

          <div className="flex items-end">
            <p className="max-w-[620px] font-montserrat text-[16px] leading-9 text-white/70 md:text-[19px]">
              {content.calmSection.description}
            </p>
          </div>
        </div>
      </section>

      {/* RESULT */}
      <section className="border-t border-[#e7e2d9] py-24 md:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8">
          <div className="grid gap-12 xl:grid-cols-[0.8fr_1.2fr] xl:gap-20">
            <div>
              <p className="mb-5 font-montserrat text-[11px] uppercase tracking-[0.32em] text-neutral-400">
                {content.resultSection.kicker}
              </p>

              <h2 className="font-tenor text-[42px] leading-[1] tracking-[-0.04em] text-black md:text-[72px]">
                {content.resultSection.title}
              </h2>

              <p className="mt-7 max-w-[560px] font-montserrat text-[15px] leading-8 text-neutral-500 md:text-[17px]">
                {content.resultSection.description}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {content.resultSection.items.map(item => (
                <div
                  key={item.title}
                  className="min-h-[210px] border border-[#e7e2d9] bg-white/45 p-7 transition duration-300 hover:-translate-y-[2px] hover:bg-white/75"
                >
                  <h3 className="font-tenor text-[30px] leading-[1] tracking-[-0.03em] text-black">
                    {item.title}
                  </h3>

                  <p className="mt-5 font-montserrat text-[14px] leading-7 text-neutral-500">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
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
            <Link
              href="/contact"
              className="inline-flex min-h-[56px] items-center justify-center border border-white bg-white px-8 font-montserrat text-[14px] font-semibold uppercase tracking-[0.08em] text-black transition duration-300 hover:-translate-y-[1px]"
            >
              {content.cta.primaryButton}
            </Link>

            <Link
              href="/portfolio"
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
