'use client';

import { useEffect, useRef, useState } from 'react';

import { Logo, Socials, Navbar } from '@/components/ui';
import CloseIcon from '@/../public/icons/close-icon.svg';
import { IBurgerMenuProps } from './types';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

export const BurgerMenu: React.FC<IBurgerMenuProps> = ({ isOpen, onClose }) => {
  const { lang, setLang } = useLanguage();
  const [common, setCommon] = useState<any>(null);

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('common', lang);
      setCommon(data);
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
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleLinkClick = () => onClose();

  if (!common) return null;

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
          px-6 pb-6 pt-6
          shadow-[0_10px_40px_rgba(24,53,43,0.10)]
        "
      >
        <div className="flex items-center justify-between">
          <Logo path="header" onClick={onClose} />

          <button
            onClick={onClose}
            aria-label={common.layout['aria-label'].btnClose}
            className="transition hover:scale-110"
          >
            <CloseIcon width={24} height={24} />
          </button>
        </div>

        <nav>
          <Navbar variant="mobile-menu" onClick={handleLinkClick} />
        </nav>

        <div className="flex gap-4 font-montserrat text-[15px] tracking-[0.25em]">
          {['ua', 'en', 'de'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l as 'ua' | 'en' | 'de')}
              className={
                lang === l
                  ? 'font-semibold text-[#18352b]'
                  : 'text-[#18352b]/70 hover:text-[#18352b]'
              }
            >
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <div>
          <Socials />
        </div>
      </div>
    </div>
  );
};
