'use client';

import React, { useEffect, useState } from 'react';

import { classnames } from '@/utils/classnames';
import { SocialsItem } from '@/components/ui';
import { SocialsProps } from './types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

interface SocialLink {
  name: 'telegram' | 'instagram' | 'facebook';
  path: string;
  ariaLabel: string;
}

interface CommonData {
  socials: SocialLink[];
}

export const Socials: React.FC<SocialsProps> = ({ className }) => {
  const { lang } = useLanguage();

  const [data, setData] = useState<CommonData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getData('common', lang);
      setData(result);
    };

    loadData();
  }, [lang]);

  if (!data) return null;

  const socialsClasses = classnames('flex gap-4 text-accent', className);

  return (
    <ul className={socialsClasses}>
      {data.socials.map(item => (
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
