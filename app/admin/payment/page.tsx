// app/admin/payment/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { DollarSign, Settings, AlertCircle, Search, Filter, Calendar, X } from 'lucide-react'
import StatsGrid from '@/components/payment/StatsGrid'
import PaymentTable from '@/components/payment/PaymentTable'
import PaymentDetailsModal from '@/components/payment/PaymentDetailsModal'
import PaymentConfiguration from '@/components/payment/PaymentConfiguration'
import { Application } from '@/types/payment'

export default function AdminPaymentManagementPage() {
  const [activeTab, setActiveTab] = useState<'payments' | 'configuration'>('payments')
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [confirming, setConfirming] = useState<string | null>(null)
  const [contacting, setContacting] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<Application | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [paymentAmount, setPaymentAmount] = useState(50000)

  // Filter states
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState({ from: '', to: '' })

  useEffect(() => {
    loadPaymentApplications()
    loadPaymentAmount()
  }, [])

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter, dateFilter])

  const loadPaymentAmount = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_config')
        .select('payment_amount')
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setPaymentAmount(data.payment_amount)
      }
    } catch (err) {
      console.error('Error loading payment amount:', err)
    }
  }

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
        .select('id, user_id, status, submission_date, age, state, season_id, is_accepted, payment_status, payment_reference, payment_submitted_at, is_participant, accepted_date, payment_method, payment_confirmed_date')
        .eq('is_accepted', true)
        .order('payment_submitted_at', { ascending: false, nullsFirst: false })

      if (appsError) throw appsError

      if (!appsData || appsData.length === 0) {
        setApplications([])
        setLoading(false)
        return
      }

      const userIds = [...new Set(appsData.map(app => app.user_id))]
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, phone')
        .in('id', userIds)

      if (usersError) throw usersError

      const usersMap = new Map()
      usersData?.forEach((user: any) => {
        usersMap.set(user.id, user)
      })

      const combinedData: Application[] = appsData.map(app => ({
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

  const filterApplications = () => {
    let filtered = [...applications]

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      filtered = filtered.filter(app =>
        app.users[0]?.full_name?.toLowerCase().includes(search) ||
        app.users[0]?.email?.toLowerCase().includes(search)
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.payment_status === statusFilter)
    }

    // Date filter
    if (dateFilter.from) {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.payment_submitted_at || app.accepted_date!)
        return appDate >= new Date(dateFilter.from)
      })
    }
    if (dateFilter.to) {
      filtered = filtered.filter(app => {
        const appDate = new Date(app.payment_submitted_at || app.accepted_date!)
        return appDate <= new Date(dateFilter.to)
      })
    }

    setFilteredApplications(filtered)
  }

  const resetFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setDateFilter({ from: '', to: '' })
  }

  const handleConfirmPayment = async (appId: string) => {
    setConfirming(appId)
    try {
      // Update payment status, mark as participant, AND automatically approve
      const { error } = await supabase
        .from('applications')
        .update({
          payment_status: 'confirmed',
          is_participant: true,
          status: 'approved', // Automatically approve on payment confirmation
          payment_confirmed_date: new Date().toISOString()
        })
        .eq('id', appId)

      if (error) throw error

      toast.success('Payment confirmed! Applicant is now an approved participant.')
      setShowDetailsModal(false)
      setSelectedApp(null)
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

      const { data: templateData } = await supabase
        .from('message_templates')
        .select('*')
        .eq('template_type', 'payment_verification')
        .single()

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

      await supabase.from('user_notifications').insert([{
        user_id: app.user_id,
        message_id: messageId,
      }])

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

      toast.success(`Verification request sent to ${app.users[0]?.full_name}`)
      loadPaymentApplications()
    } catch (err) {
      console.error('Error contacting user:', err)
      toast.error('Failed to send verification request')
    } finally {
      setContacting(null)
    }
  }

  const handleViewDetails = (app: Application) => {
    setSelectedApp(app)
    setShowDetailsModal(true)
  }

  const stats = {
    total: applications.length,
    awaitingPayment: applications.filter(a => a.payment_status === 'unpaid').length,
    pendingReview: applications.filter(a => a.payment_status === 'pending').length,
    confirmed: applications.filter(a => a.payment_status === 'confirmed').length,
    totalConfirmedAmount: applications.filter(a => a.payment_status === 'confirmed').length * paymentAmount,
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
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
          {/* Header */}
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

          {activeTab === 'payments' ? (
            <>
              {/* Info Alert */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">Payment Workflow</p>
                    <p className="text-xs text-blue-700">
                      Only <strong>Accepted</strong> applicants appear here. Once you confirm their payment, they automatically become <strong>Approved Participants</strong> and appear in the All Participants tab.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <StatsGrid stats={stats} />

              {/* Search and Filters */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      <Search className="inline w-3 h-3 mr-1" />
                      Search by name or email
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search applicants..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      <Filter className="inline w-3 h-3 mr-1" />
                      Payment Status
                    </label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="unpaid">Awaiting Payment</option>
                      <option value="pending">Pending Review</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      <Calendar className="inline w-3 h-3 mr-1" />
                      Date Range
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={dateFilter.from}
                        onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent text-xs"
                      />
                      <input
                        type="date"
                        value={dateFilter.to}
                        onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-naija-green-500 focus:border-transparent text-xs"
                      />
                    </div>
                  </div>
                </div>

                {(searchTerm || statusFilter !== 'all' || dateFilter.from || dateFilter.to) && (
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-gray-600">
                      Showing {filteredApplications.length} of {applications.length} applications
                    </p>
                    <button
                      onClick={resetFilters}
                      className="text-xs text-naija-green-600 hover:text-naija-green-700 font-semibold flex items-center gap-1"
                    >
                      <X size={12} />
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Table */}
              <PaymentTable
                applications={filteredApplications}
                onViewDetails={handleViewDetails}
              />
            </>
          ) : (
            <PaymentConfiguration />
          )}
        </div>
      </main>

      {/* Payment Details Modal */}
      {showDetailsModal && selectedApp && (
        <PaymentDetailsModal
          application={selectedApp}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedApp(null)
          }}
          onConfirm={handleConfirmPayment}
          onRequestVerification={handleRequestVerification}
          confirming={confirming === selectedApp.id}
          contacting={contacting === selectedApp.id}
        />
      )}
    </div>
  )
}