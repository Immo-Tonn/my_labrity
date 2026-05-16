'use client';

import { useEffect, useRef, useState } from 'react';

import { chatbotResponses } from '@/data/chatbotResponses';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

type Language = 'ru' | 'de';

const detectLanguage = (message: string): Language => {
  return /[а-яё]/i.test(message) ? 'ru' : 'de';
};

const getRandomItem = (items: string[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

const repeatedMessageResponses = {
  de: [
    'Diese Nachricht kommt mir bekannt vor 😄 Testen Sie mich gerade?',
    'Déjà-vu im Chat 😄 Ich glaube, das hatten wir schon.',
    'Noch einmal? 😄 Ich bin wach, versprochen.',
  ],
  ru: [
    'Кажется, я это уже видел 😄 Вы меня тестируете?',
    'Дежавю в чате 😄 Кажется, это сообщение уже было.',
    'Ещё раз? 😄 Я точно не сплю, обещаю.',
  ],
};

const idleMessages = {
  de: [
    '👀👀👀',
    'Ich bin noch da 👀 Falls Sie Fragen zu Websites, SEO oder Projekten haben, schreiben Sie einfach.',
    'Ich warte ganz professionell im Hintergrund 😄',
    'Noch da? Wenn Sie über ein Website-Projekt nachdenken, helfe ich gern.',
    'Kleiner Bot, große Geduld 😄',
  ],
  ru: [
    '👀👀👀',
    'Я всё ещё здесь 👀 Если есть вопрос про сайты, SEO или проекты — просто напишите.',
    'Я профессионально жду на фоне 😄',
    'Вы ещё тут? Если думаете о сайте — я помогу.',
    'Маленький бот, большое терпение 😄',
  ],
};

const unknownResponses = {
  de: [
    'Ich glaube, mein digitales Gehirn hat kurz geblinzelt 😄 Fragen Sie mich gerne zu Website, SEO, Preisen oder Kontakt.',
    'Hmm, das habe ich nicht ganz verstanden 😄 Ich kann besser bei Fragen zu Websites, Landingpages oder SEO helfen.',
    'Das klingt spannend, aber etwas geheimnisvoll 😄 Fragen Sie mich gerne zu Ihrem Website-Projekt.',
  ],
  ru: [
    'Кажется, мой цифровой мозг на секунду задумался 😄 Спросите меня лучше про сайт, SEO, цены или контакт.',
    'Я не совсем понял это сообщение 😄 Но я хорошо отвечаю на вопросы про сайты, лендинги и SEO.',
    'Звучит загадочно 😄 Попробуйте спросить меня про ваш сайт или digital-проект.',
  ],
};

const shortMessages = {
  de: 'Zu kurz für mein kleines Bot-Gehirn 😄 Schreiben Sie bitte etwas genauer.',
  ru: 'Слишком коротко для моего маленького бот-мозга 😄 Напишите чуть подробнее.',
};

const longMessages = {
  de: 'Das ist eine größere Frage 😄 Am besten schreiben Sie uns über das Kontaktformular, dann können wir gezielt antworten.',
  ru: 'Это уже большой вопрос 😄 Лучше напишите нам через контактную форму, и мы ответим точнее.',
};

const ctaMessages = {
  de: 'Wenn Sie möchten, können Sie direkt eine Anfrage über das Kontaktformular senden — dann kann das Team gezielt antworten.',
  ru: 'Если хотите, можно сразу отправить заявку через контактную форму — так команда ответит точнее.',
};

const teaserMessages = [
  '👋 Fragen zu Website oder SEO?',
  'AI Assistant online',
  'Brauchen Sie eine moderne Website?',
];

export default function FakeAiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      text: 'Hallo 👋 Wie kann ich Ihnen helfen?',
      sender: 'bot',
    },
  ]);

  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastUserMessageRef = useRef('');
  const lastLanguageRef = useRef<Language>('de');
  const repeatedCountRef = useRef(0);
  const idleTimerRef = useRef<number | null>(null);
  const idleCountRef = useRef(0);
  const userMessagesCountRef = useRef(0);

  useEffect(() => {
    const teaserStartTimer = window.setTimeout(() => {
      setShowTeaser(true);
    }, 4000);

    const teaserHideTimer = window.setTimeout(() => {
      setShowTeaser(false);
    }, 14000);

    return () => {
      window.clearTimeout(teaserStartTimer);
      window.clearTimeout(teaserHideTimer);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) return;
    if (idleCountRef.current >= 3) return;

    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      const language = lastLanguageRef.current;

      setMessages(prev => [
        ...prev,
        {
          text: getRandomItem(idleMessages[language]),
          sender: 'bot',
        },
      ]);

      idleCountRef.current += 1;
    }, 15000);

    return () => {
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
    };
  }, [isOpen, messages]);

  const getFunnyResponse = (message: string, language: Language) => {
    const lower = message.toLowerCase();

    if (
      lower.includes('scheiße') ||
      lower.includes('shit') ||
      lower.includes('fuck') ||
      lower.includes('блять') ||
      lower.includes('блин') ||
      lower.includes('сука')
    ) {
      return language === 'ru'
        ? '😄 Похоже, проект немного горит. Дышим спокойно — хороший сайт всё исправит.'
        : '😄 Klingt nach Projekt-Stress. Atmen Sie kurz durch — eine gute Website hilft.';
    }

    if (
      lower.includes('ты человек') ||
      lower.includes('ты живой') ||
      lower.includes('bist du mensch') ||
      lower.includes('bist du ein mensch')
    ) {
      return language === 'ru'
        ? 'Пока нет 😄 Но я уже достаточно долго работаю без сна и кофе.'
        : 'Noch nicht 😄 Aber ich arbeite schon ziemlich gut ohne Schlaf und Kaffee.';
    }

    if (
      lower.includes('сколько тебе лет') ||
      lower.includes('wie alt bist du')
    ) {
      return language === 'ru'
        ? 'Мой возраст измеряется в commit’ах 😄'
        : 'Mein Alter wird in Commits gemessen 😄';
    }

    if (
      lower.includes('кто лучший разработчик') ||
      lower.includes('лучший разработчик') ||
      lower.includes('bester entwickler') ||
      lower.includes('beste entwickler')
    ) {
      return language === 'ru'
        ? 'Конечно, команда Labrity 😄 Тут даже спорить нельзя.'
        : 'Natürlich das Labrity Team 😄 Da gibt es keine Diskussion.';
    }

    if (
      lower.includes('бесплатно') ||
      lower.includes('free') ||
      lower.includes('kostenlos') ||
      lower.includes('umsonst')
    ) {
      return language === 'ru'
        ? '😄 Бесплатно могу только пожелать красивый UI. А проект лучше обсудить индивидуально.'
        : '😄 Kostenlos kann ich nur ein schönes UI wünschen. Für ein Projekt sprechen wir besser individuell.';
    }

    if (lower.includes('matrix') || lower.includes('матрица')) {
      return language === 'ru'
        ? 'Wake up, Neo... Сайт сам себя не задеплоит 👀'
        : 'Wake up, Neo... The website has you 👀';
    }

    if (
      lower.includes('как настроение') ||
      lower.includes('настроение') ||
      lower.includes('wie geht') ||
      lower.includes('stimmung')
    ) {
      return language === 'ru'
        ? 'Отличное 😄 Сегодня ещё никто не попросил сайт “как Apple, но за 50 евро”.'
        : 'Sehr gut 😄 Heute wollte noch niemand eine Website “wie Apple, aber für 50 Euro”.';
    }

    if (lower.includes('seo seo seo')) {
      return language === 'ru'
        ? 'Кажется, SEO для вас действительно важно 😄'
        : 'Ich glaube, SEO ist Ihnen wirklich wichtig 😄';
    }

    if (
      lower.includes('apple') ||
      lower.includes('эпл') ||
      lower.includes('как у apple')
    ) {
      return language === 'ru'
        ? 'Сайт “как Apple” — классика 😄 Главное, чтобы бюджет тоже был не как яблочный сок.'
        : 'Eine Website wie Apple — Klassiker 😄 Wichtig ist nur, dass das Budget nicht wie Apfelsaft ist.';
    }

    return null;
  };

  const getBotResponse = (message: string) => {
    const cleanMessage = message.trim();
    const lowerCaseMessage = cleanMessage.toLowerCase();
    const language = detectLanguage(cleanMessage);

    lastLanguageRef.current = language;

    if (lowerCaseMessage === lastUserMessageRef.current) {
      repeatedCountRef.current += 1;
    } else {
      repeatedCountRef.current = 1;
      lastUserMessageRef.current = lowerCaseMessage;
    }

    if (repeatedCountRef.current >= 3) {
      return getRandomItem(repeatedMessageResponses[language]);
    }

    if (cleanMessage.length <= 2) {
      return shortMessages[language];
    }

    if (cleanMessage.length > 220) {
      return longMessages[language];
    }

    const funnyResponse = getFunnyResponse(cleanMessage, language);

    if (funnyResponse) {
      return funnyResponse;
    }

    const matchedResponse = chatbotResponses.find(item =>
      item.keywords.some(keyword =>
        lowerCaseMessage.includes(keyword.toLowerCase()),
      ),
    );

    if (matchedResponse) {
      return matchedResponse.response;
    }

    return getRandomItem(unknownResponses[language]);
  };

  const sendBotMessageWithDelay = (text: string) => {
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text,
          sender: 'bot',
        },
      ]);

      setIsTyping(false);
    }, 700);
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const currentInput = input;
    const botResponse = getBotResponse(currentInput);

    userMessagesCountRef.current += 1;

    setMessages(prev => [
      ...prev,
      {
        text: currentInput,
        sender: 'user',
      },
    ]);

    setInput('');
    sendBotMessageWithDelay(botResponse);

    if (userMessagesCountRef.current === 4) {
      window.setTimeout(() => {
        sendBotMessageWithDelay(ctaMessages[lastLanguageRef.current]);
      }, 1400);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    if (isTyping) return;

    const botResponse = getBotResponse(question);

    userMessagesCountRef.current += 1;

    setMessages(prev => [
      ...prev,
      {
        text: question,
        sender: 'user',
      },
    ]);

    sendBotMessageWithDelay(botResponse);
  };

  return (
    <>
      {showTeaser && !isOpen && (
        <div className="fixed bottom-[92px] right-6 z-50 max-w-[230px] animate-bounce rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black shadow-[0_12px_35px_rgba(0,0,0,0.14)]">
          {getRandomItem(teaserMessages)}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Labrity assistant"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-black text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:scale-105"
      >
        <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-black bg-green-400" />
        AI
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[520px] w-[350px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
          <div className="flex items-start justify-between border-b border-neutral-200 bg-black px-5 py-4 text-white">
            <div>
              <p className="font-semibold">Labrity Assistant</p>

              <p className="text-sm text-white/70">
                Online • Antworten auf kurze Fragen
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close Labrity assistant"
              className="rounded-full px-2 text-xl leading-none text-white/70 transition hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.sender}-${index}`}
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                  message.sender === 'user'
                    ? 'ml-auto bg-black text-white'
                    : message.text === '👀👀👀'
                      ? 'bg-neutral-100 px-5 py-4 text-[34px] leading-none text-black'
                      : 'bg-neutral-100 text-black'
                }`}
              >
                {message.text}
              </div>
            ))}

            {isTyping && (
              <div className="max-w-[85%] rounded-2xl bg-neutral-100 px-4 py-3 text-sm leading-6 text-black">
                <span className="inline-flex gap-1">
                  <span className="animate-pulse">Assistant schreibt</span>
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-100">.</span>
                  <span className="animate-bounce delay-200">.</span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-neutral-200 p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  handleSuggestedQuestion('Was kostet eine Website?')
                }
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
              >
                Preis
              </button>

              <button
                onClick={() => handleSuggestedQuestion('SEO')}
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
              >
                SEO
              </button>

              <button
                onClick={() => handleSuggestedQuestion('Portfolio')}
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
              >
                Portfolio
              </button>

              <button
                onClick={() => handleSuggestedQuestion('Kontakt')}
                className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
              >
                Kontakt
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleSend();
                  }
                }}
                placeholder="Nachricht schreiben..."
                className="flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-sm outline-none transition focus:border-black"
              />

              <button
                onClick={handleSend}
                disabled={isTyping}
                className="rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
