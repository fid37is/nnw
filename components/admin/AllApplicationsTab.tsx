'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Eye, Calendar, MapPin, User, Mail, Loader2, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react'

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
  is_participant: boolean
  accepted_date: string | null
}

interface Application extends ApplicationRow {
  users: UserData[]
}

interface AllApplicationsTabProps {
  applications: Application[]
  onRefresh: () => void
}

export default function AllApplicationsTab({ applications, onRefresh }: AllApplicationsTabProps) {
  const [selectedApps, setSelectedApps] = useState<string[]>([])
  const [actioning, setActioning] = useState(false)
  const [showWorkflowBanner, setShowWorkflowBanner] = useState(true)

  // Show ALL applications - no filtering
  const allApplications = applications

  const toggleSelectApp = (appId: string) => {
    setSelectedApps(prev =>
      prev.includes(appId)
        ? prev.filter(id => id !== appId)
        : [...prev, appId]
    )
  }

  const toggleSelectAll = () => {
    if (selectedApps.length === allApplications.length && allApplications.length > 0) {
      setSelectedApps([])
    } else {
      setSelectedApps(allApplications.map(app => app.id))
    }
  }

  const handleBulkUnderReview = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select applications')
      return
    }

    setActioning(true)
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'under_review' })
        .in('id', selectedApps)

      if (error) throw error

      toast.success(`${selectedApps.length} application(s) marked as under review`)
      setSelectedApps([])
      onRefresh()
    } catch (err) {
      console.error('Error updating applications:', err)
      toast.error('Failed to update applications')
    } finally {
      setActioning(false)
    }
  }

  const handleBulkAccept = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select applications to accept')
      return
    }

    // Filter to only accept applications that haven't been accepted yet
    const appsToAccept = applications.filter(
      app => selectedApps.includes(app.id) && !app.is_accepted
    )

    if (appsToAccept.length === 0) {
      toast.error('Selected applications are already accepted')
      return
    }

    setActioning(true)
    try {
      // Update applications to mark as accepted
      const { error: updateError } = await supabase
        .from('applications')
        .update({ 
          is_accepted: true,
          accepted_date: new Date().toISOString()
        })
        .in('id', appsToAccept.map(app => app.id))

      if (updateError) throw updateError

      toast.success(
        `${appsToAccept.length} application(s) accepted! Go to Messaging Center to send acceptance notifications using templates.`,
        { duration: 6000 }
      )

      setSelectedApps([])
      onRefresh()
    } catch (err) {
      console.error('Error accepting applications:', err)
      toast.error('Failed to accept applications')
    } finally {
      setActioning(false)
    }
  }

  const handleBulkReject = async () => {
    if (selectedApps.length === 0) {
      toast.error('Please select applications to reject')
      return
    }

    setActioning(true)
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .in('id', selectedApps)

      if (error) throw error

      toast.success(
        `${selectedApps.length} application(s) rejected. Go to Messaging Center to send rejection notifications using templates.`,
        { duration: 6000 }
      )
      setSelectedApps([])
      onRefresh()
    } catch (err) {
      console.error('Error rejecting applications:', err)
      toast.error('Failed to reject applications')
    } finally {
      setActioning(false)
    }
  }

  const isAllSelected = selectedApps.length === allApplications.length && allApplications.length > 0

  const stats = {
    total: allApplications.length,
    pending: allApplications.filter(a => a.status === 'pending').length,
    underReview: allApplications.filter(a => a.status === 'under_review').length,
    accepted: allApplications.filter(a => a.is_accepted && a.status !== 'rejected').length,
    rejected: allApplications.filter(a => a.status === 'rejected').length,
    awaitingPayment: allApplications.filter(a => a.is_accepted && a.payment_status === 'unpaid').length,
    participants: allApplications.filter(a => a.is_participant).length,
  }

  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-3 md:gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Total</p>
          <p className="text-2xl font-bold text-naija-green-900">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Pending</p>
          <p className="text-2xl font-bold text-gray-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-yellow-200 p-4">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Under Review</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.underReview}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-green-200 p-4">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-4">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-4">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Awaiting Payment</p>
          <p className="text-2xl font-bold text-blue-600">{stats.awaitingPayment}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-purple-200 p-4">
          <p className="text-xs text-gray-600 mb-1 font-semibold">Participants</p>
          <p className="text-2xl font-bold text-purple-600">{stats.participants}</p>
        </div>
      </div>

      {/* Info Banner */}
      <div 
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ 
          maxHeight: showWorkflowBanner ? '200px' : '0',
          opacity: showWorkflowBanner ? 1 : 0,
          marginBottom: showWorkflowBanner ? '1.5rem' : '0'
        }}
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900 mb-1">Application Review Workflow</p>
              <p className="text-xs text-blue-700">
                <strong>Step 1:</strong> Mark as "Under Review" to notify applicants their application is being processed. <br/>
                <strong>Step 2:</strong> Review and either Accept or Reject. <br/>
                <strong>Step 3:</strong> Accepted applicants move to Payment Management Page to submit payment proof. <br/>
                <strong>Step 4:</strong> After payment confirmation, they appear in "All Participants" tab for final approval.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-4">
          {allApplications.length > 0 && (
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
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          )}
          
          {/* Workflow Reminder Toggle */}
          <button
            onClick={() => setShowWorkflowBanner(!showWorkflowBanner)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
            title={showWorkflowBanner ? "Hide workflow reminder" : "Show workflow reminder"}
          >
            <AlertCircle size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {selectedApps.length > 0 && (
            <>
              <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                {selectedApps.length} selected
              </span>
              <button
                onClick={handleBulkUnderReview}
                disabled={actioning}
                className="px-3 py-2 bg-yellow-600 text-white rounded-lg text-sm font-semibold hover:bg-yellow-700 disabled:opacity-50 transition flex items-center gap-2 whitespace-nowrap"
              >
                {actioning && <Loader2 size={16} className="animate-spin" />}
                <Clock size={16} />
                Under Review
              </button>
              <button
                onClick={handleBulkAccept}
                disabled={actioning}
                className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2 whitespace-nowrap"
              >
                {actioning && <Loader2 size={16} className="animate-spin" />}
                <CheckCircle size={16} />
                Accept
              </button>
              <button
                onClick={handleBulkReject}
                disabled={actioning}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-2 whitespace-nowrap"
              >
                {actioning && <Loader2 size={16} className="animate-spin" />}
                <XCircle size={16} />
                Reject
              </button>
            </>
          )}
        </div>
      </div>

      {/* Applications List */}
      {allApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No applications yet
          </h3>
          <p className="text-gray-600">
            Applications will appear here once submitted
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {allApplications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              isSelected={selectedApps.includes(app.id)}
              onToggleSelect={() => toggleSelectApp(app.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ApplicationCard({
  application,
  isSelected,
  onToggleSelect,
}: {
  application: Application
  isSelected: boolean
  onToggleSelect: () => void
}) {
  const [isHovering, setIsHovering] = useState(false)

  const getStatusBadge = () => {
    // Show participant badge if applicable
    if (application.is_participant) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 flex items-center gap-1 whitespace-nowrap">
          <CheckCircle size={12} />
          Participant
        </span>
      )
    }

    // Show accepted status if applicable
    if (application.is_accepted && application.payment_status === 'unpaid') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 whitespace-nowrap">
          <CheckCircle size={12} />
          Accepted - Awaiting Payment
        </span>
      )
    }

    if (application.is_accepted && application.payment_status === 'pending') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1 whitespace-nowrap">
          <Clock size={12} />
          Payment Submitted
        </span>
      )
    }

    if (application.is_accepted && application.payment_status === 'confirmed') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 whitespace-nowrap">
          <CheckCircle size={12} />
          Payment Confirmed
        </span>
      )
    }
    
    // Show application status
    if (application.status === 'rejected') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1 whitespace-nowrap">
          <XCircle size={12} />
          Rejected
        </span>
      )
    }

    if (application.status === 'under_review') {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1 whitespace-nowrap">
          <Clock size={12} />
          Under Review
        </span>
      )
    }
    
    // Default pending
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 flex items-center gap-2 whitespace-nowrap">
        <Clock size={12} />
        Pending
      </span>
    )
  }
  
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
        {/* Checkbox */}
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

        {/* Application Details */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 items-center">
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
            <p className="text-sm text-gray-900 whitespace-nowrap">{application.age} years</p>
          </div>

          <div className="min-w-0">
            <p className="text-sm text-gray-600 flex items-center gap-2 whitespace-nowrap overflow-hidden">
              <MapPin size={14} className="text-gray-400 flex-shrink-0" />
              <span className="truncate">{application.state}</span>
            </p>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span>{new Date(application.submission_date).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 flex-shrink-0">
            {getStatusBadge()}

            <a
              href={`/admin/applications/${application.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition font-semibold text-xs whitespace-nowrap"
            >
              <Eye size={14} />
              View
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}