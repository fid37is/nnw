'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Calendar, FileText, ExternalLink, Trash2, ArrowLeft } from 'lucide-react'

interface JobApplication {
  id: string
  job_id: string | null
  position: string
  position_id: string
  department: string
  full_name: string
  email: string
  phone: string
  location: string
  cover_letter: string
  linkedin_url: string | null
  portfolio_url: string | null
  years_experience: string | null
  resume_url: string
  status: 'pending' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired'
  created_at: string
  reviewed_at: string | null
  admin_notes: string | null
}

interface ApplicationsManagementProps {
  applications: JobApplication[]
  onApplicationsChange: () => void
}

export default function ApplicationsManagement({ applications, onApplicationsChange }: ApplicationsManagementProps) {
  const [filteredApplications, setFilteredApplications] = useState<JobApplication[]>([])
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [showNotesModal, setShowNotesModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  // Mobile: track whether detail panel is open
  const [showDetail, setShowDetail] = useState(false)

  useEffect(() => {
    filterApplications()
  }, [applications, searchTerm, statusFilter, departmentFilter])

  const filterApplications = () => {
    let filtered = [...applications]
    if (searchTerm) {
      filtered = filtered.filter(app =>
        app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (statusFilter !== 'all') filtered = filtered.filter(app => app.status === statusFilter)
    if (departmentFilter !== 'all') filtered = filtered.filter(app => app.department === departmentFilter)
    setFilteredApplications(filtered)
  }

  const selectApplication = (app: JobApplication) => {
    setSelectedApplication(app)
    setShowDetail(true)
  }

  const handleBack = () => {
    setShowDetail(false)
    setSelectedApplication(null)
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ status: newStatus, reviewed_at: new Date().toISOString() })
        .eq('id', applicationId)
      if (error) throw error
      toast.success(`Application status updated to ${newStatus}`)
      onApplicationsChange()
      if (selectedApplication?.id === applicationId) {
        setSelectedApplication({ ...selectedApplication, status: newStatus as any })
      }
    } catch (err) {
      console.error('Error updating status:', err)
      toast.error('Failed to update status')
    }
  }

  const saveAdminNotes = async () => {
    if (!selectedApplication) return
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({ admin_notes: adminNotes })
        .eq('id', selectedApplication.id)
      if (error) throw error
      toast.success('Notes saved successfully')
      setShowNotesModal(false)
      onApplicationsChange()
      setSelectedApplication({ ...selectedApplication, admin_notes: adminNotes })
    } catch (err) {
      console.error('Error saving notes:', err)
      toast.error('Failed to save notes')
    }
  }

  const deleteApplication = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return
    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationId)
      if (error) throw error
      toast.success('Application deleted successfully')
      setSelectedApplication(null)
      setShowDetail(false)
      onApplicationsChange()
    } catch (err) {
      console.error('Error deleting application:', err)
      toast.error('Failed to delete application')
    }
  }

  const exportApplications = () => {
    const csv = [
      ['Name', 'Email', 'Phone', 'Position', 'Department', 'Location', 'Experience', 'Status', 'Applied Date'].join(','),
      ...filteredApplications.map(app =>
        [app.full_name, app.email, app.phone, app.position, app.department, app.location,
          app.years_experience || 'N/A', app.status, new Date(app.created_at).toLocaleDateString()].join(',')
      )
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `job-applications-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':    return 'bg-yellow-100 text-yellow-800'
      case 'reviewing':  return 'bg-blue-100 text-blue-800'
      case 'shortlisted':return 'bg-purple-100 text-purple-800'
      case 'rejected':   return 'bg-red-100 text-red-800'
      case 'hired':      return 'bg-green-100 text-green-800'
      default:           return 'bg-gray-100 text-gray-800'
    }
  }

  const departments = [...new Set(applications.map(app => app.department))].sort()

  const stats = {
    total:       applications.length,
    pending:     applications.filter(a => a.status === 'pending').length,
    reviewing:   applications.filter(a => a.status === 'reviewing').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected:    applications.filter(a => a.status === 'rejected').length,
    hired:       applications.filter(a => a.status === 'hired').length,
  }

  return (
    <div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
        {[
          { label: 'Total',       value: stats.total,       bg: 'bg-white',       border: 'border-gray-200',   text: 'text-gray-900',   sub: 'text-gray-600' },
          { label: 'Pending',     value: stats.pending,     bg: 'bg-yellow-50',   border: 'border-yellow-200', text: 'text-yellow-900', sub: 'text-yellow-700' },
          { label: 'Reviewing',   value: stats.reviewing,   bg: 'bg-blue-50',     border: 'border-blue-200',   text: 'text-blue-900',   sub: 'text-blue-700' },
          { label: 'Shortlisted', value: stats.shortlisted, bg: 'bg-purple-50',   border: 'border-purple-200', text: 'text-purple-900', sub: 'text-purple-700' },
          { label: 'Rejected',    value: stats.rejected,    bg: 'bg-red-50',      border: 'border-red-200',    text: 'text-red-900',    sub: 'text-red-700' },
          { label: 'Hired',       value: stats.hired,       bg: 'bg-green-50',    border: 'border-green-200',  text: 'text-green-900',  sub: 'text-green-700' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-lg p-3 border ${s.border}`}>
            <p className={`text-xs ${s.sub} mb-0.5`}>{s.label}</p>
            <p className={`text-xl font-bold ${s.text}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Filters ── */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-bold text-gray-900">Applications</h2>
          <button
            onClick={exportApplications}
            className="flex items-center gap-1.5 px-3 py-2 bg-naija-green-600 hover:bg-naija-green-700 text-white font-semibold rounded-lg transition text-sm"
          >
            <Download size={15} />
            <span className="hidden sm:inline">Export CSV</span>
            <span className="sm:hidden">CSV</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Name, email, or position..."
              className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
            />
          </div>
          {/* Status */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="reviewing">Reviewing</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
          {/* Department */}
          <select
            value={departmentFilter}
            onChange={e => setDepartmentFilter(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Main panel ── */}
      {/*
        Mobile:  show list OR detail (full width), toggled by showDetail
        Desktop: show both side by side
      */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── List panel — hidden on mobile when detail is open ── */}
        <div className={`lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col ${showDetail ? 'hidden lg:flex' : 'flex'}`}>
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-sm font-bold text-gray-900">
              {filteredApplications.length} Application{filteredApplications.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
            {filteredApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Search size={32} className="mb-3" />
                <p className="text-sm">No applications found</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredApplications.map(app => (
                  <div
                    key={app.id}
                    onClick={() => selectApplication(app)}
                    className={`p-4 cursor-pointer transition ${
                      selectedApplication?.id === app.id
                        ? 'bg-naija-green-50 border-l-4 border-l-naija-green-500'
                        : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm truncate">{app.full_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold whitespace-nowrap flex-shrink-0 ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mb-0.5">{app.position}</p>
                    <p className="text-xs text-gray-400">{new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Detail panel — full screen on mobile, right column on desktop ── */}
        <div className={`lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 ${showDetail ? 'block' : 'hidden lg:block'}`}>
          {!selectedApplication ? (
            <div className="flex flex-col items-center justify-center h-full min-h-64 py-20 text-gray-400">
              <Eye size={40} className="mb-4" />
              <p className="text-sm">Select an application to view details</p>
            </div>
          ) : (
            <div className="flex flex-col h-full">

              {/* Detail header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100">
                {/* Back button — mobile only */}
                <button
                  onClick={handleBack}
                  className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-600"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-gray-900 truncate">{selectedApplication.full_name}</h2>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm text-gray-500 truncate">{selectedApplication.position}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${getStatusColor(selectedApplication.status)}`}>
                      {selectedApplication.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => deleteApplication(selectedApplication.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  title="Delete Application"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* Scrollable detail body */}
              <div className="overflow-y-auto p-4 space-y-5 flex-1">

                {/* Contact Info */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <a href={`mailto:${selectedApplication.email}`} className="flex items-center gap-2 text-naija-green-600 hover:underline min-w-0">
                      <Mail size={15} className="text-gray-400 flex-shrink-0" />
                      <span className="truncate">{selectedApplication.email}</span>
                    </a>
                    <a href={`tel:${selectedApplication.phone}`} className="flex items-center gap-2 text-naija-green-600 hover:underline">
                      <Phone size={15} className="text-gray-400 flex-shrink-0" />
                      {selectedApplication.phone}
                    </a>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={15} className="text-gray-400 flex-shrink-0" />
                      {selectedApplication.location}
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={15} className="text-gray-400 flex-shrink-0" />
                      Applied: {new Date(selectedApplication.created_at).toLocaleDateString()}
                    </div>
                    {selectedApplication.years_experience && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <FileText size={15} className="text-gray-400 flex-shrink-0" />
                        Experience: {selectedApplication.years_experience}
                      </div>
                    )}
                  </div>
                </div>

                {/* Links */}
                {(selectedApplication.linkedin_url || selectedApplication.portfolio_url) && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 text-sm">Links</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedApplication.linkedin_url && (
                        <a href={selectedApplication.linkedin_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-sm font-semibold">
                          <ExternalLink size={14} /> LinkedIn
                        </a>
                      )}
                      {selectedApplication.portfolio_url && (
                        <a href={selectedApplication.portfolio_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-sm font-semibold">
                          <ExternalLink size={14} /> Portfolio
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Cover Letter */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Cover Letter</h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                    {selectedApplication.cover_letter}
                  </div>
                </div>

                {/* Resume */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Resume / CV</h3>
                  <a href={selectedApplication.resume_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-naija-green-50 text-naija-green-700 rounded-lg hover:bg-naija-green-100 transition font-semibold text-sm">
                    <FileText size={16} /> View Resume <ExternalLink size={13} />
                  </a>
                </div>

                {/* Admin Notes */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">Admin Notes</h3>
                    <button
                      onClick={() => { setAdminNotes(selectedApplication.admin_notes || ''); setShowNotesModal(true) }}
                      className="text-xs text-naija-green-600 hover:text-naija-green-700 font-semibold"
                    >
                      Edit Notes
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap min-h-16 leading-relaxed">
                    {selectedApplication.admin_notes || <span className="text-gray-400">No notes added yet</span>}
                  </div>
                </div>

                {/* Status Actions */}
                <div className="border-t pt-4">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { status: 'pending',     icon: <Clock size={14} />,         style: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
                      { status: 'reviewing',   icon: <Eye size={14} />,           style: 'bg-blue-100 text-blue-800 hover:bg-blue-200' },
                      { status: 'shortlisted', icon: <CheckCircle size={14} />,   style: 'bg-purple-100 text-purple-800 hover:bg-purple-200' },
                      { status: 'rejected',    icon: <XCircle size={14} />,       style: 'bg-red-100 text-red-800 hover:bg-red-200' },
                      { status: 'hired',       icon: <CheckCircle size={14} />,   style: 'bg-green-100 text-green-800 hover:bg-green-200' },
                    ].map(({ status, icon, style }) => (
                      <button
                        key={status}
                        onClick={() => updateApplicationStatus(selectedApplication.id, status)}
                        disabled={selectedApplication.status === status}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-semibold transition text-xs sm:text-sm disabled:opacity-40 disabled:cursor-not-allowed ${style}`}
                      >
                        {icon}
                        <span className="capitalize">{status}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Notes Modal ── */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl p-5 sm:p-6 max-h-[90vh] flex flex-col">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Edit Admin Notes</h3>
            <textarea
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 mb-4 resize-none flex-1"
              placeholder="Add your notes about this applicant..."
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowNotesModal(false)}
                className="flex-1 sm:flex-none sm:px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveAdminNotes}
                className="flex-1 sm:flex-none sm:px-6 py-2.5 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold text-sm"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}