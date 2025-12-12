'use client'

import { AuthConfigProvider } from '@/components/context/AuthContext'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const logoUrl = 'https://res.cloudinary.com/lordefid/image/upload/v1765296838/NNW_hnchr8.png'

  return (
    <AuthConfigProvider logoUrl={logoUrl}>
      {children}
    </AuthConfigProvider>
  )
}