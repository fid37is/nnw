// File: app/layout.tsx

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/Providers'
import { LogoConfigProvider } from '../components/context/LogoContext'
import './globals.css'

// ✅ Fix 1: swap + fallback so page renders immediately
const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
})

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://naijaninja.net'
const logoUrl = 'https://res.cloudinary.com/lordefid/image/upload/v1774595053/NNW_kxgtcf.png'
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || logoUrl

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),

  title: {
    default: "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
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

  authors: [{ name: 'Naija Ninja Warrior Team' }],
  creator: 'Naija Ninja Warrior',
  publisher: 'Naija Ninja Warrior',

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  openGraph: {
    type: 'website',
    locale: 'en_NG',
    alternateLocale: ['en_US', 'en_GB'],
    url: baseUrl,
    title: "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    description:
      "Think you have what it takes? Apply now to compete in Nigeria's premier obstacle course competition. Test your strength on the toughest course in Africa.",
    siteName: 'Naija Ninja Warrior',
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Naija Ninja Warrior - Nigeria's Ultimate Challenge",
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    description:
      "Think you have what it takes? Apply now to compete in Nigeria's premier obstacle course competition.",
    images: [ogImage],
    creator: '@naijaninja',
    site: '@naijaninja',
  },

  // ✅ Fix 2: local icons instead of 4 Cloudinary requests
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
    shortcut: '/icon.png',
  },

  manifest: '/manifest.json',

  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  category: 'entertainment',

  other: {
    'geo.region': 'NG',
    'geo.placename': 'Nigeria',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Fix 3: Only Organization schema globally — no JS comments in JSON */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Naija Ninja Warrior',
              url: baseUrl,
              logo: logoUrl,
              description: "Nigeria's premier obstacle course competition",
              sameAs: [
                'https://facebook.com/naijaninjawarrior',
                'https://twitter.com/officialnnw',
                'https://instagram.com/naijaninjawarrior',
                'https://youtube.com/@naijaninjawarrior',
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'Customer Service',
                areaServed: 'NG',
                availableLanguage: ['en'],
              },
            }),
          }}
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