'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import ProjectCalculator from '@/components/common/ProjectCalculator';
import { chatbotResponses } from '@/data/chatbotResponses';
import { getData } from '@/utils/getData';
import { useLanguage } from '@/utils/LanguageContext';
import { withLocale } from '@/utils/localizedPath';
import useFocusTrap from '@/utils/useFocusTrap';

// Quick-question helper: answers come from prepared texts only. It is NOT an
// AI and NOT a live person — the first message and the header say so.

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

type QuickKey = 'price' | 'seo' | 'portfolio';

type AssistantData = {
  header: {
    chatTitle: string;
    chatSubtitle: string;
    closeLabel: string;
    openLabel: string;
    calculatorTitle: string;
    calculatorSubtitle: string;
  };
  initialMessage: string;
  teaserMessages?: string[];
  contact: {
    formLabel: string;
    emailLabel: string;
  };
  buttons: Record<QuickKey | 'send' | 'calculator' | 'backToChat', string>;
  input: {
    placeholder: string;
  };
  quickQuestions: Record<QuickKey, string>;
  quickAnswers: Record<QuickKey, string>;
  unknownResponse: string;
  priorityResponses: {
    website: string;
    price: string;
    duration: string;
  };
};

type ActiveMode = 'chat' | 'calculator';

const CONTACT_EMAIL = 'labrity@web.de';

const WEBSITE_TRIGGERS = [
  'website erstellen',
  'webseite erstellen',
  'homepage erstellen',
  'seite erstellen',
  'ich möchte eine website',
  'ich brauche eine website',
  'neue website',
  'create website',
  'new website',
  'need a website',
  'створити сайт',
  'потрібен сайт',
  'хочу сайт',
  'сделать сайт',
  'создать сайт',
  'нужен сайт',
];

const PRICE_TRIGGERS = [
  'preis',
  'kosten',
  'kostet',
  'was kostet',
  'wie viel kostet',
  'angebot',
  'budget',
  'price',
  'cost',
  'how much',
  'offer',
  'ціна',
  'вартість',
  'скільки коштує',
  'цена',
  'стоимость',
  'сколько стоит',
  'прайс',
  'бюджет',
];

const DURATION_TRIGGERS = [
  'dauer',
  'wie lange',
  'zeit',
  'wann fertig',
  'timeline',
  'how long',
  'when ready',
  'термін',
  'скільки часу',
  'коли готово',
  'срок',
  'сколько времени',
];

const includesAny = (text: string, triggers: string[]) =>
  triggers.some(trigger => text.includes(trigger));

export default function FakeAiChat() {
  const { lang } = useLanguage();

  const [content, setContent] = useState<AssistantData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [teaser, setTeaser] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [activeMode, setActiveMode] = useState<ActiveMode>('chat');

  const panelRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    let cancelled = false;

    setInput('');
    setActiveMode('chat');
    setMessages([]);
    setContent(null);

    getData('aiAssistant', lang)
      .then((data: AssistantData) => {
        if (cancelled) return;

        setContent(data);
        setMessages([{ text: data.initialMessage, sender: 'bot' }]);
      })
      .catch(() => {
        // No data -> the helper simply stays hidden.
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  useEffect(() => {
    if (!isOpen) return;

    if (activeMode === 'chat') inputRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Original brand behaviour: a short speech bubble shows up above the badge
  // after 4 s and disappears after 14 s (same timing as before).
  useEffect(() => {
    const messages = content?.teaserMessages;

    if (!messages || messages.length === 0) return;

    const show = window.setTimeout(() => {
      setTeaser(messages[Math.floor(Math.random() * messages.length)]);
    }, 4000);
    const hide = window.setTimeout(() => setTeaser(null), 14000);

    return () => {
      window.clearTimeout(show);
      window.clearTimeout(hide);
    };
  }, [content]);

  useEffect(() => {
    if (isOpen) setTeaser(null);
  }, [isOpen]);

  if (!content) return null;

  const getBotResponse = (message: string) => {
    const lower = message.trim().toLowerCase();

    if (includesAny(lower, WEBSITE_TRIGGERS)) {
      return content.priorityResponses.website;
    }

    if (includesAny(lower, PRICE_TRIGGERS)) {
      return content.priorityResponses.price;
    }

    if (includesAny(lower, DURATION_TRIGGERS)) {
      return content.priorityResponses.duration;
    }

    if (lang === 'de') {
      const matched = chatbotResponses.find(item =>
        item.keywords.some(keyword => lower.includes(keyword.toLowerCase())),
      );

      if (matched) return matched.response;
    }

    return content.unknownResponse;
  };

  const addExchange = (question: string, answer: string) => {
    setMessages(prev => [
      ...prev,
      { text: question, sender: 'user' },
      { text: answer, sender: 'bot' },
    ]);
  };

  const handleSend = () => {
    const question = input.trim();

    if (!question) return;

    addExchange(question, getBotResponse(question));
    setInput('');
  };

  const handleQuickQuestion = (key: QuickKey) => {
    addExchange(content.quickQuestions[key], content.quickAnswers[key]);
  };

  const closePanel = () => {
    setIsOpen(false);
  };

  const isCalculator = activeMode === 'calculator';

  const quickKeys: QuickKey[] = ['price', 'seo', 'portfolio'];

  return (
    <>
      {teaser && !isOpen && (
        <div
          role="status"
          className="fixed bottom-[92px] right-6 z-50 max-w-[230px] animate-bounce rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black shadow-[0_12px_35px_rgba(0,0,0,0.14)]"
        >
          {teaser}
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        aria-label={
          isOpen ? content.header.closeLabel : content.header.openLabel
        }
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-black text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:scale-105"
      >
        <span
          aria-hidden="true"
          className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-black bg-green-400"
        />
        AI
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={content.header.chatTitle}
          className="fixed bottom-20 left-4 right-4 z-50 flex h-[min(520px,calc(100dvh-120px))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:bottom-24 md:left-auto md:right-6 md:w-[350px]"
        >
          <div className="flex items-start justify-between border-b border-neutral-200 bg-black px-5 py-4 text-white">
            <div>
              <p className="font-semibold">
                {isCalculator
                  ? content.header.calculatorTitle
                  : content.header.chatTitle}
              </p>
              <p className="text-sm text-white/70">
                {isCalculator
                  ? content.header.calculatorSubtitle
                  : content.header.chatSubtitle}
              </p>
            </div>

            <button
              type="button"
              onClick={closePanel}
              aria-label={content.header.closeLabel}
              className="rounded-full px-2 text-xl leading-none text-white/70 transition hover:text-white"
            >
              ×
            </button>
          </div>

          {isCalculator ? (
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
              <button
                type="button"
                onClick={() => setActiveMode('chat')}
                className="mb-3 self-start rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
              >
                ← {content.buttons.backToChat}
              </button>
              <ProjectCalculator />
            </div>
          ) : (
            <>
              <div
                role="log"
                aria-live="polite"
                className="flex flex-1 flex-col overflow-y-auto px-4 py-4"
              >
                <div className="flex flex-col gap-3">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.sender}-${index}`}
                      className={`max-w-[85%] whitespace-pre-line break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                        message.sender === 'user'
                          ? 'ml-auto bg-black text-white'
                          : 'bg-neutral-100 text-black'
                      }`}
                    >
                      {message.text}
                    </div>
                  ))}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-neutral-200 p-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  <Link
                    href={withLocale('/contact', lang)}
                    onClick={closePanel}
                    className="rounded-full border border-black bg-black px-3 py-1 text-xs text-white transition hover:opacity-90"
                  >
                    {content.contact.formLabel}
                  </Link>

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="rounded-full border border-black px-3 py-1 text-xs text-black transition hover:bg-black hover:text-white"
                  >
                    {content.contact.emailLabel}
                  </a>

                  <button
                    type="button"
                    onClick={() => setActiveMode('calculator')}
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
                  >
                    {content.buttons.calculator}
                  </button>

                  {quickKeys.map(key => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleQuickQuestion(key)}
                      className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
                    >
                      {content.buttons[key]}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleSend();
                      }
                    }}
                    aria-label={content.input.placeholder}
                    placeholder={content.input.placeholder}
                    className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-base outline-none transition focus:border-black md:text-sm"
                  />

                  <button
                    type="button"
                    onClick={handleSend}
                    className="shrink-0 rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    {content.buttons.send}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
