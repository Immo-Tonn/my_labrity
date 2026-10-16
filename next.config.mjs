/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimized variants are cached for 30 days (default is 60 seconds).
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

  // Content-Security-Policy is intentionally NOT set here yet. This site loads
  // Usercentrics CMP (web.cmp.usercentrics.eu, plus whatever it calls
  // internally — currently broken, see the known CMP ruleset issue) and an
  // inline Google Analytics init script, and a safe CSP needs to enumerate
  // every one of those sources without relying on 'unsafe-inline'. That needs
  // a dedicated pass once Usercentrics is reconfigured — see the audit report
  // for a proposed CSP to review at that point.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
        ],
      },
      // Files in /public have no content hash in their name, so they are
      // cached for a week (not immutable) and revalidated in the background.
      ...['/hero.mp4', '/hero-poster.webp', '/images/:path*', '/icons/:path*', '/fonts/:path*'].map(
        source => ({
          source,
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=604800, stale-while-revalidate=86400',
            },
          ],
        }),
      ),
      // Keep Vercel preview/deployment hosts (*.vercel.app) out of search
      // indexes; the production domains are not matched.
      {
        source: '/:path*',
        has: [{ type: 'host', value: '(.*\\.)?vercel\\.app' }],
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ];
  },
};

export default nextConfig;
