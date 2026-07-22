'use client';

import React from 'react';
import Image from 'next/image';

import { classnames } from '@/utils/classnames';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { LogoProps } from './types';

export const Logo: React.FC<LogoProps> = ({ onClick, className }) => {
  const logoClasses = classnames(
    'relative block h-[52px] w-[220px] md:h-[58px] md:w-[250px] xl:h-[64px] lg:w-[200px] xl:w-[290px]',
    className,
  );

  return (
    <LocalizedLink href="/" onClick={onClick} className={logoClasses}>
      <Image
        src="/images/logo-white.svg"
        alt="Labrity"
        fill
        priority
        className="object-contain object-left"
      />
    </LocalizedLink>
  );
};
