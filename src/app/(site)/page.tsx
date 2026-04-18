'use client';

import {
  Hero,
  Values,
  Services,
  Education,
  Questions,
  About,
  Contacts,
} from '@/sections';

import { Preloader } from '@/components/ui';
import { SectionDivider } from '@/components/ui/SectionDivider';

export default function Home() {
  return (
    <>
      <Preloader />

      {/* HERO */}
      <Hero />

      {/* DIVIDER BETWEEN VIDEOS */}
      <SectionDivider />

      {/* VIDEO SECTION */}
      <div className="relative">
        {/* VIDEO BACKGROUND */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute left-0 top-0 -z-10 h-full w-full object-cover"
        >
          <source src="/videos/page.mp4" type="video/mp4" />
        </video>

        {/* SECTIONS OVER VIDEO */}

        {/* ABOUT */}
        <About />

        {/* VALUES / BENEFITS */}
        <Values />

        {/* SERVICES */}
        <Services />

        {/* EDUCATION & EXPERIENCE */}
        <Education />

        {/* QUESTIONS / FAQ */}
        <Questions />
      </div>

      {/* CONTACTS */}
      <Contacts />
    </>
  );
}
