'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';

import { setBgVideoPaused, useBgVideoPaused } from '@/utils/bgVideoState';

type Props = { pauseLabel: string; playLabel: string };

// Small footer control for the site-wide background video. Hidden for
// visitors who prefer reduced motion, because the video never plays for them.
export default function BackgroundVideoToggle({
  pauseLabel,
  playLabel,
}: Props) {
  const paused = useBgVideoPaused();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);

    query.addEventListener('change', onChange);

    return () => query.removeEventListener('change', onChange);
  }, []);

  if (reduced) return null;

  return (
    <button
      type="button"
      onClick={() => setBgVideoPaused(!paused)}
      aria-label={paused ? playLabel : pauseLabel}
      aria-pressed={paused}
      className="flex h-8 w-8 shrink-0 items-center justify-center border border-[#F7F7F5]/35 text-[#F7F7F5]/80 transition-colors duration-300 hover:border-[#FF3830] hover:text-[#FF3830] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F7F7F5]"
    >
      {paused ? (
        <Play size={14} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Pause size={14} strokeWidth={1.8} aria-hidden="true" />
      )}
    </button>
  );
}
