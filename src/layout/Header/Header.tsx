'use client';

import { useEffect, useState, useRef } from 'react';
import { classnames } from '@/utils/classnames';
import { Logo } from '@/components/ui/Logo';
import { Navbar } from '@/components/ui/Navbar';
import BurgerMenuIcon from '@/../public/icons/burger-menu.svg';
import { BurgerMenu } from '@/components/ui/BurgerMenu';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type CommonData = {
  layout?: {
    'aria-label'?: {
      burger?: string;
      btnClose?: string;
    };
  };
};

export function Header() {
  const { lang, setLang } = useLanguage();

  const [common, setCommon] = useState<CommonData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const lastScroll = useRef(0);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('common', lang);
      setCommon(data);
    };

    loadData();
  }, [lang]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;

      setScrolled(currentScroll > 20);

      const scrollDifference = Math.abs(currentScroll - lastScroll.current);

      if (scrollDifference < 6) return;

      if (currentScroll > lastScroll.current && currentScroll > 120) {
        setHideHeader(true);
      } else if (currentScroll < lastScroll.current) {
        setHideHeader(false);
      }

      lastScroll.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const openMenu = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const languages = ['ua', 'en', 'de', 'ru'];

  return (
    <header
      className={classnames(
        'fixed left-0 top-0 z-[50] w-full transition-transform duration-300',
        'border-b border-[#18352b]/20',
        hideHeader ? '-translate-y-full' : 'translate-y-0',
        scrolled
          ? 'bg-[#f8f6f1]/92 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl'
          : 'bg-[#f8f6f1] py-5',
      )}
    >
      <div className="container relative flex items-center justify-between gap-6 xl:gap-10">
        <Logo path="header" onClick={closeMenu} className="shrink-0" />

        <Navbar
          variant="header"
          className="hidden xl:flex xl:flex-1 xl:justify-center xl:text-[13px] xl:font-medium xl:uppercase xl:tracking-[0.22em] xl:text-[#18352b]"
        />

        <div className="relative hidden items-center font-montserrat text-[13px] uppercase tracking-[0.22em] xl:flex">
          {languages.map((l, index) => (
            <div key={l} className="flex items-center">
              <button
                onClick={() => setLang(l as 'ua' | 'en' | 'de' | 'ru')}
                className={classnames(
                  'relative px-2 transition-colors duration-300',
                  lang === l
                    ? 'font-semibold text-[#18352b]'
                    : 'text-[#18352b]/55 hover:text-[#18352b]',
                )}
              >
                {l.toUpperCase()}
              </button>

              {index < languages.length - 1 && (
                <span className="mx-1 select-none text-[#18352b]/30">|</span>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={openMenu}
          aria-label={common?.layout?.['aria-label']?.burger || 'menu'}
          className="text-[#18352b] transition-all duration-300 hover:scale-110 active:scale-95 xl:hidden"
        >
          <BurgerMenuIcon width={30} height={30} />
        </button>
      </div>

      {isOpen && <BurgerMenu isOpen={isOpen} onClose={closeMenu} />}
    </header>
  );
}
