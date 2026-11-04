export type LogoProps = {
  path: 'header' | 'footer';
  className?: string;
  /** dark letters for light backgrounds (default), light for dark ones */
  tone?: 'dark' | 'light';
  /** skip the optical shift used by the header/footer rows */
  noOffset?: boolean;
  onClick?: () => void;
};
