'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Search, Filter, Download, Eye, CheckCircle, XCircle, Clock, Mail, Phone, MapPin, Calendar, FileText, ExternalLink, Trash2 } from 'lucide-react'

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

    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter)
    }

    if (departmentFilter !== 'all') {
      filtered = filtered.filter(app => app.department === departmentFilter)
    }

    setFilteredApplications(filtered)
  }

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('job_applications')
        .update({
          status: newStatus,
          reviewed_at: new Date().toISOString()
        })
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
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .delete()
        .eq('id', applicationId)

      if (error) throw error

      toast.success('Application deleted successfully')
      setSelectedApplication(null)
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
        [
          app.full_name,
          app.email,
          app.phone,
          app.position,
          app.department,
          app.location,
          app.years_experience || 'N/A',
          app.status,
          new Date(app.created_at).toLocaleDateString()
        ].join(',')
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
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'reviewing': return 'bg-blue-100 text-blue-800'
      case 'shortlisted': return 'bg-purple-100 text-purple-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'hired': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const departments = [...new Set(applications.map(app => app.department))].sort()

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    reviewing: applications.filter(a => a.status === 'reviewing').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    hired: applications.filter(a => a.status === 'hired').length,
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200">
          <p className="text-xs sm:text-sm text-yellow-700 mb-1">Pending</p>
          <p className="text-xl sm:text-2xl font-bold text-yellow-900">{stats.pending}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200">
          <p className="text-xs sm:text-sm text-blue-700 mb-1">Reviewing</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-900">{stats.reviewing}</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 border border-purple-200">
          <p className="text-xs sm:text-sm text-purple-700 mb-1">Shortlisted</p>
          <p className="text-xl sm:text-2xl font-bold text-purple-900">{stats.shortlisted}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-3 sm:p-4 border border-red-200">
          <p className="text-xs sm:text-sm text-red-700 mb-1">Rejected</p>
          <p className="text-xl sm:text-2xl font-bold text-red-900">{stats.rejected}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
          <p className="text-xs sm:text-sm text-green-700 mb-1">Hired</p>
          <p className="text-xl sm:text-2xl font-bold text-green-900">{stats.hired}</p>
        </div>
      </div>

      {/* Filters + Export Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">Applications</h2>
          <button
            onClick={exportApplications}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-naija-green-600 hover:bg-naija-green-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <Search size={14} className="inline mr-1" />
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name, email, or position..."
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <Filter size={14} className="inline mr-1" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="rejected">Rejected</option>
              <option value="hired">Hired</option>
            </select>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
              <Filter size={14} className="inline mr-1" />
              Department
            </label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
            >
              <option value="all">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Applications List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 max-h-[600px] sm:max-h-[800px] overflow-y-auto">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 sm:mb-4">
            Applications ({filteredApplications.length})
          </h2>
          {filteredApplications.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm sm:text-base">No applications found</p>
          ) : (
            <div className="space-y-2">
              {filteredApplications.map(app => (
                <div
                  key={app.id}
                  onClick={() => setSelectedApplication(app)}
                  className={`p-3 sm:p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedApplication?.id === app.id
                      ? 'border-naija-green-500 bg-naija-green-50'
                      : 'border-gray-200 hover:border-naija-green-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{app.full_name}</h3>
                      <p className="text-xs text-gray-600 truncate">{app.position}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold whitespace-nowrap ml-2 ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    <p className="truncate">{app.email}</p>
                    <p>{new Date(app.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Application Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          {!selectedApplication ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-gray-400">
              <Eye size={40} className="sm:w-12 sm:h-12 mb-4" />
              <p className="text-sm sm:text-base">Select an application to view details</p>
            </div>
          ) : (
            <div>
              <div className="flex items-start justify-between mb-4 sm:mb-6 gap-3">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 break-words">{selectedApplication.full_name}</h2>
                  <p className="text-base sm:text-lg text-gray-600 break-words">{selectedApplication.position}</p>
                  <span className={`inline-block mt-2 text-xs sm:text-sm px-3 py-1 rounded-full font-semibold ${getStatusColor(selectedApplication.status)}`}>
                    {selectedApplication.status.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => deleteApplication(selectedApplication.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                  title="Delete Application"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Contact Information</h3>
                <div className="space-y-2 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500 flex-shrink-0" />
                    <a href={`mailto:${selectedApplication.email}`} className="text-naija-green-600 hover:underline break-all">
                      {selectedApplication.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-500 flex-shrink-0" />
                    <a href={`tel:${selectedApplication.phone}`} className="text-naija-green-600 hover:underline">
                      {selectedApplication.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">{selectedApplication.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700">Applied: {new Date(selectedApplication.created_at).toLocaleDateString()}</span>
                  </div>
                  {selectedApplication.years_experience && (
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-500 flex-shrink-0" />
                      <span className="text-gray-700">Experience: {selectedApplication.years_experience}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Links */}
              {(selectedApplication.linkedin_url || selectedApplication.portfolio_url) && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Links</h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {selectedApplication.linkedin_url && (
                      <a
                        href={selectedApplication.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition text-xs sm:text-sm font-semibold"
                      >
                        <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                        LinkedIn
                      </a>
                    )}
                    {selectedApplication.portfolio_url && (
                      <a
                        href={selectedApplication.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition text-xs sm:text-sm font-semibold"
                      >
                        <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                        Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Cover Letter</h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap max-h-40 sm:max-h-60 overflow-y-auto">
                  {selectedApplication.cover_letter}
                </div>
              </div>

              {/* Resume */}
              <div className="mb-4 sm:mb-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Resume/CV</h3>
                <a
                  href={selectedApplication.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-naija-green-50 text-naija-green-700 rounded-lg hover:bg-naija-green-100 transition font-semibold w-fit text-xs sm:text-sm"
                >
                  <FileText size={18} className="sm:w-5 sm:h-5" />
                  View Resume
                  <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                </a>
              </div>

              {/* Admin Notes */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-sm sm:text-base">Admin Notes</h3>
                  <button
                    onClick={() => {
                      setAdminNotes(selectedApplication.admin_notes || '')
                      setShowNotesModal(true)
                    }}
                    className="text-xs sm:text-sm text-naija-green-600 hover:text-naija-green-700 font-semibold"
                  >
                    Edit Notes
                  </button>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-xs sm:text-sm text-gray-700 whitespace-pre-wrap min-h-20">
                  {selectedApplication.admin_notes || 'No notes added yet'}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Update Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'pending')}
                    disabled={selectedApplication.status === 'pending'}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <Clock size={14} className="sm:w-4 sm:h-4" />
                    Pending
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'reviewing')}
                    disabled={selectedApplication.status === 'reviewing'}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <Eye size={14} className="sm:w-4 sm:h-4" />
                    Reviewing
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'shortlisted')}
                    disabled={selectedApplication.status === 'shortlisted'}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                    Shortlisted
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'rejected')}
                    disabled={selectedApplication.status === 'rejected'}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <XCircle size={14} className="sm:w-4 sm:h-4" />
                    Rejected
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication.id, 'hired')}
                    disabled={selectedApplication.status === 'hired'}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <CheckCircle size={14} className="sm:w-4 sm:h-4" />
                    Hired
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notes Modal */}
      {showNotesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Edit Admin Notes</h3>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={8}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600 mb-4"
              placeholder="Add your notes about this applicant..."
            />
            <div className="flex gap-2 sm:gap-3 justify-end">
              <button
                onClick={() => setShowNotesModal(false)}
                className="px-4 sm:px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={saveAdminNotes}
                className="px-4 sm:px-6 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold text-sm sm:text-base"
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