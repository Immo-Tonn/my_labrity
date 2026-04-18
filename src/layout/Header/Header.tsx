'use client';

import { useEffect, useState, useRef } from 'react';
import { classnames } from '@/utils/classnames';
import { Logo } from '@/components/ui/Logo';
import { Navbar } from '@/components/ui/Navbar';
import BurgerMenuIcon from '@/../public/icons/burger-menu.svg';
import { BurgerMenu } from '@/components/ui/BurgerMenu';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

// ✅ Тип вместо any
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

      setScrolled(currentScroll > 50);

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

  const languages = ['ua', 'en', 'de'];

  return (
    <header
      className={classnames(
        'fixed left-0 top-0 z-[50] w-full',
        'border-b border-yellow-200 backdrop-blur-2xl transition-transform duration-300',
        hideHeader ? '-translate-y-full' : 'translate-y-0',
        scrolled ? 'bg-black/20 py-6 shadow-xl' : 'bg-black/10 py-5',
      )}
    >
      <div className="container relative flex items-center justify-between xl:gap-[100px]">
        {/* LOGO */}
        <Logo path="header" onClick={closeMenu} />

        {/* NAVIGATION */}
        <Navbar
          variant="header"
          className="hidden transition-all duration-300 xl:flex"
        />

        {/* LANGUAGE SWITCHER */}
        <div className="relative hidden items-center font-montserrat text-[15px] tracking-[0.25em] xl:flex">
          {languages.map((l, index) => (
            <div key={l} className="flex items-center">
              <button
                onClick={() => setLang(l as 'ua' | 'en' | 'de')}
                className={classnames(
                  'relative px-2 transition-colors duration-300',
                  lang === l
                    ? 'font-semibold text-yellow-300'
                    : 'text-yellow-200/80 hover:text-yellow-300',
                )}
              >
                {l.toUpperCase()}
              </button>

              {index < languages.length - 1 && (
                <span className="mx-2 select-none text-yellow-200/50">|</span>
              )}
            </div>
          ))}
        </div>

        {/* BURGER BUTTON */}
        <button
          onClick={openMenu}
          aria-label={common?.layout?.['aria-label']?.burger || 'menu'}
          className="transition-all duration-300 hover:scale-125 active:scale-95 xl:hidden"
        >
          <BurgerMenuIcon width={32} height={32} />
        </button>
      </div>

      {/* BURGER MENU */}
      {isOpen && <BurgerMenu isOpen={isOpen} onClose={closeMenu} />}
    </header>
  );
}
