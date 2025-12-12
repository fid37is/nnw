// File: components/admin/InquiriesManagement.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Send, Loader2, CheckCircle, Clock } from 'lucide-react'

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

interface InquiriesManagementProps {
  inquiries: Inquiry[]
  onInquiriesChange: () => void
}

export default function InquiriesManagement({ inquiries, onInquiriesChange }: InquiriesManagementProps) {
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [respondingInquiryId, setRespondingInquiryId] = useState<string | null>(null)
  const [inquiryResponse, setInquiryResponse] = useState('')
  const [sendingResponse, setSendingResponse] = useState(false)

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
          from: 'support@naijaninja.net',
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
                <p style="margin: 5px 0; color: #999;">If you have further questions, please reply to this email.</p>
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
      onInquiriesChange()
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
      setSelectedInquiry(null)
      onInquiriesChange()
    } catch (err) {
      console.error('Error archiving inquiry:', err)
      toast.error('Failed to archive inquiry')
    }
  }

  return (
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
  )
}