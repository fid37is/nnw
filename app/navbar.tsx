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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-green-900 via-green-800 to-green-900 backdrop-blur-md border-b border-green-700/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with Trademark */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Naija Ninja Logo"
                  width={50}
                  height={50}
                  className="rounded-lg"
                  loading="eager"
                  priority
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-naija-green-600 to-naija-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-black text-lg">NNW</span>
                </div>
              )}
              {/* Trademark symbol */}
              <span className="absolute -top-1 -right-2 text-white text-base font-black">™</span>
            </div>
            <span className="font-black text-xl text-white hidden sm:inline">
              Naija Ninja
              <sup className="text-sm font-black ml-1">™</sup>
            </span>
          </Link>

          {/* Desktop Navigation - Centered with pill background */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-8">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-6 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-white/80 hover:text-white transition">
              Login
            </Link>
            <Link
              href="/register"
              className="px-6 py-2.5 bg-white text-green-900 text-sm font-bold rounded-full hover:bg-white/90 transition-all duration-300 shadow-lg"
            >
              {isApplicationOpen ? 'Apply' : 'Register'}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white hover:text-white/80 rounded-lg hover:bg-white/10 transition"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
          <div className="px-6 py-6 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="my-4" />
            <Link 
              href="/login" 
              className="block px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-xl font-semibold transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="block w-full px-6 py-3 bg-naija-green-600 text-white font-bold rounded-xl hover:bg-naija-green-700 transition text-center shadow-lg"
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