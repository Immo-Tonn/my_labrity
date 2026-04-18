'use client';

import { useEffect, useState } from 'react';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type QuestionsData = {
  title: string;
  description: string;
  words: string[];
};

export const Questions = () => {
  const { lang } = useLanguage();
  const [questions, setQuestions] = useState<QuestionsData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('questions', lang);
      setQuestions(data);
    };

    loadData();
  }, [lang]);

  if (!questions) return null;

  const words = questions.words;

  return (
    <section className="w-full overflow-hidden pb-[100px] pt-[100px]">
      <div className="container mb-16 text-center">
        <h2 className="mb-6 font-tenor text-4xl text-accent md:text-5xl">
          {questions.title}
        </h2>

        <p className="mx-auto max-w-[520px] text-white">
          {questions.description}
        </p>
      </div>

      {/* FIRST ROW */}

      <div className="marquee">
        <div className="marquee-track">
          {words.map((word, index) => (
            <span key={index} className="marquee-word text-accent">
              {word}
              <span className="mx-10 text-accent">•</span>
            </span>
          ))}

          {words.map((word, index) => (
            <span key={'dup' + index} className="marquee-word text-accent">
              {word}
              <span className="mx-10 text-accent">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* SECOND ROW */}

      <div className="marquee reverse mt-8">
        <div className="marquee-track">
          {words.map((word, index) => (
            <span key={'row2' + index} className="marquee-word text-accent">
              {word}
              <span className="mx-10 text-accent">•</span>
            </span>
          ))}

          {words.map((word, index) => (
            <span key={'row2dup' + index} className="marquee-word text-accent">
              {word}
              <span className="mx-10 text-accent">•</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
