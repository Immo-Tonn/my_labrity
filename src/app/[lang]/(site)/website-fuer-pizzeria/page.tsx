import type { Metadata } from 'next';

import { generateIndustryMetadata, IndustryPage } from '@/utils/industryPage';

type PageParams = { lang: string };

export function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  return generateIndustryMetadata('pizzeria', params);
}

export default function Page({ params }: { params: PageParams }) {
  return <IndustryPage slug="pizzeria" params={params} />;
}
