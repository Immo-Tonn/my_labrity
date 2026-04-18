import React from 'react';

import { ServiceCardProps } from './types';

export const ServiceItem: React.FC<ServiceCardProps> = ({ card }) => {
  return (
    <li className="relative ml-[45px] flex flex-col font-semibold before:absolute before:left-[-43px] before:top-0 before:h-6 before:w-6 before:content-arrow md:ml-11 xl:w-[592px]">
      <p className="text font-montserrat font-semibold text-white">
        {card.subtitle}
      </p>

      {card.description && (
        <p className="text font-montserrat font-normal tracking-[0.5px] text-white/80">
          {card.description}
        </p>
      )}
    </li>
  );
};
