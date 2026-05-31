'use client';

import { shouldShowChristmasSnow } from '@/utils/seasonalEvents';

type SnowFlake = {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: number;
  blur: string;
  drift: string;
  depth: 'near' | 'middle' | 'far';
};

const snowFlakes: SnowFlake[] = [
  {
    id: 1,
    left: '3%',
    size: '3px',
    duration: '18s',
    delay: '0s',
    opacity: 0.26,
    blur: '0.4px',
    drift: '18px',
    depth: 'far',
  },
  {
    id: 2,
    left: '9%',
    size: '6px',
    duration: '14s',
    delay: '2s',
    opacity: 0.36,
    blur: '0px',
    drift: '-22px',
    depth: 'near',
  },
  {
    id: 3,
    left: '15%',
    size: '4px',
    duration: '20s',
    delay: '4s',
    opacity: 0.3,
    blur: '0.6px',
    drift: '14px',
    depth: 'middle',
  },
  {
    id: 4,
    left: '22%',
    size: '7px',
    duration: '16s',
    delay: '1s',
    opacity: 0.34,
    blur: '0px',
    drift: '-18px',
    depth: 'near',
  },
  {
    id: 5,
    left: '29%',
    size: '3px',
    duration: '22s',
    delay: '6s',
    opacity: 0.22,
    blur: '0.8px',
    drift: '16px',
    depth: 'far',
  },
  {
    id: 6,
    left: '36%',
    size: '5px',
    duration: '17s',
    delay: '3s',
    opacity: 0.32,
    blur: '0.3px',
    drift: '-26px',
    depth: 'middle',
  },
  {
    id: 7,
    left: '43%',
    size: '8px',
    duration: '13s',
    delay: '5s',
    opacity: 0.38,
    blur: '0px',
    drift: '24px',
    depth: 'near',
  },
  {
    id: 8,
    left: '50%',
    size: '4px',
    duration: '19s',
    delay: '2s',
    opacity: 0.28,
    blur: '0.5px',
    drift: '-14px',
    depth: 'middle',
  },
  {
    id: 9,
    left: '57%',
    size: '3px',
    duration: '23s',
    delay: '7s',
    opacity: 0.22,
    blur: '0.9px',
    drift: '18px',
    depth: 'far',
  },
  {
    id: 10,
    left: '64%',
    size: '6px',
    duration: '15s',
    delay: '1s',
    opacity: 0.35,
    blur: '0px',
    drift: '-20px',
    depth: 'near',
  },
  {
    id: 11,
    left: '71%',
    size: '4px',
    duration: '21s',
    delay: '4s',
    opacity: 0.28,
    blur: '0.5px',
    drift: '15px',
    depth: 'middle',
  },
  {
    id: 12,
    left: '78%',
    size: '7px',
    duration: '14s',
    delay: '6s',
    opacity: 0.36,
    blur: '0px',
    drift: '-24px',
    depth: 'near',
  },
  {
    id: 13,
    left: '85%',
    size: '3px',
    duration: '24s',
    delay: '3s',
    opacity: 0.21,
    blur: '0.9px',
    drift: '12px',
    depth: 'far',
  },
  {
    id: 14,
    left: '92%',
    size: '5px',
    duration: '18s',
    delay: '5s',
    opacity: 0.3,
    blur: '0.4px',
    drift: '-18px',
    depth: 'middle',
  },
  {
    id: 15,
    left: '97%',
    size: '4px',
    duration: '20s',
    delay: '8s',
    opacity: 0.26,
    blur: '0.6px',
    drift: '16px',
    depth: 'middle',
  },
  {
    id: 16,
    left: '12%',
    size: '5px',
    duration: '19s',
    delay: '9s',
    opacity: 0.28,
    blur: '0.5px',
    drift: '-16px',
    depth: 'middle',
  },
  {
    id: 17,
    left: '33%',
    size: '3px',
    duration: '25s',
    delay: '10s',
    opacity: 0.2,
    blur: '1px',
    drift: '14px',
    depth: 'far',
  },
  {
    id: 18,
    left: '61%',
    size: '6px',
    duration: '16s',
    delay: '9s',
    opacity: 0.33,
    blur: '0.2px',
    drift: '-22px',
    depth: 'near',
  },
  {
    id: 19,
    left: '88%',
    size: '4px',
    duration: '22s',
    delay: '11s',
    opacity: 0.25,
    blur: '0.7px',
    drift: '17px',
    depth: 'far',
  },
  {
    id: 20,
    left: '46%',
    size: '5px',
    duration: '18s',
    delay: '12s',
    opacity: 0.29,
    blur: '0.4px',
    drift: '-15px',
    depth: 'middle',
  },
];

type SeasonalSnowProps = {
  testDate?: Date;
};

function getDepthClass(depth: SnowFlake['depth']) {
  if (depth === 'near') {
    return 'scale-110';
  }

  if (depth === 'far') {
    return 'scale-75';
  }

  return 'scale-100';
}

export default function SeasonalSnow({ testDate }: SeasonalSnowProps) {
  const isVisible = shouldShowChristmasSnow(testDate);

  if (!isVisible) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden">
        {snowFlakes.map((flake, index) => (
          <span
            key={flake.id}
            className={`absolute top-[-24px] rounded-full ${getDepthClass(
              flake.depth,
            )} ${index > 11 ? 'hidden md:block' : ''}`}
            style={{
              left: flake.left,
              width: flake.size,
              height: flake.size,
              opacity: flake.opacity,
              filter: `blur(${flake.blur})`,
              background:
                'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(245,245,245,0.85) 42%, rgba(17,17,17,0.22) 100%)',
              boxShadow:
                '0 0 8px rgba(255,255,255,0.55), 0 0 1px rgba(17,17,17,0.22)',
              animation: `labritySnowFall ${flake.duration} linear ${flake.delay} infinite`,
              ['--snow-drift' as string]: flake.drift,
            }}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes labritySnowFall {
          0% {
            transform: translate3d(0, -28px, 0) scale(0.85);
          }

          20% {
            transform: translate3d(var(--snow-drift), 20vh, 0) scale(1);
          }

          45% {
            transform: translate3d(calc(var(--snow-drift) * -0.55), 45vh, 0)
              scale(0.92);
          }

          70% {
            transform: translate3d(calc(var(--snow-drift) * 0.75), 70vh, 0)
              scale(1.08);
          }

          100% {
            transform: translate3d(calc(var(--snow-drift) * -0.35), 108vh, 0)
              scale(0.9);
          }
        }
      `}</style>
    </>
  );
}
