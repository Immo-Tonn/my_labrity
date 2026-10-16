import type { NavLinkItem } from '@/components/ui/Navbar/types';
import type { SocialLink } from '@/components/ui/Socials/types';

export interface IBurgerMenuProps {
  navLinks: NavLinkItem[];
  socials: SocialLink[];
  closeLabel: string;
  isOpen: boolean;
  onClose: () => void;
}
