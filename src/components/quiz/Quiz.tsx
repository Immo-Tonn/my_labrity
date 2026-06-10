'use client';

import { useState } from 'react';

import { useLanguage } from '@/utils/LanguageContext';
import { QuizAnswers } from './quiz.types';

import ContactForm from './ContactForm';

import deQuiz from '@/data/de/quiz.json';
import enQuiz from '@/data/en/quiz.json';
import uaQuiz from '@/data/ua/quiz.json';
import ruQuiz from '@/data/ru/quiz.json';

type QuizLanguage = 'de' | 'en' | 'ua' | 'ru';

const quizzes: Record<QuizLanguage, typeof deQuiz> = {
  de: deQuiz,
  en: enQuiz,
  ua: uaQuiz,
  ru: ruQuiz,
};

const supportedQuizLanguages: QuizLanguage[] = ['de', 'en', 'ua', 'ru'];

const uiLabels: Record<
  QuizLanguage,
  {
    back: string;
    multiple: string;
  }
> = {
  de: {
    back: 'Zurück',
    multiple: 'Mehrere Antworten möglich',
  },
  en: {
    back: 'Back',
    multiple: 'Multiple answers possible',
  },
  ua: {
    back: 'Назад',
    multiple: 'Можна обрати кілька варіантів',
  },
  ru: {
    back: 'Назад',
    multiple: 'Можно выбрать несколько вариантов',
  },
};

export default function Quiz() {
  const { lang } = useLanguage();

  const quizLang: QuizLanguage = supportedQuizLanguages.includes(
    lang as QuizLanguage,
  )
    ? (lang as QuizLanguage)
    : 'de';

  const quiz = quizzes[quizLang].quiz;
  const labels = uiLabels[quizLang];

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  if (completed) {
    return <ContactForm quiz={quiz} answers={answers} />;
  }

  const question = quiz.questions[step];
  const selected = answers[question.id] || [];
  const progressPercent = ((step + 1) / quiz.questions.length) * 100;

  const select = (value: string) => {
    const current = answers[question.id] || [];

    if (!question.multiple) {
      setAnswers(prev => ({
        ...prev,
        [question.id]: [value],
      }));

      return;
    }

    const exists = current.includes(value);

    setAnswers(prev => ({
      ...prev,
      [question.id]: exists
        ? current.filter(item => item !== value)
        : [...current, value],
    }));
  };

  const nextStep = () => {
    if (step === quiz.questions.length - 1) {
      setCompleted(true);
      return;
    }

    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="w-full">
      {/* PROGRESS */}
      <div className="mb-9">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="font-montserrat text-[11px] font-medium uppercase tracking-[0.26em] text-black/40">
            {quiz.progress} {step + 1} / {quiz.questions.length}
          </p>

          {question.multiple && (
            <p className="hidden font-montserrat text-[10px] uppercase tracking-[0.18em] text-black/35 md:block">
              {labels.multiple}
            </p>
          )}
        </div>

        <div className="h-px w-full bg-[#e7e2d9]">
          <div
            className="h-px bg-black transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* QUESTION */}
      <div className="mb-8">
        <h2 className="max-w-[720px] font-tenor text-[34px] leading-[1.02] tracking-[-0.04em] text-black md:text-[46px]">
          {question.title}
        </h2>

        {question.multiple && (
          <p className="mt-4 font-montserrat text-[13px] leading-6 text-neutral-500 md:hidden">
            {labels.multiple}
          </p>
        )}
      </div>

      {/* OPTIONS */}
      <div className="grid gap-3">
        {question.options.map((option: string) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => select(option)}
              className={`
                group relative flex min-h-[58px] w-full items-center justify-between
                border px-5 py-4 text-left
                font-montserrat text-[14px] leading-6
                transition duration-300 md:text-[15px]
                ${
                  isSelected
                    ? 'border-black bg-black text-white shadow-[0_16px_35px_rgba(0,0,0,0.12)]'
                    : 'border-[#e7e2d9] bg-white/35 text-neutral-600 hover:border-black hover:bg-white/70 hover:text-black'
                }
              `}
            >
              <span>{option}</span>

              <span
                className={`
                  ml-5 flex h-5 w-5 shrink-0 items-center justify-center border
                  text-[11px] transition duration-300
                  ${
                    isSelected
                      ? 'border-white text-white'
                      : 'border-black/20 text-transparent group-hover:border-black/40'
                  }
                `}
              >
                ✓
              </span>
            </button>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="mt-9 flex flex-col-reverse gap-3 md:flex-row md:items-center md:justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 0}
          className="
            inline-flex min-h-[54px] items-center justify-center
            border border-black/20 bg-transparent px-7
            font-montserrat text-[12px] font-semibold uppercase tracking-[0.08em]
            text-black transition duration-300
            hover:border-black hover:bg-black hover:text-white
            disabled:pointer-events-none disabled:opacity-30
          "
        >
          {labels.back}
        </button>

        <button
          type="button"
          onClick={nextStep}
          disabled={selected.length === 0}
          className="
            inline-flex min-h-[54px] w-full items-center justify-center
            border border-black bg-black px-8
            font-montserrat text-[12px] font-semibold uppercase tracking-[0.08em]
            text-white transition duration-300
            hover:-translate-y-[1px] hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
            disabled:cursor-not-allowed disabled:border-black/20 disabled:bg-black/20 disabled:text-black/40 disabled:shadow-none
            md:w-auto
          "
        >
          {quiz.next}
        </button>
      </div>
    </div>
  );
}
