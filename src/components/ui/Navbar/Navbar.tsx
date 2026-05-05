'use client';

import React, { useEffect, useState } from 'react';
import { classnames } from '@/utils/classnames';
import { NavbarProps } from './types';
import { NavbarLink } from './NavbarLink';

import { useLanguage } from '@/utils/LanguageContext';
import { getData } from '@/utils/getData';

export const Navbar: React.FC<NavbarProps> = ({
  variant,
  onClick,
  className,
}) => {
  const { lang } = useLanguage();
  const [navLinks, setNavLinks] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await getData('header', lang);
      setNavLinks(data);
    };

    loadData();
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

  if (!navLinks.length) return null;

  return (
    <ul className={NavbarClasses}>
      {navLinks.map((link, id) => (
        <NavbarLink
          key={id}
          title={link.title}
          href={link.href}
          variant={variant}
          onClick={onClick}
        />
      ))}
    </ul>
  );
};
