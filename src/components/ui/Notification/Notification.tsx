'use client';

import React, { useEffect, useState } from 'react';

import { classnames } from '@/utils/classnames';

import { SuccessIcon, ErrorIcon } from '@/../public/icons';

import { NotificationProps } from './types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

interface NotificationTexts {
  success: {
    title: string;
    text: string;
  };
  error: {
    title: string;
    text: string;
  };
}

interface CommonData {
  notification: NotificationTexts;
}

export const Notification = ({ type }: NotificationProps) => {
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

  const title =
    type === 'success'
      ? data.notification.success.title
      : data.notification.error.title;

  const text =
    type === 'success'
      ? data.notification.success.text
      : data.notification.error.text;

  const titleStyles = classnames(
    'mb-6 font-tenor text-2xl text-center md:text-[28px] md:leading-9 xl:text-4xl xl:leading-[48px] tracking-wider',
    type === 'success' ? 'text-accent' : 'text-error',
  );

  return (
    <div className="flex flex-col items-center">
      {type === 'success' ? (
        <SuccessIcon width={64} height={64} className="mb-8 xl:mb-10" />
      ) : (
        <ErrorIcon width={64} height={64} className="mb-8 xl:mb-10" />
      )}

      <p className={titleStyles}>{title}</p>

      <p className="whitespace-pre-line text-center font-montserrat text-sm xl:text-base">
        {text}
      </p>
    </div>
  );
};
