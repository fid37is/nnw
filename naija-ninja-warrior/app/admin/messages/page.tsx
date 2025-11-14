'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Send, Users, Bell, Mail, MessageSquare, Loader2, X } from 'lucide-react'

interface Message {
  id: string
  title: string
  content: string
  message_type: 'announcement' | 'event_update' | 'season_alert' | 'direct'
  recipient_type: 'all_users' | 'approved_applicants' | 'specific_users'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  sent_at: string
}

export default function AdminMessagingPage() {
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [seasons, setSeasons] = useState<any[]>([])

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    message_type: 'announcement' as 'announcement' | 'event_update' | 'season_alert' | 'direct',
    recipient_type: 'all_users' as 'all_users' | 'approved_applicants' | 'specific_users',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    send_email: true,
    send_in_app: true,
    send_whatsapp: false,
    season_id: '',
    is_approval_template: false,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userData?.role !== 'admin') {
        toast.error('Unauthorized access')
        window.location.href = '/user/dashboard'
        return
      }

      // Load messages
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setMessages(messagesData || [])

      // Load seasons
      const { data: seasonsData } = await supabase
        .from('seasons')
        .select('id, name, year')
        .order('year', { ascending: false })

      setSeasons(seasonsData || [])
    } catch (err) {
      console.error('Error loading data:', err)
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required')
      return
    }

    if (formData.message_type === 'season_alert' && !formData.season_id) {
      toast.error('Please select a season for season alerts')
      return
    }

    setSending(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Create message
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            admin_id: session.user.id,
            title: formData.title,
            content: formData.content,
            message_type: formData.message_type,
            recipient_type: formData.recipient_type,
            priority: formData.priority,
            send_email: formData.send_email,
            send_in_app: formData.send_in_app,
            send_whatsapp: formData.send_whatsapp,
            season_id: formData.season_id || null,
            sent_at: new Date().toISOString(),
          },
        ])
        .select()

      if (messageError) throw messageError

      // Get recipients
      let recipients: string[] = []

      if (formData.recipient_type === 'all_users') {
        const { data: usersData } = await supabase
          .from('users')
          .select('id')

        recipients = usersData?.map((u: any) => u.id) || []
      } else if (formData.recipient_type === 'approved_applicants') {
        const { data: appsData } = await supabase
          .from('applications')
          .select('user_id')
          .eq('status', 'approved')

        recipients = appsData?.map((a: any) => a.user_id) || []
      }

      // Create user notifications and delivery records
      if (recipients.length > 0) {
        const messageId = messageData[0].id

        // Insert user notifications
        const notificationsData = recipients.map((user_id: string) => ({
          user_id,
          message_id: messageId,
        }))

        await supabase.from('user_notifications').insert(notificationsData)

        // Create delivery records for each channel
        const deliveryData: any[] = []
        if (formData.send_email) {
          deliveryData.push(...recipients.map((user_id: string) => ({
            message_id: messageId,
            user_id,
            delivery_type: 'email',
          })))
        }
        if (formData.send_in_app) {
          deliveryData.push(...recipients.map((user_id: string) => ({
            message_id: messageId,
            user_id,
            delivery_type: 'in_app',
          })))
        }
        if (formData.send_whatsapp) {
          deliveryData.push(...recipients.map((user_id: string) => ({
            message_id: messageId,
            user_id,
            delivery_type: 'whatsapp',
          })))
        }

        if (deliveryData.length > 0) {
          await supabase.from('message_delivery').insert(deliveryData)
        }
      }

      toast.success(`Message sent to ${recipients.length} recipient(s)`)
      setFormData({
        title: '',
        content: '',
        message_type: 'announcement',
        recipient_type: 'all_users',
        priority: 'normal',
        send_email: true,
        send_in_app: true,
        send_whatsapp: false,
        season_id: '',
        is_approval_template: false,
      })
      loadData()
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white flex items-center justify-center">
          <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8 lg:p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900">Messaging Center</h1>
            <p className="text-gray-600">Send announcements, updates, and notifications to users</p>
          </div>

          {/* Message Form */}
          <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Message</h2>

            <form onSubmit={handleSendMessage} className="space-y-6">
              {/* Message Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message Type</label>
                  <select
                    value={formData.message_type}
                    onChange={e => setFormData({ ...formData, message_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                  >
                    <option value="announcement">Announcement</option>
                    <option value="event_update">Event Update</option>
                    <option value="season_alert">Season Alert</option>
                    <option value="direct">Direct Message</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                  >
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {/* Recipients */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Send To</label>
                  <select
                    value={formData.recipient_type}
                    onChange={e => setFormData({ ...formData, recipient_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                  >
                    <option value="all_users">All Users</option>
                    <option value="approved_applicants">Approved Applicants</option>
                  </select>
                </div>

                {formData.message_type === 'season_alert' && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
                    <select
                      value={formData.season_id}
                      onChange={e => setFormData({ ...formData, season_id: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                    >
                      <option value="">Select Season</option>
                      {seasons.map(season => (
                        <option key={season.id} value={season.id}>
                          {season.name} ({season.year})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Season 2024 Registration Now Open"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
                <textarea
                  value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm resize-none"
                />
              </div>

              {/* Delivery Channels */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Delivery Channels</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.send_in_app}
                      onChange={e => setFormData({ ...formData, send_in_app: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">In-App Notification</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.send_email}
                      onChange={e => setFormData({ ...formData, send_email: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.send_whatsapp}
                      onChange={e => setFormData({ ...formData, send_whatsapp: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">WhatsApp</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={sending}
                className="w-full px-6 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Messages</h2>
            {messages.length === 0 ? (
              <p className="text-gray-600 text-center py-8">No messages sent yet</p>
            ) : (
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className="border border-gray-200 rounded-lg p-4 hover:border-naija-green-300 transition">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{msg.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(msg.sent_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${msg.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          msg.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                            msg.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {msg.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2">{msg.content}</p>
                    <div className="mt-2 flex gap-2 text-xs">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                        {msg.message_type.replace('_', ' ')}
                      </span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded capitalize">
                        {msg.recipient_type.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}