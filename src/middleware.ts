import { NextRequest, NextResponse } from 'next/server';

const PREFIXED_LOCALES = ['en', 'ua', 'ru'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const firstSegment = pathname.split('/')[1];

  if (PREFIXED_LOCALES.includes(firstSegment)) {
    return NextResponse.next();
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
