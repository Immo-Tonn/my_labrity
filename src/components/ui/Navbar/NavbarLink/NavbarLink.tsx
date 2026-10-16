import { classnames } from '@/utils/classnames';
import { LocalizedLink } from '@/components/ui/LocalizedLink';
import { NavbarLinkProps } from './types';

export const NavbarLink: React.FC<NavbarLinkProps> = ({
  href,
  title,
  variant,
  isCta = false,
  onClick,
}) => {
  const linkClasses = classnames(
    'relative font-montserrat transition-all duration-300',
    {
      // HEADER
      'text-[15px] font-medium tracking-[0.02em] text-[#18352b]/75 hover:text-[#18352b] after:absolute after:left-0 after:-bottom-[6px] after:h-[1px] after:w-0 after:bg-[#18352b] after:transition-all after:duration-300 hover:after:w-full':
        variant === 'header' && !isCta,

      // MOBILE MENU
      'text-[16px] font-medium tracking-[0.02em] text-[#18352b] after:absolute after:left-0 after:-bottom-[5px] after:h-[1px] after:w-0 after:bg-[#18352b] after:transition-all after:duration-300 hover:after:w-full':
        variant === 'mobile-menu' && !isCta,

      // CTA (last item, /contact): solid black pill in both variants
      'inline-flex items-center rounded-full bg-black px-5 py-2.5 text-[14px] font-medium tracking-[0.02em] !text-white hover:bg-[#18352b] active:scale-95':
        isCta,
    },
  );

  return (
    <li>
      <LocalizedLink href={href} onClick={onClick} className={linkClasses}>
        {title}
      </LocalizedLink>
    </li>
  );
};
