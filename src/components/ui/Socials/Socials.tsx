import React from 'react';

import { classnames } from '@/utils/classnames';
import { SocialsItem } from '@/components/ui';
import { SocialsProps } from './types';

export const Socials: React.FC<SocialsProps> = ({ socials, className }) => {
  const socialsClasses = classnames('flex gap-4 text-[#18352b]', className);

  return (
    <ul className={socialsClasses}>
      {socials
        .filter(item => item.path !== '#')
        .map(item => (
          <SocialsItem
            key={item.name}
            name={item.name}
            href={item.path}
            ariaL={item.ariaLabel}
          />
        ))}
    </ul>
  );
};
