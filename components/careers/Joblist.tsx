// ==========================================
// FILE: components/careers/JobsList.tsx
// ==========================================

import { useState } from 'react'
import CategoryCard from './CategoryCard'
import JobCard from './JobCard'
import ApplicationForm from './ApplicationForm'
import { jobCategories, getJobsByCategory, getJobById } from '@/data/jobsData'

export default function JobsList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(categoryId)
      setSelectedJobId(null)
    }
  }

  const handleApply = (jobId: string) => {
    setSelectedJobId(jobId)
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const selectedJob = selectedJobId ? getJobById(selectedJobId) : null
  const categoryJobs = selectedCategory ? getJobsByCategory(selectedCategory) : []

  return (
    <>
      {/* Categories Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
        <p className="text-gray-600 mb-8">
          Select a category to view available positions. We're hiring across all departments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {jobCategories.map((category) => {
            const jobCount = getJobsByCategory(category.id).length
            return (
              <CategoryCard
                key={category.id}
                category={category}
                jobCount={jobCount}
                isSelected={selectedCategory === category.id}
                onClick={() => handleCategoryClick(category.id)}
              />
            )
          })}
        </div>

        {/* Jobs in Selected Category */}
        {selectedCategory && (
          <div>
            <div className="bg-naija-green-50 border-2 border-naija-green-200 rounded-xl p-6 mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {jobCategories.find(c => c.id === selectedCategory)?.name} Positions
              </h3>
              <p className="text-gray-600">
                {categoryJobs.length} open {categoryJobs.length === 1 ? 'position' : 'positions'} available
              </p>
            </div>

            <div className="space-y-4">
              {categoryJobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={handleApply} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Application Form */}
      {selectedJob && (
        <ApplicationForm 
          job={selectedJob} 
          onClose={() => setSelectedJobId(null)} 
        />
      )}
    </>
  )
}