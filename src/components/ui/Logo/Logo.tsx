'use client';

import React from 'react';
import Image from 'next/image';

import { classnames } from '@/utils/classnames';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { LogoProps } from './types';

// One wordmark for header, mobile menu and footer. Its width comes from the
// shared `--logo-w` scale (globals.css) so all three always match, and the
// `brand-link` class shifts it half-way into the container gutter — header and
// footer therefore share exactly the same left edge at every width.
export const Logo: React.FC<LogoProps> = ({
  onClick,
  className,
  tone = 'dark',
  noOffset = false,
}) => {
  return (
    <LocalizedLink
      href="/"
      onClick={onClick}
      className={classnames(
        'relative flex h-[52px] shrink-0 items-center md:h-[58px] xl:h-[64px]',
        !noOffset && 'brand-link',
        className,
      )}
    >
      <Image
        src={
          tone === 'light'
            ? '/images/logo-labrity-light.svg'
            : '/images/logo-labrity.svg'
        }
        alt="Labrity"
        width={1764}
        height={250}
        priority
        unoptimized
        className="brand-img"
      />
    </LocalizedLink>
  );
};
