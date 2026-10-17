export interface NavLinkItem {
  title: string;
  href: string;
}

export interface NavbarLinkProps {
  title: string;
  href: string;
  variant: 'header' | 'mobile-menu';
  onClick?: () => void;
}

export interface NavbarProps {
  variant: 'header' | 'mobile-menu';
  navLinks: NavLinkItem[];
  className?: string;
  onClick?: () => void;
}
