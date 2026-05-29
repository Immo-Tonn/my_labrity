'use client';

import { useEffect, useRef, useState } from 'react';

import { Logo, Socials, Navbar } from '@/components/ui';
import CloseIcon from '@/../public/icons/close-icon.svg';
import { IBurgerMenuProps } from './types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type Language = 'de' | 'en' | 'ua' | 'ru';

type CommonData = {
  layout?: {
    'aria-label'?: {
      burger?: string;
      btnClose?: string;
    };
  };
};

const languages: {
  code: Language;
  short: string;
  label: string;
}[] = [
  {
    code: 'ua',
    short: 'UA',
    label: 'Українська',
  },
  {
    code: 'en',
    short: 'EN',
    label: 'English',
  },
  {
    code: 'de',
    short: 'DE',
    label: 'Deutsch',
  },
  {
    code: 'ru',
    short: 'RU',
    label: 'Русский',
  },
];

export const BurgerMenu: React.FC<IBurgerMenuProps> = ({ isOpen, onClose }) => {
  const { lang, setLang } = useLanguage();
  const [common, setCommon] = useState<CommonData | null>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getData('common', lang);
        setCommon(data);
      } catch {
        setCommon(null);
      }
    };

    loadData();
  }, [lang]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  const handleLinkClick = () => {
    onClose();
  };

  const handleLanguageChange = (newLang: Language) => {
    setLang(newLang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/30 backdrop-blur-xl xl:hidden">
      <div
        ref={modalRef}
        className="
          absolute
          right-0
          top-0
          flex
          w-[260px]
          flex-col
          gap-6
          bg-[#f8f6f1]
          px-6
          pb-6
          pt-6
          shadow-[0_10px_40px_rgba(0,0,0,0.10)]
        "
      >
        <div className="flex items-center justify-between">
          <Logo path="header" onClick={onClose} />

          <button
            onClick={onClose}
            aria-label={
              common?.layout?.['aria-label']?.btnClose || 'close menu'
            }
            className="text-black transition hover:scale-110"
          >
            <CloseIcon width={24} height={24} />
          </button>
        </div>

        <nav>
          <Navbar variant="mobile-menu" onClick={handleLinkClick} />
        </nav>

        <div className="border-y border-[#e7e2d9] py-4">
          <div className="mb-3 flex items-center justify-between font-montserrat text-[10px] uppercase tracking-[0.28em]">
            <span className="text-neutral-400">LANG</span>

            <span className="font-semibold text-black">
              {lang.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {languages.map(language => (
              <button
                key={language.code}
                type="button"
                onClick={() => handleLanguageChange(language.code)}
                aria-label={`Change language to ${language.label}`}
                className={
                  lang === language.code
                    ? 'rounded-full bg-black px-3 py-2 font-montserrat text-[11px] font-semibold uppercase tracking-[0.16em] text-white transition'
                    : 'rounded-full border border-black/10 bg-white/30 px-3 py-2 font-montserrat text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-500 transition hover:border-black/20 hover:bg-white/60 hover:text-black'
                }
              >
                {language.short}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Socials />
        </div>
      </div>
    </div>
  );
};
