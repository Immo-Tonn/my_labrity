import React from 'react';
import { classnames } from '@/utils/classnames';
import { NavbarProps } from './types';
import { NavbarLink } from './NavbarLink';

export const Navbar: React.FC<NavbarProps> = ({
  variant,
  navLinks,
  onClick,
  className,
}) => {
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
