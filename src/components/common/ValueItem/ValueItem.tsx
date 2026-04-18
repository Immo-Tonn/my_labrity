import React from 'react';

import Lock from '@/../public/icons/lock.svg';
import Meeting from '@/../public/icons/meeting.svg';
import Flower from '@/../public/icons/flower.svg';

import { ValueItemProps } from './types';

export const ValueItem: React.FC<ValueItemProps> = ({ value }) => {
  return (
    <li
      className="
      flex flex-col items-center justify-center
      rounded-[20px] border border-white/40 bg-black/40
      p-6 backdrop-blur-sm
      transition-transform duration-500 ease-out
      hover:-translate-y-[10px] hover:shadow-xl
      md:flex-row
      md:p-8 xl:flex-col xl:justify-between
      xl:p-10 mdOnly:gap-8
      "
    >
      <div className="mb-6 md:mb-0 xl:mb-10">
        {value.name === 'lock' && (
          <Lock
            className="h-12 w-12 text-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] xl:h-16 xl:w-16"
            width={48}
            height={48}
          />
        )}

        {value.name === 'meeting' && (
          <Meeting
            className="h-12 w-12 text-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] xl:h-16 xl:w-16"
            width={48}
            height={48}
          />
        )}

        {value.name === 'flower' && (
          <Flower
            className="h-12 w-12 text-accent drop-shadow-[0_0_8px_rgba(212,175,55,0.7)] xl:h-16 xl:w-16"
            width={48}
            height={48}
          />
        )}
      </div>

      <div className="flex flex-col items-center justify-center text-center mdOnly:items-start mdOnly:text-start">
        <h3 className="mb-3 max-w-full font-tenor text-xl font-normal tracking-[1px] text-accent md:mb-4 xl:mb-6 xl:max-w-[300px] xl:text-2xl">
          {value.subTitle}
        </h3>

        <p className="font-montserrat text-white/90">{value.description}</p>
      </div>
    </li>
  );
};
