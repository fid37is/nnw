import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Image from 'next/image'

export default function InquirySection() {
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submittingInquiry, setSubmittingInquiry] = useState(false)

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inquiryForm.name || !inquiryForm.email || !inquiryForm.subject || !inquiryForm.message) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmittingInquiry(true)
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: inquiryForm.name,
            email: inquiryForm.email,
            subject: inquiryForm.subject,
            message: inquiryForm.message,
            status: 'new',
          },
        ])

      if (error) throw error

      toast.success('Thank you! Your inquiry has been sent. We will respond to your email shortly.')
      setInquiryForm({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (err) {
      console.error('Error submitting inquiry:', err)
      toast.error('Failed to send inquiry. Please try again.')
    } finally {
      setSubmittingInquiry(false)
    }
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Image Column */}
        <div className="relative w-full h-full min-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/tr.png"
            alt="Contact Us"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Right Form Column */}
        <div>
          <div className="mb-12 text-center">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Got Questions?</h2>
            <p className="text-gray-600 text-lg">Send us your inquiry and we'll get back to you shortly</p>
          </div>

          <form onSubmit={handleInquirySubmit} className="space-y-6 bg-gradient-to-br from-gray-50 to-white p-8 md:p-10 rounded-2xl border-2 border-gray-100 shadow-lg">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Name</label>
              <input
                type="text"
                value={inquiryForm.name}
                onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                placeholder="Your full name"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                value={inquiryForm.email}
                onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Subject</label>
              <input
                type="text"
                value={inquiryForm.subject}
                onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                placeholder="What is this about?"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
              <textarea
                rows={5}
                value={inquiryForm.message}
                onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                placeholder="Your message..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 transition-all resize-none"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={submittingInquiry}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {submittingInquiry ? (
                <>
                  <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-full"></div>
                  Sending...
                </>
              ) : (
                'Send Inquiry'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}