'use client';

import HelixRibbonHero from '@/components/ui/HelixRibbonHero/HelixRibbonHero';
import { LocalizedLink } from '@/components/ui/LocalizedLink';

type HeroData = {
  kicker: string;
  titleFirst: string;
  description: string;
  primaryButton: string;
  secondaryButton: string;
};

type Project = { title: string; image: string };

// Photos for the closing row.
const GALLERY = [
  'hero-posters',
  'hero-hall',
  'hero-living',
  'hero-monitor',
  'hero-laptop',
].map(name => ({ src: `/images/home/gallery/${name}.webp`, title: '' }));

// Pre-cropped 3:2 versions of all project screenshots.
const helixSrc = (image: string) =>
  `/images/home/helix/${image.split('/').pop() ?? ''}`;

export default function HomeHelixHero({
  hero,
  projects,
  scrollLabel,
}: {
  hero: HeroData;
  projects: Project[];
  scrollLabel: string;
}) {
  const words = hero.titleFirst.trim().split(/\s+/);
  const name = words.pop() ?? '';
  const greeting = words.join(' ');

  return (
    <HelixRibbonHero
      height="calc(100svh - 77px)"
      stickyTop="77px"
      screens={4}
      greeting={greeting}
      name={name}
      gallery={GALLERY}
      gridCols={5}
      tileRatio={0.8}
      portrait="/images/home/hero-tablet.jpg"
      portraitAlt=""
      projects={projects.map(project => ({
        src: helixSrc(project.image),
        title: project.title,
      }))}
      count={`( ${hero.kicker} )`}
      bio={hero.description}
      scrollHint={scrollLabel}
      background="#111111"
      foreground="#F7F7F5"
      fontHref={null}
      headlineFont="var(--font-montserrat)"
      headlineWeight={600}
      headlineTransform="none"
      headlineTracking="-0.045em"
      showNav={false}
      actions={
        <div className="flex flex-wrap justify-end gap-3">
          <LocalizedLink
            href="/contact"
            className="inline-flex min-h-[48px] items-center justify-center border border-[#F7F7F5] bg-[#F7F7F5] px-6 font-montserrat text-[13px] font-medium text-[#111] transition-colors duration-300 hover:border-[#FF3830] hover:bg-[#FF3830] hover:text-[#111]"
          >
            {hero.primaryButton}
          </LocalizedLink>
          <LocalizedLink
            href="/portfolio"
            className="inline-flex min-h-[48px] items-center justify-center border border-[#F7F7F5]/60 px-6 font-montserrat text-[13px] font-medium text-[#F7F7F5] transition-colors duration-300 hover:bg-[#F7F7F5] hover:text-[#111]"
          >
            {hero.secondaryButton}
          </LocalizedLink>
        </div>
      }
    />
  );
}
