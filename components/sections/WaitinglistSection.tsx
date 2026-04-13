'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Users, MapPin, Zap, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara', 'FCT'
]

const STATE_TO_ZONE: Record<string, string> = {
  'Abia': 'South-East', 'Anambra': 'South-East', 'Ebonyi': 'South-East',
  'Enugu': 'South-East', 'Imo': 'South-East',
  'Akwa Ibom': 'South-South', 'Bayelsa': 'South-South', 'Cross River': 'South-South',
  'Delta': 'South-South', 'Edo': 'South-South', 'Rivers': 'South-South',
  'Ekiti': 'South-West', 'Lagos': 'South-West', 'Ogun': 'South-West',
  'Ondo': 'South-West', 'Osun': 'South-West', 'Oyo': 'South-West',
  'Benue': 'North-Central', 'FCT': 'North-Central', 'Kogi': 'North-Central',
  'Kwara': 'North-Central', 'Nasarawa': 'North-Central', 'Niger': 'North-Central',
  'Plateau': 'North-Central',
  'Adamawa': 'North-East', 'Bauchi': 'North-East', 'Borno': 'North-East',
  'Gombe': 'North-East', 'Taraba': 'North-East', 'Yobe': 'North-East',
  'Jigawa': 'North-West', 'Kaduna': 'North-West', 'Kano': 'North-West',
  'Katsina': 'North-West', 'Kebbi': 'North-West', 'Sokoto': 'North-West',
  'Zamfara': 'North-West',
}

interface WaitingListSectionProps {
  waitingCount: number
}

export default function WaitingListSection({ waitingCount }: WaitingListSectionProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    state: '',
    interest_level: 'competitor',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name || !formData.email) {
      toast.error('Please enter your name and email')
      return
    }

    setLoading(true)
    try {
      const geo_zone = STATE_TO_ZONE[formData.state] || null

      const { error } = await supabase.from('waiting_list').insert([{
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        state: formData.state || null,
        geo_zone,
        interest_level: formData.interest_level,
        source: 'website_homepage',
      }])

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already on the waiting list')
        } else {
          throw error
        }
        return
      }

      setSuccess(true)
      toast.success('You\'re on the list! We\'ll notify you when applications open.')
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-naija-green-900 via-naija-green-800 to-naija-green-900 py-20">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-naija-green-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-naija-green-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — copy */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-full text-naija-green-200 text-sm font-bold">
              <Zap size={14} />
              Applications Opening Soon
            </div>

            <h2 className="text-4xl md:text-5xl font-black leading-tight">
              Be First in Line.
              <br />
              <span className="text-naija-green-300">Join the Waiting List.</span>
            </h2>

            <p className="text-lg text-naija-green-100 leading-relaxed max-w-md">
              Season 1 applications are not open yet. Join the waiting list and get notified the moment they do - before anyone else.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Users size={18} className="text-naija-green-300" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">
                    {waitingCount.toLocaleString()}
                  </p>
                  <p className="text-xs text-naija-green-300">Warriors waiting</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                  <MapPin size={18} className="text-naija-green-300" />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">6</p>
                  <p className="text-xs text-naija-green-300">Zones competing</p>
                </div>
              </div>
            </div>

            {/* Benefits list */}
            <ul className="space-y-3 pt-2">
              {[
                'First access when applications open',
                'Exclusive pre-season updates and news',
                'Early notification of zone event dates',
                'Priority consideration for Season 1',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-naija-green-100 text-sm">
                  <CheckCircle size={16} className="text-naija-green-400 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {success ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-20 h-20 rounded-full bg-naija-green-100 flex items-center justify-center mx-auto">
                  <CheckCircle size={40} className="text-naija-green-600" />
                </div>
                <h3 className="text-2xl font-black text-gray-900">You&apos;re on the list!</h3>
                <p className="text-gray-600 leading-relaxed">
                  We&apos;ll send you an email the moment Season 1 applications open. Stay ready — the competition is coming.
                </p>
                <p className="text-sm text-naija-green-600 font-semibold">
                  Follow us on social media for updates in the meantime.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-1">Reserve Your Spot</h3>
                  <p className="text-gray-500 text-sm">No account needed. Just your details.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Phone Number <span className="text-gray-400">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08012345678"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:border-transparent transition"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      State <span className="text-gray-400">(optional)</span>
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-naija-green-500 focus:border-transparent transition bg-white"
                    >
                      <option value="">Select your state</option>
                      {NIGERIAN_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    {formData.state && (
                      <p className="mt-1 text-xs text-naija-green-600 font-medium">
                        Zone: {STATE_TO_ZONE[formData.state]}
                      </p>
                    )}
                  </div>

                  {/* Interest Level */}
                  <p className="text-center text-xs text-gray-400">
                    Want to sponsor, partner, or cover this?{' '}
                    <Link href="/partners" className="text-naija-green-600 font-semibold hover:underline">
                      Partners
                    </Link>{' '}
                    ·{' '}
                    <Link href="/investors" className="text-naija-green-600 font-semibold hover:underline">
                      Investors
                    </Link>{' '}
                    ·{' '}
                    <Link href="/contact" className="text-naija-green-600 font-semibold hover:underline">
                      Contact Us
                    </Link>
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-naija-green-600 hover:bg-naija-green-700 text-white font-black text-base rounded-xl transition-all duration-200 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Joining...' : 'Join the Waiting List'}
                  </button>

                  <p className="text-center text-xs text-gray-400">
                    No spam. We only email when it matters.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}