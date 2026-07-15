import type { Metadata } from 'next';

import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: '/',
  },
};

export default function Home() {
  return <HomePageClient />;
}
