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

  const allApplications = applications

  const toggleSelectApp = (appId: string) => {
    setSelectedApps(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
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
    if (selectedApps.length === 0) { toast.error('Please select applications'); return }
    setActioning(true)
    try {
      const { error } = await supabase.from('applications').update({ status: 'under_review' }).in('id', selectedApps)
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
    if (selectedApps.length === 0) { toast.error('Please select applications to accept'); return }
    const appsToAccept = applications.filter(app => selectedApps.includes(app.id) && !app.is_accepted)
    if (appsToAccept.length === 0) { toast.error('Selected applications are already accepted'); return }
    setActioning(true)
    try {
      const { error: updateError } = await supabase
        .from('applications')
        .update({ is_accepted: true, accepted_date: new Date().toISOString() })
        .in('id', appsToAccept.map(app => app.id))
      if (updateError) throw updateError
      toast.success(`${appsToAccept.length} application(s) accepted! Go to Messaging Center to send acceptance notifications.`, { duration: 6000 })
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
    if (selectedApps.length === 0) { toast.error('Please select applications to reject'); return }
    setActioning(true)
    try {
      const { error } = await supabase.from('applications').update({ status: 'rejected' }).in('id', selectedApps)
      if (error) throw error
      toast.success(`${selectedApps.length} application(s) rejected. Go to Messaging Center to send rejection notifications.`, { duration: 6000 })
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
      {/* Stats Cards — 2 cols on mobile, 4 on md, 7 on lg */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2 md:gap-3 mb-5">
        {[
          { label: 'Total',            value: stats.total,           color: 'text-naija-green-900', border: 'border-gray-200' },
          { label: 'Pending',          value: stats.pending,         color: 'text-gray-600',        border: 'border-gray-200' },
          { label: 'Under Review',     value: stats.underReview,     color: 'text-yellow-600',      border: 'border-yellow-200' },
          { label: 'Accepted',         value: stats.accepted,        color: 'text-green-600',       border: 'border-green-200' },
          { label: 'Rejected',         value: stats.rejected,        color: 'text-red-600',         border: 'border-red-200' },
          { label: 'Awaiting Payment', value: stats.awaitingPayment, color: 'text-blue-600',        border: 'border-blue-200' },
          { label: 'Participants',     value: stats.participants,    color: 'text-purple-600',      border: 'border-purple-200' },
        ].map(stat => (
          <div key={stat.label} className={`bg-white rounded-lg shadow-sm border ${stat.border} p-3 md:p-4`}>
            <p className="text-xs text-gray-500 font-semibold mb-1 truncate">{stat.label}</p>
            <p className={`text-xl md:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Workflow Banner */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: showWorkflowBanner ? '300px' : '0',
          opacity: showWorkflowBanner ? 1 : 0,
          marginBottom: showWorkflowBanner ? '1.25rem' : '0',
        }}
      >
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs md:text-sm font-semibold text-blue-900 mb-1">Application Review Workflow</p>
              <p className="text-xs text-blue-700 leading-relaxed">
                <strong>Step 1:</strong> Mark as "Under Review" to notify applicants.<br />
                <strong>Step 2:</strong> Accept or Reject.<br />
                <strong>Step 3:</strong> Accepted applicants submit payment proof.<br />
                <strong>Step 4:</strong> After payment confirmation, they appear in "All Participants".
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        {/* Left: select all + workflow toggle */}
        <div className="flex items-center gap-3">
          {allApplications.length > 0 && (
            <div className="flex items-center gap-2 cursor-pointer" onClick={toggleSelectAll}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                isAllSelected ? 'bg-naija-green-600 border-naija-green-600' : 'border-gray-300 hover:border-naija-green-400'
              }`}>
                {isAllSelected && (
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          )}
          <button
            onClick={() => setShowWorkflowBanner(!showWorkflowBanner)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition"
          >
            <AlertCircle size={14} />
            {showWorkflowBanner ? 'Hide' : 'Show'} Guide
          </button>
        </div>

        {/* Right: bulk actions */}
        {selectedApps.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{selectedApps.length} selected</span>
            <button
              onClick={handleBulkUnderReview}
              disabled={actioning}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-600 text-white rounded-lg text-xs font-semibold hover:bg-yellow-700 disabled:opacity-50 transition"
            >
              {actioning ? <Loader2 size={14} className="animate-spin" /> : <Clock size={14} />}
              Under Review
            </button>
            <button
              onClick={handleBulkAccept}
              disabled={actioning}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 disabled:opacity-50 transition"
            >
              {actioning ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
              Accept
            </button>
            <button
              onClick={handleBulkReject}
              disabled={actioning}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-50 transition"
            >
              {actioning ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Applications List */}
      {allApplications.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No applications yet</h3>
          <p className="text-sm text-gray-500">Applications will appear here once submitted</p>
        </div>
      ) : (
        <div className="space-y-2">
          {allApplications.map(app => (
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
  const getStatusBadge = () => {
    if (application.is_participant) return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 flex items-center gap-1 whitespace-nowrap">
        <CheckCircle size={11} /> Participant
      </span>
    )
    if (application.is_accepted && application.payment_status === 'unpaid') return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 whitespace-nowrap">
        <CheckCircle size={11} /> Awaiting Payment
      </span>
    )
    if (application.is_accepted && application.payment_status === 'pending') return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 flex items-center gap-1 whitespace-nowrap">
        <Clock size={11} /> Payment Submitted
      </span>
    )
    if (application.is_accepted && application.payment_status === 'confirmed') return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 flex items-center gap-1 whitespace-nowrap">
        <CheckCircle size={11} /> Payment Confirmed
      </span>
    )
    if (application.status === 'rejected') return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 flex items-center gap-1 whitespace-nowrap">
        <XCircle size={11} /> Rejected
      </span>
    )
    if (application.status === 'under_review') return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 flex items-center gap-1 whitespace-nowrap">
        <Clock size={11} /> Under Review
      </span>
    )
    return (
      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 flex items-center gap-1 whitespace-nowrap">
        <Clock size={11} /> Pending
      </span>
    )
  }

  return (
    <div
      className={`relative border rounded-lg transition-all p-3 md:p-4 ${
        isSelected ? 'bg-naija-green-50 border-naija-green-400' : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      {/* Mobile layout: stacked */}
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onToggleSelect() }}
          className={`mt-0.5 w-5 h-5 rounded border-2 cursor-pointer flex-shrink-0 flex items-center justify-center transition-all ${
            isSelected ? 'bg-naija-green-600 border-naija-green-600' : 'border-gray-300 hover:border-naija-green-400'
          }`}
        >
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Name + status + view — top row */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {application.users[0]?.full_name || 'N/A'}
            </p>
            <div className="flex items-center gap-2 flex-shrink-0">
              {getStatusBadge()}
              <a
                href={`/admin/applications/${application.id}`}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-naija-green-100 text-naija-green-700 rounded-lg hover:bg-naija-green-200 transition font-semibold text-xs whitespace-nowrap"
              >
                <Eye size={13} /> View
              </a>
            </div>
          </div>

          {/* Details grid — 1 col on mobile, 2 on sm, 4 on lg */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1 text-xs text-gray-500">
            <span className="flex items-center gap-1.5 truncate">
              <Mail size={12} className="flex-shrink-0" />
              <span className="truncate">{application.users[0]?.email || 'N/A'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <User size={12} className="flex-shrink-0" />
              {application.age} years
            </span>
            <span className="flex items-center gap-1.5 truncate">
              <MapPin size={12} className="flex-shrink-0" />
              <span className="truncate">{application.state}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="flex-shrink-0" />
              {new Date(application.submission_date).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}