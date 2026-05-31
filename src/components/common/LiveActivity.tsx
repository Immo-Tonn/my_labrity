'use client';

import { useEffect, useMemo, useState } from 'react';

import { useLanguage } from '@/utils/LanguageContext';

type ActivityLanguage = 'de' | 'en' | 'ua' | 'ru';

const activities: Record<ActivityLanguage, string[]> = {
  de: [
    'Projektinteresse aus Stuttgart',
    'Landingpage-Projekt vorbereitet',
    'Projektinteresse aus Düsseldorf',
    'SEO-Analyse angefragt',
    'Business-Website vorbereitet',
    'Projektinteresse aus Frankfurt',
    'Portfolio-Website angefragt',
    'Projekt aus München vorbereitet',
    'Branding-Anfrage vorbereitet',
    'Website-Relaunch geplant',
    'Projektinteresse aus Hamburg',
    'AI-Projektanalyse abgeschlossen',
    'Website-Anfrage vorbereitet',
    'Projekt aus Köln vorbereitet',
    'Projektinteresse aus Leipzig',
    'Modernes Webdesign angefragt',
    'Projektinteresse aus Hannover',
    'SEO-Projekt vorbereitet',
    'Premium-Website angefragt',
    'Projektinteresse aus Nürnberg',
    'Website-Konzept vorbereitet',
    'Projektinteresse aus Karlsruhe',
    'AI-Kalkulator wurde genutzt',
    'Projektinteresse aus Mannheim',
  ],

  en: [
    'Project interest from Stuttgart',
    'Landing page project prepared',
    'Project interest from Düsseldorf',
    'SEO analysis requested',
    'Business website prepared',
    'Project interest from Frankfurt',
    'Portfolio website requested',
    'Project from Munich prepared',
    'Branding request prepared',
    'Website relaunch planned',
    'Project interest from Hamburg',
    'AI project analysis completed',
    'Website request prepared',
    'Project from Cologne prepared',
    'Project interest from Leipzig',
    'Modern web design requested',
    'Project interest from Hanover',
    'SEO project prepared',
    'Premium website requested',
    'Project interest from Nuremberg',
    'Website concept prepared',
    'Project interest from Karlsruhe',
    'AI calculator was used',
    'Project interest from Mannheim',
  ],

  ua: [
    'Інтерес до проєкту зі Штутгарта',
    'Лендінг-проєкт підготовлено',
    'Інтерес до проєкту з Дюссельдорфа',
    'Запит на SEO-аналіз',
    'Бізнес-сайт підготовлено',
    'Інтерес до проєкту з Франкфурта',
    'Запит на сайт-портфоліо',
    'Проєкт з Мюнхена підготовлено',
    'Брендинг-запит підготовлено',
    'Планується редизайн сайту',
    'Інтерес до проєкту з Гамбурга',
    'AI-аналіз проєкту завершено',
    'Запит на сайт підготовлено',
    'Проєкт з Кельна підготовлено',
    'Інтерес до проєкту з Лейпцига',
    'Запит на сучасний вебдизайн',
    'Інтерес до проєкту з Ганновера',
    'SEO-проєкт підготовлено',
    'Запит на premium сайт',
    'Інтерес до проєкту з Нюрнберга',
    'Концепт сайту підготовлено',
    'Інтерес до проєкту з Карлсруе',
    'AI-калькулятор було використано',
    'Інтерес до проєкту з Мангайма',
  ],

  ru: [
    'Интерес к проекту из Штутгарта',
    'Лендинг-проект подготовлен',
    'Интерес к проекту из Дюссельдорфа',
    'Запрошен SEO-анализ',
    'Бизнес-сайт подготовлен',
    'Интерес к проекту из Франкфурта',
    'Запрошен сайт-портфолио',
    'Проект из Мюнхена подготовлен',
    'Брендинг-запрос подготовлен',
    'Планируется редизайн сайта',
    'Интерес к проекту из Гамбурга',
    'AI-анализ проекта завершён',
    'Запрос на сайт подготовлен',
    'Проект из Кёльна подготовлен',
    'Интерес к проекту из Лейпцига',
    'Запрошен современный веб-дизайн',
    'Интерес к проекту из Ганновера',
    'SEO-проект подготовлен',
    'Запрошен premium-сайт',
    'Интерес к проекту из Нюрнберга',
    'Концепт сайта подготовлен',
    'Интерес к проекту из Карлсруэ',
    'AI-калькулятор был использован',
    'Интерес к проекту из Мангайма',
  ],
};

const times: Record<ActivityLanguage, string[]> = {
  de: [
    'gerade eben',
    'vor 1 Minute',
    'vor 2 Minuten',
    'vor 4 Minuten',
    'vor 5 Minuten',
  ],

  en: [
    'just now',
    '1 minute ago',
    '2 minutes ago',
    '4 minutes ago',
    '5 minutes ago',
  ],

  ua: [
    'щойно',
    '1 хвилину тому',
    '2 хвилини тому',
    '4 хвилини тому',
    '5 хвилин тому',
  ],

  ru: [
    'только что',
    '1 минуту назад',
    '2 минуты назад',
    '4 минуты назад',
    '5 минут назад',
  ],
};

const getActivityLanguage = (lang: string): ActivityLanguage => {
  if (lang === 'en' || lang === 'ua' || lang === 'ru') {
    return lang;
  }

  return 'de';
};

export default function LiveActivity() {
  const { lang } = useLanguage();
  const activityLang = getActivityLanguage(lang);

  const [isVisible, setIsVisible] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [timeIndex, setTimeIndex] = useState(0);

  const activity = useMemo(
    () =>
      activities[activityLang][activityIndex] || activities[activityLang][0],
    [activityIndex, activityLang],
  );

  const time = useMemo(
    () => times[activityLang][timeIndex] || times[activityLang][0],
    [timeIndex, activityLang],
  );

  useEffect(() => {
    const showActivity = () => {
      setActivityIndex(
        Math.floor(Math.random() * activities[activityLang].length),
      );
      setTimeIndex(Math.floor(Math.random() * times[activityLang].length));
      setIsVisible(true);

      window.setTimeout(() => {
        setIsVisible(false);
      }, 5500);
    };

    const startTimer = window.setTimeout(showActivity, 6000);

    const interval = window.setInterval(() => {
      showActivity();
    }, 22000);

    return () => {
      window.clearTimeout(startTimer);
      window.clearInterval(interval);
    };
  }, [activityLang]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-[280px] rounded-2xl border border-white/60 bg-white/85 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.12)] backdrop-blur-xl transition">
      <div className="flex items-start gap-3">
        <span className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />

        <div>
          <p className="font-montserrat text-sm font-semibold text-black">
            {activity}
          </p>

          <p className="mt-1 font-montserrat text-xs text-neutral-500">
            {time}
          </p>
        </div>
      </div>
    </div>
  );
}
