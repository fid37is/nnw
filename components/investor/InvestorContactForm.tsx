// app/investor/contact/InvestorContactForm.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import {
  Mail, Phone, MapPin, Send, MessageSquare,
  CheckCircle2, Clock,
} from 'lucide-react'
import InvestorSidebar from '@/components/investor/InvestorSidebar'

const SUBJECTS = [
  'Investment Update Request',
  'Financial Report Query',
  'Board Meeting / Governance',
  'Distribution / Returns',
  'Portfolio Performance',
  'Document Request',
  'General Inquiry',
  'Other',
]

export default function InvestorContactForm() {
  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', subject: '', message: '',
  })

  useEffect(() => {
    let mounted = true
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!mounted) return
      if (!session) { router.replace('/investor/login'); return }
      setFormData(prev => ({
        ...prev,
        name:  session.user.user_metadata?.full_name || '',
        email: session.user.email || '',
      }))
      setSessionChecked(true)
    }
    check()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!mounted) return
      if (!session) router.replace('/investor/login')
    })
    return () => { mounted = false; subscription.unsubscribe() }
  }, [router])

  const set = (key: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setFormData(prev => ({ ...prev, [key]: e.target.value }))

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }
    setSubmitting(true)
    try {
      const { error } = await supabase.from('inquiries').insert([{
        name:    formData.name,
        email:   formData.email,
        subject: `[Investor] ${formData.subject}`,
        message: `Phone: ${formData.phone || 'Not provided'}\n\n${formData.message}`,
        status:  'new',
      }])
      if (error) throw error
      setSubmitted(true)
      toast.success('Message sent! The NNW team will respond shortly.')
    } catch (err) {
      console.error(err)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass = `w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-800
    placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-naija-green-500
    focus:border-transparent transition bg-white`

  if (!sessionChecked) {
    return (
      <div className="flex min-h-screen">
        <InvestorSidebar />
        <main className="flex-1 lg:ml-64 bg-gray-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-naija-green-600 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <InvestorSidebar />

      <main className="flex-1 min-w-0 lg:ml-64 min-h-screen bg-white overflow-y-auto">

        {/* ── Full-width page header ───────────────────────────── */}
        <div className="bg-white border-b border-gray-100 px-8 py-5">
          <div className="flex items-center gap-2.5 mb-0.5">
            <MessageSquare size={17} className="text-naija-green-600" />
            <h1 className="text-lg font-bold text-gray-900">Contact NNW Team</h1>
          </div>
          <p className="text-sm text-gray-400 pl-7">
            Send a message to the NNW admin team. We'll respond to your registered email.
          </p>
        </div>

        {/* ── Page content — full width, generous padding ──────── */}
        <div className="px-8 py-10">

          {/* ── Contact info cards ───────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Mail size={22} />
              </div>
              <h3 className="font-bold text-lg mb-2">Email Us</h3>
              <a href="mailto:phyd3lis@gmail.com" className="text-green-50 hover:text-white transition text-sm">
                phyd3lis@gmail.com
              </a>
            </div>

            <div className="bg-gradient-to-br from-naija-green-700 to-naija-green-800 text-white rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <Phone size={22} />
              </div>
              <h3 className="font-bold text-lg mb-2">Call Us</h3>
              <a href="tel:+2347038264911" className="text-green-50 hover:text-white transition text-sm">
                +234 703 826 4911
              </a>
            </div>

            <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl p-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
                <MapPin size={22} />
              </div>
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p className="text-gray-50 text-sm">Calabar & Abuja<br />Nigeria</p>
            </div>
          </div>

          {/* ── Form + sidebar ───────────────────────────────────── */}
          {submitted ? (
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-16 flex flex-col items-center text-center gap-4 mb-12">
              <div className="w-16 h-16 bg-naija-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 size={32} className="text-naija-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent</h2>
                <p className="text-gray-500">
                  The NNW team has received your message and will reply to{' '}
                  <span className="font-semibold text-gray-700">{formData.email}</span> shortly.
                </p>
              </div>
              <button
                onClick={() => { setSubmitted(false); setFormData(prev => ({ ...prev, subject: '', message: '', phone: '' })) }}
                className="mt-2 px-6 py-2.5 bg-naija-green-600 text-white text-sm font-bold rounded-full hover:bg-naija-green-700 transition"
              >
                Send another message
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

              {/* Form */}
              <div className="lg:col-span-2">
                <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                  <div className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name <span className="text-red-400">*</span>
                        </label>
                        <input type="text" value={formData.name} onChange={set('name')}
                          className={inputClass} placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input type="email" value={formData.email} onChange={set('email')}
                          className={inputClass} placeholder="john@example.com" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input type="tel" value={formData.phone} onChange={set('phone')}
                          className={inputClass} placeholder="+234 800 000 0000" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject <span className="text-red-400">*</span>
                        </label>
                        <select value={formData.subject} onChange={set('subject')} className={inputClass}>
                          <option value="">Select a subject</option>
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        value={formData.message} onChange={set('message')} rows={6}
                        className={inputClass + ' resize-none'}
                        placeholder="Describe your inquiry in detail…"
                      />
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="w-full md:w-auto px-8 py-3 bg-naija-green-600 text-white font-bold
                        rounded-full hover:bg-naija-green-700 transition flex items-center
                        justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                          Sending…
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar info */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Office Hours</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    {[
                      ['Monday – Friday', '9:00 AM – 6:00 PM'],
                      ['Saturday',        '10:00 AM – 4:00 PM'],
                      ['Sunday',          'Closed'],
                    ].map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="font-medium text-gray-700">{day}</span>
                        <span className={hours === 'Closed' ? 'text-gray-400' : ''}>{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-naija-green-50 rounded-xl p-6 border border-naija-green-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Investor Note</h3>
                  <p className="text-sm text-naija-green-700 leading-relaxed">
                    For urgent investment matters, call us directly. We typically respond to
                    portal messages within one business day.
                  </p>
                </div>

                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Direct Email</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Prefer to email directly? Reach the team at:
                  </p>
                  <a
                    href="mailto:phyd3lis@gmail.com"
                    className="text-naija-green-600 hover:text-naija-green-700 font-semibold text-sm flex items-center gap-1.5"
                  >
                    <Mail size={14} />
                    phyd3lis@gmail.com
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* ── Department contacts ──────────────────────────────── */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Department Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { dept: 'Investor Relations',      email: 'phyd3lis@gmail.com', desc: 'Investment updates, returns and portfolio queries' },
                { dept: 'Finance & Reporting',     email: 'phyd3lis@gmail.com', desc: 'Financial statements and distribution questions' },
                { dept: 'Board & Governance',      email: 'phyd3lis@gmail.com', desc: 'Meeting schedules and governance matters' },
                { dept: 'Partnerships',            email: 'phyd3lis@gmail.com', desc: 'Corporate partnerships and brand collaborations' },
                { dept: 'Media & Broadcasting',    email: 'phyd3lis@gmail.com', desc: 'Press inquiries and media partnerships' },
                { dept: 'General Inquiries',       email: 'phyd3lis@gmail.com', desc: 'All other questions and feedback' },
              ].map((c, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="font-bold text-gray-900 mb-2">{c.dept}</h3>
                  <p className="text-sm text-gray-500 mb-3">{c.desc}</p>
                  <a
                    href={`mailto:${c.email}?subject=${encodeURIComponent('[Investor] ' + c.dept + ' Inquiry')}`}
                    className="text-naija-green-600 hover:text-naija-green-700 font-medium text-sm flex items-center gap-1.5"
                  >
                    <Mail size={14} />
                    Contact Department
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* ── CTA banner ───────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-10 md:p-14 text-center">
            <h2 className="text-3xl font-bold mb-3">Need Urgent Support?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              For time-sensitive investment matters, call us directly during office hours
              or send a message and mark it urgent.
            </p>
            <a
              href="tel:+2347038264911"
              className="inline-flex items-center gap-2 px-8 py-3 bg-naija-green-600
                text-white font-bold rounded-full hover:bg-naija-green-700 transition"
            >
              <Phone size={18} />
              Call Now
            </a>
          </div>

        </div>
      </main>
    </div>
  )
}