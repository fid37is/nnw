import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/Providers'
import { LogoConfigProvider } from '../components/context/LogoContext'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

// Base configuration
const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://naijaninja.net";
const logoUrl = "https://res.cloudinary.com/lordefid/image/upload/v1765999106/nnw_eu2pmf.png";
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || logoUrl;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  
  title: {
    default: "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    template: "%s | Naija Ninja Warrior",
  },
  
  description:
    "Think you have what it takes? Apply now to compete in Naija Ninja Warrior - Nigeria's premier obstacle course competition. Test your strength, speed, and determination on the toughest course in Africa.",
  
  keywords: [
    "Naija Ninja Warrior",
    "Nigeria obstacle course",
    "Nigerian competition",
    "ninja warrior Nigeria",
    "physical challenge Nigeria",
    "TV competition Nigeria",
    "obstacle course competition",
    "Nigerian sports challenge",
    "fitness competition Nigeria",
    "athletic challenge",
    "ninja warrior audition",
    "Nigerian reality show",
  ],
  
  authors: [{ name: "Naija Ninja Warrior Team" }],
  creator: "Naija Ninja Warrior",
  publisher: "Naija Ninja Warrior",
  
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph for Facebook, WhatsApp, etc.
  openGraph: {
    type: "website",
    locale: "en_NG",
    alternateLocale: ["en_US", "en_GB"],
    url: baseUrl,
    title: "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    description:
      "Think you have what it takes? Apply now to compete in Nigeria's premier obstacle course competition. Test your strength on the toughest course in Africa.",
    siteName: "Naija Ninja Warrior",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Naija Ninja Warrior - Nigeria's Ultimate Challenge",
      },
    ],
  },

  // Twitter/X Cards
  twitter: {
    card: "summary_large_image",
    title: "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    description:
      "Think you have what it takes? Apply now to compete in Nigeria's premier obstacle course competition.",
    images: [ogImage],
    creator: "@naijaninja", // Update with your actual Twitter handle
    site: "@naijaninja",
  },

  // Icons and favicons
  icons: {
    icon: [
      { url: logoUrl, sizes: "32x32", type: "image/png" },
      { url: logoUrl, sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: logoUrl, sizes: "180x180", type: "image/png" }],
    shortcut: [logoUrl],
  },

  // PWA manifest
  manifest: "/manifest.json",
  
  // Google verification (add your code when you get it)
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },

  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Category
  category: "entertainment",

  // Additional metadata for Nigerian audience
  other: {
    "geo.region": "NG",
    "geo.placename": "Nigeria",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Naija Ninja Warrior",
              "url": baseUrl,
              "logo": logoUrl,
              "description": "Nigeria's premier obstacle course competition",
              "sameAs": [
                "https://facebook.com/naijaninjawarrior", // Update with your actual social links
                "https://twitter.com/officialnnw",
                "https://instagram.com/naijaninjawarrior",
                "https://youtube.com/@naijaninjawarrior",
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Customer Service",
                "areaServed": "NG",
                "availableLanguage": ["en"]
              }
            }),
          }}
        />
        
        {/* Event Schema (if you have specific competition dates) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "Naija Ninja Warrior Competition",
              "description": "Nigeria's ultimate physical challenge obstacle course competition",
              "image": ogImage,
              "organizer": {
                "@type": "Organization",
                "name": "Naija Ninja Warrior",
                "url": baseUrl
              },
              "location": {
                "@type": "Place",
                "name": "Nigeria",
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "NG"
                }
              },
              // Add these when you have dates:
              // "startDate": "2025-06-01",
              // "endDate": "2025-08-31",
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