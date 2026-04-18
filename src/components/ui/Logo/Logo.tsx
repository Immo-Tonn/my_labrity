'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import { classnames } from '@/utils/classnames';
import { LogoProps } from './types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

export const Logo: React.FC<LogoProps> = ({ path, onClick, className }) => {
  const { lang } = useLanguage();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getData('common', lang);
      setData(result);
    };

    loadData();
  }, [lang]);

  if (!data) return null;

  const { logo } = data.layout;

  const logoSizes =
    path === 'header'
      ? 'text-2xl leading-7 tracking-[0.5px] xl:text-[32px] xl:leading-8'
      : 'text-2xl leading-7 tracking-[0.2px]';

  const logoClasses = classnames(
    'font-italic inline-block font-tenor font-normal text-accent hover:text-hover transition focus-visible:text-pressed',
    logoSizes,
    className,
  );

  return (
    <Link href="/" onClick={onClick} className={logoClasses}>
      {logo.label}
    </Link>
  );
};
