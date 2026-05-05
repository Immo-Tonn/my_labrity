import React from 'react';

import Telegram from '@/../public/icons/telegram.svg';
import Instagram from '@/../public/icons/instagram.svg';
import Facebook from '@/../public/icons/facebook.svg';

import { SocialsItemProps } from './types';

export const SocialsItem: React.FC<SocialsItemProps> = ({
  name,
  href,
  ariaL,
}) => {
  return (
    <li key={name}>
      <a
        href={href}
        aria-label={ariaL}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="inline-flex transition duration-300 hover:-translate-y-1 hover:rotate-3 hover:scale-110 hover:text-black focus-visible:text-black"
      >
        {name === 'telegram' && <Telegram className="h-8 w-8" />}
        {name === 'instagram' && <Instagram className="h-8 w-8" />}
        {name === 'facebook' && <Facebook className="h-8 w-8" />}
      </a>
    </li>
  );
};
