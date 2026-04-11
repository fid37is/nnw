// File: app/page.tsx

import type { Metadata } from 'next'
import HomeClient from './HomeClient'

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://naijaninja.net'
const OG_IMAGE = process.env.NEXT_PUBLIC_OG_IMAGE ||
  'https://res.cloudinary.com/lordefid/image/upload/v1775875375/og-image_zzmbk7.png'

export const metadata: Metadata = {
  title:       "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
  description: "Nigeria's premier obstacle-course sports entertainment franchise. Apply to compete, watch live events, and follow the nation's top athletes battle through the ultimate ninja challenge.",

  alternates: {
    canonical: BASE_URL,
  },

  openGraph: {
    title:       "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    description: "Apply to compete in Nigeria's premier obstacle course. Watch live events and follow the nation's top athletes.",
    url:         BASE_URL,
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Naija Ninja Warrior" }],
  },

  twitter: {
    card:        'summary_large_image',
    title:       "Naija Ninja Warrior - Nigeria's Ultimate Physical Challenge",
    description: "Apply to compete in Nigeria's premier obstacle course.",
    images:      [OG_IMAGE],
  },
}

export default function Page() {
  return <HomeClient />
}