import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getData } from '@/utils/getData';
import { buildHreflangAlternates } from '@/utils/hreflangAlternates';
import { buildOpenGraph } from '@/utils/openGraph';
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
      'Klare Antworten auf reale Fragen rund um Website-Projekte, Webdesign, Webentwicklung und Relaunch — ohne Trends, ohne Listicles.',
  },
  en: {
    title: 'Blog | Labrity',
    description:
      'Clear answers to real questions about website projects, webdesign, web development and relaunches — no trend pieces, no listicles.',
  },
  ru: {
    title: 'Блог | Labrity',
    description:
      'Понятные ответы на реальные вопросы о разработке сайтов, дизайне, технической части и релонче — без трендов и списков ради списков.',
  },
  ua: {
    title: 'Блог | Labrity',
    description:
      'Зрозумілі відповіді на реальні питання про розробку сайтів, дизайн, технічну частину та релонч — без трендів і списків заради списків.',
  },
};

type PageParams = { lang: string };

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
  };
}

export default async function BlogPage({ params }: { params: PageParams }) {
  if (!isLanguage(params.lang)) notFound();

  const index: {
    hero: BlogIndexData['hero'];
    articles: string[];
    heroAlt: string;
    editorialAlt: string;
  } = await getData('blog/index', params.lang);
  const common = await getData('common', params.lang);

  const summaries: BlogArticleSummary[] = await Promise.all(
    index.articles.map(async slug => {
      const article = await getData(`blog/${slug}`, params.lang);
      return {
        slug,
        title: article.hero.title,
        description: article.hero.intro,
      };
    }),
  );

  const initialData: BlogIndexData = {
    hero: index.hero,
    heroAlt: index.heroAlt,
    editorialAlt: index.editorialAlt,
    articles: summaries,
    readLabel: common.blogUi.readLabel,
  };

  return <BlogIndexPageClient initialData={initialData} />;
}
