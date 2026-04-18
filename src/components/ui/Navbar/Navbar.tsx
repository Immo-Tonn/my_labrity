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
      'text-text font-montserrat text-sm flex-col gap-6':
        variant === 'mobile-menu',

      'text-text font-montserrat text-lg tracking-wide gap-20':
        variant === 'header',
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
