'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Users, Database, CreditCard, LogOut,
  Menu, X, Trophy, ClipboardList, MessageSquare, Zap, Clock,
  TrendingUp, ChevronDown, ListChecks, ChevronLeft
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useLogoConfig } from '@/components/context/LogoContext'   // ← Fixed import

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Applications', href: '/applications', icon: Users },
  { label: 'Payments', href: '/payment', icon: CreditCard },
  { label: 'Users', href: '/users', icon: Users },
  { label: 'Job Applicants', href: '/job-applications', icon: Users },
  { label: 'Champions', href: '/champions', icon: Trophy },
  { label: 'Seasons', href: '/seasons', icon: Calendar },
  {
    label: 'Competition',
    icon: Zap,
    submenu: [
      { label: 'Stages', href: '/stages', icon: Zap },
      { label: 'Performance', href: '/performance', icon: Clock },
      { label: 'Progress', href: '/stage-progress', icon: TrendingUp },
    ],
  },
  { label: 'Messages', href: '/messages', icon: MessageSquare },
  { label: 'Investors', href: '/investors', icon: TrendingUp },
  { label: 'Audit Logs', href: '/audit-logs', icon: ClipboardList },
  { label: 'Add Items', href: '/merch-sponsor', icon: Database },
  { label: 'Waiting List', href: '/waiting-list', icon: ListChecks },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const { logoUrl } = useLogoConfig()

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  // Persist collapsed state
  useEffect(() => {
    const saved = localStorage.getItem('sidebarCollapsed')
    if (saved !== null) setIsCollapsed(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(isCollapsed))
  }, [isCollapsed])

  // Auto-expand active submenu
  useEffect(() => {
    const activeParent = navItems.find(item =>
      item.submenu?.some((sub: any) =>
        pathname === sub.href || pathname.startsWith(sub.href + '/')
      )
    )
    if (activeParent) setExpandedMenu(activeParent.label)
  }, [pathname])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out')
    window.location.href = '/'
  }

  const isMenuActive = (item: any): boolean => {
    if (item.href) {
      return pathname === item.href || pathname.startsWith(item.href + '/')
    }
    if (item.submenu) {
      return item.submenu.some((sub: any) =>
        pathname === sub.href || pathname.startsWith(sub.href + '/')
      )
    }
    return false
  }

  const toggleCollapse = () => setIsCollapsed(!isCollapsed)

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm"
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-naija-green-900 text-white overflow-y-auto transition-all duration-300 z-40 flex flex-col ${isCollapsed ? 'w-20' : 'w-64'
          } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Logo + Collapse Button */}
        <div className="p-6 flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-3 flex-1 min-w-0">
            {logoUrl && (
              <Image
                src={logoUrl}
                alt="Logo"
                width={48}
                height={48}
                className="rounded-lg flex-shrink-0"
              />
            )}
            {!isCollapsed && <span className="font-bold text-xl truncate">Admin</span>}
          </Link>

          <button
            onClick={toggleCollapse}
            className="hidden lg:block text-naija-green-300 hover:text-white p-1 rounded-lg hover:bg-naija-green-800 transition"
          >
            <ChevronLeft
              size={20}
              className={`transition-transform ${isCollapsed ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = isMenuActive(item)
            const isExpanded = expandedMenu === item.label

            return (
              <div key={item.label}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-naija-green-600 text-white' : 'text-naija-green-100 hover:bg-naija-green-800'
                        }`}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium flex-1 text-left">{item.label}</span>
                          <ChevronDown size={18} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>

                    {isExpanded && !isCollapsed && (
                      <div className="mt-1 ml-6 space-y-1 border-l-2 border-naija-green-700 pl-4">
                        {item.submenu.map((sub: any) => {
                          const SubIcon = sub.icon
                          const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + '/')
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setIsMobileOpen(false)}
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${isSubActive ? 'bg-naija-green-600 text-white' : 'text-naija-green-100 hover:bg-naija-green-800'
                                }`}
                            >
                              <SubIcon size={18} className="flex-shrink-0" />
                              <span className="font-medium">{sub.label}</span>
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-naija-green-600 text-white' : 'text-naija-green-100 hover:bg-naija-green-800'
                      }`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 mt-auto border-t border-naija-green-800">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-naija-green-100 hover:bg-naija-green-800 transition-all ${isCollapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={20} />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  )
}