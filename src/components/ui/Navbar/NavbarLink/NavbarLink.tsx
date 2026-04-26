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
    'relative font-montserrat transition-all duration-300',
    {
      // HEADER
      'text-[15px] font-medium tracking-[0.02em] text-[#18352b]/75 hover:text-[#18352b] after:absolute after:left-0 after:-bottom-[6px] after:h-[1px] after:w-0 after:bg-[#18352b] after:transition-all after:duration-300 hover:after:w-full':
        variant === 'header',

      // MOBILE MENU
      'text-[16px] font-medium tracking-[0.02em] text-[#18352b] after:absolute after:left-0 after:-bottom-[5px] after:h-[1px] after:w-0 after:bg-[#18352b] after:transition-all after:duration-300 hover:after:w-full':
        variant === 'mobile-menu',
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
