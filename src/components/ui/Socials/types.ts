export type SocialLink = {
  name: 'telegram' | 'instagram' | 'facebook';
  path: string;
  ariaLabel: string;
};

export type SocialsProps = {
  socials: SocialLink[];
  className?: string;
};
