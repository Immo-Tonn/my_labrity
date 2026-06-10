'use client';

import React, { useEffect, useState } from 'react';
import { classnames } from '@/utils/classnames';
import { NavbarProps } from './types';
import { NavbarLink } from './NavbarLink';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

type NavLinkItem = {
  title: string;
  href: string;
};

export const Navbar: React.FC<NavbarProps> = ({
  variant,
  onClick,
  className,
}) => {
  const { lang } = useLanguage();
  const [navLinks, setNavLinks] = useState<NavLinkItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const data = await getData('header', lang);

        if (!isMounted) {
          return;
        }

        if (Array.isArray(data)) {
          setNavLinks(data);
          return;
        }

        setNavLinks([]);
      } catch {
        if (!isMounted) {
          return;
        }

        try {
          const fallbackData = await getData('header', 'de');

          if (isMounted && Array.isArray(fallbackData)) {
            setNavLinks(fallbackData);
          }
        } catch {
          if (isMounted) {
            setNavLinks([]);
          }
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [lang]);

  const NavbarClasses = classnames(
    'flex',
    {
      'w-full flex-col items-start gap-6 font-montserrat text-sm':
        variant === 'mobile-menu',

      'items-center gap-10 font-montserrat': variant === 'header',
    },
    className,
  );

  if (!navLinks.length) {
    return null;
  }

  return (
    <ul className={NavbarClasses}>
      {navLinks.map(link => (
        <NavbarLink
          key={`${link.href}-${link.title}`}
          title={link.title}
          href={link.href}
          variant={variant}
          onClick={onClick}
        />
      ))}
    </ul>
  );
};
