import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { BLOG_SLUGS } from '@/data/blogSlugs';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { buildBreadcrumbSchema } from '@/utils/breadcrumbSchema';
import { buildArticleSchema } from '@/utils/articleSchema';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import BlogArticlePageClient, {
  type BlogArticleData,
} from './BlogArticlePageClient';

type PageParams = { lang: string; slug: string };

export async function generateStaticParams() {
  const LOCALES: Language[] = ['de', 'en', 'ru', 'ua'];
  return LOCALES.flatMap(lang => BLOG_SLUGS.map(slug => ({ lang, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  if (!isLanguage(params.lang)) notFound();
  if (!(BLOG_SLUGS as readonly string[]).includes(params.slug)) notFound();

  const article: BlogArticleData = await getData(
    `blog/${params.slug}`,
    params.lang,
  );
  const path = `/blog/${params.slug}`;
  const canonical = withLocale(path, params.lang);

  return {
    title: article.meta.title,
    description: article.meta.description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(path),
    },
    openGraph: await buildOpenGraph(
      params.lang,
      canonical,
      article.meta.title,
      article.meta.description,
    ),
    twitter: await buildTwitter(
      params.lang,
      article.meta.title,
      article.meta.description,
    ),
  };
}

export default async function BlogArticlePage({
  params,
}: {
  params: PageParams;
}) {
  if (!isLanguage(params.lang)) notFound();
  if (!(BLOG_SLUGS as readonly string[]).includes(params.slug)) notFound();

  const [initialDataRaw, common] = await Promise.all([
    getData(`blog/${params.slug}`, params.lang),
    getData('common', params.lang),
  ]);

  const relatedArticles = await Promise.all(
    (initialDataRaw.relatedArticles as string[]).map(async slug => {
      const related = await getData(`blog/${slug}`, params.lang);
      return { slug, title: related.hero.title as string };
    }),
  );

  const initialData: BlogArticleData = {
    ...initialDataRaw,
    relatedArticles,
    ui: {
      breadcrumbParent: common.blogUi.breadcrumbParent,
      sourcesLabel: common.blogUi.sourcesLabel,
      moreArticlesLabel: common.blogUi.moreArticlesLabel,
      allArticlesLabel: common.blogUi.allArticlesLabel,
    },
  };

  const path = `/blog/${params.slug}`;
  const canonical = withLocale(path, params.lang);
  const blogIndexUrl = withLocale('/blog', params.lang);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: common.blogUi.breadcrumbParent, url: blogIndexUrl },
    { name: initialDataRaw.breadcrumbLabel, url: canonical },
  ]);

  const articleSchema = buildArticleSchema({
    headline: initialDataRaw.hero.title,
    description: initialDataRaw.meta.description,
    datePublished: initialDataRaw.publishedDate,
    dateModified: initialDataRaw.updatedDate,
    canonicalUrl: canonical,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <BlogArticlePageClient initialData={initialData} />
    </>
  );
}
