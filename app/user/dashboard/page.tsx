'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { FileText, Upload, Clock, CheckCircle, XCircle, Mail, Bell, MessageSquare, Settings, Trash2, RefreshCw, Menu, X, DollarSign, CreditCard } from 'lucide-react'
import UserDropdown from '@/components/UserDropdown'
import Image from 'next/image';
import { useAuthConfig } from '@/components/context/AuthContext'

interface Application {
  id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  submission_date: string
  season_id: string
  video_url: string | null
  photo_url: string | null
  is_accepted: boolean
  is_participant: boolean
  payment_status: 'unpaid' | 'pending' | 'confirmed'
  payment_submitted_at: string | null
  payment_method?: string
}

interface User {
  id: string
  email: string
  full_name: string
  phone: string
}

interface Message {
  id: string
  title: string
  content: string
  priority: string
  message_type: string
}

interface Notification {
  id: string
  message_id: string
  is_read: boolean
  read_at: string | null
  created_at: string
  message: Message | null
}

interface Preferences {
  email_notifications: boolean
  in_app_notifications: boolean
  whatsapp_notifications: boolean
  whatsapp_number: string
}

// Social Media Sidebar Component
// Clean Social Media Sidebar Component
function SocialMediaSidebar() {
  const socialLinks = [
    {
      name: 'X',
      handle: '@officialnnw',
      url: 'https://x.com/officialnnw',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      handle: '@naijaninjawarrior',
      url: 'https://instagram.com/naijaninjawarrior',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    },
    {
      name: 'TikTok',
      handle: '@naijaninjawarrior',
      url: 'https://tiktok.com/@naijaninjawarrior',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      handle: 'Naija-Ninja-Warrior',
      url: 'https://linkedin.com/company/naija-ninja-warrior',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      handle: 'NaijaNinjaWarrior',
      url: 'https://facebook.com/naijaninjawarrior',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'WhatsApp',
      handle: 'Channel',
      url: 'https://whatsapp.com/channel/0029VbC22T75fM5jemSqUI0E',
      icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      )
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 sticky top-24">
      {/* Header */}
      <div className="mb-5 pb-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900 mb-1">Stay Connected</h3>
        <p className="text-xs text-gray-600">
          Follow us on social media for updates
        </p>
      </div>

      {/* Social Links - Clean List */}
      <div className="space-y-2">
        {socialLinks.map((social) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Icon */}
            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 group-hover:bg-naija-green-100 group-hover:text-naija-green-700 transition-colors flex-shrink-0">
              {social.icon}
            </div>
            
            {/* Text */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-naija-green-700 transition-colors">
                {social.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {social.handle}
              </p>
            </div>

            {/* Arrow */}
            <svg 
              className="w-4 h-4 text-gray-400 group-hover:text-naija-green-600 group-hover:translate-x-0.5 transition-all flex-shrink-0" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <span className="text-sm">💡</span>
          <p className="leading-relaxed">
            Turn on notifications to stay updated with announcements and competition details.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function UserDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [application, setApplication] = useState<Application | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'application' | 'inbox' | 'preferences'>('application')
  const [applicationOpen, setApplicationOpen] = useState<boolean>(false)
  const [checkingApplicationWindow, setCheckingApplicationWindow] = useState(true)
  const [preferences, setPreferences] = useState<Preferences>({
    email_notifications: true,
    in_app_notifications: true,
    whatsapp_notifications: false,
    whatsapp_number: '',
  })
  const [savingPreferences, setSavingPreferences] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<Notification | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [deletingMessage, setDeletingMessage] = useState<string | null>(null)
  const { logoUrl } = useAuthConfig()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          window.location.href = '/login'
          return
        }

        // Get user data
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (userError) throw userError
        setUser(userData)

        // Check application window
        const { data: seasonData } = await supabase
          .from('seasons')
          .select('application_start_date, application_end_date')
          .eq('status', 'active')
          .single()

        if (seasonData) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)

          const startDate = new Date(seasonData.application_start_date)
          startDate.setHours(0, 0, 0, 0)

          const endDate = new Date(seasonData.application_end_date)
          endDate.setHours(23, 59, 59, 999)

          const isOpen = today >= startDate && today <= endDate
          setApplicationOpen(isOpen)
        }
        setCheckingApplicationWindow(false)

        // Get application data with payment info
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('id, status, submission_date, season_id, video_url, photo_url, is_accepted, is_participant, payment_status, payment_submitted_at, payment_method')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (appError && appError.code !== 'PGRST116') {
          throw appError
        }

        if (appData) {
          setApplication(appData)
        }

        // Get notifications
        const { data: notifData, error: notifError } = await supabase
          .from('user_notifications')
          .select('id, message_id, is_read, read_at, created_at')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })

        if (notifError) {
          console.error('Error fetching notifications:', notifError)
        } else {
          const messageIds = notifData?.map((n: any) => n.message_id) || []

          if (messageIds.length > 0) {
            const { data: messagesData, error: messagesError } = await supabase
              .from('messages')
              .select('id, title, content, priority, message_type')
              .in('id', messageIds)

            if (!messagesError && messagesData) {
              const messagesMap = new Map((messagesData as any[]).map((m: any) => [m.id, m]))
              const combinedNotifications = (notifData as any[]).map((notif: any) => ({
                ...notif,
                message: messagesMap.get(notif.message_id) || null
              })) as Notification[]
              setNotifications(combinedNotifications)
            }
          }
        }

        // Get preferences
        const { data: prefData } = await supabase
          .from('notification_preferences')
          .select('*')
          .eq('user_id', session.user.id)
          .single()

        if (prefData) {
          setPreferences({
            email_notifications: prefData.email_notifications,
            in_app_notifications: prefData.in_app_notifications,
            whatsapp_notifications: prefData.whatsapp_notifications,
            whatsapp_number: prefData.whatsapp_number || '',
          })
        }
      } catch (err) {
        setError('Failed to load dashboard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const savePreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      setSavingPreferences(true)

      const { error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: session.user.id,
          email_notifications: preferences.email_notifications,
          in_app_notifications: preferences.in_app_notifications,
          whatsapp_notifications: preferences.whatsapp_notifications,
          whatsapp_number: preferences.whatsapp_number,
        })

      if (error) throw error
      toast.success('Preferences saved successfully')
    } catch (err) {
      console.error('Error saving preferences:', err)
      toast.error('Failed to save preferences')
    } finally {
      setSavingPreferences(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('user_notifications')
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId)

      setNotifications(prev =>
        prev.map((n: any) => n.id === notificationId ? { ...n, is_read: true } : n)
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: notifData } = await supabase
        .from('user_notifications')
        .select('id, message_id, is_read, read_at, created_at')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (notifData && notifData.length > 0) {
        const messageIds = (notifData as any[]).map((n: any) => n.message_id)
        const { data: messagesData } = await supabase
          .from('messages')
          .select('id, title, content, priority, message_type')
          .in('id', messageIds)

        if (messagesData) {
          const messagesMap = new Map((messagesData as any[]).map((m: any) => [m.id, m]))
          const combinedNotifications = (notifData as any[]).map((notif: any) => ({
            ...notif,
            message: messagesMap.get(notif.message_id) || null
          })) as Notification[]
          setNotifications(combinedNotifications)
        }
      }
      toast.success('Messages refreshed')
    } catch (err) {
      console.error('Error refreshing:', err)
      toast.error('Failed to refresh messages')
    } finally {
      setRefreshing(false)
    }
  }

  const deleteMessage = async (notificationId: string) => {
    setDeletingMessage(notificationId)
    try {
      await supabase
        .from('user_notifications')
        .delete()
        .eq('id', notificationId)

      setNotifications(prev => prev.filter((n: any) => n.id !== notificationId))
      if (selectedMessage?.id === notificationId) {
        setSelectedMessage(null)
      }
      toast.success('Message deleted')
    } catch (err) {
      console.error('Error deleting message:', err)
      toast.error('Failed to delete message')
    } finally {
      setDeletingMessage(null)
    }
  }

  const deleteAllMessages = async () => {
    if (!confirm('Are you sure you want to delete all messages? This cannot be undone.')) return

    setDeletingMessage('all')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      await supabase
        .from('user_notifications')
        .delete()
        .eq('user_id', session.user.id)

      setNotifications([])
      setSelectedMessage(null)
      toast.success('All messages deleted')
    } catch (err) {
      console.error('Error deleting all messages:', err)
      toast.error('Failed to delete messages')
    } finally {
      setDeletingMessage(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle size={20} />
      case 'rejected':
        return <XCircle size={20} />
      case 'under_review':
        return <Clock size={20} />
      default:
        return <FileText size={20} />
    }
  }

  // Check if user needs to pay
  const needsPayment = application?.is_accepted &&
    !application?.is_participant &&
    application?.payment_status !== 'confirmed'

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logoUrl}
                alt="Naija Ninja Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
            </Link>
          </div>
        </nav>
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)]">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </div>
      </main>
    )
  }

  const unreadCount = notifications.filter((n: any) => !n.is_read).length

  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoUrl}
              alt="Naija Ninja Logo"
              width={60}
              height={60}
              className="rounded-lg"
              priority
            />
            <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
          </Link>
          <UserDropdown handleLogout={handleLogout} />
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        {error && (
          <div className="bg-red-100 border border-red-300 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-4xl font-bold text-naija-green-900 mb-1">
            Welcome, {user?.full_name}! 👋
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage your application and messages</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('application')}
            className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${activeTab === 'application'
              ? 'text-naija-green-600 border-naija-green-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <span className="hidden sm:inline">Application</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-4 py-3 font-semibold border-b-2 transition relative whitespace-nowrap ${activeTab === 'inbox'
              ? 'text-naija-green-600 border-naija-green-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Inbox</span>
              {unreadCount > 0 && (
                <span className="ml-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${activeTab === 'preferences'
              ? 'text-naija-green-600 border-naija-green-600'
              : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
          >
            <div className="flex items-center gap-2">
              <Settings size={18} />
              <span className="hidden sm:inline">Preferences</span>
            </div>
          </button>
        </div>

        {/* Application Tab */}
        {/* Application Tab */}
        {activeTab === 'application' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Application Status (spans 2 columns) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Required Banner */}
              {needsPayment && (
                <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 shadow-lg animate-in slide-in-from-top duration-500">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">🎉</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-green-900 mb-2">
                        Congratulations! You've Been Accepted!
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Complete your payment to confirm your participation in the NAIJA Star Challenge.
                        {application?.payment_status === 'pending' && (
                          <span className="block mt-2 text-orange-700 font-semibold">
                            ⏳ Your payment is currently under review. We'll notify you once it's confirmed.
                          </span>
                        )}
                      </p>
                      {application?.payment_status === 'unpaid' && (
                        <Link
                          href="/user/payment"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition shadow-md hover:shadow-lg"
                        >
                          <CreditCard size={20} />
                          Complete Payment Now
                        </Link>
                      )}
                      {application?.payment_status === 'pending' && (
                        <div className="flex items-center gap-2 text-orange-800 font-semibold">
                          <Clock size={18} />
                          Payment Pending Verification
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Nickname Reminder for Accepted Users */}
              {application?.is_accepted && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                  <p className="text-gray-700">
                    💡 <strong>Tip:</strong> Don't forget to add your nickname in your{' '}
                    <Link href="/user/profile" className="text-blue-600 underline font-semibold">
                      profile page
                    </Link>
                    {' '}for the challenge phases!
                  </p>
                </div>
              )}

              {application ? (
                <>
                  <div className="bg-white rounded-2xl shadow-md border border-naija-green-100 p-6">
                    <h2 className="text-lg font-bold text-naija-green-900 mb-4">Application Status</h2>
                    <div className={`flex items-center gap-4 p-4 rounded-lg border-2 ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <div>
                        <p className="font-semibold capitalize">{application.status.replace('_', ' ')}</p>
                        <p className="text-sm">
                          Submitted on {new Date(application.submission_date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Video Uploaded:</span>
                        <span className="font-semibold">
                          {application.video_url ? '✓ Yes' : '✗ No'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Photo Uploaded:</span>
                        <span className="font-semibold">
                          {application.photo_url ? '✓ Yes' : '✗ No'}
                        </span>
                      </div>
                      {application.is_accepted && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Accepted:</span>
                            <span className="font-semibold text-green-600">✓ Yes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Payment Status:</span>
                            <span className={`font-semibold ${application.payment_status === 'confirmed' ? 'text-green-600' :
                                application.payment_status === 'pending' ? 'text-orange-600' :
                                  'text-red-600'
                              }`}>
                              {application.payment_status === 'confirmed' ? '✓ Confirmed' :
                                application.payment_status === 'pending' ? '⏳ Pending Review' :
                                  '✗ Unpaid'}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {application.status === 'pending' || !application.video_url || !application.photo_url ? (
                    <div className="grid grid-cols-1 gap-3">
                      <Link
                        href={`/user/application/${application.id}`}
                        className="flex items-center justify-center gap-2 bg-naija-green-600 text-white rounded-lg py-3 px-4 hover:bg-naija-green-700 transition font-semibold text-sm"
                      >
                        <Upload size={18} />
                        Upload Media
                      </Link>
                      <Link
                        href="/user/profile"
                        className="flex items-center justify-center gap-2 bg-naija-green-100 text-naija-green-700 rounded-lg py-3 px-4 hover:bg-naija-green-200 transition font-semibold text-sm"
                      >
                        <FileText size={18} />
                        View Details
                      </Link>
                    </div>
                  ) : !application.is_accepted ? (
                    <div className="bg-naija-green-50 border-2 border-naija-green-200 rounded-lg p-3 text-center">
                      <p className="text-naija-green-900 font-semibold text-sm">
                        ✓ Application complete! Under review.
                      </p>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-naija-green-100 p-6 text-center">
                  <div className="inline-block w-14 h-14 bg-naija-green-100 rounded-full items-center justify-center mb-3">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h2 className="text-lg font-bold text-naija-green-900 mb-2">No Application Yet</h2>
                  <p className="text-sm text-gray-600 mb-4">Start your journey to become a Naija Ninja Warrior!</p>

                  {checkingApplicationWindow ? (
                    <div className="animate-pulse bg-gray-200 h-10 rounded-lg w-48 mx-auto"></div>
                  ) : applicationOpen ? (
                    <Link
                      href="/user/application/new"
                      className="inline-block px-5 py-2 bg-naija-green-600 text-white rounded-lg text-sm font-semibold hover:bg-naija-green-700 transition"
                    >
                      Create Application
                    </Link>
                  ) : (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-2">
                      <p className="text-gray-600 font-semibold text-sm">Applications Currently Closed</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Applications are not open at this time. Check back during the application window.
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="bg-naija-green-50 border border-naija-green-200 rounded-lg p-4">
                <h3 className="font-bold text-naija-green-900 text-sm mb-3">📋 Application Checklist</h3>
                <ul className="space-y-2 text-xs text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="w-4 text-center font-bold">{application?.photo_url ? '✓' : '○'}</span>
                    Profile Photo
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 text-center font-bold">{application?.video_url ? '✓' : '○'}</span>
                    2-3 Min Video
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 text-center font-bold">{application?.status === 'under_review' || application?.status === 'approved' ? '✓' : '○'}</span>
                    Under Review
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 text-center font-bold">{application?.is_accepted ? '✓' : '○'}</span>
                    Accepted
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 text-center font-bold">{application?.payment_status === 'confirmed' ? '✓' : '○'}</span>
                    Payment Confirmed
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-4 text-center font-bold">{application?.is_participant ? '✓' : '○'}</span>
                    Participant Status
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Social Media Sidebar */}
            <div className="lg:col-span-1">
              <SocialMediaSidebar />
            </div>
          </div>
        )}

        {/* Inbox Tab */}
        {activeTab === 'inbox' && (
          <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 h-auto lg:h-[calc(100vh-200px)]">
            {/* Messages List - Left */}
            <div className={`lg:col-span-1 ${selectedMessage ? 'hidden lg:block' : 'block'}`}>
              <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 h-full lg:h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                  <h2 className="text-lg font-bold text-gray-900">Messages ({notifications.length})</h2>
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="p-1.5 hover:bg-gray-100 rounded transition disabled:opacity-50"
                    title="Refresh messages"
                  >
                    <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div>
                      <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-600 text-sm">No messages yet</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-y-auto min-h-0">
                      <div className="space-y-2 p-3">
                        {notifications.map((notif: any) => (
                          <button
                            key={notif.id}
                            onClick={() => {
                              setSelectedMessage(notif)
                              if (!notif.is_read) {
                                markAsRead(notif.id)
                              }
                            }}
                            className={`w-full text-left p-3 rounded-lg border transition ${selectedMessage?.id === notif.id
                              ? 'border-naija-green-600 bg-naija-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                              }`}
                          >
                            <div className="flex items-start gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{notif.message?.title || 'No Title'}</h3>
                                <p className="text-xs text-gray-500 mt-1">{new Date(notif.created_at).toLocaleDateString()}</p>
                              </div>
                              {!notif.is_read && (
                                <div className="w-2 h-2 bg-naija-green-600 rounded-full flex-shrink-0 mt-1.5"></div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {notifications.length > 0 && (
                      <div className="p-3 border-t border-gray-200 flex-shrink-0">
                        <button
                          onClick={deleteAllMessages}
                          disabled={deletingMessage === 'all'}
                          className="w-full px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-xs font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete All
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Message Detail - Right */}
            <div className={`lg:col-span-2 ${selectedMessage ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 sm:p-6 h-full lg:h-full flex flex-col">
                {selectedMessage ? (
                  <div className="flex flex-col h-full animate-in fade-in duration-200">
                    <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200 flex-shrink-0 gap-3">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{selectedMessage.message?.title || 'No Title'}</h2>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2">
                          {new Date(selectedMessage.created_at).toLocaleString()}
                        </p>
                        {selectedMessage.message?.priority && (
                          <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${selectedMessage.message.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                            selectedMessage.message.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                              selectedMessage.message.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {selectedMessage.message.priority.toUpperCase()} PRIORITY
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => setSelectedMessage(null)}
                          className="lg:hidden p-2 hover:bg-gray-100 text-gray-700 rounded-lg transition"
                          title="Back to messages"
                        >
                          <X size={20} />
                        </button>
                        <button
                          onClick={() => deleteMessage(selectedMessage.id)}
                          disabled={deletingMessage === selectedMessage.id}
                          className="p-2 hover:bg-red-100 text-red-700 rounded-lg transition disabled:opacity-50"
                          title="Delete this message"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto mb-4 min-h-0">
                      <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700 leading-relaxed">
                        {selectedMessage.message?.content || 'No content'}
                      </div>
                    </div>

                    {!selectedMessage.is_read && (
                      <div className="text-xs text-gray-500 text-center flex-shrink-0">
                        ✓ Message marked as read
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-600">Select a message to read</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-4 sm:p-6 max-w-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h2>

            <div className="space-y-6">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.in_app_notifications}
                    onChange={e => setPreferences({ ...preferences, in_app_notifications: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">In-App Notifications</span>
                    <span className="block text-xs text-gray-600">Receive notifications within the app</span>
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.email_notifications}
                    onChange={e => setPreferences({ ...preferences, email_notifications: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">Email Notifications</span>
                    <span className="block text-xs text-gray-600">Receive updates via email</span>
                  </span>
                </label>
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences.whatsapp_notifications}
                    onChange={e => setPreferences({ ...preferences, whatsapp_notifications: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="ml-3">
                    <span className="block text-sm font-semibold text-gray-900">WhatsApp Notifications</span>
                    <span className="block text-xs text-gray-600">Receive messages on WhatsApp</span>
                  </span>
                </label>

                {preferences.whatsapp_notifications && (
                  <div className="mt-3 ml-7">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">WhatsApp Number</label>
                    <input
                      type="tel"
                      value={preferences.whatsapp_number}
                      onChange={e => setPreferences({ ...preferences, whatsapp_number: e.target.value })}
                      placeholder="+234 800 000 0000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={savePreferences}
                disabled={savingPreferences}
                className="w-full px-6 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {savingPreferences ? 'Saving...' : 'Save Preferences'}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}