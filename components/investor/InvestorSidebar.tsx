'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, FileText, LogOut, Menu, X,
  TrendingUp, Mail, KeyRound,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useLogoConfig } from '@/components/context/LogoContext'

// Proxy handles /investor prefix — sidebar hrefs are clean paths only
const navItems = [
  { label: 'Dashboard',       href: '/dashboard',       icon: LayoutDashboard },
  { label: 'Documents',       href: '/documents',       icon: FileText },
  { label: 'Change Password', href: '/update-password', icon: KeyRound },
  { label: 'Contact',         href: '/contact',         icon: Mail },
]

export default function InvestorSidebar() {
  const pathname = usePathname()
  const router   = useRouter()
  const [open, setOpen] = useState(false)
  const { logoUrl } = useLogoConfig()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace('/login')
      }
    )
    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out')
    router.replace('/login')
  }

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-naija-green-900 text-white p-6 overflow-y-auto transition-transform duration-300 z-40 flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 mb-2">
          {logoUrl ? (
            <Image src={logoUrl} alt="NNW Logo" width={48} height={48} className="rounded-lg" priority />
          ) : (
            <div className="w-12 h-12 bg-naija-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">NNW</span>
            </div>
          )}
          <div>
            <p className="font-bold text-sm leading-tight">Investor Portal</p>
            <p className="text-naija-green-300 text-xs">NNW Entertainment</p>
          </div>
        </Link>

        <div className="border-t border-naija-green-700 mb-6 mt-2" />

        {/* Nav */}
        <nav className="space-y-1 flex-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-naija-green-600 text-white'
                    : 'text-naija-green-100 hover:bg-naija-green-800'
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* Investor note */}
        <div className="mb-4 p-3 bg-naija-green-800 rounded-lg border border-naija-green-700">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className="text-naija-green-400" />
            <p className="text-xs font-semibold text-naija-green-300">Read-Only Access</p>
          </div>
          <p className="text-xs text-naija-green-400 leading-relaxed">
            This portal provides transparent, real-time visibility into your investment.
          </p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-naija-green-100 hover:bg-naija-green-800 transition"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}