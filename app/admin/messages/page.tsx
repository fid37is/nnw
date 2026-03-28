// File: app/admin/messaging/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import MessageTemplates from '@/components/admin/MessagesTemplate'
import InquiriesManagement from '@/components/admin/InquiriesManagement'
import {
  Send, Mail, MessageSquare, Loader2, RefreshCw,
  Clock, ChevronDown, Users, AlertCircle, Inbox
} from 'lucide-react'

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

const PRIORITY_STYLES: Record<string, string> = {
  urgent: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  high:   'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
  normal: 'bg-blue-50 text-blue-700 ring-1 ring-blue-200',
  low:    'bg-gray-100 text-gray-600',
}

const TYPE_LABELS: Record<string, string> = {
  announcement: 'Announcement',
  event_update: 'Event Update',
  season_alert: 'Season Alert',
  direct: 'Direct',
}

const RECIPIENT_LABELS: Record<string, string> = {
  all_users: 'All Users',
  accepted_applicants: 'Accepted (awaiting payment)',
  participants: 'Participants (paid)',
  approved_applicants: 'Approved',
  rejected_applicants: 'Rejected',
  specific_users: 'Specific Users',
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
    message_type: 'announcement' as Message['message_type'],
    recipient_type: 'all_users' as Message['recipient_type'],
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    send_in_app: true,
    season_id: '',
  })

  useEffect(() => { loadData() }, [])

  const loadData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { window.location.href = '/admin/login'; return }

      const { data: userData } = await supabase
        .from('users').select('role').eq('id', session.user.id).single()

      if (userData?.role !== 'admin') {
        toast.error('Unauthorized access')
        window.location.href = '/user/dashboard'
        return
      }

      const [{ data: messagesData }, { data: inquiriesData }, { data: templatesData }, { data: seasonsData }] =
        await Promise.all([
          supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(20),
          supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
          supabase.from('message_templates').select('*').order('created_at', { ascending: false }),
          supabase.from('seasons').select('id, name, year').order('year', { ascending: false }),
        ])

      setMessages(messagesData || [])
      setInquiries(inquiriesData || [])
      setTemplates(templatesData || [])
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
    try { await loadData(); toast.success('Refreshed') }
    catch { toast.error('Failed to refresh') }
    finally { setRefreshing(false) }
  }

  const handleUseTemplate = (template: MessageTemplate) => {
    setFormData(prev => ({ ...prev, title: template.title, content: template.content }))
    setActiveTab('messages')
    toast.success(`Template "${template.name}" loaded`)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) { toast.error('Subject and message are required'); return }
    if (formData.message_type === 'season_alert' && !formData.season_id) {
      toast.error('Please select a season for season alerts'); return
    }

    setSending(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([{
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
        }])
        .select()

      if (messageError) throw messageError

      let recipients: string[] = []

      if (formData.recipient_type === 'all_users') {
        const { data: usersData } = await supabase.from('users').select('id')
        recipients = usersData?.map((u: any) => u.id) || []
      } else if (formData.recipient_type === 'accepted_applicants') {
        const { data: appsData } = await supabase.from('applications').select('user_id').eq('is_accepted', true).eq('is_participant', false)
        recipients = appsData?.map((a: any) => a.user_id) || []
      } else if (formData.recipient_type === 'participants') {
        const { data: appsData } = await supabase.from('applications').select('user_id').eq('is_participant', true)
        recipients = appsData?.map((a: any) => a.user_id) || []
      } else if (formData.recipient_type === 'approved_applicants') {
        const { data: appsData } = await supabase.from('applications').select('user_id').eq('status', 'approved')
        recipients = appsData?.map((a: any) => a.user_id) || []
      } else if (formData.recipient_type === 'rejected_applicants') {
        const { data: appsData } = await supabase.from('applications').select('user_id').eq('status', 'rejected')
        recipients = appsData?.map((a: any) => a.user_id) || []
      }

      if (recipients.length > 0) {
        const messageId = messageData[0].id

        if (formData.send_in_app) {
          await supabase.from('user_notifications').insert(recipients.map(user_id => ({ user_id, message_id: messageId })))
        }

        const deliveryData: any[] = recipients.map(user_id => ({ message_id: messageId, user_id, delivery_type: 'email' }))
        if (formData.send_in_app) {
          deliveryData.push(...recipients.map(user_id => ({ message_id: messageId, user_id, delivery_type: 'in_app' })))
        }
        await supabase.from('message_delivery').insert(deliveryData)

        const { data: recipientUsers } = await supabase.from('users').select('email, full_name').in('id', recipients)

        if (recipientUsers?.length) {
          await Promise.allSettled(recipientUsers.map(async (user) => {
            try {
              await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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
                        <div style="color: #666; line-height: 1.6; white-space: pre-wrap;">${formData.content.replace(/\n/g, '<br>')}</div>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        <p style="color: #666; font-size: 14px;">Best regards,<br/><strong>Naija Ninja Warrior Team</strong></p>
                      </div>
                      <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
                        <p>© 2024 Naija Ninja Warrior. All rights reserved.</p>
                      </div>
                    </div>
                  `,
                }),
              })
            } catch (error) {
              console.error(`Error sending email to ${user.email}:`, error)
            }
          }))
        }
      }

      toast.success(`Message sent to ${recipients.length} recipient(s)`)
      setFormData({ title: '', content: '', message_type: 'announcement', recipient_type: 'all_users', priority: 'normal', send_in_app: true, season_id: '' })
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
        <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-naija-green-600" />
        </main>
      </div>
    )
  }

  const newInquiriesCount = inquiries.filter(i => i.status === 'new').length

  return (
    <div className="flex">
      <AdminSidebar />

      <main className="flex-1 lg:ml-64 min-h-screen bg-gray-50">
        <div className="px-6 py-8">

          {/* ── Page Header ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Messaging Center</h1>
              <p className="text-sm text-gray-500 mt-0.5">Broadcast announcements, respond to inquiries, manage templates</p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-40"
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              {refreshing ? 'Refreshing…' : 'Refresh'}
            </button>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1 p-1 bg-white border border-gray-200 rounded-xl w-fit mb-6 shadow-sm">
            {([
              { key: 'messages',  label: 'Broadcast',  icon: Mail,         badge: null },
              { key: 'inquiries', label: 'Inquiries',  icon: Inbox,        badge: newInquiriesCount || null },
              { key: 'templates', label: 'Templates',  icon: MessageSquare, badge: templates.length || null },
            ] as const).map(({ key, label, icon: Icon, badge }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  activeTab === key
                    ? 'bg-naija-green-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={15} />
                {label}
                {badge !== null && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === key ? 'bg-white/20 text-white' : 'bg-naija-green-100 text-naija-green-700'
                  }`}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Broadcast Tab ── */}
          {activeTab === 'messages' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_560px] gap-6 items-start">

              {/* Email Composer */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">

                {/* Composer toolbar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
                  <span className="text-sm font-semibold text-gray-700">New Broadcast</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_STYLES[formData.priority]}`}>
                      {formData.priority.toUpperCase()}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSendMessage}>

                  {/* FROM row */}
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 w-14 shrink-0">FROM</span>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-naija-green-600 flex items-center justify-center">
                        <span className="text-white text-[10px] font-bold">NNW</span>
                      </div>
                      <span className="text-sm text-gray-700 font-medium">Naija Ninja Warrior</span>
                      <span className="text-xs text-gray-400">&lt;noreply@naijaninja.net&gt;</span>
                    </div>
                  </div>

                  {/* TO row */}
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 w-14 shrink-0">TO</span>
                    <div className="relative flex-1">
                      <select
                        value={formData.recipient_type}
                        onChange={e => setFormData({ ...formData, recipient_type: e.target.value as any })}
                        className="w-full appearance-none bg-transparent text-sm text-gray-800 font-medium focus:outline-none cursor-pointer pr-6"
                      >
                        <option value="all_users">All Users</option>
                        <option value="accepted_applicants">Accepted Applicants (awaiting payment)</option>
                        <option value="participants">Participants (payment confirmed)</option>
                        <option value="approved_applicants">Approved Applicants</option>
                        <option value="rejected_applicants">Rejected Applicants</option>
                      </select>
                      <ChevronDown size={13} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 ml-auto">
                      <Users size={13} />
                    </div>
                  </div>

                  {/* TYPE + PRIORITY row */}
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 w-14 shrink-0">TYPE</span>
                    <div className="relative flex-1">
                      <select
                        value={formData.message_type}
                        onChange={e => setFormData({ ...formData, message_type: e.target.value as any })}
                        className="w-full appearance-none bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer pr-6"
                      >
                        <option value="announcement">Announcement</option>
                        <option value="event_update">Event Update</option>
                        <option value="season_alert">Season Alert</option>
                        <option value="direct">Direct Message</option>
                      </select>
                      <ChevronDown size={13} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="w-px h-4 bg-gray-200 mx-1" />

                    <span className="text-xs font-semibold text-gray-400 shrink-0">PRIORITY</span>
                    <div className="relative">
                      <select
                        value={formData.priority}
                        onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                        className="appearance-none bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer pr-5"
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                      <ChevronDown size={13} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* SEASON row (conditional) */}
                  {formData.message_type === 'season_alert' && (
                    <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-amber-50">
                      <span className="text-xs font-semibold text-amber-600 w-14 shrink-0">SEASON</span>
                      <div className="relative flex-1">
                        <select
                          value={formData.season_id}
                          onChange={e => setFormData({ ...formData, season_id: e.target.value })}
                          className="w-full appearance-none bg-transparent text-sm text-gray-800 focus:outline-none cursor-pointer pr-6"
                        >
                          <option value="">Select a season…</option>
                          {seasons.map(s => (
                            <option key={s.id} value={s.id}>{s.name} ({s.year})</option>
                          ))}
                        </select>
                        <ChevronDown size={13} className="absolute right-0 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                      </div>
                      <AlertCircle size={14} className="text-amber-500 shrink-0" />
                    </div>
                  )}

                  {/* SUBJECT row */}
                  <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100">
                    <span className="text-xs font-semibold text-gray-400 w-14 shrink-0">SUBJECT</span>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Season 2024 Registration is Now Open"
                      className="flex-1 text-sm font-medium text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none"
                    />
                  </div>

                  {/* Body */}
                  <div className="px-5 py-4">
                    <textarea
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your message here…&#10;&#10;Recipients will receive this via email and optionally as an in-app notification."
                      rows={10}
                      className="w-full text-sm text-gray-700 placeholder:text-gray-400 bg-transparent focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Composer Footer / Action Bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50">
                    {/* Left: options */}
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-8 h-4 rounded-full transition-colors relative ${formData.send_in_app ? 'bg-naija-green-500' : 'bg-gray-300'}`}
                        onClick={() => setFormData(prev => ({ ...prev, send_in_app: !prev.send_in_app }))}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform ${formData.send_in_app ? 'translate-x-4' : 'translate-x-0.5'}`} />
                      </div>
                      <span className="text-xs text-gray-500 group-hover:text-gray-700 transition-colors select-none">
                        In-app notification
                      </span>
                    </label>

                    {/* Right: Send button */}
                    <button
                      type="submit"
                      disabled={sending}
                      className="flex items-center gap-2.5 px-5 py-2.5 bg-naija-green-600 hover:bg-naija-green-700 text-white text-sm font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98]"
                    >
                      {sending
                        ? <><Loader2 size={15} className="animate-spin" /> Sending…</>
                        : <><Send size={15} /> Send Message</>
                      }
                    </button>
                  </div>
                </form>
              </div>

              {/* ── Sent Messages Sidebar ── */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-gray-400" />
                    <span className="text-sm font-semibold text-gray-700">Sent</span>
                  </div>
                  <span className="text-xs text-gray-400">{messages.length} message{messages.length !== 1 ? 's' : ''}</span>
                </div>

                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center px-6">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Send size={20} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No messages yet</p>
                    <p className="text-xs text-gray-400 mt-1">Sent broadcasts will appear here</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50 max-h-[620px] overflow-y-auto">
                    {messages.map(msg => (
                      <div key={msg.id} className="px-5 py-3.5 hover:bg-gray-50 transition-colors cursor-default">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-800 line-clamp-1 leading-snug flex-1">{msg.title}</p>
                          <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${PRIORITY_STYLES[msg.priority]}`}>
                            {msg.priority}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-2.5">{msg.content}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                              {TYPE_LABELS[msg.message_type] ?? msg.message_type}
                            </span>
                            <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {RECIPIENT_LABELS[msg.recipient_type] ?? msg.recipient_type}
                            </span>
                          </div>
                          <time className="text-[10px] text-gray-400 shrink-0">
                            {new Date(msg.sent_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </time>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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