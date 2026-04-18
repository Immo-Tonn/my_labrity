import Link from 'next/link';
import { classnames } from '@/utils/classnames';
import { NavbarLinkProps } from './types';

export const NavbarLink: React.FC<NavbarLinkProps> = ({
  href,
  title,
  variant,
  onClick,
}) => {
  const linkClasses = classnames(
    'transition font-montserrat text-[#e8d59c]',
    'hover:text-[#ffe8a3]',
    'active:text-[#fff3c6]',

    // underline animation
    'relative after:absolute after:left-0 after:-bottom-[5px] after:h-[1px] after:w-0 after:bg-[#ffe8a3] after:transition-all after:duration-300 hover:after:w-full',

    // soft scale + glow
    'hover:scale-[1.07] hover:drop-shadow-[0_0_8px_rgba(255,232,163,0.4)]',

    {
      'text-base': variant === 'header',
      'text-sm': variant === 'mobile-menu',
    },
  );

  return (
    <li>
      <Link href={href} onClick={onClick} className={linkClasses}>
        {title}
      </Link>
    </li>
  );
};
