import Image from 'next/image';

import { classnames } from '@/utils/classnames';

type InnerPhotoProps = {
  src: string;
  width: number;
  height: number;
  sizes: string;
  /** Crop focus per breakpoint, e.g. "50% 40%". */
  position?: string;
  /** Opens by itself on load: always, or only from the lg breakpoint up
   *  (for photos that start inside the first screen on desktop only). */
  open?: boolean | 'lg';
  priority?: boolean;
  /** Hairline frame around the photo (default). */
  frame?: boolean;
  /** Slow, slight zoom on hover. */
  hoverZoom?: boolean;
  className?: string;
};

// Purely decorative photograph in a hairline-framed rectangle. It opens
// through a mask (scroll-triggered via SwissMotion, or on load with `open`)
// and carries no text of its own.
export function InnerPhoto({
  src,
  width,
  height,
  sizes,
  position = '50% 50%',
  open = false,
  priority = false,
  frame = true,
  hoverZoom = false,
  className,
}: InnerPhotoProps) {
  return (
    <div
      aria-hidden="true"
      className={classnames(
        'group/photo relative',
        frame && 'border border-[#111]/90',
        open === 'lg'
          ? 'sw-open-lg overflow-hidden'
          : open
            ? 'sw-open'
            : 'overflow-hidden',
        className,
      )}
    >
      <Image
        src={src}
        alt=""
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        style={{ objectPosition: position }}
        className={classnames(
          'absolute inset-0 h-full w-full object-cover',
          hoverZoom &&
            'transition-transform duration-[1200ms] ease-out group-hover/photo:scale-[1.04]',
        )}
      />
    </div>
  );
}
