'use client';

import React from 'react';

import { Button } from '@/components/ui';
import { ServiceItem } from '@/components/common';
import { useQuiz } from '@/components/quiz';

import type { Service } from './types';

export type ServicesListProps = {
  services: Service[];
  buttonLabel: string;
};

export function ServicesList({ services, buttonLabel }: ServicesListProps) {
  const { openQuiz } = useQuiz();

  return (
    <div className="flex flex-col gap-6 md:gap-8 xl:gap-10 xl:pt-[68px]">
      {services.map(service => (
        <div
          key={service._id}
          className="
            group
            flex
            flex-col
            border
            border-[#e7e2d9]
            bg-white
            px-6
            py-6
            shadow-[0_12px_32px_rgba(0,0,0,0.035)]
            transition-all
            duration-500
            ease-out
            hover:-translate-y-[4px]
            hover:shadow-[0_22px_50px_rgba(0,0,0,0.06)]
            md:px-8
            md:py-8
            xl:flex-row
            xl:px-0
            xl:py-0
          "
        >
          <div
            className="
              flex
              flex-col
              border-b
              border-[#e7e2d9]
              pb-8
              md:flex-row
              md:items-center
              md:justify-between
              xl:w-[420px]
              xl:shrink-0
              xl:flex-col
              xl:items-start
              xl:border-b-0
              xl:pb-[52px]
              xl:pl-[80px]
              xl:pr-10
              xl:pt-[68px]
            "
          >
            <div className="flex flex-col items-start pb-8 md:pb-0 xl:w-full xl:max-w-[330px]">
              <p className="mb-3 font-montserrat text-[11px] uppercase tracking-[0.24em] text-[#18352b]/55 md:text-xs">
                {service.location}
              </p>

              <h3 className="font-tenor text-[34px] leading-[1.02] text-black transition-colors duration-300 group-hover:text-[#18352b] md:text-[40px] xl:text-[46px]">
                {service.title}
              </h3>
            </div>

            <Button
              tag="button"
              accent={false}
              onClick={openQuiz}
              className="
                flex
                min-h-[56px]
                max-w-full
                justify-center
                border
                border-black
                bg-black
                px-8
                font-montserrat
                text-[14px]
                font-semibold
                uppercase
                tracking-[0.08em]
                text-white
                transition
                duration-300
                hover:-translate-y-[1px]
                hover:shadow-[0_12px_30px_rgba(0,0,0,0.18)]
                md:max-w-[170px]
                xl:max-w-[180px]
              "
            >
              {buttonLabel}
            </Button>
          </div>

          <ul
            className="
              flex
              flex-col
              gap-6
              pt-8
              md:pt-8
              xl:flex-1
              xl:border-l
              xl:border-[#e7e2d9]
              xl:pb-[52px]
              xl:pl-10
              xl:pr-[80px]
              xl:pt-[68px]
            "
          >
            {service.card?.map((card, index) => (
              <ServiceItem key={index} card={card} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
