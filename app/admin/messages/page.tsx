// File: app/admin/messaging/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import MessageTemplates from '@/components/admin/MessagesTemplate'
import InquiriesManagement from '@/components/admin/InquiriesManagement'
import { Send, Mail, MessageSquare, Loader2, RefreshCw } from 'lucide-react'

interface Message {
  id: string
  title: string
  content: string
  message_type: 'announcement' | 'event_update' | 'season_alert' | 'direct'
  recipient_type: 'all_users' | 'approved_applicants' | 'rejected_applicants' | 'accepted_applicants' | 'participants' | 'specific_users'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  sent_at: string
}

interface Inquiry {
  id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'responded' | 'archived'
  created_at: string
  responded_at: string | null
  admin_response: string | null
}

interface MessageTemplate {
  id: string
  name: string
  title: string
  content: string
  template_type: 'acceptance' | 'approval' | 'rejection' | 'general'
  created_at: string
}

interface Season {
  id: string
  name: string
  year: number
}

export default function AdminMessagingPage() {
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<'messages' | 'inquiries' | 'templates'>('messages')
  const [messages, setMessages] = useState<Message[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [templates, setTemplates] = useState<MessageTemplate[]>([])
  const [seasons, setSeasons] = useState<Season[]>([])

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    message_type: 'announcement' as 'announcement' | 'event_update' | 'season_alert' | 'direct',
    recipient_type: 'all_users' as 'all_users' | 'approved_applicants' | 'rejected_applicants' | 'accepted_applicants' | 'participants' | 'specific_users',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    send_in_app: true,
    season_id: '',
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

      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      setMessages(messagesData || [])

      const { data: inquiriesData } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      setInquiries(inquiriesData || [])

      const { data: templatesData } = await supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: false })

      setTemplates(templatesData || [])

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

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      await loadData()
      toast.success('Data refreshed successfully')
    } catch (err) {
      console.error('Error refreshing data:', err)
      toast.error('Failed to refresh data')
    } finally {
      setRefreshing(false)
    }
  }

  const handleUseTemplate = (template: MessageTemplate) => {
    setFormData({
      ...formData,
      title: template.title,
      content: template.content,
    })
    setActiveTab('messages')
    toast.success(`Template "${template.name}" loaded`)
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
            send_email: true,
            send_in_app: formData.send_in_app,
            send_whatsapp: false,
            season_id: formData.season_id || null,
            sent_at: new Date().toISOString(),
          },
        ])
        .select()

      if (messageError) throw messageError

      let recipients: string[] = []

      if (formData.recipient_type === 'all_users') {
        const { data: usersData } = await supabase
          .from('users')
          .select('id')

        recipients = usersData?.map((u: any) => u.id) || []
      } else if (formData.recipient_type === 'accepted_applicants') {
        const { data: appsData } = await supabase
          .from('applications')
          .select('user_id')
          .eq('is_accepted', true)
          .eq('is_participant', false)

        recipients = appsData?.map((a: any) => a.user_id) || []
      } else if (formData.recipient_type === 'participants') {
        const { data: appsData } = await supabase
          .from('applications')
          .select('user_id')
          .eq('is_participant', true)

        recipients = appsData?.map((a: any) => a.user_id) || []
      } else if (formData.recipient_type === 'approved_applicants') {
        const { data: appsData } = await supabase
          .from('applications')
          .select('user_id')
          .eq('status', 'approved')

        recipients = appsData?.map((a: any) => a.user_id) || []
      } else if (formData.recipient_type === 'rejected_applicants') {
        const { data: appsData } = await supabase
          .from('applications')
          .select('user_id')
          .eq('status', 'rejected')

        recipients = appsData?.map((a: any) => a.user_id) || []
      }

      if (recipients.length > 0) {
        const messageId = messageData[0].id

        if (formData.send_in_app) {
          const notificationsData = recipients.map((user_id: string) => ({
            user_id,
            message_id: messageId,
          }))
          await supabase.from('user_notifications').insert(notificationsData)
        }

        const deliveryData: any[] = []
        
        deliveryData.push(...recipients.map((user_id: string) => ({
          message_id: messageId,
          user_id,
          delivery_type: 'email',
        })))
        
        if (formData.send_in_app) {
          deliveryData.push(...recipients.map((user_id: string) => ({
            message_id: messageId,
            user_id,
            delivery_type: 'in_app',
          })))
        }

        if (deliveryData.length > 0) {
          await supabase.from('message_delivery').insert(deliveryData)
        }

        const { data: recipientUsers } = await supabase
          .from('users')
          .select('email, full_name')
          .in('id', recipients)

        if (recipientUsers && recipientUsers.length > 0) {
          const emailPromises = recipientUsers.map(async (user) => {
            try {
              const emailResponse = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: 'noreply@naijaninja.net',
                  to: user.email,
                  subject: formData.title,
                  html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                      <div style="background: linear-gradient(135deg, #1a7346 0%, #0d5a33 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="color: white; margin: 0;">Naija Ninja Warrior</h1>
                      </div>
                      
                      <div style="background: white; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
                        <h2 style="color: #333; margin-top: 0;">${formData.title}</h2>
                        <div style="color: #666; line-height: 1.6; white-space: pre-wrap;">
                          ${formData.content.replace(/\n/g, '<br>')}
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        
                        <p style="color: #666; margin-top: 30px; font-size: 14px;">
                          Best regards,<br/>
                          <strong>Naija Ninja Warrior Team</strong>
                        </p>
                      </div>
                      
                      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                        <p style="margin: 5px 0;">© 2024 Naija Ninja Warrior. All rights reserved.</p>
                      </div>
                    </div>
                  `,
                }),
              })

              if (!emailResponse.ok) {
                console.error(`Failed to send email to ${user.email}`)
              }
            } catch (error) {
              console.error(`Error sending email to ${user.email}:`, error)
            }
          })

          await Promise.allSettled(emailPromises)
        }
      }

      toast.success(`Message sent to ${recipients.length} recipient(s)`)
      setFormData({
        title: '',
        content: '',
        message_type: 'announcement',
        recipient_type: 'all_users',
        priority: 'normal',
        send_in_app: true,
        season_id: '',
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
        <div className="max-w-6xl mx-auto px-4 py-8 lg:p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-naija-green-900">Messaging Center</h1>
                <p className="text-gray-600">Send announcements, manage inquiries, and create message templates</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'messages'
                  ? 'text-naija-green-600 border-naija-green-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Mail size={20} />
                Broadcast Messages
              </div>
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'text-naija-green-600 border-naija-green-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                Inquiries ({inquiries.filter(i => i.status === 'new').length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-3 font-semibold border-b-2 transition whitespace-nowrap ${
                activeTab === 'templates'
                  ? 'text-naija-green-600 border-naija-green-600'
                  : 'text-gray-600 border-transparent hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <MessageSquare size={20} />
                Templates ({templates.length})
              </div>
            </button>
          </div>

          {activeTab === 'messages' && (
            <>
              <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Message</h2>

                <form onSubmit={handleSendMessage} className="space-y-6">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Send To</label>
                      <select
                        value={formData.recipient_type}
                        onChange={e => setFormData({ ...formData, recipient_type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                      >
                        <option value="all_users">All Users</option>
                        <option value="accepted_applicants">Accepted Applicants (awaiting payment)</option>
                        <option value="participants">Participants (payment confirmed)</option>
                        <option value="approved_applicants">Approved Participants</option>
                        <option value="rejected_applicants">Rejected Applicants</option>
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Additional Notifications</label>
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
                      <p className="text-xs text-gray-500 ml-6">
                        ✅ Email will always be sent (required for all messages)
                      </p>
                    </div>
                  </div>

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
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            msg.priority === 'urgent' ? 'bg-red-100 text-red-800' :
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
            </>
          )}

          {activeTab === 'inquiries' && (
            <InquiriesManagement inquiries={inquiries} onInquiriesChange={loadData} />
          )}

          {activeTab === 'templates' && (
            <MessageTemplates 
              templates={templates} 
              onTemplateUse={handleUseTemplate}
              onTemplatesChange={loadData}
            />
          )}
        </div>
      </main>
    </div>
  )
}