'use client';

import React, { useEffect, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import { QuestionsSlider } from '@/components/common/QuestionsSlider';
import { SliderButtonNext } from '@/components/ui';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

interface QuestionImage {
  id: number;
  img: string;
  alt: string;
  label: string;
}

export const QuestionsSwiper = () => {
  const { lang } = useLanguage();
  const [dataImages, setDataImages] = useState<QuestionImage[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const result = await getData('questionsSwiper', lang);
      setDataImages(result);
    };

    loadData();
  }, [lang]);

  if (!dataImages.length) return null;

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1}
      breakpoints={{
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1280: {
          slidesPerView: 3,
          spaceBetween: 40,
        },
      }}
    >
      {dataImages.map(item => (
        <SwiperSlide key={item.id}>
          <QuestionsSlider
            id={item.id}
            img={item.img}
            alt={item.alt}
            label={item.label}
          />
        </SwiperSlide>
      ))}

      <SliderButtonNext />
    </Swiper>
  );
};
