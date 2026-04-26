import React from 'react';

import { ServiceCardProps } from './types';

export const ServiceItem: React.FC<ServiceCardProps> = ({ card }) => {
  return (
    <li className="grid grid-cols-[24px_1fr] items-start gap-x-5">
      <span className="mt-[2px] block h-6 w-6 content-arrow" />

      <div className="min-w-0">
        <p className="font-montserrat text-[16px] font-semibold leading-6 text-black md:text-[17px]">
          {card.subtitle}
        </p>

        {card.description && (
          <p className="mt-2 font-montserrat text-sm font-normal leading-6 tracking-[0.2px] text-neutral-600 md:text-base">
            {card.description}
          </p>
        )}
      </div>
    </li>
  );
};
