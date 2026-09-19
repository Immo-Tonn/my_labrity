/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  poweredByHeader: false,

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
    ];
  },
};

export default nextConfig;
