'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { useLogoConfig } from '../components/context/LogoContext'

interface NavbarProps {
  isApplicationOpen?: boolean
}

export default function Navbar({ isApplicationOpen = false }: NavbarProps) {
  const { logoUrl } = useLogoConfig()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationLinks = [
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/participants', label: 'Participants' },
    { href: '/merch', label: 'Shop' },
    { href: '/about', label: 'About' },
  ]

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt="Naija Ninja Logo"
              width={60}
              height={60}
              className="rounded-lg"
              priority
            />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-naija-green-600 to-naija-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">NNW</span>
            </div>
          )}
          <span className="font-bold text-gray-900 hidden sm:inline">Naija Ninja</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navigationLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            Login
          </Link>
          <Link
            href="/register"
            className="px-6 py-2 bg-naija-green-600 text-white text-sm font-semibold rounded-lg hover:bg-naija-green-700 transition"
          >
            {isApplicationOpen ? 'Apply' : 'Register'}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-600 hover:text-gray-900"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-3">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-600 hover:text-gray-900 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-2" />
            <Link href="/login" className="block py-2 text-gray-600 hover:text-gray-900 transition">
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full px-6 py-2 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition text-center"
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