// ==========================================
// FILE: components/careers/JobCard.tsx
// ==========================================

import { useState } from 'react'
import type { Job } from '@/data/jobsData'

interface JobCardProps {
  job: Job
  onApply: (jobId: string) => void
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div 
      className="bg-white rounded-xl border-2 border-gray-200 hover:border-naija-green-300 transition overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-xl mb-2">{job.title}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="text-xs bg-naija-green-100 text-naija-green-700 px-3 py-1 rounded-full font-medium">
                {job.department}
              </span>
              <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                {job.location}
              </span>
              <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-medium">
                {job.type}
              </span>
              <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-medium">
                {job.salary}
              </span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>
        
        {isExpanded && (
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Key Responsibilities:</p>
              <ul className="space-y-1">
                {job.responsibilities.map((resp, j) => (
                  <li key={j} className="flex gap-2 items-start text-sm text-gray-600">
                    <span className="text-naija-green-600 mt-1">•</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-2">Requirements:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {job.requirements.map((req, j) => (
                  <li key={j} className="flex gap-2 items-start text-sm text-gray-600">
                    <span className="text-naija-green-600 mt-1">✓</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-full hover:bg-gray-200 transition"
          >
            {isExpanded ? 'Show Less' : 'View Details'}
          </button>
          <button
            onClick={() => onApply(job.id)}
            className="px-6 py-2.5 bg-naija-green-600 text-white font-semibold rounded-full hover:bg-naija-green-700 transition"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}