// ==========================================
// FILE: components/careers/JobsList.tsx
// Updated to fetch jobs from Supabase database
// ==========================================

import { useState, useRef, useEffect } from 'react'
import { X, Instagram, Linkedin, Facebook } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import CategoryCard from './CategoryCard'
import JobCard from './JobCard'
import ApplicationForm from './ApplicationForm'

interface Job {
  id: string
  position_id: string
  title: string
  department: string
  category: string
  location: string
  job_type: string
  type: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  is_active: boolean
  isActive: boolean
  applications_count: number
  created_at: string
  updated_at: string
}

interface JobCategory {
  id: string
  name: string
  description: string
  icon: string
  color: string
  display_order: number
}

export default function JobsList() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [categories, setCategories] = useState<JobCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [hasJobsHistory, setHasJobsHistory] = useState(false)
  const jobsContainerRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  // Fetch jobs and categories from database
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Fetch active jobs
        const { data: jobsData, error: jobsError } = await supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (jobsError) throw jobsError

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('job_categories')
          .select('*')
          .order('display_order', { ascending: true })

        if (categoriesError) throw categoriesError

        // Check if any jobs have ever existed (for empty state logic)
        const { count: totalJobsCount } = await supabase
          .from('jobs')
          .select('*', { count: 'exact', head: true })

        setJobs(jobsData || [])
        setCategories(categoriesData || [])
        setHasJobsHistory((totalJobsCount || 0) > 0)
      } catch (error) {
        console.error('Error fetching jobs:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const activeJobs = jobs
  const hasActiveJobs = activeJobs.length > 0

  const getJobsByCategory = (categoryId: string) => {
    return jobs.filter(job => job.category === categoryId)
  }

  const getJobById = (jobId: string) => {
    return jobs.find(job => job.id === jobId) || null
  }

  const handleCategoryClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    } else {
      setSelectedCategory(categoryId)
      setSelectedJobId(null)
    }
  }

  useEffect(() => {
    if (selectedCategory && jobsContainerRef.current) {
      const yOffset = -100
      const element = jobsContainerRef.current
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset

      window.scrollTo({ top: y, behavior: 'smooth' })
    }
  }, [selectedCategory])

  const handleApply = (jobId: string) => {
    setSelectedJobId(jobId)
    setTimeout(() => {
      document.getElementById('application-form')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }, 100)
  }

  const handleClearCategory = () => {
    setSelectedCategory(null)
    if (categoriesRef.current) {
      categoriesRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const selectedJob = selectedJobId ? getJobById(selectedJobId) : null
  const categoryJobs = selectedCategory ? getJobsByCategory(selectedCategory) : []
  const selectedCategoryName = categories.find(c => c.id === selectedCategory)?.name

  // Loading state
  if (loading) {
    return (
      <div className="mb-16 flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-naija-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading career opportunities...</p>
        </div>
      </div>
    )
  }

  // If no active jobs, show appropriate message based on history
  if (!hasActiveJobs) {
    return (
      <div className="mb-8 sm:mb-12 md:mb-16">
        <div className="bg-gradient-to-br from-naija-green-50 via-white to-naija-green-50 rounded-xl sm:rounded-2xl border-2 border-naija-green-200 p-6 sm:p-8 md:p-12 text-center">
          {/* Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-naija-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg 
              className="w-8 h-8 sm:w-10 sm:h-10 text-naija-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </div>

          {/* Heading - Different based on scenario */}
          {hasJobsHistory ? (
            <>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                No Current Openings
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-4">
                Thank you for your interest in joining Naija Ninja Warrior! All positions have been filled for this recruitment cycle. New opportunities will be announced soon.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                🚀 Exciting Opportunities Coming Soon!
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed px-4">
                We're currently preparing new career opportunities at Naija Ninja Warrior. 
                We'll be opening applications for various roles across Nigeria very soon!
              </p>
            </>
          )}

          {/* Divider */}
          <div className="w-20 sm:w-24 h-1 bg-naija-green-300 rounded-full mx-auto mb-4 sm:mb-6"></div>

          {/* CTA */}
          <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 max-w-xl mx-auto border border-naija-green-200 shadow-sm">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
              Stay Updated
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 px-2">
              Follow us on social media to be the first to know when new positions open!
            </p>

            {/* Social Links - Icon Only, Clean Design */}
            <div className="flex justify-center gap-3 sm:gap-4 flex-wrap">
              <a
                href="https://x.com/officialnnw"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Follow us on X (Twitter)"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://instagram.com/naijaninjawarrior"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900" />
              </a>
              <a
                href="https://tiktok.com/@naijaninjawarrior"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Follow us on TikTok"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href="https://facebook.com/naijaninjawarrior"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900" />
              </a>
              <a
                href="https://linkedin.com/company/naijaninjawarrior"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900" />
              </a>
              <a
                href="https://whatsapp.com/channel/0029VbC22T75fM5jemSqUI0E"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 sm:w-14 sm:h-14 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all hover:scale-110 group"
                aria-label="Join our WhatsApp Channel"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 group-hover:text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6 px-4">
            Questions? Contact us at{' '}
            <a 
              href="mailto:careers@naijaninjawarrior.com" 
              className="text-naija-green-600 hover:underline font-semibold"
            >
              careers@naijaninjawarrior.com
            </a>
          </p>
        </div>
      </div>
    )
  }

  // Normal flow when jobs are active
  return (
    <>
      {/* Categories Section */}
      <div className="mb-16" ref={categoriesRef}>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse by Category</h2>
        <p className="text-gray-600 mb-8">
          Select a category to view available positions. We're hiring across all departments.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
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
      </div>

      {/* Jobs in Selected Category */}
      {selectedCategory && (
        <div ref={jobsContainerRef} className="mb-16">
          <div className="sticky top-20 z-10 bg-white/95 backdrop-blur-sm border-b-2 border-gray-200 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 mb-6">
            <div className="flex items-center justify-between max-w-7xl mx-auto">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {selectedCategoryName} Positions
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {categoryJobs.length} open {categoryJobs.length === 1 ? 'position' : 'positions'}
                </p>
              </div>
              <button
                onClick={handleClearCategory}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition text-sm font-medium text-gray-700"
              >
                <X size={16} />
                <span className="hidden sm:inline">Close</span>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-naija-green-100 via-naija-green-50 to-transparent rounded-xl p-6 mb-6 border-l-4 border-naija-green-500">
            <p className="text-gray-700 font-medium flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-naija-green-500 rounded-full animate-pulse"></span>
              Showing {categoryJobs.length} {categoryJobs.length === 1 ? 'position' : 'positions'} in {selectedCategoryName}
            </p>
          </div>

          <div className="space-y-4">
            {categoryJobs.map((job, index) => (
              <div
                key={job.id}
                style={{ animationDelay: `${index * 50}ms` }}
                className="animate-[slideIn_0.3s_ease-out_forwards] opacity-0"
              >
                <JobCard job={job} onApply={handleApply} />
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={handleClearCategory}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-full transition font-semibold text-gray-700"
            >
              ← Back to All Categories
            </button>
          </div>
        </div>
      )}

      {/* Empty State for selected category with no jobs */}
      {selectedCategory && categoryJobs.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 mb-16">
          <p className="text-gray-600 text-lg mb-2">No positions currently available in this category.</p>
          <p className="text-sm text-gray-500">Check other categories or come back soon!</p>
        </div>
      )}

      {/* Application Form */}
      {selectedJob && (
        <ApplicationForm 
          job={selectedJob} 
          onClose={() => setSelectedJobId(null)} 
        />
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}