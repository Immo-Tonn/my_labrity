'use client';

import { useEffect, useState } from 'react';
import { useSwiper } from 'swiper/react';

import IconSliderNext from '@/../public/icons/arrow.svg';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

interface CommonData {
  questionsSection: {
    ariaLabel: string;
  };
}

export const SliderButtonNext = () => {
  const swiper = useSwiper();
  const { lang } = useLanguage();

  const [data, setData] = useState<CommonData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getData('common', lang);
      setData(result);
    };

    loadData();
  }, [lang]);

  if (!data) return null;

  const { ariaLabel } = data.questionsSection;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="ml-auto mr-0 block xl:mt-[58px]"
      onClick={() => swiper.slideNext()}
    >
      <IconSliderNext
        width={32}
        height={32}
        className="transition hover:stroke-2 focus:stroke-2"
      />
    </button>
  );
};
