'use client';

import { useEffect, useId, useRef, useState } from 'react';
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
  // Home gets the Swiss-grid look (square, hairline-bordered). Every other
  // page keeps the original header styling untouched.
  const isHome = stripLocale(pathname).path === '/';

  const [isOpen, setIsOpen] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const lastScroll = useRef(0);
  const languageRef = useRef<HTMLDivElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const menuId = useId();

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

  // The burger menu only exists below the desktop breakpoint: close it (and
  // release the scroll lock) when the window grows past it or the route changes.
  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setIsOpen(false);
        document.body.style.overflow = 'auto';
      }
    };

    query.addEventListener('change', onChange);

    return () => query.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  }, [pathname]);

  const openMenu = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
    burgerRef.current?.focus();
  };

  const handleLanguageChange = (newLang: Language) => {
    const { path } = stripLocale(pathname);
    window.location.href = withLocale(path, newLang);
  };

  return (
    <header
      className={classnames(
        'fixed inset-x-0 top-0 z-[50] transition-transform duration-300',
        hideHeader ? '-translate-y-full' : 'translate-y-0',
        isHome
          ? 'home-header border-b border-[#111] bg-[#F7F7F5] py-3'
          : [
              'border-b border-[#111]',
              scrolled
                ? 'bg-[#F7F7F5]/92 py-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl'
                : 'bg-[#F7F7F5] py-4',
            ],
      )}
    >
      <div className="2xl:gap-10 container relative flex items-center justify-between gap-4 xl:gap-6">
        <Logo
          path="header"
          onClick={() => setIsOpen(false)}
          className={classnames(
            'shrink-0',
            isHome ? 'xl:!h-[48px]' : '!h-[44px] md:!h-[48px] xl:!h-[48px]',
          )}
        />

        <nav
          aria-label="Main"
          className="hdr-nav hidden min-w-0 lg:flex lg:flex-1 lg:justify-center"
        >
          <Navbar
            variant="header"
            navLinks={navLinks}
            className="2xl:gap-10 2xl:[&_a]:tracking-[0.02em] lg:gap-[14px] lg:font-medium lg:uppercase lg:text-black xl:gap-6 lg:[&_a]:whitespace-nowrap lg:[&_a]:text-[length:var(--nav-fs)] lg:[&_a]:tracking-[0.04em] xl:[&_a]:tracking-[0.08em]"
          />
        </nav>

        <div
          ref={languageRef}
          className="relative hidden shrink-0 items-center font-montserrat text-[12px] uppercase tracking-[0.22em] lg:flex"
        >
          <button
            type="button"
            onClick={() => setIsLanguageOpen(prev => !prev)}
            aria-label="Change language"
            aria-expanded={isLanguageOpen}
            className={classnames(
              'flex items-center gap-2 px-3 py-2 text-black transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#111] xl:px-4',
              'border border-[#111]/40 hover:bg-[#111] hover:text-white [&_span]:transition-colors hover:[&_span]:text-white',
            )}
          >
            <span className="hidden text-neutral-500 xl:inline">LANG</span>
            <span className="hidden h-3 w-px bg-black/20 xl:block" />
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
            <div className="absolute right-0 top-[calc(100%+10px)] min-w-[170px] overflow-hidden rounded-2xl border border-[#111]/[0.12] bg-[#F7F7F5]/95 p-2 shadow-[0_18px_45px_rgba(0,0,0,0.10)] backdrop-blur-xl">
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
          ref={burgerRef}
          type="button"
          onClick={openMenu}
          aria-label={burgerLabel}
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-haspopup="dialog"
          className="text-black transition-all duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111] active:scale-95 lg:hidden"
        >
          <BurgerMenuIcon width={30} height={30} />
        </button>
      </div>

      {isOpen && (
        <BurgerMenu
          id={menuId}
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
