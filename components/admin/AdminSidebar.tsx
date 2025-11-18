'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Calendar, Users, Database, CreditCard, LogOut, Menu, X, Trophy, ClipboardList, MessageSquare, Zap, Clock, TrendingUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useAuthConfig } from '../context/AuthContext'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Applications',
    href: '/admin/applications',
    icon: Users,
  },
  {
    label: 'Payments',
    href: '/admin/payment',
    icon: CreditCard,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Champions',
    href: '/admin/champions',
    icon: Trophy,
  },
  {
    label: 'Seasons',
    href: '/admin/seasons',
    icon: Calendar,
  },
  {
    label: 'Competition',
    icon: Zap,
    submenu: [
      {
        label: 'Stages',
        href: '/admin/stages',
        icon: Zap,
      },
      {
        label: 'Performance',
        href: '/admin/performance',
        icon: Clock,
      },
      {
        label: 'Progress',
        href: '/admin/stage-progress',
        icon: TrendingUp,
      },
    ],
  },
  {
    label: 'Messages',
    href: '/admin/messages',
    icon: MessageSquare,
  },
  {
    label: 'Audit Logs',
    href: '/admin/audit-logs',
    icon: ClipboardList,
  },
  {
    label: 'Add Items',
    href: '/admin/merch-sponsor',
    icon: Database,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const { logoUrl } = useAuthConfig()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out')
    window.location.href = '/'
  }

  const isMenuActive = (item: any) => {
    if (item.href) {
      return pathname === item.href || pathname.startsWith(item.href + '/')
    }
    if (item.submenu) {
      return item.submenu.some((sub: any) => pathname === sub.href || pathname.startsWith(sub.href + '/'))
    }
    return false
  }

  // Initialize expandedMenu based on current pathname
  const [initExpanded, setInitExpanded] = useState(false)

  if (!initExpanded) {
    const activeMenu = navItems.find(item => item.submenu && item.submenu.some((sub: any) => pathname === sub.href || pathname.startsWith(sub.href + '/')))
    if (activeMenu) {
      setExpandedMenu(activeMenu.label)
      setInitExpanded(true)
    }
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(!open)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-naija-green-900 text-white p-6 overflow-y-auto transition-transform duration-300 z-40 ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
      >
        {/* Logo */}
        <Link href="/admin/dashboard" className="flex items-center gap-3 mb-8">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt="Naija Ninja Logo"
              width={60}
              height={60}
              loading="eager"
              priority
              className="rounded-lg"
            />
          )}
          <span className="font-bold text-lg truncate">Admin</span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1 mb-8">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = isMenuActive(item)
            const isExpanded = expandedMenu === item.label

            return (
              <div key={item.label}>
                {item.submenu ? (
                  <>
                    {/* Parent Menu Item with Submenu */}
                    <button
                      onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${isActive
                        ? 'bg-naija-green-600 text-white'
                        : 'text-naija-green-100 hover:bg-naija-green-800'
                        }`}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      <span className="font-medium flex-1 text-left truncate">{item.label}</span>
                      <ChevronDown
                        size={18}
                        className={`flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* Submenu Items */}
                    {isExpanded && (
                      <div className="mt-1 ml-4 space-y-1 border-l-2 border-naija-green-700 pl-2">
                        {item.submenu.map(subitem => {
                          const SubIcon = subitem.icon
                          const isSubActive = pathname === subitem.href || pathname.startsWith(subitem.href + '/')

                          return (
                            <Link
                              key={subitem.href}
                              href={subitem.href}
                              onClick={() => {
                                setOpen(false)
                                // Keep dropdown open on desktop, close on mobile
                                if (window.innerWidth < 1024) {
                                  setExpandedMenu(null)
                                }
                              }}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition truncate ${isSubActive
                                ? 'bg-naija-green-600 text-white'
                                : 'text-naija-green-100 hover:bg-naija-green-800'
                                }`}
                            >
                              <SubIcon size={18} className="flex-shrink-0" />
                              <span className="font-medium text-sm truncate">{subitem.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  /* Regular Menu Item */
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${isActive
                      ? 'bg-naija-green-600 text-white'
                      : 'text-naija-green-100 hover:bg-naija-green-800'
                      }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    <span className="font-medium truncate">{item.label}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-naija-green-100 hover:bg-naija-green-800 transition truncate"
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span className="font-medium truncate">Logout</span>
        </button>
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}