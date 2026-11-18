import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
import { buildTwitter } from '@/utils/twitter';
import { isLanguage, withLocale, type Language } from '@/utils/localizedPath';
import BlogIndexPageClient, {
  type BlogIndexData,
  type BlogArticleSummary,
} from './BlogIndexPageClient';

const PATH = '/blog';

const META: Record<Language, { title: string; description: string }> = {
  de: {
    title: 'Blog | Labrity',
    description:
      'Klare Antworten auf echte Fragen rund um Website-Projekte, Webdesign, Webentwicklung und Relaunch — ohne Trends, ohne Listicles.',
  },
  en: {
    title: 'Blog | Labrity',
    description:
      'Clear answers to practical questions about website projects, web design, web development and relaunches — no trend pieces, no listicles.',
  },
  ru: {
    title: 'Блог | Labrity',
    description:
      'Понятные ответы на практические вопросы о разработке сайтов, дизайне, технической части и обновлении сайта — без трендов и списков ради списков.',
  },
  ua: {
    title: 'Блог | Labrity',
    description:
      'Зрозумілі відповіді на практичні питання про розробку сайтів, дизайн, технічну частину та оновлення сайту — без трендів і списків заради списків.',
  },
};

type PageParams = { lang: string };

// Rough reading time (~200 words/min) from the article body text.
function collectWords(node: unknown): number {
  if (typeof node === 'string') {
    return node.trim().split(/\s+/).filter(Boolean).length;
  }
  if (Array.isArray(node)) {
    return node.reduce<number>((sum, item) => sum + collectWords(item), 0);
  }
  if (node && typeof node === 'object') {
    return Object.values(node).reduce<number>(
      (sum, item) => sum + collectWords(item),
      0,
    );
  }
  return 0;
}

function estimateReadMinutes(article: {
  hero?: unknown;
  keyTakeaway?: unknown;
  sections?: unknown;
}): number {
  const words =
    collectWords(article.hero) +
    collectWords(article.keyTakeaway) +
    collectWords(article.sections);
  return Math.max(2, Math.round(words / 200));
}

export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  if (!isLanguage(params.lang)) notFound();

  const { title, description } = META[params.lang];
  const canonical = withLocale(PATH, params.lang);

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: buildHreflangAlternates(PATH),
    },
    openGraph: await buildOpenGraph(params.lang, canonical, title, description),
    twitter: await buildTwitter(params.lang, title, description),
  };
}

export default async function BlogPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const index: {
    hero: BlogIndexData['hero'];
    articles: string[];
    heroAlt: string;
    editorialAlt: string;
    cards: Record<string, { category: string; excerpt: string }>;
    featuredSlug: string;
    featuredLabel: string;
    readTimeLabel: string;
    cta: BlogIndexData['cta'];
  } = await getData('blog/index', params.lang);
  const common = await getData('common', params.lang);

  const summaries: BlogArticleSummary[] = await Promise.all(
    index.articles.map(async slug => {
      const article = await getData(`blog/${slug}`, params.lang);
      const card = index.cards[slug];
      return {
        slug,
        title: article.hero.title,
        description: card?.excerpt ?? article.hero.intro,
        category: card?.category ?? '',
        readMinutes: estimateReadMinutes(article),
      };
    }),
  );

  const initialData: BlogIndexData = {
    hero: index.hero,
    heroAlt: index.heroAlt,
    editorialAlt: index.editorialAlt,
    articles: summaries,
    readLabel: common.blogUi.readLabel,
    readTimeLabel: index.readTimeLabel,
    featuredSlug: index.featuredSlug,
    featuredLabel: index.featuredLabel,
    cta: index.cta,
  };

  return <BlogIndexPageClient initialData={initialData} />;
}
