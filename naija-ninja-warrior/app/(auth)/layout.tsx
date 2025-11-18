'use client'

import Link from 'next/link'
import Image from 'next/image'
import { AuthConfigProvider, useAuthConfig } from '@/components/context/AuthContext'

function AuthLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const { logoUrl } = useAuthConfig()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-naija-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Naija Ninja Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
            )}
            <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
          </Link>
        </div>
      </nav>

      {/* Split Layout Container - Full width with max-width constraint */}
      <div className="max-w-7xl mx-auto flex flex-1 w-full overflow-hidden">

        {/* LEFT SIDE - Video (Desktop Only, 50% width) - Full dimensions */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center overflow-hidden">
          {/* Replace with actual video URL from Cloudinary */}
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
          >
            <source
              src="https://res.cloudinary.com/lordefid/video/upload/q_auto,f_auto,w_1400,c_scale/FINEST_lmu1to.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* RIGHT SIDE - Forms (Full width on mobile, 50% on desktop) */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-8 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-md">

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-naija-green-100">
              {children}
            </div>

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By using this platform, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const logoUrl = "https://res.cloudinary.com/lordefid/image/upload/v1763343827/fine_zpc6p1.png"

  return (
    <AuthConfigProvider logoUrl={logoUrl}>
      <AuthLayoutContent>
        {children}
      </AuthLayoutContent>
    </AuthConfigProvider>
  )
}