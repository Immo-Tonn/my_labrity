'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { classnames } from '@/utils/classnames';
import { Logo } from '@/components/ui/Logo';
import { Navbar } from '@/components/ui/Navbar';
import BurgerMenuIcon from '@/../public/icons/burger-menu.svg';
import { BurgerMenu } from '@/components/ui/BurgerMenu';
import type { NavLinkItem } from '@/components/ui/Navbar/types';
import type { SocialLink } from '@/components/ui/Socials/types';

import { useLanguage } from '@/utils/LanguageContext';
import { stripLocale, withLocale, type Language } from '@/utils/localizedPath';

type HeaderProps = {
  navLinks: NavLinkItem[];
  socials: SocialLink[];
  burgerLabel: string;
  closeLabel: string;
};

const languages: {
  code: Language;
  short: string;
  label: string;
}[] = [
  {
    code: 'de',
    short: 'DE',
    label: 'Deutsch',
  },
  {
    code: 'en',
    short: 'EN',
    label: 'English',
  },
  {
    code: 'ua',
    short: 'UA',
    label: 'Українська',
  },
  {
    code: 'ru',
    short: 'RU',
    label: 'Русский',
  },
];

export function Header({
  navLinks,
  socials,
  burgerLabel,
  closeLabel,
}: HeaderProps) {
  const { lang } = useLanguage();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const lastScroll = useRef(0);
  const languageRef = useRef<HTMLDivElement | null>(null);

  const currentLanguage =
    languages.find(language => language.code === lang) || languages[0];

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageRef.current &&
        !languageRef.current.contains(event.target as Node)
      ) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  const handleLanguageChange = (newLang: Language) => {
    const { path } = stripLocale(pathname);
    window.location.href = withLocale(path, newLang);
  };

  return (
    <header
      className={classnames(
        'fixed inset-x-0 top-0 z-[50] transition-transform duration-300',
        'border-b border-[#e7e2d9]',
        hideHeader ? '-translate-y-full' : 'translate-y-0',
        scrolled
          ? 'bg-[#f8f6f1]/92 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl'
          : 'bg-[#f8f6f1] py-5',
      )}
    >
      <div className="2xl:gap-10 container relative flex items-center justify-between gap-6">
        <Logo path="header" onClick={closeMenu} className="shrink-0" />

        <nav className="hidden xl:flex xl:flex-1 xl:justify-center">
          <Navbar
            variant="header"
            navLinks={navLinks}
            className="2xl:gap-10 2xl:[&_a]:text-[15px] 2xl:[&_a]:tracking-[0.02em] xl:gap-6 xl:font-medium xl:uppercase xl:text-black xl:[&_a]:whitespace-nowrap xl:[&_a]:text-[12px] xl:[&_a]:tracking-[0.08em]"
          />
        </nav>

        <div
          ref={languageRef}
          className="relative hidden items-center font-montserrat text-[12px] uppercase tracking-[0.22em] xl:flex"
        >
          <button
            type="button"
            onClick={() => setIsLanguageOpen(prev => !prev)}
            aria-label="Change language"
            aria-expanded={isLanguageOpen}
            className="flex items-center gap-2 rounded-full border border-black/10 bg-white/35 px-4 py-2 text-black transition duration-300 hover:border-black/25 hover:bg-white/65"
          >
            <span className="text-neutral-500">LANG</span>
            <span className="h-3 w-px bg-black/20" />
            <span className="font-semibold text-black">
              {currentLanguage.short}
            </span>
            <span
              className={classnames(
                'text-[10px] text-neutral-500 transition-transform duration-300',
                isLanguageOpen ? 'rotate-180' : 'rotate-0',
              )}
            >
              ▾
            </span>
          </button>

          {isLanguageOpen && (
            <div className="absolute right-0 top-[calc(100%+10px)] min-w-[170px] overflow-hidden rounded-2xl border border-[#e7e2d9] bg-[#f8f6f1]/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur-xl">
              {languages.map(language => (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => handleLanguageChange(language.code)}
                  className={classnames(
                    'flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-[12px] tracking-[0.12em] transition duration-300',
                    lang === language.code
                      ? 'bg-black text-white'
                      : 'text-neutral-500 hover:bg-black/5 hover:text-black',
                  )}
                >
                  <span>{language.label}</span>
                  <span className="font-semibold">{language.short}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={openMenu}
          aria-label={burgerLabel}
          className="text-black transition-all duration-300 hover:scale-110 active:scale-95 xl:hidden"
        >
          <BurgerMenuIcon width={30} height={30} />
        </button>
      </div>

      {isOpen && (
        <BurgerMenu
          isOpen={isOpen}
          onClose={closeMenu}
          navLinks={navLinks}
          socials={socials}
          closeLabel={closeLabel}
        />
      )}
    </header>
  );
}
