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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
