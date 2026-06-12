'use client';

import {
  getSeasonalEvent,
  type SeasonalAccent as SeasonalAccentType,
  type SeasonalEventKey,
} from '@/utils/seasonalEvents';

type SeasonalTextItem = {
  title: string;
  text: string;
};

export type SeasonalTexts = Partial<Record<SeasonalEventKey, SeasonalTextItem>>;

type SeasonalAccentProps = {
  lang: string;
  seasonal?: SeasonalTexts;
  testDate?: Date;
};

function getAccentStyles(accent: SeasonalAccentType) {
  switch (accent) {
    case 'ukraine':
      return {
        dot: 'bg-[#0057b7]',
        line: 'from-[#0057b7] via-[#ffd700] to-[#ffd700]',
        star: 'text-[#0057b7]',
      };

    case 'germany':
      return {
        dot: 'bg-[#c21f32]',
        line: 'from-black via-[#c21f32] to-[#f4c430]',
        star: 'text-[#c21f32]',
      };

    case 'new-year':
      return {
        dot: 'bg-[#c21f32]',
        line: 'from-black/20 via-[#c21f32] to-black/20',
        star: 'text-[#c21f32]',
      };

    case 'christmas':
      return {
        dot: 'bg-[#c21f32]',
        line: 'from-[#c21f32] via-[#1f5c43] to-[#c21f32]',
        star: 'text-[#c21f32]',
      };

    case 'easter':
      return {
        dot: 'bg-[#d8b4a0]',
        line: 'from-[#d8b4a0] via-[#e7d7c9] to-[#d8b4a0]',
        star: 'text-[#d8b4a0]',
      };

    default:
      return {
        dot: 'bg-[#c21f32]',
        line: 'from-black/20 via-[#c21f32] to-black/20',
        star: 'text-[#c21f32]',
      };
  }
}

function isHolidayMainAccent(accent: SeasonalAccentType) {
  return accent === 'christmas' || accent === 'new-year';
}

export default function SeasonalAccent({
  lang,
  seasonal,
  testDate,
}: SeasonalAccentProps) {
  const event = getSeasonalEvent(lang, testDate);

  if (!event) return null;

  const text = seasonal?.[event.key];

  if (!text?.title || !text?.text) return null;

  const accentStyles = getAccentStyles(event.accent);
  const isMainHoliday = isHolidayMainAccent(event.accent);

  if (isMainHoliday) {
    return (
      <div className="relative z-[7] border-b border-[#e7e2d9] bg-[#f8f6f1]/92 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-center px-4 py-4 text-center md:flex-row md:gap-5 md:py-5">
          <div className="flex items-center justify-center gap-3">
            <span
              className={`font-tenor text-[17px] leading-none md:text-[20px] ${accentStyles.star}`}
            >
              ✦
            </span>

            <p className="font-tenor text-[22px] italic leading-none tracking-[0.03em] text-black md:text-[28px]">
              {text.title}
            </p>

            <span
              className={`font-tenor text-[17px] leading-none md:text-[20px] ${accentStyles.star}`}
            >
              ✦
            </span>
          </div>

          <span
            className={`my-3 h-px w-20 bg-gradient-to-r md:my-0 md:w-16 ${accentStyles.line}`}
          />

          <p className="max-w-[520px] font-montserrat text-[12px] leading-6 text-neutral-500 md:text-[13px]">
            {text.text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-[7] border-b border-[#e7e2d9] bg-[#f8f6f1]/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-center gap-2 px-4 py-4 text-center md:flex-row md:gap-5 md:py-5">
        <div className="flex items-center justify-center gap-3">
          <span className={`h-[7px] w-[7px] rounded-full ${accentStyles.dot}`} />

          <p className="font-montserrat text-[10px] font-semibold uppercase tracking-[0.28em] text-black/55 md:text-[11px]">
            {text.title}
          </p>
        </div>

        <span
          className={`hidden h-px w-12 bg-gradient-to-r md:block ${accentStyles.line}`}
        />

        <p className="max-w-[560px] font-montserrat text-[12px] leading-6 text-neutral-500 md:text-[13px]">
          {text.text}
        </p>
      </div>
    </div>
  );
}