'use client'

import { AuthConfigProvider } from '@/components/context/AuthContext'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const logoUrl = 'https://res.cloudinary.com/lordefid/image/upload/v1763343827/fine_zpc6p1.png'

  return (
    <AuthConfigProvider logoUrl={logoUrl}>
      {children}
    </AuthConfigProvider>
  )
}