import { NextRequest, NextResponse } from 'next/server';

const PREFIXED_LOCALES = ['en', 'ua', 'ru'];

// German is the default locale and its canonical public URLs have no prefix
// (see withLocale/DEFAULT_LOCALE in utils/localizedPath.ts, used by every
// internal link, the sitemap and hreflang alternates — none of them ever
// produce a "/de" URL). A visitor landing on "/de" or "/de/..." (old
// bookmark, guessed URL, external link) is redirected to the unprefixed
// canonical path instead of being served a second, duplicate copy of the
// page at "/de/...".
const explicitDefaultLocaleRe = /^\/de(?=\/|$)/;

// "uk" is Ukrainian's real language code (used in hreflang), but our URL
// segment is "/ua". Anyone guessing or linking "/uk/..." is sent to the real
// Ukrainian page instead of a 404.
const ukrainianAliasRe = /^\/uk(?=\/|$)/;

export function middleware(request: NextRequest) {
  const { pathname: rawPathname } = request.nextUrl;

  // All routes are lowercase. A mixed-case URL (/Services, /EN/prices) would
  // otherwise resolve to a duplicate 200 page, so it is redirected to its
  // lowercase form (query string is preserved by cloning nextUrl). If the
  // lowercase path also carries an explicit "/de" prefix, that prefix is
  // dropped in the same redirect to avoid a second hop.
  const pathname = rawPathname.toLowerCase();

  if (ukrainianAliasRe.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(ukrainianAliasRe, '/ua');

    return NextResponse.redirect(url, 308);
  }

  if (pathname !== rawPathname) {
    const url = request.nextUrl.clone();
    url.pathname = explicitDefaultLocaleRe.test(pathname)
      ? pathname.replace(explicitDefaultLocaleRe, '') || '/'
      : pathname;

    return NextResponse.redirect(url, 308);
  }

  // Old working URL of the Web-Apps service page -> final SEO URL.
  const oldWebAppsRe = /^(\/(?:en|ua|ru))?\/web-apps(?=\/|$)/;
  if (oldWebAppsRe.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(
      oldWebAppsRe,
      '$1/web-app-entwickeln-lassen',
    );

    return NextResponse.redirect(url, 308);
  }

  const firstSegment = pathname.split('/')[1];

  if (PREFIXED_LOCALES.includes(firstSegment)) {
    return NextResponse.next();
  }

  if (explicitDefaultLocaleRe.test(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(explicitDefaultLocaleRe, '') || '/';

    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/de${pathname}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api routes
     * - _next (static/image optimization)
     * - files with an extension (favicon.ico, robots.txt, sitemap.xml, /meta/*, /images/*, etc.)
     */
    '/((?!api|_next|.*\\..*).*)',
  ],
};
