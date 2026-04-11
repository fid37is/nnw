import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Main site — allow all public pages ─────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/user/',        // contestant dashboard — behind auth
          '/admin/',       // admin portal — behind auth
          '/investor/',    // investor portal — behind auth
          '/api/',         // API routes — never index
          '/_next/',       // Next.js internals
        ],
      },

      // ── Admin subdomain — block entirely ───────────────────────────────
      {
        userAgent: '*',
        disallow: '/',
        // Applied via host matching on admin.naijaninja.net
      },
    ],

    sitemap: 'https://naijaninja.net/sitemap.xml',
    host:    'https://naijaninja.net',
  }
}