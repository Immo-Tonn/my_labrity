'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';

import { classnames } from '@/utils/classnames';

type BackgroundVideoProps = {
  webm: string;
  mp4: string;
  poster: string;
  pauseLabel: string;
  playLabel: string;
  className?: string;
  // Optional dimming layer above the video (under the control) and a custom
  // position for the pause/play button; defaults keep the original look.
  overlayClassName?: string;
  controlClassName?: string;
};

// Decorative, silent, looping video in a hairline frame. It only plays while
// it is on screen, stays on its poster for visitors who prefer reduced
// motion, and always offers a visible pause/play control.
export function BackgroundVideo({
  webm,
  mp4,
  poster,
  pauseLabel,
  playLabel,
  className,
  overlayClassName,
  controlClassName,
}: BackgroundVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [userPaused, setUserPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    reducedRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (reducedRef.current) {
      setUserPaused(true);

      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => setPlaying(false));
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      setUserPaused(false);
      video.play().catch(() => undefined);
    } else {
      setUserPaused(true);
      video.pause();
    }
  };

  return (
    <div
      className={classnames(
        'relative overflow-hidden border border-[#111] bg-[#111111]',
        className,
      )}
    >
      <video
        ref={videoRef}
        aria-hidden="true"
        tabIndex={-1}
        muted
        loop
        playsInline
        preload="metadata"
        poster={poster}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={webm} type="video/webm" />
        <source src={mp4} type="video/mp4" />
      </video>

      {overlayClassName && (
        <div
          aria-hidden="true"
          className={classnames(
            'pointer-events-none absolute inset-0',
            overlayClassName,
          )}
        />
      )}

      <button
        type="button"
        onClick={toggle}
        aria-label={playing && !userPaused ? pauseLabel : playLabel}
        aria-pressed={userPaused}
        className={classnames(
          'absolute flex h-10 w-10 items-center justify-center border border-[#F7F7F5]/50 bg-[#111111]/80 text-[#F7F7F5] transition-colors duration-300 hover:border-[#FF3830] hover:bg-[#FF3830] hover:text-[#111111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F7F7F5]',
          controlClassName ?? 'bottom-3 right-3 md:bottom-5 md:right-8',
        )}
      >
        {playing && !userPaused ? (
          <Pause size={16} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <Play size={16} strokeWidth={1.8} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
