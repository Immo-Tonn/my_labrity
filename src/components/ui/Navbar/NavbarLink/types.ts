export interface NavbarLinkProps {
  title: string;
  href: string;
  variant: 'header' | 'mobile-menu';
  onClick?: () => void;
}
