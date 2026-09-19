import { SITE_URL } from './siteUrl';

export function buildArticleSchema({
  headline,
  description,
  datePublished,
  dateModified,
  canonicalUrl,
}: {
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  canonicalUrl: string;
}) {
  const organizationId = `${SITE_URL}/#organization`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    datePublished,
    dateModified,
    author: { '@id': organizationId },
    publisher: { '@id': organizationId },
    mainEntityOfPage: `${SITE_URL}${canonicalUrl}`,
  };
}
