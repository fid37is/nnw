'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Briefcase, Heart, TrendingUp, Users, Award, Globe, Upload, X } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Navbar from '../navbar'
import Footer from '../footer'

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null)
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

  const openPositions = [
    {
      id: 'executive-producer',
      title: 'Executive Producer',
      department: 'Production',
      location: 'Lagos',
      type: 'Full-time',
      salary: '₦500,000 - ₦800,000/month',
      description: 'Lead the entire production of Nigeria\'s first ninja warrior competition series. Oversee creative vision, manage production teams, coordinate with sponsors, and ensure delivery of high-quality broadcast content.',
      requirements: [
        '7+ years in TV/Reality show production',
        'Experience managing large-scale events',
        'Strong leadership and team management',
        'Budget management expertise',
        'Knowledge of Nigerian broadcast standards',
        'Available for extensive travel across Nigeria'
      ],
      responsibilities: [
        'Oversee all aspects of show production from pre to post',
        'Manage production team and coordinate departments',
        'Ensure quality control and brand consistency',
        'Handle sponsor and stakeholder relationships',
        'Develop production timelines and budgets'
      ]
    },
    {
      id: 'production-manager',
      title: 'Production Manager',
      department: 'Production',
      location: 'Lagos/Abuja',
      type: 'Full-time',
      salary: '₦350,000 - ₦500,000/month',
      description: 'Coordinate day-to-day production operations, manage crew schedules, handle logistics for regional competitions and filming across multiple Nigerian cities.',
      requirements: [
        '5+ years production management experience',
        'Event coordination background',
        'Strong organizational skills',
        'Problem-solving abilities',
        'Experience with multi-location shoots',
        'Fluent in English and at least one Nigerian language'
      ],
      responsibilities: [
        'Coordinate shooting schedules and locations',
        'Manage production crew and equipment',
        'Handle logistics and transportation',
        'Ensure safety protocols are followed',
        'Liaise with local authorities and venues'
      ]
    },
    {
      id: 'camera-operator',
      title: 'Camera Operator',
      department: 'Technical',
      location: 'Multiple Locations',
      type: 'Contract',
      salary: '₦150,000 - ₦250,000/month',
      description: 'Capture high-energy competition footage, behind-the-scenes content, and contestant stories. Work with state-of-the-art camera equipment to deliver broadcast-quality content.',
      requirements: [
        '3+ years camera operation experience',
        'Experience with sports or action filming',
        'Knowledge of broadcast cameras',
        'Physical fitness for mobile shooting',
        'Own equipment (preferred but not required)',
        'Portfolio of previous work'
      ],
      responsibilities: [
        'Operate cameras during competition filming',
        'Capture dynamic action shots',
        'Work with directors on shot composition',
        'Maintain and troubleshoot camera equipment',
        'Adapt to fast-paced filming environments'
      ]
    },
    {
      id: 'video-editor',
      title: 'Video Editor',
      department: 'Post-Production',
      location: 'Lagos (Hybrid)',
      type: 'Full-time',
      salary: '₦250,000 - ₦400,000/month',
      description: 'Edit competition episodes, create promotional content, and assemble compelling narratives from raw footage. Transform hours of competition footage into engaging television.',
      requirements: [
        'Professional video editing experience',
        'Proficiency in Adobe Premiere/Final Cut Pro',
        'Understanding of storytelling and pacing',
        'Experience with reality TV or sports content',
        'Strong attention to detail',
        'Ability to work under tight deadlines'
      ],
      responsibilities: [
        'Edit competition episodes and highlights',
        'Create social media content',
        'Collaborate with producers on story arcs',
        'Add graphics, music, and sound effects',
        'Manage post-production workflow'
      ]
    },
    {
      id: 'social-media-manager',
      title: 'Social Media Manager',
      department: 'Marketing',
      location: 'Lagos',
      type: 'Full-time',
      salary: '₦200,000 - ₦350,000/month',
      description: 'Build and engage our online community across Instagram, TikTok, Twitter/X, and YouTube. Create viral content, manage contestant engagement, and drive viewership.',
      requirements: [
        'Proven social media management experience',
        'Content creation skills (video/graphics)',
        'Understanding of Nigerian social media trends',
        'Experience with entertainment or sports brands',
        'Strong copywriting skills',
        'Analytics and growth mindset'
      ],
      responsibilities: [
        'Develop and execute social media strategy',
        'Create engaging content daily',
        'Manage community interactions',
        'Track analytics and optimize performance',
        'Coordinate with production for BTS content'
      ]
    },
    {
      id: 'obstacle-designer',
      title: 'Obstacle Course Designer',
      department: 'Operations',
      location: 'Multiple Locations',
      type: 'Contract',
      salary: '₦300,000 - ₦500,000/project',
      description: 'Design, build, and test ninja warrior obstacle courses. Ensure safety while creating challenging and visually exciting obstacles for competitors.',
      requirements: [
        'Engineering or construction background',
        'Understanding of biomechanics and safety',
        'Welding and fabrication skills',
        'Creative problem-solving abilities',
        'Physical fitness and obstacle course knowledge',
        'Team leadership experience'
      ],
      responsibilities: [
        'Design innovative obstacle courses',
        'Oversee construction and installation',
        'Conduct safety testing and inspections',
        'Train crew on obstacle setup',
        'Adapt designs for different venues'
      ]
    },
    {
      id: 'contestant-coordinator',
      title: 'Contestant Coordinator',
      department: 'Contestant Services',
      location: 'Lagos/Abuja',
      type: 'Full-time',
      salary: '₦180,000 - ₦300,000/month',
      description: 'Manage all contestant relations from application to competition day. Handle registrations, communications, on-site support, and ensure positive contestant experiences.',
      requirements: [
        'Customer service or event coordination experience',
        'Excellent communication skills',
        'Organized and detail-oriented',
        'Problem-solving under pressure',
        'Empathetic and people-focused',
        'Flexible schedule including weekends'
      ],
      responsibilities: [
        'Process contestant applications',
        'Coordinate contestant communications',
        'Manage competition day check-ins',
        'Handle contestant inquiries and issues',
        'Collect contestant stories and testimonials'
      ]
    },
    {
      id: 'sponsorship-manager',
      title: 'Sponsorship & Partnerships Manager',
      department: 'Business Development',
      location: 'Lagos',
      type: 'Full-time',
      salary: '₦400,000 - ₦700,000/month + Commission',
      description: 'Secure corporate sponsorships and brand partnerships. Build relationships with Nigerian brands and deliver value through innovative partnership activations.',
      requirements: [
        'B2B sales and partnership experience',
        'Entertainment or sports industry background',
        'Strong negotiation skills',
        'Established Nigerian corporate network',
        'Track record of closing deals',
        'Excellent presentation skills'
      ],
      responsibilities: [
        'Identify and approach potential sponsors',
        'Develop partnership proposals and decks',
        'Negotiate sponsorship agreements',
        'Manage sponsor relationships',
        'Deliver partnership value and reporting'
      ]
    },
    {
      id: 'sound-engineer',
      title: 'Sound Engineer',
      department: 'Technical',
      location: 'Multiple Locations',
      type: 'Contract',
      salary: '₦120,000 - ₦200,000/month',
      description: 'Capture clean audio during competitions, manage sound mixing, and ensure broadcast-quality sound for all productions.',
      requirements: [
        'Professional sound engineering experience',
        'Knowledge of broadcast audio equipment',
        'Experience with live event sound',
        'Problem-solving and quick thinking',
        'Own equipment (preferred)',
        'Physical ability for location work'
      ],
      responsibilities: [
        'Set up and operate sound equipment',
        'Capture dialogue and ambient sound',
        'Mix audio during live competitions',
        'Troubleshoot audio issues',
        'Collaborate with production team'
      ]
    },
    {
      id: 'content-producer',
      title: 'Content Producer (Social/Digital)',
      department: 'Marketing',
      location: 'Lagos (Hybrid)',
      type: 'Full-time',
      salary: '₦180,000 - ₦300,000/month',
      description: 'Create short-form content for TikTok, Instagram Reels, and YouTube Shorts. Capture behind-the-scenes moments and athlete stories that drive engagement.',
      requirements: [
        'Video content creation experience',
        'Mobile filming and editing skills',
        'Understanding of viral content',
        'Creative storytelling ability',
        'Self-starter with minimal supervision',
        'Knowledge of trending formats'
      ],
      responsibilities: [
        'Film and edit short-form content',
        'Capture BTS and contestant moments',
        'Create trending challenge videos',
        'Optimize content for each platform',
        'Monitor performance and iterate'
      ]
    },
    {
      id: 'state-coordinator',
      title: 'State Coordinators',
      department: 'Operations',
      location: 'Various States',
      type: 'Part-time/Contract',
      salary: '₦80,000 - ₦150,000/month',
      description: 'Represent Naija Ninja Warrior in your state. Coordinate local registrations, scouting, and community engagement. Multiple positions available nationwide.',
      requirements: [
        'Strong local community connections',
        'Event coordination experience',
        'Excellent communication skills',
        'Self-motivated and entrepreneurial',
        'Access to local venues and networks',
        'Passion for fitness and sports'
      ],
      responsibilities: [
        'Drive local contestant registrations',
        'Coordinate regional qualifiers',
        'Build partnerships with gyms and trainers',
        'Manage local marketing efforts',
        'Report to head office regularly'
      ]
    },
    {
      id: 'graphics-designer',
      title: 'Graphics Designer',
      department: 'Creative',
      location: 'Lagos (Hybrid)',
      type: 'Full-time',
      salary: '₦150,000 - ₦280,000/month',
      description: 'Design graphics for broadcast, social media, and marketing materials. Create visual identity elements that elevate the Naija Ninja Warrior brand.',
      requirements: [
        'Professional graphic design experience',
        'Proficiency in Adobe Creative Suite',
        'Motion graphics skills (After Effects)',
        'Strong portfolio of work',
        'Understanding of brand consistency',
        'Fast turnaround capability'
      ],
      responsibilities: [
        'Design broadcast graphics and overlays',
        'Create social media assets',
        'Develop marketing materials',
        'Design contestant profiles and stats',
        'Maintain brand visual standards'
      ]
    }
  ]

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

    if (!selectedJob) {
      toast.error('Please select a job position')
      return
    }

    if (!resumeFile) {
      toast.error('Please upload your resume')
      return
    }

    if (!formData.full_name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const job = openPositions.find(j => j.id === selectedJob)
      
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
            position: job?.title,
            position_id: selectedJob,
            department: job?.department,
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
      setSelectedJob(null)
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
    } catch (err) {
      console.error('Error submitting application:', err)
      toast.error('Failed to submit application. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const selectedPosition = openPositions.find(j => j.id === selectedJob)

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-20">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <Briefcase size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Join Our Team</h1>
          </div>
          <p className="text-xl text-gray-600">Help Us Build Africa's Premier Ninja Warrior Competition</p>
        </div>

        {/* Hero Statement */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Be Part of Something Legendary</h2>
          <p className="text-lg text-green-50 leading-relaxed mb-6">
            We're launching Nigeria's first ninja warrior competition series and looking for talented, passionate individuals to join our founding team. This is your opportunity to be part of history and help create a movement that will inspire millions across Africa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Heart className="mb-2" size={28} />
              <p className="font-bold mb-1">Ground Floor Opportunity</p>
              <p className="text-green-100 text-sm">Join us at the start of something big</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <TrendingUp className="mb-2" size={28} />
              <p className="font-bold mb-1">Rapid Growth</p>
              <p className="text-green-100 text-sm">Grow your career as we expand</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Users className="mb-2" size={28} />
              <p className="font-bold mb-1">Dynamic Team</p>
              <p className="text-green-100 text-sm">Work with passionate creators</p>
            </div>
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Open Positions</h2>
          <p className="text-gray-600 mb-8">We're hiring for {openPositions.length} positions across production, technical, marketing, and operations teams</p>
          
          <div className="space-y-4">
            {openPositions.map((job) => (
              <div 
                key={job.id} 
                className={`bg-white rounded-xl border-2 transition overflow-hidden cursor-pointer ${
                  selectedJob === job.id 
                    ? 'border-naija-green-500 shadow-lg' 
                    : 'border-gray-200 hover:border-naija-green-300'
                }`}
                onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
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
                  
                  {selectedJob === job.id && (
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
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedJob(job.id)
                      document.getElementById('application-form')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="mt-4 px-6 py-2.5 bg-naija-green-600 text-white font-semibold rounded-full hover:bg-naija-green-700 transition"
                  >
                    {selectedJob === job.id ? 'Apply Below' : 'Apply Now'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form */}
        {selectedJob && (
          <div id="application-form" className="mb-16">
            <div className="bg-gradient-to-br from-naija-green-50 to-green-100 rounded-xl p-8 border-2 border-naija-green-200">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Apply for {selectedPosition?.title}</h2>
                  <p className="text-gray-600">Fill in your details and upload your resume to apply</p>
                </div>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 hover:bg-white/50 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="bg-white rounded-lg p-6">
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
                    onClick={handleSubmit}
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
              </div>
            </div>
          </div>
        )}

        {/* Why Join Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Why Join Naija Ninja Warrior?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <Globe size={24} />,
                title: 'Pioneer a Movement',
                desc: 'Be part of launching Nigeria\'s first ninja competition series and shape the future of fitness entertainment in Africa.',
                color: 'bg-blue-100 text-blue-600'
              },
              {
                icon: <Award size={24} />,
                title: 'Make Real Impact',
                desc: 'Your work will inspire millions of Nigerians to pursue fitness, overcome challenges, and achieve their dreams.',
                color: 'bg-green-100 text-green-600'
              },
              {
                icon: <Users size={24} />,
                title: 'Diverse Team',
                desc: 'Work alongside passionate professionals from entertainment, sports, media, and technology backgrounds.',
                color: 'bg-purple-100 text-purple-600'
              },
              {
                icon: <TrendingUp size={24} />,
                title: 'Career Growth',
                desc: 'As we expand, early team members will have exceptional opportunities for advancement and leadership roles.',
                color: 'bg-orange-100 text-orange-600'
              },
            ].map((value, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className={`w-12 h-12 ${value.color} rounded-lg flex items-center justify-center mb-4`}>
                  {value.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-lg">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't See Your Role?</h2>
            <p className="text-lg text-green-50 mb-8">
              We're always looking for exceptional talent. Send us your CV and tell us how you can contribute to building Nigeria's premier sports entertainment platform.
            </p>
            <Link href="/contact" className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition">
              Contact HR Team
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}