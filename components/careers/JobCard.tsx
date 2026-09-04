// ==========================================
// FILE: components/careers/JobCard.tsx
// Updated to use Job type from database
// ==========================================

import { useState } from 'react'

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

interface JobCardProps {
  job: Job
  onApply: (jobId: string) => void
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className="bg-white rounded-lg border-2 border-nnw-navy/10 hover:border-nnw-green/40 transition overflow-hidden"
    >
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="mb-4">
          <h3 className="font-display uppercase text-nnw-navy text-lg sm:text-xl mb-3 leading-tight">
            {job.title}
          </h3>

          {/* Tags - Mobile: 2 columns, Desktop: 4 columns */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
            <span className="text-xs bg-nnw-green/10 text-nnw-green px-2.5 sm:px-3 py-1 rounded-full font-medium truncate text-center">
              {job.department}
            </span>
            <span className="text-xs bg-nnw-navy/10 text-nnw-navy px-2.5 sm:px-3 py-1 rounded-full font-medium truncate text-center">
              {job.location}
            </span>
            <span className="text-xs bg-nnw-ash/20 text-nnw-navy px-2.5 sm:px-3 py-1 rounded-full font-medium truncate text-center">
              {job.job_type}
            </span>
            <span className="text-xs bg-nnw-amber/15 text-nnw-amber px-2.5 sm:px-3 py-1 rounded-full font-medium truncate text-center">
              {job.salary}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-nnw-navy/65 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 sm:mt-6 space-y-4 sm:space-y-5">
            <div>
              <p className="text-sm font-semibold text-nnw-navy mb-2">
                Key Responsibilities:
              </p>
              <ul className="space-y-1.5 sm:space-y-2">
                {job.responsibilities.map((resp, j) => (
                  <li key={j} className="flex gap-2 items-start text-sm text-nnw-navy/65">
                    <span className="text-nnw-green mt-0.5 flex-shrink-0">•</span>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-nnw-navy mb-2">
                Requirements:
              </p>
              <ul className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {job.requirements.map((req, j) => (
                  <li key={j} className="flex gap-2 items-start text-sm text-nnw-navy/65">
                    <span className="text-nnw-green mt-0.5 flex-shrink-0">✓</span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Action Buttons - Mobile: Stack vertically, Desktop: Horizontal */}
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-4 sm:mt-5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-nnw-navy/5 text-nnw-navy text-sm sm:text-base font-mono uppercase tracking-wide rounded-full hover:bg-nnw-navy/10 transition order-2 sm:order-1"
          >
            {isExpanded ? 'Show Less' : 'View Details'}
          </button>
          <button
            onClick={() => onApply(job.id)}
            className="w-full sm:w-auto px-5 sm:px-6 py-2.5 bg-nnw-gold text-nnw-navy text-sm sm:text-base font-mono uppercase tracking-wide font-bold rounded-full hover:bg-nnw-gold-soft transition order-1 sm:order-2"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}