'use client';

import { useEffect, useState } from 'react';

import { useBgVideoPaused } from '@/utils/bgVideoState';

// Site-wide, silent, looping video behind everything. The poster doubles as
// the layer's own background, so visitors who prefer reduced motion or who
// paused the video (and the first paint before it loads) see a still image.
export default function SiteBackground() {
  const [reduced, setReduced] = useState(false);
  const paused = useBgVideoPaused();

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');

    setReduced(query.matches);

    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches);

    query.addEventListener('change', onChange);

    return () => query.removeEventListener('change', onChange);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 bg-[#F7F7F5] bg-cover bg-center"
      style={{ backgroundImage: 'url(/videos/site-bg-poster.jpg)' }}
    >
      {!reduced && !paused && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/site-bg-poster.jpg"
          tabIndex={-1}
          className="pointer-events-none h-full w-full object-cover"
        >
          <source src="/videos/site-bg.webm" type="video/webm" />
          <source src="/videos/site-bg.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
