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

      'items-center gap-8 font-montserrat xl:gap-10': variant === 'header',
    },
    className,
  );

  if (!navLinks.length) {
    return null;
  }

  // The last item (/contact) is the primary call to action.
  const ctaIndex = navLinks.length - 1;

  return (
    <ul className={NavbarClasses}>
      {navLinks.map((link, index) => (
        <NavbarLink
          key={`${link.href}-${link.title}`}
          title={link.title}
          href={link.href}
          variant={variant}
          isCta={index === ctaIndex}
          onClick={onClick}
        />
      ))}
    </ul>
  );
};
