'use client';

import { usePathname } from 'next/navigation';

import { classnames } from '@/utils/classnames';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { stripLocale } from '@/utils/localizedPath';
import { NavbarLinkProps } from './types';

// Pages that live under a menu section without sharing its URL prefix.
const PARENT_SECTION: Record<string, string> = {
  '/webdesign': '/services',
  '/webentwicklung': '/services',
  '/website-erstellen-lassen': '/services',
  '/website-relaunch': '/services',
  '/landingpage-erstellen-lassen': '/services',
  '/website-fuer-modemarken': '/services',
};

// Locale-free comparison, so "/ru/blog/slug" highlights "Blog" just like
// "/blog/slug" does. Nested pages highlight their parent section.
function isCurrent(pathname: string, href: string) {
  const current = stripLocale(pathname).path.replace(/\/+$/, '') || '/';
  const target = stripLocale(href).path.replace(/\/+$/, '') || '/';

  if (target === '/') return current === '/';

  const section =
    PARENT_SECTION[current] ??
    PARENT_SECTION[`/${current.split('/')[1] ?? ''}`] ??
    current;

  return (
    section === target || current === target || current.startsWith(`${target}/`)
  );
}

export const NavbarLink: React.FC<NavbarLinkProps> = ({
  href,
  title,
  variant,
  onClick,
}) => {
  const pathname = usePathname();
  const active = isCurrent(pathname, href);

  const underline = classnames(
    'after:absolute after:left-0 after:h-[1px] after:bg-[#FF3830] after:transition-[width] after:duration-300 after:ease-out hover:after:w-full focus-visible:after:w-full',
    active ? 'after:w-full' : 'after:w-0',
  );

  const linkClasses = classnames(
    'relative font-montserrat transition-colors duration-300',
    {
      // HEADER
      'text-[15px] font-medium tracking-[0.02em] after:-bottom-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]':
        variant === 'header',

      // MOBILE MENU
      'text-[16px] font-medium tracking-[0.02em] text-[#111111] after:-bottom-[5px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#111111]':
        variant === 'mobile-menu',
    },
    variant === 'header' &&
      (active
        ? 'text-[#111111]'
        : 'text-[#111111]/75 hover:text-[#111111] focus-visible:text-[#111111]'),
    underline,
  );

  return (
    <li>
      <LocalizedLink
        href={href}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        className={linkClasses}
      >
        {title}
      </LocalizedLink>
    </li>
  );
};
