// File: app/navbar.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useLogoConfig } from '../components/context/LogoContext'

export default function Navbar() {
  const { logoUrl } = useLogoConfig()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)
  const pathname = usePathname()

  const navigationLinks = [
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/participants', label: 'Participants' },
    { href: '/merch', label: 'Shop' },
    { href: '/about', label: 'About' },
  ]

  const isActive = (href: string) => pathname === href

  useEffect(() => {
    // ✅ Fetch application status client-side after mount
    // This avoids SSR/client mismatch entirely
    const checkApplicationStatus = async () => {
      const { data } = await supabase
        .from('seasons')
        .select('application_start_date, application_end_date')
        .order('year', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (data) {
        const today = new Date().toISOString().split('T')[0]
        setIsApplicationOpen(
          today >= data.application_start_date && today <= data.application_end_date
        )
      }
    }
    checkApplicationStatus()
  }, [])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Naija Ninja Logo"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  loading="eager"
                  priority
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-naija-green-700 to-naija-green-800 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-lg">NNW</span>
                </div>
              )}
            </div>
            <span className="font-black text-xl text-white hidden sm:inline leading-none">
              Naija Ninja
            </span>
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-2 bg-gray-800 backdrop-blur-sm rounded-full px-6 py-3 border border-gray-700">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-6 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 ${
                    isActive(link.href)
                      ? 'bg-white text-gray-900'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-gray-300 hover:text-white transition">
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-naija-green-700 text-white text-sm font-bold rounded-full hover:bg-naija-green-800 transition-all duration-300 shadow-lg"
            >
              {isApplicationOpen ? 'Apply' : 'Register'}
            </Link>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-gray-300 rounded-lg hover:bg-gray-800 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-800 backdrop-blur-md border-t border-gray-700">
          <div className="px-6 py-6 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-xl font-semibold transition ${
                  isActive(link.href)
                    ? 'bg-white text-gray-900'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-4 border-gray-700" />
            <Link
              href="/login"
              className="block px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-xl font-semibold transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full px-6 py-3 bg-naija-green-700 text-white font-bold rounded-xl hover:bg-naija-green-800 transition text-center shadow-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              {isApplicationOpen ? 'Apply' : 'Register'}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}