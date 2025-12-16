
// ==========================================
// FILE: components/careers/ApplicationForm.tsx
// ==========================================

import { useState } from 'react'
import { X, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Job } from '@/data/jobsData'

interface ApplicationFormProps {
  job: Job
  onClose: () => void
}

export default function ApplicationForm({ job, onClose }: ApplicationFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    cover_letter: '',
    linkedin_url: '',
    portfolio_url: '',
    years_experience: '',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Resume must be less than 5MB')
        return
      }
      if (!file.type.includes('pdf') && !file.type.includes('document') && !file.type.includes('msword')) {
        toast.error('Please upload a PDF or Word document')
        return
      }
      setResumeFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!resumeFile) {
      toast.error('Please upload your resume')
      return
    }

    if (!formData.full_name || !formData.email || !formData.phone || !formData.cover_letter) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const fileName = `${Date.now()}-${resumeFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('job-applications')
        .upload(fileName, resumeFile)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('job-applications')
        .getPublicUrl(fileName)

      const { error: insertError } = await supabase
        .from('job_applications')
        .insert([
          {
            position: job.title,
            position_id: job.id,
            department: job.department,
            full_name: formData.full_name,
            email: formData.email,
            phone: formData.phone,
            location: formData.location,
            cover_letter: formData.cover_letter,
            linkedin_url: formData.linkedin_url,
            portfolio_url: formData.portfolio_url,
            years_experience: formData.years_experience || null,
            resume_url: publicUrl,
            status: 'pending',
          },
        ])

      if (insertError) throw insertError

      toast.success('Application submitted successfully! We\'ll review your application and get back to you soon.')
      
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        location: '',
        cover_letter: '',
        linkedin_url: '',
        portfolio_url: '',
        years_experience: '',
      })
      setResumeFile(null)
      onClose()
      
    } catch (err) {
      console.error('Error submitting application:', err)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div id="application-form" className="mb-16">
      <div className="bg-gradient-to-br from-naija-green-50 to-green-100 rounded-xl p-8 border-2 border-naija-green-200">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for {job.title}</h2>
            <p className="text-gray-600">Fill in your details and upload your resume to apply</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/50 rounded-lg transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                  placeholder="+234 800 000 0000"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Current Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                  placeholder="Lagos, Nigeria"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Years of Experience
                </label>
                <input
                  type="text"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({...formData, years_experience: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                  placeholder="e.g., 5 years"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  LinkedIn Profile
                </label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({...formData, linkedin_url: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Portfolio/Website (Optional)
              </label>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData({...formData, portfolio_url: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                placeholder="https://yourportfolio.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Cover Letter *
              </label>
              <textarea
                value={formData.cover_letter}
                onChange={(e) => setFormData({...formData, cover_letter: e.target.value})}
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                placeholder="Tell us why you're perfect for this role..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Resume/CV * (PDF or Word, max 5MB)
              </label>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-naija-green-500 transition">
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                    <p className="text-sm font-medium text-gray-600">
                      {resumeFile ? resumeFile.name : 'Click to upload your resume'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">PDF or Word document, max 5MB</p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    required
                  />
                </label>
                {resumeFile && (
                  <div className="mt-2 flex items-center justify-between bg-green-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-700">{resumeFile.name}</span>
                    <button
                      type="button"
                      onClick={() => setResumeFile(null)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-8 py-4 bg-naija-green-600 text-white font-bold rounded-lg hover:bg-naija-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></div>
                  Submitting Application...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
