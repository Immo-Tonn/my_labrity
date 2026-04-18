'use client';

import React, { useEffect, useState } from 'react';

import { classnames } from '@/utils/classnames';
import CloseIcon from '@/../public/icons/close-icon.svg';

import { ModalProps } from './types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

interface CommonData {
  modal: {
    ariaLabel: string;
  };
}

export const Modal = ({ onClose, children, className }: ModalProps) => {
  const { lang } = useLanguage();
  const [data, setData] = useState<CommonData | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const result = await getData('common', lang);
      setData(result);
    };

    loadData();
  }, [lang]);

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [onClose]);

  if (!data) return null;

  const { ariaLabel } = data.modal;

  const onBackDropClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalClasses = classnames(
    'relative mx-auto flex w-[320px] flex-col bg-mainBcg shadow-md',
    className,
  );

  return (
    <div
      onClick={onBackDropClick}
      className="bg-backdrop fixed inset-0 z-[2000] flex items-center justify-center overscroll-none backdrop-blur-2xl"
    >
      <div className={modalClasses}>
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={onClose}
          className="duration-250 absolute right-[21px] top-[21px] transform transition hover:scale-110"
        >
          <CloseIcon width={24} height={24} />
        </button>

        {children}
      </div>
    </div>
  );
};
