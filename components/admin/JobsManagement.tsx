'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Plus, Edit2, Trash2, Eye, EyeOff, Search, Filter, Save, X } from 'lucide-react'

interface Job {
  id: string
  position_id: string
  title: string
  department: string
  category: string
  location: string
  job_type: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  is_active: boolean
  applications_count: number
  created_at: string
  updated_at: string
}

interface JobsManagementProps {
  jobs: Job[]
  onJobsChange: () => void
}

export default function JobsManagement({ jobs, onJobsChange }: JobsManagementProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingJob, setEditingJob] = useState<Job | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    position_id: '',
    department: '',
    category: '',
    location: '',
    job_type: 'Full-time',
    salary: '',
    description: '',
    requirements: [''],
    responsibilities: [''],
    is_active: false
  })

  const categories = [
    { id: 'administrative', name: 'Administrative' },
    { id: 'media-production', name: 'Media & Production' },
    { id: 'technical-operations', name: 'Technical & Operations' },
    { id: 'support-logistics', name: 'Support & Logistics' },
    { id: 'marketing-sponsorship', name: 'Marketing & Sponsorship' }
  ]

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || job.category === categoryFilter
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && job.is_active) ||
                         (statusFilter === 'inactive' && !job.is_active)
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job)
      setFormData({
        title: job.title,
        position_id: job.position_id,
        department: job.department,
        category: job.category,
        location: job.location,
        job_type: job.job_type,
        salary: job.salary,
        description: job.description,
        requirements: job.requirements,
        responsibilities: job.responsibilities,
        is_active: job.is_active
      })
    } else {
      setEditingJob(null)
      setFormData({
        title: '',
        position_id: '',
        department: '',
        category: 'administrative',
        location: '',
        job_type: 'Full-time',
        salary: '',
        description: '',
        requirements: [''],
        responsibilities: [''],
        is_active: false
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingJob(null)
  }

  const handleSaveJob = async () => {
    if (!formData.title || !formData.position_id || !formData.department || !formData.description) {
      toast.error('Please fill in all required fields')
      return
    }

    const filteredRequirements = formData.requirements.filter(r => r.trim() !== '')
    const filteredResponsibilities = formData.responsibilities.filter(r => r.trim() !== '')

    if (filteredRequirements.length === 0 || filteredResponsibilities.length === 0) {
      toast.error('Please add at least one requirement and one responsibility')
      return
    }

    try {
      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update({
            title: formData.title,
            department: formData.department,
            category: formData.category,
            location: formData.location,
            job_type: formData.job_type,
            salary: formData.salary,
            description: formData.description,
            requirements: filteredRequirements,
            responsibilities: filteredResponsibilities,
            is_active: formData.is_active
          })
          .eq('id', editingJob.id)

        if (error) throw error
        toast.success('Job updated successfully')
      } else {
        const { error } = await supabase
          .from('jobs')
          .insert([{
            title: formData.title,
            position_id: formData.position_id,
            department: formData.department,
            category: formData.category,
            location: formData.location,
            job_type: formData.job_type,
            salary: formData.salary,
            description: formData.description,
            requirements: filteredRequirements,
            responsibilities: filteredResponsibilities,
            is_active: formData.is_active
          }])

        if (error) throw error
        toast.success('Job created successfully')
      }

      handleCloseModal()
      onJobsChange()
    } catch (err: any) {
      console.error('Error saving job:', err)
      if (err.code === '23505') {
        toast.error('A job with this position ID already exists')
      } else {
        toast.error('Failed to save job')
      }
    }
  }

  const toggleJobStatus = async (job: Job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !job.is_active })
        .eq('id', job.id)

      if (error) throw error
      toast.success(`Job ${!job.is_active ? 'activated' : 'deactivated'} successfully`)
      onJobsChange()
    } catch (err) {
      console.error('Error toggling job status:', err)
      toast.error('Failed to update job status')
    }
  }

  const deleteJob = async (job: Job) => {
    if (!confirm(`Are you sure you want to delete "${job.title}"? This action cannot be undone.`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', job.id)

      if (error) throw error
      toast.success('Job deleted successfully')
      onJobsChange()
    } catch (err) {
      console.error('Error deleting job:', err)
      toast.error('Failed to delete job')
    }
  }

  const addArrayItem = (field: 'requirements' | 'responsibilities') => {
    setFormData({
      ...formData,
      [field]: [...formData[field], '']
    })
  }

  const updateArrayItem = (field: 'requirements' | 'responsibilities', index: number, value: string) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData({
      ...formData,
      [field]: newArray
    })
  }

  const removeArrayItem = (field: 'requirements' | 'responsibilities', index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData({
      ...formData,
      [field]: newArray.length === 0 ? [''] : newArray
    })
  }

  const stats = {
    total: jobs.length,
    active: jobs.filter(j => j.is_active).length,
    inactive: jobs.filter(j => !j.is_active).length,
    totalApplications: jobs.reduce((sum, j) => sum + j.applications_count, 0)
  }

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Jobs</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <p className="text-sm text-green-700 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-900">{stats.active}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-300">
          <p className="text-sm text-gray-600 mb-1">Inactive</p>
          <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <p className="text-sm text-blue-700 mb-1">Applications</p>
          <p className="text-2xl font-bold text-blue-900">{stats.totalApplications}</p>
        </div>
      </div>

      {/* Filters & Add Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Search size={16} className="inline mr-1" />
              Search Jobs
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title or department..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="w-full md:w-auto px-6 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add New Job
        </button>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No jobs found</p>
          </div>
        ) : (
          filteredJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      job.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {job.department}
                    </span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                      {job.location}
                    </span>
                    <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                      {job.job_type}
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {job.salary}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  {job.applications_count > 0 && (
                    <p className="text-sm text-blue-600 font-semibold">
                      {job.applications_count} application{job.applications_count !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => toggleJobStatus(job)}
                  className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                    job.is_active
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {job.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                  {job.is_active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleOpenModal(job)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold hover:bg-blue-200 transition flex items-center gap-2"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => deleteJob(job)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Job Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-4xl w-full my-8">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white rounded-t-xl">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                    placeholder="e.g., Executive Producer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Position ID * {editingJob && '(Cannot be changed)'}
                  </label>
                  <input
                    type="text"
                    value={formData.position_id}
                    onChange={(e) => setFormData({...formData, position_id: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                    placeholder="e.g., executive-producer"
                    disabled={!!editingJob}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Department *
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                    placeholder="e.g., Media & Production"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                    placeholder="e.g., Lagos"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Job Type *
                  </label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => setFormData({...formData, job_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Salary *
                  </label>
                  <input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                    placeholder="e.g., ₦500,000 - ₦800,000/month"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                  placeholder="Describe the role and responsibilities..."
                />
              </div>

              {/* Requirements */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Requirements *
                </label>
                <div className="space-y-2">
                  {formData.requirements.map((req, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={req}
                        onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                        placeholder="Enter a requirement..."
                      />
                      <button
                        onClick={() => removeArrayItem('requirements', index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('requirements')}
                    className="text-sm text-naija-green-600 hover:text-naija-green-700 font-semibold"
                  >
                    + Add Requirement
                  </button>
                </div>
              </div>

              {/* Responsibilities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Responsibilities *
                </label>
                <div className="space-y-2">
                  {formData.responsibilities.map((resp, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => updateArrayItem('responsibilities', index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-naija-green-600"
                        placeholder="Enter a responsibility..."
                      />
                      <button
                        onClick={() => removeArrayItem('responsibilities', index)}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem('responsibilities')}
                    className="text-sm text-naija-green-600 hover:text-naija-green-700 font-semibold"
                  >
                    + Add Responsibility
                  </button>
                </div>
              </div>

              {/* Active Status */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Show on careers page (Active)
                  </span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end sticky bottom-0 bg-white rounded-b-xl">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveJob}
                className="px-6 py-2 bg-naija-green-600 text-white rounded-lg hover:bg-naija-green-700 transition font-semibold flex items-center gap-2"
              >
                <Save size={18} />
                {editingJob ? 'Update Job' : 'Create Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}