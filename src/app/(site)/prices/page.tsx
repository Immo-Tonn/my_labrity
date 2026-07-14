import type { Metadata } from 'next';

import pricesData from '@/data/de/prices.json';
import PricesPageClient from './PricesPageClient';

export const metadata: Metadata = {
  title: pricesData.meta.title,
  description: pricesData.meta.description,
  alternates: {
    canonical: '/prices',
  },
  openGraph: {
    url: '/prices',
    title: pricesData.meta.title,
    description: pricesData.meta.description,
  },
};

export default function PricesPage() {
  return <PricesPageClient />;
}
