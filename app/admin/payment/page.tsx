'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { CheckCircle, XCircle, Eye, Clock, Loader2, User, Mail, Calendar, DollarSign, Image as ImageIcon, AlertCircle, Settings, CreditCard, Building2, Save, Copy, Check, Send } from 'lucide-react'

interface UserData {
  full_name: string
  email: string
  phone: string
}

interface ApplicationRow {
  id: string
  user_id: string
  status: 'pending' | 'under_review' | 'approved' | 'rejected'
  submission_date: string
  age: number
  state: string
  season_id: string
  is_accepted: boolean
  payment_status: 'unpaid' | 'pending' | 'confirmed'
  payment_reference: string | null
  payment_submitted_at: string | null
  is_participant: boolean
  accepted_date: string | null
  payment_method?: string
}

interface Application extends ApplicationRow {
  users: UserData[]
}

interface PaymentConfig {
  payment_amount: number
  paystack_enabled: boolean
  transfer_enabled: boolean
  account_name: string
  account_number: string
  bank_name: string
}

export default function AdminPaymentManagementPage() {
  const [activeTab, setActiveTab] = useState<'payments' | 'configuration'>('payments')
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [contacting, setContacting] = useState<string | null>(null)
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showProofModal, setShowProofModal] = useState(false)
  const [bulkConfirming, setBulkConfirming] = useState(false)

  useEffect(() => {
    loadPaymentApplications()
  }, [])

  const loadPaymentApplications = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = '/login'
        return
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (userError || userData?.role !== 'admin') {
        toast.error('Unauthorized access')
        window.location.href = '/user/dashboard'
        return
      }

      const { data: appsData, error: appsError } = await supabase
        .from('applications')
        .select('id, user_id, status, submission_date, age, state, season_id, is_accepted, payment_status, payment_reference, payment_submitted_at, is_participant, accepted_date, payment_method')
        .eq('is_accepted', true)
        .eq('is_participant', false)
        .order('payment_submitted_at', { ascending: false, nullsFirst: false })

      if (appsError) throw appsError

      if (!appsData || appsData.length === 0) {
        setApplications([])
        setLoading(false)
        return
      }

      const userIds = [...new Set(appsData.map((app: ApplicationRow) => app.user_id))]
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, phone')
        .in('id', userIds)

      if (usersError) throw usersError

      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      const combinedData: Application[] = appsData.map((app: ApplicationRow) => ({
        ...app,
        users: usersMap.has(app.user_id) ? [usersMap.get(app.user_id)] : []
      }))

      setApplications(combinedData)
    } catch (err) {
      console.error('Error loading payment applications:', err)
      toast.error('Failed to load payment applications')
    } finally {
      setLoading(false)
    }
  }

  const toggleSelectApp = (appId: string) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    )
  }

  const toggleSelectAll = () => {
    const pendingApps = applications.filter(a => a.payment_status === 'pending')
    
    if (selectedApps.length === pendingApps.length && pendingApps.length > 0) {
      setSelectedApps([])
    } else {
      setSelectedApps(pendingApps.map(app => app.id))
    }
  }

  const handleBulkConfirmPayment = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select payments to confirm')
      return
    }

    setBulkConfirming(true)
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          payment_status: 'confirmed',
          is_participant: true,
          payment_confirmed_date: new Date().toISOString()
        })
        .in('id', selectedApps)

      if (error) throw error

      toast.success(`${selectedApps.length} payment(s) confirmed! Applicants are now participants.`)
      setSelectedApps([])
      loadPaymentApplications()
    } catch (err) {
      console.error('Error confirming payments:', err)
      toast.error('Failed to confirm payments')
    } finally {
      setBulkConfirming(false)
    }
  }

  const handleConfirmPayment = async (appId: string) => {
    setConfirming(appId)
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          payment_status: 'confirmed',
          is_participant: true,
          payment_confirmed_date: new Date().toISOString()
        })
        .eq('id', appId)

      if (error) throw error

      toast.success('Payment confirmed! Applicant is now a participant and will appear in the All Participants tab.')
      loadPaymentApplications()
    } catch (err) {
      console.error('Error confirming payment:', err)
      toast.error('Failed to confirm payment')
    } finally {
      setConfirming(null)
    }
  }

  const handleRequestVerification = async (appId: string) => {
    const app = applications.find(a => a.id === appId)
    if (!app) return

    setContacting(appId)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      // Get the payment verification template
      const { data: templateData } = await supabase
        .from('message_templates')
        .select('*')
        .eq('template_type', 'payment_verification')
        .single()

      // Use template or default message
      const messageTitle = templateData?.title || 'Payment Verification Required'
      const messageContent = templateData?.content || `Hello,

We have received your payment submission for the NAIJA Star Challenge participation fee. However, we need to verify some details before we can confirm your payment.

Please respond with the following information:
- Transaction reference number
- Date and time of payment
- Amount paid
- Payment method used

Alternatively, if you paid via bank transfer, you can resubmit a clearer photo of your payment proof.

We aim to verify all payments within 24-48 hours.

Thank you for your patience!

Best regards,
NAIJA Star Challenge Team`

      // Create message record
      const { data: messageData, error: messageError } = await supabase
        .from('messages')
        .insert([
          {
            admin_id: session.user.id,
            title: messageTitle,
            content: messageContent,
            message_type: 'direct',
            recipient_type: 'specific_users',
            priority: 'high',
            send_email: true,
            send_in_app: true,
            send_whatsapp: false,
            sent_at: new Date().toISOString(),
          },
        ])
        .select()

      if (messageError) throw messageError

      const messageId = messageData[0].id

      // Create notification for the user
      await supabase.from('user_notifications').insert([{
        user_id: app.user_id,
        message_id: messageId,
      }])

      // Create delivery records
      await supabase.from('message_delivery').insert([
        {
          message_id: messageId,
          user_id: app.user_id,
          delivery_type: 'email',
        },
        {
          message_id: messageId,
          user_id: app.user_id,
          delivery_type: 'in_app',
        }
      ])

      // Update application with contact timestamp
      await supabase
        .from('applications')
        .update({
          payment_contacted_at: new Date().toISOString()
        })
        .eq('id', appId)
        
      toast.success(`Verification request sent to ${app.users[0]?.full_name}`)
      loadPaymentApplications()
    } catch (err) {
      console.error('Error contacting user:', err)
      toast.error('Failed to send verification request')
    } finally {
      setContacting(null)
    }
  }

  const viewPaymentProof = (app: Application) => {
    setSelectedApp(app)
    setShowProofModal(true)
  }

  const stats = {
    total: applications.length,
    awaitingPayment: applications.filter(a => a.payment_status === 'unpaid').length,
    pendingReview: applications.filter(a => a.payment_status === 'pending').length,
  }

  const isAllSelected = selectedApps.length === applications.filter(a => a.payment_status === 'pending').length && 
                       applications.filter(a => a.payment_status === 'pending').length > 0

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
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900 mb-2">Payment Management</h1>
            <p className="text-gray-600">Review and confirm payment submissions from accepted applicants</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'payments'
                  ? 'text-naija-green-700 border-b-2 border-naija-green-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <DollarSign size={18} />
                Payment Submissions
              </div>
            </button>
            <button
              onClick={() => setActiveTab('configuration')}
              className={`px-6 py-3 font-semibold transition-all relative ${
                activeTab === 'configuration'
                  ? 'text-naija-green-700 border-b-2 border-naija-green-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings size={18} />
                Configuration
              </div>
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'payments' ? (
            <>
              {/* Info Banner */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Payment Workflow</p>
                    <p className="text-xs text-blue-700">
                      Only <strong>Accepted</strong> applicants appear here. Once you confirm their payment, they automatically become <strong>Participants</strong> and move to the "All Participants" tab for final approval.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Total Accepted</p>
                  <p className="text-2xl font-bold text-naija-green-900">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Awaiting Payment</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.awaitingPayment}</p>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pendingReview}</p>
                </div>
              </div>

              {/* Applications List */}
              {applications.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No payment submissions
                  </h3>
                  <p className="text-gray-600">
                    Accepted applicants will appear here once they submit payment proof
                  </p>
                </div>
              ) : (
                <>
                  {/* Action Toolbar */}
                  <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      {applications.filter(a => a.payment_status === 'pending').length > 0 && (
                        <div className="flex items-center gap-3">
                          <div
                            onClick={toggleSelectAll}
                            className={`w-5 h-5 rounded border-2 cursor-pointer transition-all flex items-center justify-center ${
                              isAllSelected ? 'bg-naija-green-600 border-naija-green-600' : 'border-gray-300 hover:border-naija-green-400'
                            }`}
                          >
                            {isAllSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm text-gray-600">Select All Pending</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedApps.length > 0 && (
                        <>
                          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                            {selectedApps.length} selected
                          </span>
                          <button
                            onClick={handleBulkConfirmPayment}
                            disabled={bulkConfirming}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2 whitespace-nowrap"
                          >
                            {bulkConfirming ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Confirming...
                              </>
                            ) : (
                              <>
                                <CheckCircle size={16} />
                                Confirm Selected
                              </>
                            )}
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    {applications.map((app) => (
                      <PaymentCard
                        key={app.id}
                        application={app}
                        isSelected={selectedApps.includes(app.id)}
                        onToggleSelect={() => toggleSelectApp(app.id)}
                        onConfirm={() => handleConfirmPayment(app.id)}
                        onRequestVerification={() => handleRequestVerification(app.id)}
                        onViewProof={() => viewPaymentProof(app)}
                        confirming={confirming === app.id}
                        contacting={contacting === app.id}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <PaymentConfigurationTab />
          )}
        </div>
      </main>

      {/* Payment Proof Modal */}
      {showProofModal && selectedApp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Payment Proof</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedApp.users[0]?.full_name} - {selectedApp.users[0]?.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleConfirmPayment(selectedApp.id)
                      setShowProofModal(false)
                      setSelectedApp(null)
                    }}
                    disabled={confirming === selectedApp.id}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {confirming === selectedApp.id ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={14} />
                        Confirm
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      handleRequestVerification(selectedApp.id)
                    }}
                    disabled={contacting === selectedApp.id}
                    className="px-3 py-1.5 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {contacting === selectedApp.id ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Request
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setShowProofModal(false)
                      setSelectedApp(null)
                    }}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <XCircle size={24} />
                  </button>
                </div>
              </div>

              {selectedApp.payment_reference ? (
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={selectedApp.payment_reference}
                    alt="Payment Proof"
                    className="w-full h-auto"
                  />
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">No payment proof submitted yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PaymentCard({
  application,
  isSelected,
  onToggleSelect,
  onConfirm,
  onRequestVerification,
  onViewProof,
  confirming,
  contacting,
}: {
  application: Application
  isSelected: boolean
  onToggleSelect: () => void
  onConfirm: () => void
  onRequestVerification: () => void
  onViewProof: () => void
  confirming: boolean
  contacting: boolean
}) {
  const [isHovering, setIsHovering] = useState(false)

  const canSelect = application.payment_status === 'pending'

  return (
    <div className="relative">
      <div
        className={`relative border rounded-lg transition-all pl-12 p-4 ${
          isSelected
            ? 'bg-naija-green-50 border-naija-green-500'
            : isHovering
              ? 'bg-gray-50 border-gray-300'
              : 'bg-white border-gray-200'
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {canSelect && (
          <div
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleSelect()
            }}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded border-2 cursor-pointer transition-all flex items-center justify-center ${
              isSelected ? 'bg-naija-green-600 border-naija-green-600' : 'border-gray-300 hover:border-naija-green-400'
            } ${isHovering || isSelected ? 'opacity-100' : 'opacity-0'}`}
          >
            {isSelected && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-center">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 whitespace-nowrap overflow-hidden">
              <User size={14} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{application.users[0]?.full_name || 'N/A'}</span>
            </h3>
          </div>

          <div className="min-w-0">
            <p className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap overflow-hidden">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{application.users[0]?.email || 'N/A'}</span>
            </p>
          </div>

          <div className="min-w-0">
            <p className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap">
              <Calendar size={14} className="text-gray-400 flex-shrink-0" />
              Accepted: {new Date(application.accepted_date!).toLocaleDateString()}
            </p>
          </div>

          <div className="min-w-0">
            {application.payment_submitted_at ? (
              <div>
                <p className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap">
                  <DollarSign size={14} className="text-gray-400 flex-shrink-0" />
                  Paid: {new Date(application.payment_submitted_at).toLocaleDateString()}
                </p>
                {application.payment_method && (
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    {application.payment_method === 'paystack' ? (
                      <><CreditCard size={12} className="text-blue-600" /> Paystack</>
                    ) : (
                      <><Building2 size={12} className="text-green-600" /> Transfer</>
                    )}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400 flex items-center gap-2 whitespace-nowrap">
                <DollarSign size={14} className="flex-shrink-0" />
                Not submitted
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 flex-shrink-0">
            {application.payment_status === 'pending' && application.payment_reference ? (
              <button
                onClick={onViewProof}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-semibold text-xs whitespace-nowrap"
              >
                <Eye size={14} />
                View Proof
              </button>
            ) : application.payment_status === 'unpaid' ? (
              <span className="text-xs text-gray-500 italic px-3 py-1.5">Awaiting payment</span>
            ) : (
              <span className="text-xs text-gray-500 italic px-3 py-1.5">No proof submitted</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PaymentConfigurationTab() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const [config, setConfig] = useState<PaymentConfig>({
    payment_amount: 50000,
    paystack_enabled: true,
    transfer_enabled: true,
    account_name: 'NAIJA Star Challenge',
    account_number: '0123456789',
    bank_name: 'Access Bank'
  })

  useEffect(() => {
    loadPaymentConfig()
  }, [])

  const loadPaymentConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_config')
        .select('*')
        .single()
      
      if (error && error.code !== 'PGRST116') throw error
      
      if (data) {
        setConfig(data)
      }
    } catch (err) {
      console.error('Error loading payment config:', err)
      toast.error('Failed to load payment configuration')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!config.payment_amount || config.payment_amount <= 0) {
      toast.error('Please enter a valid payment amount')
      return
    }

    if (!config.paystack_enabled && !config.transfer_enabled) {
      toast.error('Please enable at least one payment method')
      return
    }

    if (config.transfer_enabled && (!config.account_name || !config.account_number || !config.bank_name)) {
      toast.error('Please fill in all bank transfer details')
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('payment_config')
        .upsert({
          id: 1,
          ...config,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      toast.success('Payment configuration saved successfully!')
    } catch (err) {
      console.error('Error saving config:', err)
      toast.error('Failed to save payment configuration')
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-blue-900 mb-1">Payment Setup</p>
            <p className="text-xs text-blue-700">
              Set the participation fee and choose which payment methods to offer. Accepted applicants will see these options on their dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Amount Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <DollarSign className="w-5 h-5 text-naija-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Payment Amount</h2>
        </div>
        
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Participation Fee (NGN)
          </label>
          <input
            type="number"
            value={config.payment_amount}
            onChange={(e) => setConfig({ ...config, payment_amount: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent text-lg font-semibold"
            placeholder="50000"
          />
          <p className="text-sm text-gray-500 mt-2">
            Display amount: <span className="font-bold text-naija-green-700">{formatCurrency(config.payment_amount)}</span>
          </p>
        </div>
      </div>

      {/* Payment Methods Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-5 h-5 text-naija-green-600" />
          <h2 className="text-xl font-bold text-gray-900">Payment Methods</h2>
        </div>

        <div className="space-y-4">
          {/* Paystack Toggle */}
          <div className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
            <div
              onClick={() => setConfig({ ...config, paystack_enabled: !config.paystack_enabled })}
              className={`w-12 h-6 rounded-full cursor-pointer transition-all relative ${
                config.paystack_enabled ? 'bg-naija-green-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  config.paystack_enabled ? 'left-7' : 'left-1'
                }`}
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Paystack Payment</h3>
              <p className="text-sm text-gray-600">
                Enable instant online payment via debit/credit cards. Payments are automatically verified.
              </p>
            </div>
          </div>

          {/* Bank Transfer Toggle */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-4 mb-4">
              <div
                onClick={() => setConfig({ ...config, transfer_enabled: !config.transfer_enabled })}
                className={`w-12 h-6 rounded-full cursor-pointer transition-all relative ${
                  config.transfer_enabled ? 'bg-naija-green-600' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                    config.transfer_enabled ? 'left-7' : 'left-1'
                  }`}
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Bank Transfer</h3>
                <p className="text-sm text-gray-600">
                  Allow manual bank transfers. Users must upload payment proof for verification.
                </p>
              </div>
            </div>

            {config.transfer_enabled && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={config.account_name}
                    onChange={(e) => setConfig({ ...config, account_name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"
                    placeholder="NAIJA Star Challenge"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={config.account_number}
                      onChange={(e) => setConfig({ ...config, account_number: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"
                      placeholder="0123456789"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={config.bank_name}
                      onChange={(e) => setConfig({ ...config, bank_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent"
                      placeholder="Access Bank"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-gradient-to-br from-naija-green-50 to-white rounded-xl shadow-sm border border-naija-green-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Preview - User View</h3>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600 mb-2">Participation Fee</p>
            <p className="text-3xl font-bold text-naija-green-700">{formatCurrency(config.payment_amount)}</p>
          </div>
          
          <div className="space-y-2">
            {config.paystack_enabled && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-900">Pay with Card (Paystack)</span>
                </div>
              </div>
            )}
            {config.transfer_enabled && (
              <div className="p-3 bg-naija-green-50 border border-naija-green-200 rounded-lg text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-naija-green-600" />
                  <span className="font-semibold text-naija-green-900">Bank Transfer</span>
                </div>
              </div>
            )}
            {!config.paystack_enabled && !config.transfer_enabled && (
              <p className="text-center text-gray-500 text-sm py-4">No payment methods enabled</p>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Configuration
            </>
          )}
        </button>
      </div>
    </div>
  )
}