// File: app/layout.tsx
// Changes from your current version:
// 1. Added `viewport` as a separate export (required in Next.js 14+ — avoids deprecation warning)
// 2. Upgraded JSON-LD from generic Organization to SportsOrganization (better Google rich results)
// 3. Added SportsEvent schema stub (update dates/location when your season is confirmed)
// Everything else is exactly as you had it.

import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/Providers'
import { LogoConfigProvider } from '../components/context/LogoContext'
import './globals.css'

const inter = Inter({
  subsets:  ['latin'],
  display:  'swap',
  preload:  true,
  fallback: ['system-ui', 'arial'],
})

const baseUrl  = process.env.NEXT_PUBLIC_APP_URL || 'https://naijaninja.net'
const logoUrl  = 'https://res.cloudinary.com/lordefid/image/upload/v1774595053/NNW_kxgtcf.png'
const ogImage  = process.env.NEXT_PUBLIC_OG_IMAGE || logoUrl

// ── Viewport — must be a separate export in Next.js 14+ ──────────────────────
export const viewport: Viewport = {
  themeColor:   '#0A6B3B',
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default:  "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    template: '%s | Naija Ninja Warrior',
  },

  description:
    "Think you have what it takes? Apply now to compete in Naija Ninja Warrior - Nigeria's premier obstacle course competition. Test your strength, speed, and determination on the toughest course in Africa.",

  keywords: [
    'Naija Ninja Warrior',
    'Nigeria obstacle course',
    'Nigerian competition',
    'ninja warrior Nigeria',
    'physical challenge Nigeria',
    'TV competition Nigeria',
    'obstacle course competition',
    'Nigerian sports challenge',
    'fitness competition Nigeria',
    'athletic challenge',
    'ninja warrior audition',
    'Nigerian reality show',
  ],

  authors:   [{ name: 'Naija Ninja Warrior Team' }],
  creator:   'Naija Ninja Warrior',
  publisher: 'Naija Ninja Warrior',

  formatDetection: {
    email:     false,
    address:   false,
    telephone: false,
  },

  openGraph: {
    type:            'website',
    locale:          'en_NG',
    alternateLocale: ['en_US', 'en_GB'],
    url:             baseUrl,
    title:           "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    description:
      "Think you have what it takes? Apply now to compete in Nigeria's premier obstacle course competition. Test your strength on the toughest course in Africa.",
    siteName: 'Naija Ninja Warrior',
    images: [
      {
        url:    ogImage,
        width:  1200,
        height: 630,
        alt:    "Naija Ninja Warrior - Nigeria's Ultimate Challenge",
      },
    ],
  },

  twitter: {
    card:        'summary_large_image',
    title:       "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    description: "Think you have what it takes? Apply now to compete in Nigeria's premier obstacle course competition.",
    images:      [ogImage],
    creator:     '@naijaninja',
    site:        '@naijaninja',
  },

  icons: {
    icon:     '/icon.png',
    apple:    '/icon.png',
    shortcut: '/icon.png',
  },

  manifest: '/manifest.json',

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },

  category: 'entertainment',

  other: {
    'geo.region':    'NG',
    'geo.placename': 'Nigeria',
  },
}

// ── JSON-LD structured data ───────────────────────────────────────────────────
// SportsOrganization gives better Google rich result eligibility than plain Organization.
// SportsEvent helps the event appear in Google's event search results.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type':       'SportsOrganization',
      '@id':         `${baseUrl}/#organization`,
      name:          'Naija Ninja Warrior',
      alternateName: 'NNW',
      url:           baseUrl,
      logo: {
        '@type':  'ImageObject',
        url:      logoUrl,
        width:    512,
        height:   512,
      },
      description: "Nigeria's premier obstacle-course sports entertainment franchise",
      sport:       'Obstacle Course Racing',
      areaServed:  'Nigeria',
      sameAs: [
        'https://facebook.com/naijaninjawarrior',
        'https://twitter.com/officialnnw',
        'https://instagram.com/naijaninjawarrior',
        'https://youtube.com/@naijaninjawarrior',
      ],
      contactPoint: {
        '@type':           'ContactPoint',
        contactType:       'Customer Service',
        areaServed:        'NG',
        availableLanguage: ['en'],
      },
    },
    {
      // Update startDate / endDate once Season 1 dates are confirmed
      '@type':       'SportsEvent',
      '@id':         `${baseUrl}/#season1`,
      name:          'Naija Ninja Warrior — Season 1',
      description:   "Nigeria's first obstacle-course sports championship. Athletes compete through purpose-built courses for the title of Naija Ninja Warrior.",
      sport:         'Obstacle Course Racing',
      url:           baseUrl,
      image:         ogImage,
      organizer: {
        '@id': `${baseUrl}/#organization`,
      },
      location: {
        '@type': 'Place',
        name:    'Lagos, Nigeria',
        address: {
          '@type':           'PostalAddress',
          addressLocality:   'Lagos',
          addressCountry:    'NG',
        },
      },
      // startDate: '2026-01-01',
      // endDate:   '2026-12-31',
      eventStatus:             'https://schema.org/EventScheduled',
      eventAttendanceMode:     'https://schema.org/OfflineEventAttendanceMode',
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={inter.className}>
        <LogoConfigProvider logoUrl={logoUrl}>
          <Providers>{children}</Providers>
        </LogoConfigProvider>
      </body>
    </html>
  )
}