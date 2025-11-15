import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '../components/Providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Naija Ninja Warrior - Nigeria\'s Ultimate Challenge',
  description: 'Apply now to compete in Naija Ninja Warrior, Nigeria\'s premier physical competition.',
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23007A5E" width="100" height="100"/><text x="50" y="60" font-size="70" font-weight="bold" text-anchor="middle" fill="white" font-family="Arial">🥋</text></svg>',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}