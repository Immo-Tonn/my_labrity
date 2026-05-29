'use client';

import { useState } from 'react';

import { useLanguage } from '@/utils/LanguageContext';
import { QuizAnswers } from './quiz.types';

import ContactForm from './ContactForm';

import deQuiz from '@/data/de/quiz.json';
import enQuiz from '@/data/en/quiz.json';
import uaQuiz from '@/data/ua/quiz.json';

const quizzes = {
  de: deQuiz,
  en: enQuiz,
  ua: uaQuiz,
};

export default function Quiz() {
  const { lang } = useLanguage();

  const quiz = quizzes[lang].quiz;

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  if (completed) {
    return <ContactForm quiz={quiz} answers={answers} />;
  }

  const question = quiz.questions[step];

  const selected = answers[question.id] || [];

  const select = (value: string) => {
    const current = answers[question.id] || [];

    // SINGLE CHOICE
    if (!question.multiple) {
      setAnswers(prev => ({
        ...prev,
        [question.id]: [value],
      }));

      return;
    }

    // MULTIPLE CHOICE
    const exists = current.includes(value);

    setAnswers(prev => ({
      ...prev,
      [question.id]: exists
        ? current.filter(x => x !== value)
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

  return (
    <div className="p-8">
      <p className="mb-4 text-sm text-black/60">
        {quiz.progress} {step + 1} / {quiz.questions.length}
      </p>

      <h2 className="mb-6 text-2xl font-medium">
        {question.title}
      </h2>

      <div className="grid gap-3">
        {question.options.map((option: string) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              onClick={() => select(option)}
              className={`
                group relative overflow-hidden
                rounded-xl border bg-white

                px-4 py-3

                text-left
                transition-all duration-300

                ${
                  isSelected
                    ? 'border-black'
                    : 'border-[#e7e2d9] hover:border-black'
                }
              `}
            >
              {/* BASE OVERLAY */}
              <span
                className={`
                  absolute inset-0
                  bg-black/5
                  transition-opacity
                  duration-300

                  ${
                    isSelected
                      ? 'opacity-100'
                      : 'opacity-0 group-hover:opacity-100'
                  }
                `}
              />

              {/* SHIMMER */}
              <span
                className={`
                  absolute inset-0
                  -translate-x-[120%]
                  skew-x-[-20deg]

                  bg-gradient-to-r
                  from-transparent
                  via-white/80
                  to-transparent

                  opacity-0
                  pointer-events-none

                  group-hover:animate-[shine_1.1s_linear]
                  group-hover:opacity-100

                  ${
                    isSelected
                      ? 'animate-[shine_1.4s_linear_infinite] opacity-100'
                      : ''
                  }
                `}
              />

              {/* CONTENT */}
              <span className="relative z-10">
                {option}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={nextStep}
        disabled={selected.length === 0}
        className="
          mt-8 w-full
          border bg-black

          px-5 py-2.5

          text-white
          transition-opacity

          disabled:cursor-not-allowed
          disabled:opacity-40
        "
      >
        {quiz.next}
      </button>

      <style jsx global>{`
        @keyframes shine {
          0% {
            transform: translateX(-120%) skewX(-20deg);
          }
          100% {
            transform: translateX(220%) skewX(-20deg);
          }
        }
      `}</style>
    </div>
  );
}