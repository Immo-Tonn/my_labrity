'use client';

import { useEffect, useMemo, useState } from 'react';

import { getData } from '@/utils/getData';
import { useLanguage } from '@/utils/LanguageContext';
import { withLocale } from '@/utils/localizedPath';

type QuizAnswer = {
  label: string;
  value: string;
  weight: number;
};

type QuizQuestion = {
  key: string;
  label: string;
  question: string;
  answers: QuizAnswer[];
};

type EstimateItem = {
  title: string;
  range: string;
  description: string;
};

type ProjectCalculatorData = {
  startButton: string;
  analysisTitle: string;
  finishedTitle: string;
  marketAnalysisTitle: string;
  marketAnalysisText: string;
  marketAnalysisNote: string;
  contactText: string;
  contactButton: string;
  restartButton: string;
  estimates: {
    compact: EstimateItem;
    business: EstimateItem;
    premium: EstimateItem;
    complex: EstimateItem;
  };
  questions: QuizQuestion[];
};

const fallbackCalculatorData: ProjectCalculatorData = {
  startButton: '✨ Projekt-Kalkulator starten',
  analysisTitle: '✨ AI-Projektanalyse',
  finishedTitle: '✅ AI-Marktanalyse abgeschlossen',
  marketAnalysisTitle: 'AI-basierte Marktanalyse',
  marketAnalysisText:
    'Diese Preisspanne wurde vom AI-Assistenten anhand typischer Marktpreise deutscher Webstudios, Projektumfang, Design-Komplexität, SEO-Anforderungen, Funktionen und moderner Website-Standards eingeordnet.',
  marketAnalysisNote:
    'Die angezeigte Range ist eine grobe Markt-Orientierung und kein finales Angebot von Labrity.',
  contactText:
    'Für Ihre individuelle Labrity-Einschätzung, mögliche Rabatte und ein konkretes Angebot können Sie uns direkt über das Kontaktformular kontaktieren.',
  contactButton: 'Individuelle Labrity-Preise anfragen',
  restartButton: 'Neue AI-Analyse starten',
  estimates: {
    compact: {
      title: 'Kompaktes Website-Projekt',
      range: 'ca. 2.000€ – 3.500€',
      description:
        'Die AI erkennt ein eher kompaktes Website-Projekt mit überschaubarem Umfang, klarer Struktur und wenigen komplexen Funktionen.',
    },
    business: {
      title: 'Professionelle Business-Website',
      range: 'ca. 4.000€ – 7.000€',
      description:
        'Die AI erkennt ein professionelles Website-Projekt mit individuellem Design, mehreren Inhalten, guter Struktur und wichtigen Grundfunktionen.',
    },
    premium: {
      title: 'Individuelles Premium-Projekt',
      range: 'ca. 8.000€ – 14.000€',
      description:
        'Die AI erkennt ein anspruchsvolleres Premium-Projekt mit Design-Komplexität, SEO-Anforderungen, Content-Arbeit oder erweiterten Funktionen.',
    },
    complex: {
      title: 'Komplexe individuelle Web-Lösung',
      range: 'ab ca. 15.000€',
      description:
        'Die AI erkennt ein größeres individuelles Projekt mit Shop, Login, Datenbank, Integrationen, Premium-Design oder komplexerer technischer Architektur.',
    },
  },
  questions: [],
};

const getEstimate = (
  score: number,
  estimates: ProjectCalculatorData['estimates'],
) => {
  if (score <= 20) {
    return estimates.compact;
  }

  if (score <= 42) {
    return estimates.business;
  }

  if (score <= 65) {
    return estimates.premium;
  }

  return estimates.complex;
};

export default function ProjectCalculator() {
  const { lang } = useLanguage();

  const [calculatorData, setCalculatorData] =
    useState<ProjectCalculatorData | null>(null);

  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('projectCalculator', lang);

        setCalculatorData({
          ...fallbackCalculatorData,
          ...data,
          estimates: data?.estimates || fallbackCalculatorData.estimates,
          questions: data?.questions?.length
            ? data.questions
            : fallbackCalculatorData.questions,
        });
      } catch {
        setCalculatorData(fallbackCalculatorData);
      }
    };

    loadData();
  }, [lang]);

  useEffect(() => {
    setIsStarted(false);
    setStep(0);
    setAnswers({});
    setScore(0);
  }, [lang]);

  const content = useMemo(
    () => calculatorData ?? fallbackCalculatorData,
    [calculatorData],
  );

  const questions = content.questions;
  const currentQuestion = questions[step];
  const isFinished = step >= questions.length && questions.length > 0;
  const progress = questions.length
    ? Math.round((step / questions.length) * 100)
    : 0;

  const estimate = useMemo(
    () => getEstimate(score, content.estimates),
    [score, content.estimates],
  );

  const handleAnswer = (answer: QuizAnswer) => {
    if (!currentQuestion) return;

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.key]: answer.value,
    }));

    setScore(prev => prev + answer.weight);
    setStep(prev => prev + 1);
  };

  const resetQuiz = () => {
    setIsStarted(false);
    setStep(0);
    setAnswers({});
    setScore(0);
  };

  if (!calculatorData) {
    return (
      <button
        disabled
        className="w-full rounded-xl border border-black bg-black px-4 py-3 text-sm font-medium text-white opacity-70"
      >
        Loading...
      </button>
    );
  }

  if (!questions.length) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm text-neutral-600">
        Project calculator data could not be loaded.
      </div>
    );
  }

  if (!isStarted) {
    return (
      <button
        onClick={() => setIsStarted(true)}
        className="w-full rounded-xl border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        {content.startButton}
      </button>
    );
  }

  return (
    <div className="mb-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
      {!isFinished && currentQuestion ? (
        <>
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-black">
                {content.analysisTitle}
              </p>

              <p className="text-[11px] text-neutral-400">
                {step + 1}/{questions.length}
              </p>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-black transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <p className="mb-3 text-sm leading-6 text-neutral-700">
            {currentQuestion.question}
          </p>

          <div className="flex flex-wrap gap-2">
            {currentQuestion.answers.map(answer => (
              <button
                key={`${currentQuestion.key}-${answer.value}`}
                onClick={() => handleAnswer(answer)}
                className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
              >
                {answer.label}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <p className="mb-2 text-xs font-semibold text-black">
            {content.finishedTitle}
          </p>

          <div className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-semibold text-black">{estimate.title}</p>

            <p className="mt-2 text-2xl font-semibold text-black">
              {estimate.range}
            </p>

            <p className="mt-2 text-xs leading-5 text-neutral-600">
              {estimate.description}
            </p>
          </div>

          <div className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="mb-2 text-xs font-semibold text-black">
              {content.marketAnalysisTitle}
            </p>

            <p className="text-xs leading-5 text-neutral-600">
              {content.marketAnalysisText}
            </p>

            <p className="mt-2 text-xs leading-5 text-neutral-500">
              {content.marketAnalysisNote}
            </p>
          </div>

          <p className="mb-3 text-xs leading-5 text-neutral-500">
            {content.contactText}
          </p>

          <div className="space-y-1 rounded-xl bg-white p-3 text-xs text-neutral-600">
            {Object.entries(answers).map(([key, value]) => {
              const question = questions.find(item => item.key === key);

              return (
                <p key={key}>
                  <strong>{question?.label || key}:</strong> {value}
                </p>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <a
              href={withLocale('/contact', lang)}
              className="rounded-xl bg-black px-4 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
            >
              {content.contactButton}
            </a>

            <button
              onClick={resetQuiz}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600 transition hover:border-black hover:text-black"
            >
              {content.restartButton}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
