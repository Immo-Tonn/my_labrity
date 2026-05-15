'use client';

import { useState } from 'react';

import { useLanguage } from '@/utils/LanguageContext';
import { QuizAnswers } from './quiz.types';
import { useQuiz } from '@/components/quiz';

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
  const { closeQuiz } = useQuiz();

  const quiz = quizzes[lang].quiz;

  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswers>({});

  if (completed) {
    return <ContactForm quiz={quiz} answers={answers} />;
  }

  const question = quiz.questions[step];

  const select = (value: string) => {
    const current = answers[question.id] || [];

    if (!question.multiple) {
      setAnswers({
        ...answers,
        [question.id]: [value],
      });

      if (step < quiz.questions.length - 1) {
        setTimeout(() => setStep(p => p + 1), 150);
      }

      return;
    }

    const exists = current.includes(value);

    setAnswers(prev => ({
      ...prev,
      [question.id]: exists
        ? current.filter(x => x !== value)
        : [...current, value],
    }));
  };

  const finishQuiz = () => {
    setCompleted(true);
  };

  const selected = answers[question.id] || [];

  return (
    <div className="p-8">
      <button onClick={closeQuiz} className="absolute right-4 top-4">
        ✕
      </button>

      <p className="mb-4">
        {quiz.progress} {step + 1} / {quiz.questions.length}
      </p>

      <h2 className="mb-8 text-3xl">{question.title}</h2>

      <div className="grid gap-4">
        {question.options.map((option: string) => {
          const isSelected = selected.includes(option);

          return (
            <button
              key={option}
              onClick={() => select(option)}
              className={`
                group relative overflow-hidden

                rounded-xl
                border
                bg-white
                p-4

                text-left transition-all

                duration-300

                ${
                  isSelected
                    ? 'border-black'
                    : 'border-[#e7e2d9] hover:border-black'
                }
              `}
            >
              {/* 🔥 BASE DARK OVERLAY (как CTA button base) */}
              <span
                className="
                  absolute inset-0
                  bg-black/5
                  opacity-0
                  transition-opacity
                  duration-300 group-hover:opacity-100
                "
              />

              {/* 🔥 SHIMMER (главный эффект) */}
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

                  group-hover:animate-[shine_1.1s_linear]
                  group-hover:opacity-100

                  ${
                    isSelected
                      ? 'animate-[shine_1.4s_linear_infinite] opacity-100'
                      : ''
                  }

                  pointer-events-none
                `}
              />

              {/* CONTENT */}
              <span className="relative z-10">{option}</span>
            </button>
          );
        })}
      </div>

      {step === quiz.questions.length - 1 && (
        <button
          onClick={finishQuiz}
          className="
            mt-8 w-full
            border bg-black px-6
            py-3 text-white
          "
        >
          {quiz.next}
        </button>
      )}

      {/* 🔥 ANIMATION */}
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
