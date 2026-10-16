import { getData } from './getData';
import { type Language } from './localizedPath';

// Like `openGraph`, a page's own `twitter` object replaces the layout's one
// wholesale. Without this helper every page inherited the homepage's
// twitter:title/description. The image is the shared brand image from
// meta.json (same one used for og:image).
export async function buildTwitter(
  lang: Language,
  title: string,
  description: string,
) {
  const meta = await getData('meta', lang);
  const images: string[] = meta.openGraph.images.map(
    (img: { url: string }) => img.url,
  );

  return {
    card: 'summary_large_image' as const,
    title,
    description,
    images,
  };
}
