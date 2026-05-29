'use client';

import { useEffect, useMemo, useState } from 'react';

const activities = [
  'Neue Anfrage aus Stuttgart',
  'Landingpage-Projekt gestartet',
  'Neue Anfrage aus Düsseldorf',
  'SEO-Analyse angefragt',
  'Business-Website vorbereitet',
  'Neue Anfrage aus Frankfurt',
  'Portfolio-Website angefragt',
  'Projekt aus München gestartet',
  'Neue Branding-Anfrage erhalten',
  'Website-Relaunch vorbereitet',
  'Neue Anfrage aus Hamburg',
  'AI-Projektanalyse abgeschlossen',
  'Neue Website-Anfrage erhalten',
  'Projekt aus Köln vorbereitet',
  'Neue Anfrage aus Leipzig',
  'Modernes Webdesign angefragt',
  'Neue Anfrage aus Hannover',
  'SEO-Projekt gestartet',
  'Premium-Website angefragt',
  'Neue Anfrage aus Nürnberg',
  'Website-Konzept vorbereitet',
  'Neue Anfrage aus Karlsruhe',
  'AI-Kalkulator wurde genutzt',
  'Neue Anfrage aus Mannheim',
];

const times = [
  'gerade eben',
  'vor 1 Minute',
  'vor 2 Minuten',
  'vor 4 Minuten',
  'vor 5 Minuten',
];

export default function LiveActivity() {
  const [isVisible, setIsVisible] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [timeIndex, setTimeIndex] = useState(0);

  const activity = useMemo(() => activities[activityIndex], [activityIndex]);
  const time = useMemo(() => times[timeIndex], [timeIndex]);

  useEffect(() => {
    const showActivity = () => {
      setActivityIndex(Math.floor(Math.random() * activities.length));
      setTimeIndex(Math.floor(Math.random() * times.length));
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
  }, []);

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
