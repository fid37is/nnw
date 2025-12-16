'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Navbar from '../navbar'
import Footer from '../footer'

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
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar  />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <MessageSquare size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Contact Us</h1>
          </div>
          <p className="text-xl text-gray-600">Get in Touch With Our Team</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Mail size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Email Us</h3>
            <a href="mailto:phyd3lis@gmail.com" className="text-green-50 hover:text-white transition">
              phyd3lis@gmail.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-naija-green-700 to-naija-green-800 text-white rounded-xl p-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <Phone size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Call Us</h3>
            <a href="tel:+2348085952266" className="text-green-50 hover:text-white transition">
              +234 808 595 2266
            </a>
          </div>

          <div className="bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-xl p-6">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-4">
              <MapPin size={24} />
            </div>
            <h3 className="font-bold text-lg mb-2">Location</h3>
            <p className="text-gray-50">
              Calabar & Abuja<br />Nigeria
            </p>
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                      placeholder="John Doe"
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
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                      placeholder="+234 800 000 0000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-naija-green-500"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full md:w-auto px-8 py-3 bg-naija-green-600 text-white font-bold rounded-full hover:bg-naija-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send Message
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Office Hours</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Monday - Friday</span>
                  <span>9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Saturday</span>
                  <span>10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Sunday</span>
                  <span>Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-naija-green-50 rounded-xl p-6 border border-naija-green-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Quick Links</h3>
              <div className="space-y-3">
                <Link href="/register" className="block text-naija-green-700 hover:text-naija-green-800 font-medium">
                  → Register for Competition
                </Link>
                <Link href="/training" className="block text-naija-green-700 hover:text-naija-green-800 font-medium">
                  → Find Training Centers
                </Link>
                <Link href="/partners" className="block text-naija-green-700 hover:text-naija-green-800 font-medium">
                  → Partnership Opportunities
                </Link>
                <Link href="/faq" className="block text-naija-green-700 hover:text-naija-green-800 font-medium">
                  → Frequently Asked Questions
                </Link>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Media Inquiries</h3>
              <p className="text-sm text-gray-600 mb-3">
                For press, media partnerships, and broadcasting opportunities:
              </p>
              <a href="mailto:phyd3lid@gmail.com?subject=Media Inquiry" 
                 className="text-naija-green-600 hover:text-naija-green-700 font-semibold text-sm">
                Contact Media Relations →
              </a>
            </div>
          </div>
        </div>

        {/* Department Contacts */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Department Contacts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { dept: 'Competitor Relations', email: 'phyd3lid@gmail.com', desc: 'Registration, eligibility, and competition questions' },
              { dept: 'Partnerships & Sponsorship', email: 'phyd3lid@gmail.com', desc: 'Corporate partnerships and brand collaborations' },
              { dept: 'Media & Broadcasting', email: 'phyd3lid@gmail.com', desc: 'Press inquiries and media partnerships' },
              { dept: 'Training Centers', email: 'phyd3lid@gmail.com', desc: 'Certified training facility information' },
              { dept: 'Human Resources', email: 'phyd3lid@gmail.com', desc: 'Career opportunities and employment' },
              { dept: 'General Inquiries', email: 'phyd3lid@gmail.com', desc: 'All other questions and feedback' },
            ].map((contact, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{contact.dept}</h3>
                <p className="text-sm text-gray-600 mb-3">{contact.desc}</p>
                <a href={`mailto:${contact.email}?subject=${contact.dept} Inquiry`} 
                   className="text-naija-green-600 hover:text-naija-green-700 font-medium text-sm flex items-center gap-1">
                  <Mail size={14} />
                  Contact Department
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Prompt */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Have Questions?</h2>
            <p className="text-lg text-gray-300 mb-8">
              Check out our FAQ section for quick answers to common questions about registration, competition format, training, and more.
            </p>
            <Link href="/faq" className="inline-block px-8 py-3 bg-naija-green-600 text-white font-bold rounded-full hover:bg-naija-green-700 transition">
              View FAQ
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}