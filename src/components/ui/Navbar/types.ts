export interface NavbarLinkProps {
  title: string;
  href: string;
  variant: 'header' | 'mobile-menu';
  onClick?: () => void;
}

export interface NavbarProps {
  variant: 'header' | 'mobile-menu';
  className?: string;
  onClick?: () => void;
}
