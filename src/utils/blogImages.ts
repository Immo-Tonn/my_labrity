export type BlogImage = {
  src: string;
  width: number;
  height: number;
};

export const BLOG_HERO_IMAGE: BlogImage = {
  src: '/images/blog/blog-hero.jpg',
  width: 1374,
  height: 1145,
};

export const BLOG_EDITORIAL_IMAGE: BlogImage = {
  src: '/images/blog/blog-editorial-workspace.jpg',
  width: 1536,
  height: 1024,
};

export const BLOG_COVER_IMAGES: Record<string, BlogImage> = {
  'website-erstellen-lassen-kosten': {
    src: '/images/blog/website-erstellen-lassen-kosten.jpg',
    width: 1024,
    height: 1536,
  },
  'website-relaunch-seo-verluste-vermeiden': {
    src: '/images/blog/website-relaunch-seo-verluste-vermeiden.jpg',
    width: 1536,
    height: 1024,
  },
  'freelancer-oder-webagentur': {
    src: '/images/blog/freelancer-oder-webagentur.jpg',
    width: 1536,
    height: 1024,
  },
  'website-veraltet-anzeichen': {
    src: '/images/blog/website-veraltet-anzeichen.jpg',
    width: 1374,
    height: 1145,
  },
  'landingpage-oder-website': {
    src: '/images/blog/landingpage-oder-website.jpg',
    width: 1374,
    height: 1145,
  },
  'website-ladezeit-performance': {
    src: '/images/blog/website-ladezeit-performance.jpg',
    width: 1374,
    height: 1145,
  },
  'website-briefing-checkliste': {
    src: '/images/blog/website-briefing-checkliste.jpg',
    width: 1374,
    height: 1145,
  },
  'redirects-website-relaunch': {
    src: '/images/blog/redirects-website-relaunch.jpg',
    width: 1374,
    height: 1145,
  },
  'landingpage-dauer-launch': {
    src: '/images/blog/landingpage-dauer-launch.jpg',
    width: 1536,
    height: 1024,
  },
  'webdesign-beauty-wellness': {
    src: '/images/blog/webdesign-beauty-wellness.jpg',
    width: 1374,
    height: 1145,
  },
  'website-kunden-gewinnen-leadgenerierung': {
    src: '/images/blog/website-kunden-gewinnen-leadgenerierung.jpg',
    width: 1374,
    height: 1145,
  },
};
