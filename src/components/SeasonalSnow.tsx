'use client';

import { useEffect, useState } from 'react';

import { shouldShowChristmasSnow } from '@/utils/seasonalEvents';

type SnowFlake = {
  id: number;
  left: string;
  size: string;
  duration: string;
  delay: string;
  opacity: number;
  drift: string;
  rotate: string;
  symbol: '❄' | '❅' | '❆' | '✻' | '✼';
  color: string;
  depth: 'near' | 'middle' | 'far';
};

const snowFlakes: SnowFlake[] = [
  // КРУПНЫЕ КРАСИВЫЕ СНЕЖИНКИ
  {
    id: 1,
    left: '4%',
    size: '36px',
    duration: '15s',
    delay: '2s',
    opacity: 0.95,
    drift: '34px',
    rotate: '260deg',
    symbol: '❄',
    color: '#3f9fdf',
    depth: 'near',
  },
  {
    id: 2,
    left: '13%',
    size: '32px',
    duration: '17s',
    delay: '8s',
    opacity: 0.92,
    drift: '-28px',
    rotate: '-240deg',
    symbol: '❅',
    color: '#4fa8e8',
    depth: 'near',
  },
  {
    id: 3,
    left: '24%',
    size: '38px',
    duration: '14s',
    delay: '5s',
    opacity: 0.94,
    drift: '30px',
    rotate: '300deg',
    symbol: '❆',
    color: '#57b0ed',
    depth: 'near',
  },
  {
    id: 4,
    left: '36%',
    size: '34px',
    duration: '16s',
    delay: '11s',
    opacity: 0.92,
    drift: '-32px',
    rotate: '-280deg',
    symbol: '❄',
    color: '#5fb7f0',
    depth: 'near',
  },
  {
    id: 5,
    left: '49%',
    size: '37px',
    duration: '18s',
    delay: '4s',
    opacity: 0.9,
    drift: '36px',
    rotate: '320deg',
    symbol: '❄',
    color: '#3f9fdf',
    depth: 'near',
  },
  {
    id: 6,
    left: '62%',
    size: '33px',
    duration: '15s',
    delay: '10s',
    opacity: 0.92,
    drift: '-34px',
    rotate: '-260deg',
    symbol: '❆',
    color: '#4fa8e8',
    depth: 'near',
  },
  {
    id: 7,
    left: '77%',
    size: '35px',
    duration: '17s',
    delay: '6s',
    opacity: 0.92,
    drift: '32px',
    rotate: '280deg',
    symbol: '❅',
    color: '#57b0ed',
    depth: 'near',
  },
  {
    id: 8,
    left: '92%',
    size: '31px',
    duration: '19s',
    delay: '13s',
    opacity: 0.88,
    drift: '-24px',
    rotate: '-220deg',
    symbol: '❄',
    color: '#67b9f3',
    depth: 'near',
  },

  // СРЕДНИЕ СНЕЖИНКИ
  {
    id: 9,
    left: '8%',
    size: '29px',
    duration: '22s',
    delay: '16s',
    opacity: 0.86,
    drift: '22px',
    rotate: '180deg',
    symbol: '❅',
    color: '#4fa8e8',
    depth: 'middle',
  },
  {
    id: 10,
    left: '18%',
    size: '28px',
    duration: '24s',
    delay: '9s',
    opacity: 0.84,
    drift: '-18px',
    rotate: '-160deg',
    symbol: '✻',
    color: '#5fb7f0',
    depth: 'middle',
  },
  {
    id: 11,
    left: '29%',
    size: '30px',
    duration: '20s',
    delay: '14s',
    opacity: 0.88,
    drift: '24px',
    rotate: '220deg',
    symbol: '❆',
    color: '#3f9fdf',
    depth: 'middle',
  },
  {
    id: 12,
    left: '41%',
    size: '28px',
    duration: '25s',
    delay: '3s',
    opacity: 0.84,
    drift: '-20px',
    rotate: '-180deg',
    symbol: '❄',
    color: '#57b0ed',
    depth: 'middle',
  },
  {
    id: 13,
    left: '54%',
    size: '30px',
    duration: '21s',
    delay: '18s',
    opacity: 0.86,
    drift: '20px',
    rotate: '190deg',
    symbol: '❅',
    color: '#3f9fdf',
    depth: 'middle',
  },
  {
    id: 14,
    left: '67%',
    size: '27px',
    duration: '26s',
    delay: '7s',
    opacity: 0.82,
    drift: '-16px',
    rotate: '-150deg',
    symbol: '✼',
    color: '#5fb7f0',
    depth: 'middle',
  },
  {
    id: 15,
    left: '80%',
    size: '31px',
    duration: '23s',
    delay: '12s',
    opacity: 0.86,
    drift: '24px',
    rotate: '210deg',
    symbol: '❆',
    color: '#4fa8e8',
    depth: 'middle',
  },
  {
    id: 16,
    left: '89%',
    size: '28px',
    duration: '24s',
    delay: '20s',
    opacity: 0.84,
    drift: '-14px',
    rotate: '-170deg',
    symbol: '✻',
    color: '#57b0ed',
    depth: 'middle',
  },

  // ДОПОЛНИТЕЛЬНЫЕ ВИДИМЫЕ СНЕЖИНКИ
  {
    id: 17,
    left: '2%',
    size: '30px',
    duration: '31s',
    delay: '24s',
    opacity: 0.86,
    drift: '16px',
    rotate: '180deg',
    symbol: '❄',
    color: '#4fa8e8',
    depth: 'far',
  },
  {
    id: 18,
    left: '7%',
    size: '28px',
    duration: '34s',
    delay: '19s',
    opacity: 0.84,
    drift: '-16px',
    rotate: '-170deg',
    symbol: '✻',
    color: '#5fb7f0',
    depth: 'far',
  },
  {
    id: 19,
    left: '12%',
    size: '31px',
    duration: '30s',
    delay: '27s',
    opacity: 0.86,
    drift: '18px',
    rotate: '190deg',
    symbol: '❅',
    color: '#57b0ed',
    depth: 'far',
  },
  {
    id: 20,
    left: '19%',
    size: '29px',
    duration: '36s',
    delay: '31s',
    opacity: 0.82,
    drift: '-14px',
    rotate: '-160deg',
    symbol: '✼',
    color: '#67b9f3',
    depth: 'far',
  },
  {
    id: 21,
    left: '27%',
    size: '32px',
    duration: '32s',
    delay: '22s',
    opacity: 0.88,
    drift: '18px',
    rotate: '200deg',
    symbol: '❆',
    color: '#3f9fdf',
    depth: 'far',
  },
  {
    id: 22,
    left: '33%',
    size: '28px',
    duration: '35s',
    delay: '15s',
    opacity: 0.84,
    drift: '-15px',
    rotate: '-190deg',
    symbol: '✻',
    color: '#5fb7f0',
    depth: 'far',
  },
  {
    id: 23,
    left: '39%',
    size: '30px',
    duration: '33s',
    delay: '29s',
    opacity: 0.86,
    drift: '17px',
    rotate: '180deg',
    symbol: '❄',
    color: '#67b9f3',
    depth: 'far',
  },
  {
    id: 24,
    left: '46%',
    size: '28px',
    duration: '37s',
    delay: '8s',
    opacity: 0.84,
    drift: '-14px',
    rotate: '-180deg',
    symbol: '❅',
    color: '#4fa8e8',
    depth: 'far',
  },
  {
    id: 25,
    left: '53%',
    size: '29px',
    duration: '34s',
    delay: '26s',
    opacity: 0.84,
    drift: '16px',
    rotate: '185deg',
    symbol: '✼',
    color: '#57b0ed',
    depth: 'far',
  },
  {
    id: 26,
    left: '60%',
    size: '31px',
    duration: '38s',
    delay: '33s',
    opacity: 0.86,
    drift: '-18px',
    rotate: '-200deg',
    symbol: '❆',
    color: '#3f9fdf',
    depth: 'far',
  },
  {
    id: 27,
    left: '69%',
    size: '30px',
    duration: '32s',
    delay: '17s',
    opacity: 0.86,
    drift: '17px',
    rotate: '190deg',
    symbol: '❄',
    color: '#4fa8e8',
    depth: 'far',
  },
  {
    id: 28,
    left: '75%',
    size: '28px',
    duration: '36s',
    delay: '28s',
    opacity: 0.84,
    drift: '-14px',
    rotate: '-170deg',
    symbol: '✻',
    color: '#5fb7f0',
    depth: 'far',
  },
  {
    id: 29,
    left: '83%',
    size: '29px',
    duration: '35s',
    delay: '21s',
    opacity: 0.84,
    drift: '16px',
    rotate: '180deg',
    symbol: '❅',
    color: '#57b0ed',
    depth: 'far',
  },
  {
    id: 30,
    left: '90%',
    size: '28px',
    duration: '39s',
    delay: '35s',
    opacity: 0.84,
    drift: '-16px',
    rotate: '-190deg',
    symbol: '✼',
    color: '#4fa8e8',
    depth: 'far',
  },
  {
    id: 31,
    left: '96%',
    size: '31px',
    duration: '34s',
    delay: '25s',
    opacity: 0.86,
    drift: '16px',
    rotate: '190deg',
    symbol: '❆',
    color: '#5fb7f0',
    depth: 'far',
  },
];

type SeasonalSnowProps = {
  testDate?: Date;
  forceVisible?: boolean;
};

function getDepthClass(depth: SnowFlake['depth']) {
  if (depth === 'near') return 'scale-110';
  if (depth === 'middle') return 'scale-100';

  return 'scale-100';
}

export default function SeasonalSnow({
  testDate,
  forceVisible = false,
}: SeasonalSnowProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isVisible = forceVisible || shouldShowChristmasSnow(testDate);

  if (!isVisible) return null;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
        {snowFlakes.map(flake => (
          <span
            key={flake.id}
            aria-hidden="true"
            className={`absolute top-[-64px] select-none font-serif leading-none antialiased ${getDepthClass(
              flake.depth,
            )}`}
            style={{
              left: flake.left,
              fontSize: flake.size,
              opacity: flake.opacity,
              color: flake.color,

              // ВАЖНО:
              // отрицательная задержка делает снег равномерным сразу после открытия страницы
              animation: `labritySnowFall ${flake.duration} linear -${flake.delay} infinite`,

              ['--snow-drift' as string]: flake.drift,
              ['--snow-rotate' as string]: flake.rotate,
            }}
          >
            {flake.symbol}
          </span>
        ))}
      </div>

      <style jsx global>{`
        @keyframes labritySnowFall {
          0% {
            transform: translate3d(0, -64px, 0) rotate(0deg);
          }

          16% {
            transform: translate3d(calc(var(--snow-drift) * 0.55), 16vh, 0)
              rotate(calc(var(--snow-rotate) * 0.18));
          }

          35% {
            transform: translate3d(calc(var(--snow-drift) * -0.45), 35vh, 0)
              rotate(calc(var(--snow-rotate) * 0.4));
          }

          58% {
            transform: translate3d(calc(var(--snow-drift) * 0.85), 58vh, 0)
              rotate(calc(var(--snow-rotate) * 0.65));
          }

          78% {
            transform: translate3d(calc(var(--snow-drift) * -0.25), 78vh, 0)
              rotate(calc(var(--snow-rotate) * 0.82));
          }

          100% {
            transform: translate3d(calc(var(--snow-drift) * 0.4), 112vh, 0)
              rotate(var(--snow-rotate));
          }
        }
      `}</style>
    </>
  );
}
