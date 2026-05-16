'use client';

import { useMemo, useState } from 'react';

import { sendMessage } from '@/api/telegram';

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

const quizQuestions: QuizQuestion[] = [
  {
    key: 'business',
    label: 'Business',
    question: 'Welches Business haben Sie?',
    answers: [
      { label: 'Selbstständig', value: 'Selbstständig', weight: 1 },
      { label: 'Kleines Unternehmen', value: 'Kleines Unternehmen', weight: 1 },
      { label: 'Marke / Studio', value: 'Marke / Studio', weight: 2 },
      { label: 'Online-Shop', value: 'Online-Shop', weight: 4 },
      {
        label: 'Noch nicht gestartet',
        value: 'Noch nicht gestartet',
        weight: 1,
      },
    ],
  },
  {
    key: 'websiteType',
    label: 'Website-Typ',
    question: 'Welche Website brauchen Sie?',
    answers: [
      { label: 'Landingpage', value: 'Landingpage', weight: 1 },
      { label: 'Firmenwebsite', value: 'Firmenwebsite', weight: 2 },
      {
        label: 'Portfolio / Personal Brand',
        value: 'Portfolio / Personal Brand',
        weight: 2,
      },
      { label: 'Online-Shop', value: 'Online-Shop', weight: 5 },
      { label: 'Noch nicht sicher', value: 'Noch nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'mainGoal',
    label: 'Ziel',
    question: 'Was ist das wichtigste Ziel der Website?',
    answers: [
      { label: 'Mehr Anfragen', value: 'Mehr Anfragen', weight: 1 },
      { label: 'Premium-Auftritt', value: 'Premium-Auftritt', weight: 2 },
      { label: 'Online verkaufen', value: 'Online verkaufen', weight: 5 },
      {
        label: 'Informationen zeigen',
        value: 'Informationen zeigen',
        weight: 1,
      },
      { label: 'Noch nicht sicher', value: 'Noch nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'existingWebsite',
    label: 'Aktuelle Website',
    question: 'Gibt es bereits eine Website?',
    answers: [
      { label: 'Nein', value: 'Nein', weight: 1 },
      {
        label: 'Ja, aber sie ist okay',
        value: 'Ja, aber sie ist okay',
        weight: 0,
      },
      {
        label: 'Ja, braucht Redesign',
        value: 'Ja, braucht Redesign',
        weight: 2,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'pages',
    label: 'Seitenanzahl',
    question: 'Wie groß soll die Website ungefähr werden?',
    answers: [
      { label: '1 Seite', value: '1 Seite', weight: 0 },
      { label: '2–5 Seiten', value: '2–5 Seiten', weight: 1 },
      { label: '6–10 Seiten', value: '6–10 Seiten', weight: 3 },
      { label: 'Mehr als 10 Seiten', value: 'Mehr als 10 Seiten', weight: 5 },
      { label: 'Noch nicht sicher', value: 'Noch nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'design',
    label: 'Design-Stil',
    question: 'Wie soll das Design aussehen?',
    answers: [
      { label: 'Einfach & sauber', value: 'Einfach & sauber', weight: 0 },
      { label: 'Minimal & modern', value: 'Minimal & modern', weight: 1 },
      {
        label: 'Modern mit Animationen',
        value: 'Modern mit Animationen',
        weight: 3,
      },
      { label: 'Premium / kreativ', value: 'Premium / kreativ', weight: 4 },
      { label: 'Noch nicht sicher', value: 'Noch nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'animations',
    label: 'Animationen',
    question: 'Brauchen Sie Animationen oder visuelle Effekte?',
    answers: [
      { label: 'Nein', value: 'Nein', weight: 0 },
      { label: 'Kleine Animationen', value: 'Kleine Animationen', weight: 1 },
      {
        label: 'Viele moderne Effekte',
        value: 'Viele moderne Effekte',
        weight: 4,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'references',
    label: 'Referenzen',
    question: 'Haben Sie Beispiel-Websites oder Referenzen?',
    answers: [
      { label: 'Ja, klare Beispiele', value: 'Ja, klare Beispiele', weight: 0 },
      { label: 'Ein paar Ideen', value: 'Ein paar Ideen', weight: 1 },
      {
        label: 'Nein, brauche Beratung',
        value: 'Nein, brauche Beratung',
        weight: 2,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'content',
    label: 'Inhalte',
    question: 'Wer liefert Texte, Bilder und Videos?',
    answers: [
      { label: 'Alles vorhanden', value: 'Alles vorhanden', weight: 0 },
      { label: 'Teilweise vorhanden', value: 'Teilweise vorhanden', weight: 2 },
      {
        label: 'Wir brauchen Unterstützung',
        value: 'Wir brauchen Unterstützung',
        weight: 4,
      },
      { label: 'Noch nicht sicher', value: 'Noch nicht sicher', weight: 2 },
    ],
  },
  {
    key: 'copywriting',
    label: 'Texte',
    question: 'Brauchen Sie Hilfe bei Website-Texten?',
    answers: [
      {
        label: 'Nein, Texte sind fertig',
        value: 'Nein, Texte sind fertig',
        weight: 0,
      },
      {
        label: 'Texte müssen verbessert werden',
        value: 'Texte müssen verbessert werden',
        weight: 2,
      },
      {
        label: 'Texte komplett erstellen',
        value: 'Texte komplett erstellen',
        weight: 4,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'media',
    label: 'Medien',
    question: 'Brauchen Sie Fotos, Videos oder Hero-Video?',
    answers: [
      { label: 'Nein', value: 'Nein', weight: 0 },
      { label: 'Fotos', value: 'Fotos', weight: 1 },
      { label: 'Fotos + Videos', value: 'Fotos + Videos', weight: 3 },
      {
        label: 'Hero-Video / Premium Look',
        value: 'Hero-Video / Premium Look',
        weight: 4,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'branding',
    label: 'Branding',
    question: 'Gibt es Logo, Farben und Branding?',
    answers: [
      { label: 'Alles vorhanden', value: 'Alles vorhanden', weight: 0 },
      { label: 'Nur Logo', value: 'Nur Logo', weight: 1 },
      {
        label: 'Alles neu entwickeln',
        value: 'Alles neu entwickeln',
        weight: 4,
      },
      { label: 'Noch nicht sicher', value: 'Noch nicht sicher', weight: 2 },
    ],
  },
  {
    key: 'forms',
    label: 'Kontakt / Leads',
    question: 'Wie sollen Kunden Sie kontaktieren?',
    answers: [
      { label: 'Kontaktformular', value: 'Kontaktformular', weight: 1 },
      { label: 'WhatsApp / Telefon', value: 'WhatsApp / Telefon', weight: 1 },
      {
        label: 'Formular + Email',
        value: 'Formular + Email',
        weight: 2,
      },
      { label: 'Buchung / Kalender', value: 'Buchung / Kalender', weight: 4 },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'functions',
    label: 'Funktionen',
    question: 'Brauchen Sie besondere Funktionen?',
    answers: [
      { label: 'Nein, einfache Website', value: 'Einfache Website', weight: 0 },
      { label: 'Kontaktformular', value: 'Kontaktformular', weight: 1 },
      { label: 'Buchungssystem', value: 'Buchungssystem', weight: 4 },
      { label: 'Login / Datenbank', value: 'Login / Datenbank', weight: 6 },
      {
        label: 'Online-Zahlung / Shop',
        value: 'Online-Zahlung / Shop',
        weight: 7,
      },
    ],
  },
  {
    key: 'editable',
    label: 'Bearbeitung',
    question: 'Möchten Sie Inhalte später selbst bearbeiten?',
    answers: [
      { label: 'Nein', value: 'Nein', weight: 0 },
      {
        label: 'Ja, einfache Änderungen',
        value: 'Ja, einfache Änderungen',
        weight: 2,
      },
      {
        label: 'Ja, CMS / Adminbereich',
        value: 'Ja, CMS / Adminbereich',
        weight: 5,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'languages',
    label: 'Sprachen',
    question: 'Brauchen Sie mehrere Sprachen?',
    answers: [
      { label: 'Nur Deutsch', value: 'Nur Deutsch', weight: 0 },
      { label: 'Deutsch + Englisch', value: 'Deutsch + Englisch', weight: 2 },
      { label: '3 Sprachen', value: '3 Sprachen', weight: 3 },
      { label: 'Mehrsprachig', value: 'Mehrsprachig', weight: 5 },
      { label: 'Noch nicht sicher', value: 'Noch nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'seo',
    label: 'SEO',
    question: 'Wie wichtig ist SEO / Google?',
    answers: [
      { label: 'Sehr wichtig', value: 'Sehr wichtig', weight: 4 },
      { label: 'Mittel', value: 'Mittel', weight: 1 },
      { label: 'Später', value: 'Später', weight: 1 },
      { label: 'Nicht wichtig', value: 'Nicht wichtig', weight: 0 },
    ],
  },
  {
    key: 'localSeo',
    label: 'Local SEO',
    question: 'Ist lokale Sichtbarkeit wichtig?',
    answers: [
      {
        label: 'Ja, Google Maps / lokal',
        value: 'Ja, Google Maps / lokal',
        weight: 2,
      },
      { label: 'Nein', value: 'Nein', weight: 0 },
      { label: 'Vielleicht später', value: 'Vielleicht später', weight: 1 },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'integrations',
    label: 'Integrationen',
    question: 'Brauchen Sie externe Integrationen?',
    answers: [
      { label: 'Nein', value: 'Nein', weight: 0 },
      {
        label: 'Google Maps / WhatsApp',
        value: 'Google Maps / WhatsApp',
        weight: 1,
      },
      { label: 'Newsletter / CRM', value: 'Newsletter / CRM', weight: 3 },
      {
        label: 'API / spezielle Systeme',
        value: 'API / spezielle Systeme',
        weight: 6,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'legal',
    label: 'Rechtliches',
    question: 'Brauchen Sie Impressum, Datenschutz oder Cookie-Hinweis?',
    answers: [
      {
        label: 'Ja, bitte berücksichtigen',
        value: 'Ja, bitte berücksichtigen',
        weight: 1,
      },
      { label: 'Schon vorhanden', value: 'Schon vorhanden', weight: 0 },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'domain',
    label: 'Domain',
    question: 'Haben Sie bereits Domain und Hosting?',
    answers: [
      { label: 'Ja', value: 'Ja', weight: 0 },
      { label: 'Nur Domain', value: 'Nur Domain', weight: 1 },
      {
        label: 'Nein, brauchen Hilfe',
        value: 'Nein, brauchen Hilfe',
        weight: 2,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'launch',
    label: 'Launch',
    question: 'Brauchen Sie Hilfe beim Launch / Deployment?',
    answers: [
      { label: 'Ja', value: 'Ja', weight: 2 },
      { label: 'Nein', value: 'Nein', weight: 0 },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'support',
    label: 'Support',
    question: 'Brauchen Sie Unterstützung nach dem Launch?',
    answers: [
      { label: 'Nein', value: 'Nein', weight: 0 },
      { label: 'Kleine Änderungen', value: 'Kleine Änderungen', weight: 1 },
      {
        label: 'Regelmäßige Betreuung',
        value: 'Regelmäßige Betreuung',
        weight: 3,
      },
      { label: 'Nicht sicher', value: 'Nicht sicher', weight: 1 },
    ],
  },
  {
    key: 'timeline',
    label: 'Start',
    question: 'Wann möchten Sie starten?',
    answers: [
      {
        label: 'So schnell wie möglich',
        value: 'So schnell wie möglich',
        weight: 3,
      },
      {
        label: 'Innerhalb eines Monats',
        value: 'Innerhalb eines Monats',
        weight: 2,
      },
      { label: 'In 2–3 Monaten', value: 'In 2–3 Monaten', weight: 1 },
      { label: 'Noch offen', value: 'Noch offen', weight: 0 },
    ],
  },
  {
    key: 'decision',
    label: 'Entscheidung',
    question: 'Wie weit ist Ihre Entscheidung?',
    answers: [
      {
        label: 'Ich möchte bald starten',
        value: 'Ich möchte bald starten',
        weight: 2,
      },
      {
        label: 'Ich vergleiche Angebote',
        value: 'Ich vergleiche Angebote',
        weight: 1,
      },
      {
        label: 'Ich informiere mich nur',
        value: 'Ich informiere mich nur',
        weight: 0,
      },
      { label: 'Noch nicht sicher', value: 'Noch nicht sicher', weight: 0 },
    ],
  },
];

const getEstimate = (score: number) => {
  if (score <= 20) {
    return {
      title: 'Kleines Landingpage-Projekt',
      description:
        'Das wirkt nach einem überschaubaren Website-Projekt mit klarer Struktur und eher einfachem Umfang.',
    };
  }

  if (score <= 42) {
    return {
      title: 'Moderne Business-Website',
      description:
        'Das wirkt nach einer professionellen Website mit individuellem Design, mehreren Inhalten und wichtigen Grundfunktionen.',
    };
  }

  if (score <= 65) {
    return {
      title: 'Individuelles Premium-Projekt',
      description:
        'Das wirkt nach einem anspruchsvolleren Projekt mit Design, SEO, mehreren Seiten, Content-Arbeit oder erweiterten Funktionen.',
    };
  }

  return {
    title: 'Komplexe individuelle Lösung',
    description:
      'Das wirkt nach einem größeren Projekt mit besonderen Funktionen, Shop, Login, Datenbank, Integrationen oder Premium-Design.',
  };
};

export default function ProjectCalculator() {
  const [isStarted, setIsStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [score, setScore] = useState(0);
  const [isPrepared, setIsPrepared] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const currentQuestion = quizQuestions[step];
  const isFinished = step >= quizQuestions.length;
  const progress = Math.round((step / quizQuestions.length) * 100);
  const estimate = useMemo(() => getEstimate(score), [score]);

  const handleAnswer = (answer: QuizAnswer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.key]: answer.value,
    }));

    setScore(prev => prev + answer.weight);
    setStep(prev => prev + 1);
    setSendError('');
  };

  const handlePrepareRequest = async () => {
    try {
      setIsSending(true);
      setSendError('');

      const formattedAnswers = Object.entries(answers)
        .map(([key, value]) => {
          const question = quizQuestions.find(item => item.key === key);

          return `${question?.label || key}: ${value}`;
        })
        .join('%0A');

      const message =
        `🤖 Neue AI-Projektanfrage von Labrity%0A%0A` +
        `AI-Einschätzung: ${estimate.title}%0A` +
        `Score: ${score}%0A%0A` +
        `${formattedAnswers}`;

      await sendMessage(message);

      setIsPrepared(true);
    } catch {
      setSendError(
        'Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es erneut.',
      );
    } finally {
      setIsSending(false);
    }
  };

  const resetQuiz = () => {
    setIsStarted(false);
    setStep(0);
    setAnswers({});
    setScore(0);
    setIsPrepared(false);
    setIsSending(false);
    setSendError('');
  };

  if (!isStarted) {
    return (
      <button
        onClick={() => setIsStarted(true)}
        className="w-full rounded-xl border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90"
      >
        ✨ Projekt-Kalkulator starten
      </button>
    );
  }

  return (
    <div className="mb-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-3">
      {!isFinished ? (
        <>
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-black">
                ✨ Projekt-Kalkulator
              </p>

              <p className="text-[11px] text-neutral-400">
                {step + 1}/{quizQuestions.length}
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
                key={answer.value}
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
            ✅ AI-Einschätzung abgeschlossen
          </p>

          <div className="mb-4 rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-sm font-semibold text-black">{estimate.title}</p>

            <p className="mt-2 text-xs leading-5 text-neutral-600">
              {estimate.description}
            </p>
          </div>

          <p className="mb-3 text-xs leading-5 text-neutral-500">
            Diese Einschätzung wurde automatisch vom AI-Assistenten erstellt und
            ist nur eine grobe Orientierung. Für ein genaues Angebot prüft das
            Labrity-Team Ihre Antworten persönlich.
          </p>

          <div className="space-y-1 rounded-xl bg-white p-3 text-xs text-neutral-600">
            {Object.entries(answers).map(([key, value]) => {
              const question = quizQuestions.find(item => item.key === key);

              return (
                <p key={key}>
                  <strong>{question?.label || key}:</strong> {value}
                </p>
              );
            })}
          </div>

          {!isPrepared ? (
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={handlePrepareRequest}
                disabled={isSending}
                className="rounded-xl bg-black px-4 py-3 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending
                  ? 'Anfrage wird gesendet...'
                  : 'Anfrage an Labrity-Team senden'}
              </button>

              <button
                onClick={resetQuiz}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600 transition hover:border-black hover:text-black"
              >
                Neu starten
              </button>

              {sendError && (
                <p className="text-xs leading-5 text-red-600">{sendError}</p>
              )}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-3">
              <p className="text-sm font-semibold text-black">
                AI-Anfrage gesendet ✅
              </p>

              <p className="mt-2 text-xs leading-5 text-neutral-600">
                Ihre Anfrage wurde erfolgreich an das Labrity-Team gesendet. Der
                AI-Assistent hat Ihre Angaben vorstrukturiert, damit unser Team
                Ihr Projekt besser einschätzen kann. Wir prüfen alles persönlich
                und melden uns mit einer passenden Rückmeldung.
              </p>

              <button
                onClick={resetQuiz}
                className="mt-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-600 transition hover:border-black hover:text-black"
              >
                Neue AI-Einschätzung starten
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
