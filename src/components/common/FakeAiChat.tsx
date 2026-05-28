'use client';

import { useEffect, useRef, useState } from 'react';

import ProjectCalculator from '@/components/common/ProjectCalculator';
import { chatbotResponses } from '@/data/chatbotResponses';
import { getData } from '@/utils/getData';
import { useLanguage } from '@/utils/LanguageContext';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

type ActiveMode = 'chat' | 'calculator';

type AiAssistantData = {
  header: {
    chatTitle: string;
    calculatorTitle: string;
    chatSubtitle: string;
    calculatorSubtitle: string;
    closeLabel: string;
    openLabel: string;
  };
  initialMessage: string;
  teaserMessages: string[];
  buttons: {
    calculator: string;
    price: string;
    seo: string;
    portfolio: string;
    send: string;
    backToChat: string;
  };
  input: {
    placeholder: string;
  };
  typing: string;
  suggestedQuestions: {
    price: string;
    seo: string;
    portfolio: string;
  };
  repeatedMessageResponses: string[];
  idleMessages: string[];
  unknownResponses: string[];
  shortMessage: string;
  longMessage: string;
  ctaMessage: string;
  priorityResponses: {
    website: string;
    price: string;
    duration: string;
  };
  funnyResponses: {
    stress: string;
    human: string;
    age: string;
    bestDeveloper: string;
    free: string;
    matrix: string;
    mood: string;
    seoRepeat: string;
    apple: string;
  };
};

const fallbackAssistantData: AiAssistantData = {
  header: {
    chatTitle: 'Labrity Assistant',
    calculatorTitle: 'Labrity AI-Kalkulator',
    chatSubtitle: 'Online • Antworten auf kurze Fragen',
    calculatorSubtitle: 'AI • Projektanalyse',
    closeLabel: 'Labrity Assistant schließen',
    openLabel: 'Labrity Assistant öffnen',
  },
  initialMessage: 'Hallo 👋 Wie kann ich Ihnen helfen?',
  teaserMessages: [
    '👋 Fragen zu Website oder SEO?',
    'AI Assistant online',
    'Brauchen Sie eine moderne Website?',
  ],
  buttons: {
    calculator: '✨ Projekt-Kalkulator',
    price: 'Preis',
    seo: 'SEO',
    portfolio: 'Portfolio',
    send: 'Send',
    backToChat: '← Zurück zum Chat',
  },
  input: {
    placeholder: 'Nachricht schreiben...',
  },
  typing: 'Assistant schreibt',
  suggestedQuestions: {
    price: 'Was kostet eine Website?',
    seo: 'SEO',
    portfolio: 'Portfolio',
  },
  repeatedMessageResponses: [
    'Diese Nachricht kommt mir bekannt vor 😄 Testen Sie mich gerade?',
    '😄 Ich glaube, das hatten wir schon.',
    'Noch einmal? 😄 Ich bin wach, versprochen.',
  ],
  idleMessages: [
    '👀👀👀',
    'Ich bin noch da 👀 Falls Sie Fragen zu Websites, SEO oder Projekten haben, schreiben Sie einfach.',
    'Ich warte ganz professionell im Hintergrund 😄',
    'Noch da? Wenn Sie über ein Website-Projekt nachdenken, helfe ich gern.',
    'Kleiner Bot, große Geduld 😄',
  ],
  unknownResponses: [
    'Ich glaube, mein digitales Gehirn hat kurz geblinzelt 😄 Fragen Sie mich gerne zu Website, SEO, Preisen oder dem Projekt-Kalkulator.',
    'Hmm, das habe ich nicht ganz verstanden 😄 Ich kann besser bei Fragen zu Websites, Landingpages, SEO oder Projektkosten helfen.',
    'Das klingt spannend, aber etwas geheimnisvoll 😄 Für eine grobe Einschätzung können Sie den Projekt-Kalkulator nutzen.',
  ],
  shortMessage:
    'Zu kurz für mein kleines Bot-Gehirn 😄 Schreiben Sie bitte etwas genauer.',
  longMessage:
    'Das ist eine größere Frage 😄 Am besten nutzen Sie den Projekt-Kalkulator oder schreiben uns über das Kontaktformular.',
  ctaMessage:
    'Wenn Sie möchten, können Sie den Projekt-Kalkulator nutzen oder direkt eine Anfrage über das Kontaktformular senden.',
  priorityResponses: {
    website:
      'Sehr gerne 😊 Wir können Ihnen bei einer neuen Website helfen. Für eine erste Einschätzung können Sie den ✨ Projekt-Kalkulator nutzen oder uns über das Kontaktformular schreiben.',
    price:
      'Die Kosten hängen vom Umfang, Design, der Seitenanzahl und den gewünschten Funktionen ab. Für eine grobe Einschätzung können Sie den ✨ Projekt-Kalkulator nutzen oder uns über das Kontaktformular schreiben.',
    duration:
      'Die Dauer hängt vom Projektumfang ab. Eine kleine Website kann schneller umgesetzt werden, ein größeres Projekt mit Animationen, SEO oder Datenbank braucht mehr Zeit.',
  },
  funnyResponses: {
    stress:
      '😄 Klingt nach Projekt-Stress. Atmen Sie kurz durch — eine gute Website hilft.',
    human:
      'Noch nicht 😄 Aber ich arbeite schon ziemlich gut ohne Schlaf und Kaffee.',
    age: 'Mein Alter wird in Commits gemessen 😄',
    bestDeveloper: 'Natürlich das Labrity Team 😄 Da gibt es keine Diskussion.',
    free: '😄 Kostenlos kann ich nur ein schönes UI wünschen. Für ein Projekt sprechen wir besser individuell.',
    matrix: 'Wake up, Neo... The website has you 👀',
    mood: 'Sehr gut 😄 Heute wollte noch niemand eine Website “wie Apple, aber für 50 Euro”.',
    seoRepeat: 'Ich glaube, SEO ist Ihnen wirklich wichtig 😄',
    apple:
      'Eine Website wie Apple — Klassiker 😄 Wichtig ist nur, dass das Budget nicht wie Apfelsaft ist.',
  },
};

const getRandomItem = (items: string[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

const mergeAssistantData = (
  data: Partial<AiAssistantData>,
): AiAssistantData => {
  return {
    ...fallbackAssistantData,
    ...data,
    header: {
      ...fallbackAssistantData.header,
      ...(data.header || {}),
    },
    buttons: {
      ...fallbackAssistantData.buttons,
      ...(data.buttons || {}),
    },
    input: {
      ...fallbackAssistantData.input,
      ...(data.input || {}),
    },
    suggestedQuestions: {
      ...fallbackAssistantData.suggestedQuestions,
      ...(data.suggestedQuestions || {}),
    },
    priorityResponses: {
      ...fallbackAssistantData.priorityResponses,
      ...(data.priorityResponses || {}),
    },
    funnyResponses: {
      ...fallbackAssistantData.funnyResponses,
      ...(data.funnyResponses || {}),
    },
    teaserMessages: data.teaserMessages?.length
      ? data.teaserMessages
      : fallbackAssistantData.teaserMessages,
    repeatedMessageResponses: data.repeatedMessageResponses?.length
      ? data.repeatedMessageResponses
      : fallbackAssistantData.repeatedMessageResponses,
    idleMessages: data.idleMessages?.length
      ? data.idleMessages
      : fallbackAssistantData.idleMessages,
    unknownResponses: data.unknownResponses?.length
      ? data.unknownResponses
      : fallbackAssistantData.unknownResponses,
  };
};
export default function FakeAiChat() {
  const { lang } = useLanguage();

  const [assistantData, setAssistantData] = useState<AiAssistantData | null>(
    null,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<ActiveMode>('chat');
  const [isTyping, setIsTyping] = useState(false);
  const [showTeaser, setShowTeaser] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const lastUserMessageRef = useRef('');
  const repeatedCountRef = useRef(0);
  const idleTimerRef = useRef<number | null>(null);
  const idleCountRef = useRef(0);
  const userMessagesCountRef = useRef(0);

  const content = assistantData ?? fallbackAssistantData;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('aiAssistant', lang);
        const mergedData = mergeAssistantData(data || {});

        setAssistantData(mergedData);
        setMessages([
          {
            text: mergedData.initialMessage,
            sender: 'bot',
          },
        ]);
      } catch {
        setAssistantData(fallbackAssistantData);
        setMessages([
          {
            text: fallbackAssistantData.initialMessage,
            sender: 'bot',
          },
        ]);
      }
    };

    loadData();

    setInput('');
    setActiveMode('chat');
    setIsTyping(false);
    setShowTeaser(false);

    lastUserMessageRef.current = '';
    repeatedCountRef.current = 0;
    idleCountRef.current = 0;
    userMessagesCountRef.current = 0;
  }, [lang]);

  useEffect(() => {
    if (!assistantData) return;

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
  }, [assistantData]);

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
    if (!isOpen || activeMode !== 'chat') return;
    if (idleCountRef.current >= 3) return;

    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          text: getRandomItem(content.idleMessages),
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
  }, [isOpen, activeMode, messages, content.idleMessages]);

  const getPriorityResponse = (message: string) => {
    const lower = message.toLowerCase();

    if (
      lower.includes('website erstellen') ||
      lower.includes('webseite erstellen') ||
      lower.includes('homepage erstellen') ||
      lower.includes('seite erstellen') ||
      lower.includes('ich möchte eine website') ||
      lower.includes('ich brauche eine website') ||
      lower.includes('neue website') ||
      lower.includes('create website') ||
      lower.includes('new website') ||
      lower.includes('need a website') ||
      lower.includes('створити сайт') ||
      lower.includes('потрібен сайт') ||
      lower.includes('хочу сайт') ||
      lower.includes('сделать сайт') ||
      lower.includes('создать сайт') ||
      lower.includes('нужен сайт')
    ) {
      return content.priorityResponses.website;
    }

    if (
      lower.includes('preis') ||
      lower.includes('kosten') ||
      lower.includes('kostet') ||
      lower.includes('was kostet') ||
      lower.includes('wie viel kostet') ||
      lower.includes('angebot') ||
      lower.includes('budget') ||
      lower.includes('price') ||
      lower.includes('cost') ||
      lower.includes('how much') ||
      lower.includes('offer') ||
      lower.includes('ціна') ||
      lower.includes('вартість') ||
      lower.includes('скільки коштує') ||
      lower.includes('цена') ||
      lower.includes('стоимость') ||
      lower.includes('сколько стоит') ||
      lower.includes('прайс') ||
      lower.includes('бюджет')
    ) {
      return content.priorityResponses.price;
    }

    if (
      lower.includes('dauer') ||
      lower.includes('wie lange') ||
      lower.includes('zeit') ||
      lower.includes('wann fertig') ||
      lower.includes('timeline') ||
      lower.includes('how long') ||
      lower.includes('when ready') ||
      lower.includes('термін') ||
      lower.includes('скільки часу') ||
      lower.includes('коли готово') ||
      lower.includes('срок') ||
      lower.includes('сколько времени')
    ) {
      return content.priorityResponses.duration;
    }

    return null;
  };

  const getFunnyResponse = (message: string) => {
    const lower = message.toLowerCase();

    if (
      lower.includes('scheiße') ||
      lower.includes('shit') ||
      lower.includes('fuck') ||
      lower.includes('блять') ||
      lower.includes('блин') ||
      lower.includes('сука')
    ) {
      return content.funnyResponses.stress;
    }

    if (
      lower.includes('ты человек') ||
      lower.includes('ти людина') ||
      lower.includes('ты живой') ||
      lower.includes('ти живий') ||
      lower.includes('bist du mensch') ||
      lower.includes('bist du ein mensch') ||
      lower.includes('are you human')
    ) {
      return content.funnyResponses.human;
    }

    if (
      lower.includes('сколько тебе лет') ||
      lower.includes('скільки тобі років') ||
      lower.includes('wie alt bist du') ||
      lower.includes('how old are you')
    ) {
      return content.funnyResponses.age;
    }

    if (
      lower.includes('кто лучший разработчик') ||
      lower.includes('лучший разработчик') ||
      lower.includes('хто найкращий розробник') ||
      lower.includes('bester entwickler') ||
      lower.includes('beste entwickler') ||
      lower.includes('best developer')
    ) {
      return content.funnyResponses.bestDeveloper;
    }

    if (
      lower.includes('бесплатно') ||
      lower.includes('безкоштовно') ||
      lower.includes('free') ||
      lower.includes('kostenlos') ||
      lower.includes('umsonst')
    ) {
      return content.funnyResponses.free;
    }

    if (
      lower.includes('matrix') ||
      lower.includes('матрица') ||
      lower.includes('матриця')
    ) {
      return content.funnyResponses.matrix;
    }

    if (
      lower.includes('как настроение') ||
      lower.includes('настроение') ||
      lower.includes('як настрій') ||
      lower.includes('настрій') ||
      lower.includes('wie geht') ||
      lower.includes('stimmung') ||
      lower.includes('how are you')
    ) {
      return content.funnyResponses.mood;
    }

    if (lower.includes('seo seo seo')) {
      return content.funnyResponses.seoRepeat;
    }

    if (
      lower.includes('apple') ||
      lower.includes('эпл') ||
      lower.includes('епл') ||
      lower.includes('как у apple') ||
      lower.includes('як у apple')
    ) {
      return content.funnyResponses.apple;
    }

    return null;
  };

  const getBotResponse = (message: string) => {
    const cleanMessage = message.trim();
    const lowerCaseMessage = cleanMessage.toLowerCase();

    if (lowerCaseMessage === lastUserMessageRef.current) {
      repeatedCountRef.current += 1;
    } else {
      repeatedCountRef.current = 1;
      lastUserMessageRef.current = lowerCaseMessage;
    }

    if (repeatedCountRef.current >= 3) {
      return getRandomItem(content.repeatedMessageResponses);
    }

    if (cleanMessage.length <= 2) {
      return content.shortMessage;
    }

    if (cleanMessage.length > 220) {
      return content.longMessage;
    }

    const priorityResponse = getPriorityResponse(cleanMessage);

    if (priorityResponse) {
      return priorityResponse;
    }

    const funnyResponse = getFunnyResponse(cleanMessage);

    if (funnyResponse) {
      return funnyResponse;
    }

    if (lang === 'de') {
      const matchedResponse = chatbotResponses.find(item =>
        item.keywords.some(keyword =>
          lowerCaseMessage.includes(keyword.toLowerCase()),
        ),
      );

      if (matchedResponse) {
        return matchedResponse.response;
      }
    }

    return getRandomItem(content.unknownResponses);
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
        sendBotMessageWithDelay(content.ctaMessage);
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

  const openCalculator = () => {
    setActiveMode('calculator');
    setShowTeaser(false);
  };

  const backToChat = () => {
    setActiveMode('chat');
  };
  return (
    <>
      {showTeaser && !isOpen && assistantData && (
        <div className="fixed bottom-[92px] right-6 z-50 max-w-[230px] animate-bounce rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-black shadow-[0_12px_35px_rgba(0,0,0,0.14)]">
          {getRandomItem(content.teaserMessages)}
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={content.header.openLabel}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-black text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition hover:scale-105"
      >
        <span className="absolute right-1 top-1 h-3 w-3 rounded-full border-2 border-black bg-green-400" />
        AI
      </button>

      {isOpen && (
        <div className="fixed bottom-20 left-4 right-4 z-50 flex h-[min(520px,calc(100dvh-120px))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:bottom-24 md:left-auto md:right-6 md:w-[350px]">
          <div className="flex items-start justify-between border-b border-neutral-200 bg-black px-5 py-4 text-white">
            <div>
              <p className="font-semibold">
                {activeMode === 'calculator'
                  ? content.header.calculatorTitle
                  : content.header.chatTitle}
              </p>

              <p className="text-sm text-white/70">
                {activeMode === 'calculator'
                  ? content.header.calculatorSubtitle
                  : content.header.chatSubtitle}
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              aria-label={content.header.closeLabel}
              className="rounded-full px-2 text-xl leading-none text-white/70 transition hover:text-white"
            >
              ×
            </button>
          </div>

          {activeMode === 'chat' ? (
            <>
              <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                <div className="flex flex-col gap-3">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.sender}-${index}`}
                      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${
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
                        <span className="animate-pulse">{content.typing}</span>
                        <span className="animate-bounce">.</span>
                        <span className="animate-bounce delay-100">.</span>
                        <span className="animate-bounce delay-200">.</span>
                      </span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="border-t border-neutral-200 p-3">
                <div className="mb-3 flex flex-wrap gap-2">
                  <button
                    onClick={openCalculator}
                    className="rounded-full border border-black bg-black px-3 py-1 text-xs text-white transition hover:opacity-90"
                  >
                    {content.buttons.calculator}
                  </button>

                  <button
                    onClick={() =>
                      handleSuggestedQuestion(content.suggestedQuestions.price)
                    }
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
                  >
                    {content.buttons.price}
                  </button>

                  <button
                    onClick={() =>
                      handleSuggestedQuestion(content.suggestedQuestions.seo)
                    }
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
                  >
                    {content.buttons.seo}
                  </button>

                  <button
                    onClick={() =>
                      handleSuggestedQuestion(
                        content.suggestedQuestions.portfolio,
                      )
                    }
                    className="rounded-full border border-neutral-200 px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
                  >
                    {content.buttons.portfolio}
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
                    placeholder={content.input.placeholder}
                    className="min-w-0 flex-1 rounded-xl border border-neutral-300 px-4 py-3 text-base outline-none transition focus:border-black md:text-sm"
                  />

                  <button
                    onClick={handleSend}
                    disabled={isTyping}
                    className="shrink-0 rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {content.buttons.send}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
              <button
                onClick={backToChat}
                className="mb-3 self-start rounded-full border border-neutral-200 bg-white px-3 py-1 text-xs text-neutral-600 transition hover:border-black hover:text-black"
              >
                {content.buttons.backToChat}
              </button>

              <ProjectCalculator />
            </div>
          )}
        </div>
      )}
    </>
  );
}
