'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Calendar, Users, Database, CreditCard, LogOut,
  Menu, X, Trophy, ClipboardList, MessageSquare, Zap, Clock,
  TrendingUp, ChevronDown, ListChecks, ChevronLeft,
  KeyRound, ShieldCheck, UserPlus, UserCog, ChevronRight,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useLogoConfig } from '@/components/context/LogoContext'

const navItems = [
  { label: 'Dashboard',     href: '/dashboard',        icon: LayoutDashboard },
  { label: 'Applications',  href: '/applications',     icon: Users           },
  { label: 'Payments',      href: '/payment',          icon: CreditCard      },
  { label: 'Users',         href: '/users',            icon: Users           },
  { label: 'Job Applicants',href: '/job-applications', icon: Users           },
  { label: 'Champions',     href: '/champions',        icon: Trophy          },
  { label: 'Seasons',       href: '/seasons',          icon: Calendar        },
  {
    label: 'Competition',
    icon: Zap,
    submenu: [
      { label: 'Stages',      href: '/stages',         icon: Zap        },
      { label: 'Performance', href: '/performance',    icon: Clock      },
      { label: 'Progress',    href: '/stage-progress', icon: TrendingUp },
    ],
  },
  { label: 'Messages',    href: '/messages',       icon: MessageSquare },
  { label: 'Investors',   href: '/investors',      icon: TrendingUp    },
  { label: 'Audit Logs',  href: '/audit-logs',     icon: ClipboardList },
  { label: 'Add Items',   href: '/merch-sponsor',  icon: Database      },
  { label: 'Waiting List',href: '/waiting-list',   icon: ListChecks    },
]

interface AdminUser {
  id: string
  full_name: string
  email: string
  role: string
}

export default function AdminSidebar() {
  const pathname  = usePathname()
  const router    = useRouter()
  const { logoUrl } = useLogoConfig()

  const [isMobileOpen,  setIsMobileOpen]  = useState(false)
  const [isCollapsed,   setIsCollapsed]   = useState(false)
  const [expandedMenu,  setExpandedMenu]  = useState<string | null>(null)
  const [showPopup,     setShowPopup]     = useState(false)
  const [currentAdmin,  setCurrentAdmin]  = useState<AdminUser | null>(null)
  const [isSuperAdmin,  setIsSuperAdmin]  = useState(false)

  // Password reset modal state
  const [showPwModal,   setShowPwModal]   = useState(false)
  const [newPassword,   setNewPassword]   = useState('')
  const [pwLoading,     setPwLoading]     = useState(false)

  const popupRef = useRef<HTMLDivElement>(null)

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

  // Load current admin info
  useEffect(() => {
    const loadAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('users')
        .select('id, full_name, email, role')
        .eq('id', user.id)
        .single()
      if (data) {
        setCurrentAdmin(data)
        setIsSuperAdmin(data.role === 'super_admin')
      }
    }
    loadAdmin()
  }, [])

  // Close popup on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setShowPopup(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logged out')
    window.location.href = '/'
  }

  const handlePasswordReset = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }
    setPwLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      toast.success('Password updated successfully')
      setShowPwModal(false)
      setNewPassword('')
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password')
    } finally {
      setPwLoading(false)
    }
  }

  const isMenuActive = (item: any): boolean => {
    if (item.href) return pathname === item.href || pathname.startsWith(item.href + '/')
    if (item.submenu) return item.submenu.some((sub: any) =>
      pathname === sub.href || pathname.startsWith(sub.href + '/'))
    return false
  }

  const initials = currentAdmin?.full_name
    ? currentAdmin.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

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
        className={`fixed left-0 top-0 h-screen bg-naija-green-900 text-white flex flex-col transition-all duration-300 z-40
          ${isCollapsed ? 'w-20' : 'w-64'}
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* ── Top: Logo + collapse button ── */}
        <div className={`flex-shrink-0 flex items-center border-b border-naija-green-800 ${isCollapsed ? 'justify-center p-4' : 'justify-between px-5 py-4'}`}>
          {/* Logo — clicking expands if collapsed */}
          <button
            onClick={() => isCollapsed ? setIsCollapsed(false) : router.push('/dashboard')}
            className="flex items-center gap-3 min-w-0 focus:outline-none"
          >
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-naija-green-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">NNW</span>
              </div>
            )}
            {!isCollapsed && (
              <span className="font-bold text-lg truncate text-white">Admin</span>
            )}
          </button>

          {/* Collapse toggle — only when expanded */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex text-naija-green-300 hover:text-white p-1.5 rounded-lg hover:bg-naija-green-800 transition flex-shrink-0"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {/* ── Middle: Scrollable nav ── */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 scrollbar-thin scrollbar-thumb-naija-green-700">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive   = isMenuActive(item)
            const isExpanded = expandedMenu === item.label

            return (
              <div key={item.label}>
                {item.submenu ? (
                  <>
                    <button
                      onClick={() => setExpandedMenu(isExpanded ? null : item.label)}
                      title={isCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                        ${isActive ? 'bg-naija-green-600 text-white' : 'text-naija-green-100 hover:bg-naija-green-800'}
                        ${isCollapsed ? 'justify-center' : ''}`}
                    >
                      <Icon size={20} className="flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="font-medium flex-1 text-left text-sm">{item.label}</span>
                          <ChevronDown size={16} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                    {isExpanded && !isCollapsed && (
                      <div className="mt-1 ml-5 space-y-1 border-l-2 border-naija-green-700 pl-3">
                        {item.submenu.map((sub: any) => {
                          const SubIcon = sub.icon
                          const isSubActive = pathname === sub.href || pathname.startsWith(sub.href + '/')
                          return (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={() => setIsMobileOpen(false)}
                              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all
                                ${isSubActive ? 'bg-naija-green-600 text-white' : 'text-naija-green-100 hover:bg-naija-green-800'}`}
                            >
                              <SubIcon size={16} className="flex-shrink-0" />
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
                    title={isCollapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                      ${isActive ? 'bg-naija-green-600 text-white' : 'text-naija-green-100 hover:bg-naija-green-800'}
                      ${isCollapsed ? 'justify-center' : ''}`}
                  >
                    <Icon size={20} className="flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium text-sm">{item.label}</span>}
                  </Link>
                )}
              </div>
            )
          })}
        </nav>

        {/* ── Bottom: Sticky avatar + logout ── */}
        <div className="flex-shrink-0 border-t border-naija-green-800 p-3 space-y-1" ref={popupRef}>

          {/* Avatar button */}
          <div className="relative">
            <button
              onClick={() => setShowPopup(!showPopup)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-naija-green-800 transition-all
                ${isCollapsed ? 'justify-center' : ''}`}
            >
              {/* Avatar circle */}
              <div className="w-8 h-8 rounded-full bg-naija-green-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs">
                {initials}
              </div>
              {!isCollapsed && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-semibold text-white truncate">{currentAdmin?.full_name || 'Admin'}</p>
                    <p className="text-xs text-naija-green-300 truncate">{currentAdmin?.email || ''}</p>
                  </div>
                  <ChevronRight size={14} className={`text-naija-green-300 transition-transform ${showPopup ? 'rotate-90' : ''}`} />
                </>
              )}
            </button>

            {/* Popup */}
            {showPopup && (
              <div className={`absolute bottom-full mb-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 w-56
                ${isCollapsed ? 'left-full ml-2 bottom-0 mb-0' : 'left-0'}`}>

                {/* Admin info header */}
                <div className="px-4 py-3 bg-naija-green-50 border-b border-gray-100">
                  <p className="text-xs font-bold text-naija-green-900 truncate">{currentAdmin?.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentAdmin?.email}</p>
                  <span className={`mt-1 inline-block text-xs px-2 py-0.5 rounded-full font-semibold
                    ${isSuperAdmin ? 'bg-red-100 text-red-700' : 'bg-naija-green-100 text-naija-green-700'}`}>
                    {isSuperAdmin ? 'Super Admin' : 'Admin'}
                  </span>
                </div>

                <div className="py-1">
                  {/* Reset password */}
                  <button
                    onClick={() => { setShowPopup(false); setShowPwModal(true) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <KeyRound size={15} className="text-gray-400" />
                    Reset Password
                  </button>

                  {/* Permission settings — super admin only */}
                  {isSuperAdmin && (
                    <button
                      onClick={() => { setShowPopup(false); router.push('/admin/admins') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <ShieldCheck size={15} className="text-gray-400" />
                      Permission Settings
                    </button>
                  )}

                  {/* Add admin — super admin only */}
                  {isSuperAdmin && (
                    <button
                      onClick={() => { setShowPopup(false); router.push('/admin/admins?action=add') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      <UserPlus size={15} className="text-gray-400" />
                      Add Admin
                    </button>
                  )}

                  {/* Admins list */}
                  <button
                    onClick={() => { setShowPopup(false); router.push('/admin/admins') }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
                  >
                    <UserCog size={15} className="text-gray-400" />
                    Manage Admins
                  </button>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut size={15} />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* ── Password Reset Modal ── */}
      {showPwModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-naija-green-100 flex items-center justify-center">
                <KeyRound size={20} className="text-naija-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Reset Password</h3>
                <p className="text-xs text-gray-500">Enter your new password</p>
              </div>
            </div>

            <input
              type="password"
              placeholder="New password (min. 8 characters)"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 mb-4"
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setShowPwModal(false); setNewPassword('') }}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordReset}
                disabled={pwLoading}
                className="flex-1 px-4 py-2.5 bg-naija-green-600 text-white rounded-xl text-sm font-semibold hover:bg-naija-green-700 transition disabled:opacity-50"
              >
                {pwLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}