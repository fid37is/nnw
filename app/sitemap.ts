import { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://naijaninja.net'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    // ── Core pages ─────────────────────────────────────────────────────────
    {
      url:             BASE_URL,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        1.0,
    },
    {
      url:             `${BASE_URL}/about`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.8,
    },

    // ── Competition ────────────────────────────────────────────────────────
    {
      url:             `${BASE_URL}/leaderboard`,
      lastModified:    new Date(),
      changeFrequency: 'weekly',      // updates as competition progresses
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/participants`,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.8,
    },
    {
      url:             `${BASE_URL}/highlights`,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.7,
    },

    // ── Registration ───────────────────────────────────────────────────────
    {
      url:             `${BASE_URL}/register`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.9,           // high priority — primary conversion page
    },

    // ── Commerce & Partnerships ────────────────────────────────────────────
    {
      url:             `${BASE_URL}/merch`,
      lastModified:    new Date(),
      changeFrequency: 'weekly',
      priority:        0.6,
    },
    {
      url:             `${BASE_URL}/partners`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.7,
    },

    // ── Business & Investors ───────────────────────────────────────────────
    {
      url:             `${BASE_URL}/investors`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.6,
    },
    {
      url:             `${BASE_URL}/careers`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.5,
    },

    // ── Support ────────────────────────────────────────────────────────────
    {
      url:             `${BASE_URL}/faq`,
      lastModified:    new Date(),
      changeFrequency: 'monthly',
      priority:        0.6,
    },
    {
      url:             `${BASE_URL}/contact`,
      lastModified:    new Date(),
      changeFrequency: 'yearly',
      priority:        0.5,
    },

    // ── Legal ──────────────────────────────────────────────────────────────
    {
      url:             `${BASE_URL}/privacy`,
      lastModified:    new Date(),
      changeFrequency: 'yearly',
      priority:        0.3,
    },
    {
      url:             `${BASE_URL}/terms`,
      lastModified:    new Date(),
      changeFrequency: 'yearly',
      priority:        0.3,
    },

    // ── NOTE: Excluded routes ──────────────────────────────────────────────
    // /login              — auth page, no SEO value
    // /register (login)   — same
    // admin.naijaninja.net/* — admin portal on subdomain, behind auth
    // investor.naijaninja.net/* — investor portal on subdomain, behind auth
    // /user/*             — contestant dashboard, behind auth
    //
    // ── Routes removed from original sitemap (don't exist yet) ───────────
    // /competition  — page does not exist, route returns 404
    // /hall-of-fame — page does not exist, route returns 404
    // /training     — page does not exist, route returns 404
  ]
}