'use client'

// File: app/(main)/contact/page.tsx

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'

const DEPARTMENTS = [
  { dept: 'Competitor Relations', email: 'support@naijaninja.net', desc: 'Registration, eligibility, and competition questions' },
  { dept: 'Partnerships & Sponsorship', email: 'support@naijaninja.net', desc: 'Corporate partnerships and brand collaborations' },
  { dept: 'Media & Broadcasting', email: 'support@naijaninja.net', desc: 'Press inquiries and media partnerships' },
  { dept: 'Training Centers', email: 'support@naijaninja.net', desc: 'Certified training facility information' },
  { dept: 'Human Resources', email: 'support@naijaninja.net', desc: 'Career opportunities and employment' },
  { dept: 'General Inquiries', email: 'support@naijaninja.net', desc: 'All other questions and feedback' },
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: `Phone: ${formData.phone || 'Not provided'}\n\n${formData.message}`,
            status: 'new',
          },
        ])

      if (error) throw error

      toast.success('Thank you! Your message has been sent. We will respond to your email shortly.')
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      })
    } catch (err) {
      console.error('Error submitting inquiry:', err)
      toast.error('Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-br from-nnw-navy via-nnw-navy to-nnw-green pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-3">
            <MessageSquare size={36} className="text-nnw-gold" />
            <h1 className="font-display uppercase text-4xl md:text-6xl text-nnw-bone leading-none">Contact Us.</h1>
          </div>
          <p className="text-nnw-ash text-lg max-w-xl">Get in touch with our team - competition, partnerships, media, or general questions.</p>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-nnw-green to-nnw-green-light text-nnw-bone rounded-lg p-6 border border-nnw-green">
            <div className="w-12 h-12 bg-white/15 rounded-lg flex items-center justify-center mb-4">
              <Mail size={22} />
            </div>
            <h3 className="font-display uppercase text-lg mb-2">Email Us</h3>
            <a href="mailto:support@naijaninja.net" className="text-nnw-bone/80 hover:text-nnw-bone transition text-sm">
              support@naijaninja.net
            </a>
          </div>

          <div className="bg-nnw-navy text-nnw-bone rounded-lg p-6 border border-nnw-navy">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
              <Phone size={22} />
            </div>
            <h3 className="font-display uppercase text-lg mb-2">Call Us</h3>
            <a href="tel:+2348085952266" className="text-nnw-bone/80 hover:text-nnw-bone transition text-sm">
              +234 808 595 2266
            </a>
          </div>

          <div className="bg-white text-nnw-navy rounded-lg p-6 border-2 border-nnw-navy/10">
            <div className="w-12 h-12 bg-nnw-navy/5 rounded-lg flex items-center justify-center mb-4">
              <MapPin size={22} className="text-nnw-green" />
            </div>
            <h3 className="font-display uppercase text-lg mb-2">Location</h3>
            <p className="text-nnw-navy/60 text-sm">Calabar &amp; Abuja<br />Nigeria</p>
          </div>
        </div>

        {/* Contact Form & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-8 border border-nnw-navy/10">
              <h2 className="font-display uppercase text-2xl text-nnw-navy mb-6">Send Us a Message</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs tracking-widest uppercase text-nnw-navy/60 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-nnw-navy/15 rounded focus:outline-none focus:ring-2 focus:ring-nnw-green"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs tracking-widest uppercase text-nnw-navy/60 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-nnw-navy/15 rounded focus:outline-none focus:ring-2 focus:ring-nnw-green"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-mono text-xs tracking-widest uppercase text-nnw-navy/60 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-nnw-navy/15 rounded focus:outline-none focus:ring-2 focus:ring-nnw-green"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs tracking-widest uppercase text-nnw-navy/60 mb-2">Subject *</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 border border-nnw-navy/15 rounded focus:outline-none focus:ring-2 focus:ring-nnw-green"
                    >
                      <option value="">Select a subject</option>
                      <option value="Competition Inquiry">Competition Inquiry</option>
                      <option value="Partnership/Sponsorship">Partnership/Sponsorship</option>
                      <option value="Media Inquiry">Media Inquiry</option>
                      <option value="Training Centers">Training Centers</option>
                      <option value="General Question">General Question</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-xs tracking-widest uppercase text-nnw-navy/60 mb-2">Message *</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-3 border border-nnw-navy/15 rounded focus:outline-none focus:ring-2 focus:ring-nnw-green"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full md:w-auto px-8 py-3 bg-nnw-gold text-nnw-navy font-mono text-sm tracking-wider uppercase font-bold rounded hover:bg-nnw-gold-soft transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-nnw-navy border-t-transparent rounded-full" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 border border-nnw-navy/10">
              <h3 className="font-display uppercase text-nnw-navy mb-4 text-base">Office Hours</h3>
              <div className="space-y-3 text-sm text-nnw-navy/60">
                <div className="flex justify-between"><span className="font-medium">Monday - Friday</span><span>9:00 AM - 6:00 PM</span></div>
                <div className="flex justify-between"><span className="font-medium">Saturday</span><span>10:00 AM - 4:00 PM</span></div>
                <div className="flex justify-between"><span className="font-medium">Sunday</span><span>Closed</span></div>
              </div>
            </div>

            <div className="bg-nnw-green/5 rounded-lg p-6 border border-nnw-green/20">
              <h3 className="font-display uppercase text-nnw-navy mb-4 text-base">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/register" className="block text-nnw-green hover:text-nnw-green-light font-medium text-sm">→ Register for Competition</Link>
                <Link href="/training" className="block text-nnw-green hover:text-nnw-green-light font-medium text-sm">→ Find Training Centers</Link>
                <Link href="/partners" className="block text-nnw-green hover:text-nnw-green-light font-medium text-sm">→ Partnership Opportunities</Link>
                <Link href="/faq" className="block text-nnw-green hover:text-nnw-green-light font-medium text-sm">→ Frequently Asked Questions</Link>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-nnw-navy/10">
              <h3 className="font-display uppercase text-nnw-navy mb-4 text-base">Media Inquiries</h3>
              <p className="text-sm text-nnw-navy/60 mb-3">For press, media partnerships, and broadcasting opportunities:</p>
              <a href="mailto:support@naijaninja.net?subject=Media Inquiry" className="text-nnw-green hover:text-nnw-green-light font-semibold text-sm">
                Contact Media Relations →
              </a>
            </div>
          </div>
        </div>

        {/* Department Contacts */}
        <div className="mb-16">
          <h2 className="font-display uppercase text-3xl text-nnw-navy mb-8">Department Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEPARTMENTS.map((contact, i) => (
              <div key={i} className="bg-white rounded-lg p-6 border border-nnw-navy/10">
                <h3 className="font-display uppercase text-nnw-navy mb-2 text-base">{contact.dept}</h3>
                <p className="text-sm text-nnw-navy/60 mb-3">{contact.desc}</p>
                <a href={`mailto:${contact.email}?subject=${contact.dept} Inquiry`} className="text-nnw-green hover:text-nnw-green-light font-medium text-sm flex items-center gap-1">
                  <Mail size={13} /> Contact Department
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Prompt */}
        <div className="bg-gradient-to-br from-nnw-navy to-nnw-green text-nnw-bone rounded-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">Have Questions?</h2>
            <p className="text-lg text-nnw-ash mb-8">
              Check out our FAQ section for quick answers to common questions about registration, competition format, training, and more.
            </p>
            <Link href="/faq" className="inline-block px-8 py-3 bg-nnw-gold text-nnw-navy font-mono text-sm tracking-wider uppercase font-bold rounded hover:bg-nnw-gold-soft transition">
              View FAQ
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}