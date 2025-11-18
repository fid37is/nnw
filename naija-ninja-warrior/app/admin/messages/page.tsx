'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { Send, Users, Mail, MessageSquare, Loader2, X, CheckCircle, Clock, Copy, Trash2, Edit2, Plus, RefreshCw } from 'lucide-react'

interface Message {
  id: string
  title: string
  content: string
  message_type: 'announcement' | 'event_update' | 'season_alert' | 'direct'
  recipient_type: 'all_users' | 'approved_applicants' | 'rejected_applicants' | 'specific_users'
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
  template_type: 'approval' | 'rejection' | 'general'
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
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [respondingInquiryId, setRespondingInquiryId] = useState<string | null>(null)
  const [inquiryResponse, setInquiryResponse] = useState('')
  const [sendingResponse, setSendingResponse] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null)
  const [showTemplateForm, setShowTemplateForm] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    message_type: 'announcement' as 'announcement' | 'event_update' | 'season_alert' | 'direct',
    recipient_type: 'all_users' as 'all_users' | 'approved_applicants' | 'rejected_applicants' | 'specific_users',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    send_email: true,
    send_in_app: true,
    send_whatsapp: false,
    season_id: '',
  })

  const [templateFormData, setTemplateFormData] = useState({
    name: '',
    title: '',
    content: '',
    template_type: 'approval' as 'approval' | 'rejection' | 'general',
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

      // Load inquiries
      const { data: inquiriesData } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false })

      setInquiries(inquiriesData || [])

      // Load templates
      const { data: templatesData } = await supabase
        .from('message_templates')
        .select('*')
        .order('created_at', { ascending: false })

      setTemplates(templatesData || [])

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

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!templateFormData.name || !templateFormData.title || !templateFormData.content) {
      toast.error('All fields are required')
      return
    }

    setSending(true)
    try {
      if (editingTemplate) {
        const { error } = await supabase
          .from('message_templates')
          .update({
            name: templateFormData.name,
            title: templateFormData.title,
            content: templateFormData.content,
            template_type: templateFormData.template_type,
          })
          .eq('id', editingTemplate.id)

        if (error) throw error
        toast.success('Template updated successfully')
      } else {
        const { error } = await supabase
          .from('message_templates')
          .insert([templateFormData])

        if (error) throw error
        toast.success('Template created successfully')
      }

      setTemplateFormData({
        name: '',
        title: '',
        content: '',
        template_type: 'approval',
      })
      setEditingTemplate(null)
      setShowTemplateForm(false)
      loadData()
    } catch (err) {
      console.error('Error saving template:', err)
      toast.error('Failed to save template')
    } finally {
      setSending(false)
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return

    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', templateId)

      if (error) throw error
      toast.success('Template deleted successfully')
      loadData()
    } catch (err) {
      console.error('Error deleting template:', err)
      toast.error('Failed to delete template')
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
            send_email: formData.send_email,
            send_in_app: formData.send_in_app,
            send_whatsapp: formData.send_whatsapp,
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

        const notificationsData = recipients.map((user_id: string) => ({
          user_id,
          message_id: messageId,
        }))

        await supabase.from('user_notifications').insert(notificationsData)

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
      })
      loadData()
    } catch (err) {
      console.error('Error sending message:', err)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleRespondToInquiry = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inquiryResponse.trim() || !respondingInquiryId || !selectedInquiry) {
      toast.error('Please enter a response')
      return
    }

    setSendingResponse(true)
    try {
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: selectedInquiry.email,
          subject: `Re: ${selectedInquiry.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h2 style="color: #1a7346; margin: 0 0 10px 0;">Naija Ninja Warrior</h2>
                <p style="color: #666; margin: 0; font-size: 14px;">We've received your inquiry and our team has responded</p>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">Your Original Inquiry:</h3>
                <p style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #1a7346; color: #666;">
                  <strong>${selectedInquiry.subject}</strong><br/><br/>
                  ${selectedInquiry.message.replace(/\n/g, '<br/>')}
                </p>
              </div>

              <div style="margin-bottom: 20px;">
                <h3 style="color: #333; margin-top: 0;">Our Response:</h3>
                <p style="background-color: #e8f5e9; padding: 15px; border-left: 4px solid #1a7346; color: #333; line-height: 1.6;">
                  ${inquiryResponse.replace(/\n/g, '<br/>')}
                </p>
              </div>

              <div style="border-top: 1px solid #eee; padding-top: 20px; color: #666; font-size: 12px;">
                <p style="margin: 5px 0;">Best regards,<br/>Naija Ninja Warrior Team</p>
                <p style="margin: 5px 0; color: #999;">This is an automated response. Please do not reply to this email.</p>
              </div>
            </div>
          `,
        }),
      })

      if (!emailResponse.ok) {
        const errorData = await emailResponse.json()
        throw new Error(errorData.error || 'Failed to send email')
      }

      const { error: updateError } = await supabase
        .from('inquiries')
        .update({
          admin_response: inquiryResponse,
          status: 'responded',
          responded_at: new Date().toISOString(),
        })
        .eq('id', respondingInquiryId)

      if (updateError) throw updateError

      toast.success('Response sent to inquirer via email')
      setInquiryResponse('')
      setRespondingInquiryId(null)
      setSelectedInquiry(null)
      loadData()
    } catch (err) {
      console.error('Error responding to inquiry:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to send response')
    } finally {
      setSendingResponse(false)
    }
  }

  const handleArchiveInquiry = async (inquiryId: string) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: 'archived' })
        .eq('id', inquiryId)

      if (error) throw error

      toast.success('Inquiry archived')
      loadData()
    } catch (err) {
      console.error('Error archiving inquiry:', err)
      toast.error('Failed to archive inquiry')
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
          {/* Header */}
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

          {/* Tabs */}
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

          {/* Messages Tab */}
          {activeTab === 'messages' && (
            <>
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
            </>
          )}

          {/* Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Inquiries List */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Inquiries</h2>
                  {inquiries.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No inquiries</p>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {inquiries.map(inquiry => (
                        <button
                          key={inquiry.id}
                          onClick={() => setSelectedInquiry(inquiry)}
                          className={`w-full text-left p-3 rounded-lg border transition ${
                            selectedInquiry?.id === inquiry.id
                              ? 'border-naija-green-600 bg-naija-green-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-semibold text-sm text-gray-900 line-clamp-1">{inquiry.subject}</h3>
                            {inquiry.status === 'responded' && (
                              <CheckCircle size={16} className="text-green-600 flex-shrink-0" />
                            )}
                            {inquiry.status === 'new' && (
                              <Clock size={16} className="text-orange-600 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{inquiry.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{new Date(inquiry.created_at).toLocaleDateString()}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Inquiry Detail */}
              <div className="lg:col-span-2">
                {selectedInquiry ? (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">{selectedInquiry.subject}</h2>
                          <p className="text-sm text-gray-600 mt-1">From: {selectedInquiry.name} ({selectedInquiry.email})</p>
                          <p className="text-xs text-gray-500 mt-1">{new Date(selectedInquiry.created_at).toLocaleString()}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          selectedInquiry.status === 'responded' ? 'bg-green-100 text-green-800' :
                          selectedInquiry.status === 'new' ? 'bg-orange-100 text-orange-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedInquiry.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInquiry.message}</p>
                      </div>

                      {selectedInquiry.admin_response && (
                        <div className="bg-naija-green-50 rounded-lg p-4 mb-4 border border-naija-green-200">
                          <p className="text-xs font-semibold text-naija-green-900 mb-2">Your Response:</p>
                          <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedInquiry.admin_response}</p>
                          <p className="text-xs text-gray-500 mt-2">Sent: {new Date(selectedInquiry.responded_at!).toLocaleString()}</p>
                        </div>
                      )}
                    </div>

                    {selectedInquiry.status !== 'responded' && (
                      <form onSubmit={handleRespondToInquiry} className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Your Response</label>
                          <textarea
                            value={inquiryResponse}
                            onChange={e => setInquiryResponse(e.target.value)}
                            placeholder="Type your response here..."
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm resize-none"
                          />
                          <p className="text-xs text-gray-500 mt-1">Response will be sent to: {selectedInquiry.email}</p>
                        </div>

                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={sendingResponse}
                            onClick={() => setRespondingInquiryId(selectedInquiry.id)}
                            className="flex-1 px-4 py-2 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          >
                            {sendingResponse ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Sending...
                              </>
                            ) : (
                              <>
                                <Send size={16} />
                                Send Response
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleArchiveInquiry(selectedInquiry.id)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                          >
                            Archive
                          </button>
                        </div>
                      </form>
                    )}

                    {selectedInquiry.status === 'responded' && (
                      <button
                        type="button"
                        onClick={() => handleArchiveInquiry(selectedInquiry.id)}
                        className="w-full px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                      >
                        Archive
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full flex items-center justify-center">
                    <p className="text-gray-600">Select an inquiry to view details</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Templates Tab */}
          {activeTab === 'templates' && (
            <>
              {/* Template Form */}
              <div className="bg-white rounded-lg shadow-sm border border-naija-green-100 p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingTemplate ? 'Edit Template' : 'Create New Template'}
                  </h2>
                  {showTemplateForm && (
                    <button
                      onClick={() => {
                        setShowTemplateForm(false)
                        setEditingTemplate(null)
                        setTemplateFormData({
                          name: '',
                          title: '',
                          content: '',
                          template_type: 'approval',
                        })
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>

                {showTemplateForm ? (
                  <form onSubmit={handleSaveTemplate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Template Name</label>
                        <input
                          type="text"
                          value={templateFormData.name}
                          onChange={e => setTemplateFormData({ ...templateFormData, name: e.target.value })}
                          placeholder="e.g., Approval - Standard"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Template Type</label>
                        <select
                          value={templateFormData.template_type}
                          onChange={e => setTemplateFormData({ ...templateFormData, template_type: e.target.value as any })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                        >
                          <option value="approval">Approval Message</option>
                          <option value="rejection">Rejection Message</option>
                          <option value="general">General Message</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message Title</label>
                      <input
                        type="text"
                        value={templateFormData.title}
                        onChange={e => setTemplateFormData({ ...templateFormData, title: e.target.value })}
                        placeholder="e.g., Your Application Has Been Approved!"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Message Content</label>
                      <textarea
                        value={templateFormData.content}
                        onChange={e => setTemplateFormData({ ...templateFormData, content: e.target.value })}
                        placeholder="Write your template message here..."
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 text-sm resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-2">You can edit this further before sending</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={sending}
                        className="flex-1 px-4 py-2 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {sending ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            Saving...
                          </>
                        ) : (
                          editingTemplate ? 'Update Template' : 'Create Template'
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowTemplateForm(false)
                          setEditingTemplate(null)
                          setTemplateFormData({
                            name: '',
                            title: '',
                            content: '',
                            template_type: 'approval',
                          })
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowTemplateForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition"
                  >
                    <Plus size={18} />
                    Create New Template
                  </button>
                )}
              </div>

              {/* Templates List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {templates.length === 0 ? (
                  <div className="col-span-full bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                    <p className="text-gray-600">No templates created yet</p>
                  </div>
                ) : (
                  templates.map(template => (
                    <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {template.template_type === 'approval' && '✅ Approval Message'}
                            {template.template_type === 'rejection' && '❌ Rejection Message'}
                            {template.template_type === 'general' && '📢 General Message'}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-xs font-semibold text-gray-700 mb-1">Title:</p>
                        <p className="text-sm text-gray-900 font-medium mb-3">{template.title}</p>
                        <p className="text-xs font-semibold text-gray-700 mb-1">Preview:</p>
                        <p className="text-xs text-gray-600 line-clamp-3">{template.content}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="flex-1 px-3 py-2 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition flex items-center justify-center gap-1 text-xs font-semibold"
                        >
                          <Copy size={14} />
                          Use Template
                        </button>
                        <button
                          onClick={() => {
                            setEditingTemplate(template)
                            setTemplateFormData({
                              name: template.name,
                              title: template.title,
                              content: template.content,
                              template_type: template.template_type as any,
                            })
                            setShowTemplateForm(true)
                          }}
                          className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-1 text-xs font-semibold"
                        >
                          <Edit2 size={14} />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition flex items-center justify-center gap-1 text-xs font-semibold"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}