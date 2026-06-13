import { useQuiz } from '@/components/quiz';
import { useLanguage } from '@/utils/LanguageContext';

import Quiz from './Quiz';

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

const fallbackModal = {
  kicker: 'Projekt-Kalkulator',
  title: 'Erzählen Sie uns kurz von Ihrem Projekt.',
  description:
    'Ein paar kurze Fragen helfen uns, Ihr Vorhaben besser einzuschätzen.',
  note: 'Transparent. Persönlich. Unverbindlich.',
  close: 'Quiz schließen',
};

export default function QuizModal() {
  const { open, closeQuiz } = useQuiz();
  const { lang } = useLanguage();

  const quizLang: QuizLanguage = supportedQuizLanguages.includes(
    lang as QuizLanguage,
  )
    ? (lang as QuizLanguage)
    : 'de';

  const modal = quizzes[quizLang].quiz.modal || fallbackModal;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 py-4 md:px-6">
      {/* BACKDROP */}
      <button
        type="button"
        aria-label={modal.close}
        onClick={closeQuiz}
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
      />

      {/* MODAL */}
      <div className="relative z-10 flex max-h-[92dvh] w-full max-w-[1180px] flex-col overflow-hidden border border-[#e7e2d9] bg-[#f8f6f1] shadow-[0_40px_110px_rgba(0,0,0,0.35)] lg:grid lg:h-full lg:max-h-[620px] lg:grid-cols-[0.82fr_1.18fr]">
        {/* CLOSE */}
        <button
          type="button"
          onClick={closeQuiz}
          aria-label={modal.close}
          className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center border border-white/20 bg-black/30 font-montserrat text-[18px] leading-none text-white transition duration-300 hover:bg-white hover:text-black md:right-6 md:top-6 lg:h-10 lg:w-10 xl:border-black/10 xl:bg-[#f8f6f1]/80 xl:text-black xl:hover:bg-black xl:hover:text-white"
        >
          ×
        </button>

        {/* BRAND PANEL */}
        <aside className="relative shrink-0 overflow-hidden bg-[#111111] px-6 py-7 text-white md:px-8 md:py-8 lg:flex lg:min-h-0 lg:h-full lg:flex-col lg:justify-between lg:px-10 lg:py-12">
          <div>
            <p className="font-tenor text-[20px] uppercase tracking-[-0.03em] text-white md:text-[22px] xl:text-[24px]">
              LABRITY
            </p>

            <div className="mt-2 h-px w-9 bg-white/35 xl:w-10" />
          </div>

          <div className="mt-9 md:mt-10 xl:mt-0">
            <p className="mb-4 font-montserrat text-[9px] uppercase tracking-[0.3em] text-white/35 md:text-[10px] xl:text-[11px]">
              {modal.kicker}
            </p>

            <h2 className="max-w-[620px] font-tenor text-[34px] leading-[0.96] tracking-[-0.045em] text-white md:text-[44px] xl:max-w-[420px] xl:text-[58px]">
              {modal.title}
            </h2>

            <p className="mt-5 max-w-[620px] font-montserrat text-[13px] leading-6 text-white/65 md:text-[14px] md:leading-7 xl:mt-7 xl:max-w-[410px] xl:text-[15px] xl:leading-8">
              {modal.description}
            </p>
          </div>

          <div className="mt-7 border-t border-white/20 pt-5 xl:mt-0 xl:pt-7">
            <p className="font-montserrat text-[9px] uppercase tracking-[0.22em] text-white/35 md:text-[10px] xl:text-[11px] xl:tracking-[0.26em]">
              {modal.note}
            </p>
          </div>
        </aside>

        {/* QUIZ AREA */}
        <div className="relative min-h-0 flex-1 overflow-y-auto bg-[#f8f6f1]">
          <div className="px-6 py-7 md:px-10 md:py-10 xl:px-12 xl:py-14">
            <Quiz />
          </div>
        </div>
      </div>
    </div>
  );
}
