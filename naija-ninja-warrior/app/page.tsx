'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { ArrowRight, Trophy, Users, Zap } from 'lucide-react'

interface Champion {
  id: string
  user_id: string
  season_id: string
  full_name: string
  position: number
}

interface Runner {
  id: string
  user_id: string
  full_name: string
  position: number
}

interface Season {
  id: string
  name: string
  year: number
  application_start_date: string
  application_end_date: string
}

export default function Home() {
  const [champion, setChampion] = useState<Champion | null>(null)
  const [runners, setRunners] = useState<Runner[]>([])
  const [season, setSeason] = useState<Season | null>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, eliminated: 0 })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const { data: seasonData } = await supabase
        .from('seasons')
        .select('id, name, year, status, application_start_date, application_end_date')
        .order('year', { ascending: false })
        .limit(1)
        .single()
      
      if (!seasonData) {
        setLoading(false)
        return
      }

      setSeason(seasonData)

      // Get champion
      const { data: championData } = await supabase
        .from('champions')
        .select('id, user_id, season_id, position, users (full_name)')
        .eq('season_id', seasonData.id)
        .eq('position', 1)
        .single()

      if (championData) {
        setChampion({
          id: championData.id,
          user_id: championData.user_id,
          season_id: championData.season_id,
          full_name: championData.users?.[0]?.full_name || 'Champion',
          position: championData.position,
        })
      }

      // Get runners-up
      const { data: runnersData } = await supabase
        .from('champions')
        .select('id, user_id, season_id, position, users (full_name)')
        .eq('season_id', seasonData.id)
        .in('position', [2, 3, 4])
        .order('position', { ascending: true })

      if (runnersData) {
        setRunners(
          runnersData.map((r: any) => ({
            id: r.id,
            user_id: r.user_id,
            full_name: r.users?.[0]?.full_name || 'Participant',
            position: r.position,
          }))
        )
      }

      // Get stats
      const { count: activeCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('season_id', seasonData.id)
        .eq('status', 'approved')

      const { count: eliminatedCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('season_id', seasonData.id)
        .eq('status', 'eliminated')

      const { count: totalCount } = await supabase
        .from('applications')
        .select('id', { count: 'exact' })
        .eq('season_id', seasonData.id)

      setStats({
        total: totalCount || 0,
        active: activeCount || 0,
        eliminated: eliminatedCount || 0,
      })
    } catch (err) {
      console.error('Failed to load data:', err)
    } finally {
      setLoading(false)
    }
  }

  const isApplicationOpen = () => {
    if (!season) return false
    const today = new Date().toISOString().split('T')[0]
    return today >= season.application_start_date && today <= season.application_end_date
  }

  const getMedalColor = (position: number) => {
    if (position === 2) return 'border-l-4 border-slate-400'
    if (position === 3) return 'border-l-4 border-orange-500'
    return 'border-l-4 border-blue-500'
  }

  const getMedalBg = (position: number) => {
    if (position === 2) return 'bg-slate-50'
    if (position === 3) return 'bg-orange-50'
    return 'bg-blue-50'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-naija-green-200 border-t-naija-green-600 rounded-full"></div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* Logo Image - Replace the src path with your logo file */}
            <div className="w-16 h-16 bg-naija-green-600 rounded-lg flex items-center justify-center shadow-md overflow-hidden">
              <Image
                src="/logo.png"
                alt="Naija Ninja Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="font-bold text-gray-900 hidden sm:inline">Naija Ninja</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/leaderboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Leaderboard
            </Link>
            <Link href="/participants" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Participants
            </Link>
            <Link href="/merch" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Shop
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              About
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Login
            </Link>
            <Link href="/register" className="px-6 py-2 bg-naija-green-600 text-white text-sm font-semibold rounded-lg hover:bg-naija-green-700 transition">
              Apply
            </Link>
          </div>
        </div>
      </nav>

      {/* Application Status */}
      {season && (
        <div className={`${isApplicationOpen() ? 'bg-green-50 border-b border-green-200' : 'bg-amber-50 border-b border-amber-200'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 text-center text-sm font-medium">
            {isApplicationOpen() ? (
              <span className="text-green-700">Applications Open • Deadline: {new Date(season.application_end_date).toLocaleDateString()}</span>
            ) : (
              <span className="text-amber-700">Applications Closed • Next season opening soon</span>
            )}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative overflow-hidden">
        {/* NNW Watermark - Full Width */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <div className="text-[400px] font-black text-naija-green-100 opacity-30">
            NNW
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Content */}
          <div>
            <div className="inline-block px-3 py-1 bg-naija-green-100 text-naija-green-700 text-xs font-bold rounded-full mb-6">
              SEASON {season?.year}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Test Your Limits
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Nigeria's premier physical competition. Compete against the best, push your boundaries, and claim your place in history.
            </p>
            <div className="flex gap-4">
              <Link
                href="/register"
                className="px-8 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition flex items-center gap-2"
              >
                Apply Now
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/leaderboard"
                className="px-8 py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 transition"
              >
                View Leaderboard
              </Link>
            </div>
          </div>

          {/* Right: Champion Showcase */}
          <div className="flex items-center justify-center">
            {champion ? (
              <div className="w-full max-w-sm">
                <div className="bg-gray-900 rounded-2xl overflow-hidden">
                  {/* Champion Photo Area */}
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                    {/* Silhouette */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="text-[200px]">👤</div>
                    </div>
                    {/* Question Mark */}
                    <div className="relative z-10 text-[120px] text-gray-700">?</div>
                  </div>
                  {/* Info */}
                  <div className="p-8 bg-gray-900 text-white">
                    <p className="text-sm font-semibold text-gray-400 mb-2">REIGNING CHAMPION</p>
                    <h2 className="text-3xl font-bold mb-1">{champion.full_name}</h2>
                    <p className="text-sm text-gray-400">Season {season?.year}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-sm">
                <div className="bg-gray-900 rounded-2xl overflow-hidden">
                  <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <div className="text-[200px]">👤</div>
                    </div>
                    <div className="relative z-10 text-[120px] text-gray-600">?</div>
                  </div>
                  <div className="p-8 bg-gray-900 text-white">
                    <p className="text-sm font-semibold text-gray-400 mb-2">NEXT CHAMPION</p>
                    <h2 className="text-3xl font-bold mb-1">Could Be You</h2>
                    <p className="text-sm text-gray-400">Apply now and make history</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto justify-center text-center px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-naija-green-600 mb-2">{stats.total}</div>
            <p className="text-gray-600 font-medium">Total Warriors</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-900 mb-2">{stats.active}</div>
            <p className="text-gray-600 font-medium">Competing</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-gray-400 mb-2">{stats.eliminated}</div>
            <p className="text-gray-600 font-medium">Eliminated</p>
          </div>
        </div>
      </section>

      {/* Top Performers */}
      {runners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Performers</h2>
            <p className="text-gray-600">Rising stars and runners-up</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {runners.map(runner => (
              <div key={runner.id} className={`p-6 rounded-lg ${getMedalBg(runner.position)} ${getMedalColor(runner.position)}`}>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-gray-900 text-white text-xs font-bold rounded-full">
                    #{runner.position}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{runner.full_name}</h3>
                <p className="text-sm text-gray-600 mt-2">
                  {runner.position === 2 ? 'Runner Up' : runner.position === 3 ? 'Third Place' : 'Fourth Place'}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* View All Participants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Top Competitors</h2>
          <p className="text-gray-600">The leaders in this season's competition</p>
        </div>

        {/* Top 3 Positions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* 1st Place */}
          <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
            <div className="text-3xl font-bold text-yellow-700 mb-1">1st</div>
            <p className="text-sm text-yellow-600 font-medium">
              {champion ? champion.full_name : 'Waiting for champion...'}
            </p>
            {!champion && <p className="text-xs text-yellow-500 mt-2">Champion to be determined</p>}
          </div>

          {/* 2nd Place */}
          <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
            <div className="text-3xl font-bold text-slate-700 mb-1">2nd</div>
            <p className="text-sm text-slate-600 font-medium">
              {runners.length > 0 && runners[0] ? runners[0].full_name : 'Waiting for runner-up...'}
            </p>
            {(!runners.length || !runners[0]) && <p className="text-xs text-slate-500 mt-2">Runner-up to be determined</p>}
          </div>

          {/* 3rd Place */}
          <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-700 mb-1">3rd</div>
            <p className="text-sm text-orange-600 font-medium">
              {runners.length > 1 && runners[1] ? runners[1].full_name : 'Waiting for top performer...'}
            </p>
            {(!runners.length || runners.length < 2 || !runners[1]) && <p className="text-xs text-orange-500 mt-2">Competitor to be determined</p>}
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/participants"
            className="inline-flex items-center gap-2 px-8 py-3 border-2 border-gray-200 text-gray-900 font-semibold rounded-lg hover:border-gray-300 transition"
          >
            <Users size={20} />
            View All Participants
          </Link>
        </div>
      </section>

      {/* Sponsors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-12 text-center">Supported By</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { name: 'Nike' },
            { name: 'Gatorade' },
            { name: 'Red Bull' },
            { name: 'MTN' },
          ].map((sponsor, idx) => (
            <div key={idx} className="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <p className="font-semibold text-gray-900">{sponsor.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Video Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Event Highlights</h2>
          <p className="text-gray-600">Watch epic moments from past competitions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: 'Finals Showdown', video: 'dQw4w9WgXcQ' },
            { title: 'Champion\'s Journey', video: 'dQw4w9WgXcQ' },
            { title: 'Epic Moments', video: 'dQw4w9WgXcQ' },
          ].map((video, idx) => (
            <div key={idx} className="rounded-lg overflow-hidden border border-gray-100 hover:border-gray-200 transition">
              <div className="aspect-video bg-gray-200">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${video.video}`}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h2>
          <p className="text-gray-600">Find answers to common questions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              question: 'How do I apply?',
              answer: 'Click the Apply button, fill out your information, and submit a short video and photos. Our team reviews and approves within 48 hours.'
            },
            {
              question: 'What are the age requirements?',
              answer: 'You must be 18 years or older to compete. Nigerian citizenship or residency is required.'
            },
            {
              question: 'How many stages are there?',
              answer: 'There are 3 competition stages: Elimination Round, Semi-Finals, and Finals. Only top performers advance.'
            },
            {
              question: 'Where can I train?',
              answer: 'Visit our Training Gyms section on the About page to find certified Ninja training locations near you.'
            },
            {
              question: 'What happens if I get eliminated?',
              answer: 'Eliminated participants are recognized on the leaderboard and can apply for the next season.'
            },
            {
              question: 'Are there prizes?',
              answer: 'Yes! Winners receive cash prizes, sponsorship deals, and the prestigious title of Naija Ninja Warrior Champion.'
            },
          ].map((faq, idx) => (
            <div key={idx} className="p-6 bg-gray-50 rounded-lg border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-3">{faq.question}</h3>
              <p className="text-gray-600 text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Enquiry Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Got Questions?</h2>
            <p className="text-gray-600">Send us your inquiry and we'll get back to you shortly</p>
          </div>

          <form className="space-y-6 bg-gray-50 p-8 rounded-lg border border-gray-100">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Name</label>
              <input
                type="text"
                placeholder="Your full name"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Subject</label>
              <input
                type="text"
                placeholder="What is this about?"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
              <textarea
                rows={4}
                placeholder="Your message..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-naija-green-600 transition resize-none"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full px-8 py-3 bg-naija-green-600 text-white font-semibold rounded-lg hover:bg-naija-green-700 transition"
            >
              Send Inquiry
            </button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100">
        <div className="bg-naija-green-600 rounded-2xl p-12 md:p-16 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Compete?</h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            {champion
              ? `Can you dethrone ${champion.full_name}? Join hundreds of warriors and prove yourself.`
              : 'Be the first to claim the champion title. Apply now and make history.'}
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-naija-green-600 font-bold rounded-lg hover:bg-green-50 transition"
          >
            Apply Now
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-600 text-sm">
          <p>© 2025 Naija Ninja Warrior. Challenge yourself. Become a legend.</p>
        </div>
      </footer>
    </main>
  )
}