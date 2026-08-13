'use client'

import Link from 'next/link'
import { ArrowLeft, Dumbbell, Users, Award, Mail } from '@/components/ui/icons'

export default function TrainingPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden pt-32">

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">

        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <Dumbbell size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Training Centers</h1>
          </div>
          <p className="text-xl text-gray-600">Official NNW Certified Facilities Across Nigeria</p>
        </div>

        {/* Intro banner */}
        <div className="bg-naija-green-600 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Train Like a Warrior</h2>
          <p className="text-lg text-green-50 leading-relaxed mb-8">
            NNW is building a nationwide network of certified training centers - purpose-built for ninja-style competition prep, strength development, and athletic excellence. Each facility will feature competition-grade obstacles, professional coaching, and structured programs for all levels.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-lg p-4">
              <Users className="mb-2" size={28} />
              <p className="font-bold mb-1">Expert Coaches</p>
              <p className="text-green-100 text-sm">Certified trainers with competition experience</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Dumbbell className="mb-2" size={28} />
              <p className="font-bold mb-1">Full Equipment</p>
              <p className="text-green-100 text-sm">Competition-grade obstacles and training gear</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <Award className="mb-2" size={28} />
              <p className="font-bold mb-1">Structured Programs</p>
              <p className="text-green-100 text-sm">From beginner to elite competition preparation</p>
            </div>
          </div>
        </div>

        {/* Centers - coming soon */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Find a Center Near You</h2>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center">
            <div className="w-14 h-14 bg-naija-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Dumbbell size={28} className="text-naija-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Locations Being Confirmed</h3>
            <p className="text-gray-500 mx-auto mb-8 leading-relaxed">
              Official NNW training centers are currently being certified across all six geopolitical zones. Locations will be published as they are confirmed.
            </p>
            <a
              href="mailto:training@naijaninja.net"
              className="inline-flex items-center gap-2 px-10 py-3.5 bg-naija-green-600 hover:bg-naija-green-700 text-white font-bold rounded-full transition"
            >
              <Mail size={16} />
              Get Notified When Available
            </a>
          </div>
        </div>

        {/* Training Programs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Training Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: 'Beginner Program',
                duration: '8 weeks',
                desc: 'Build foundational strength, learn basic ninja techniques, and develop proper form.',
                includes: ['3 sessions per week', 'Basic obstacle training', 'Strength fundamentals', 'Flexibility work'],
              },
              {
                title: 'Competition Prep',
                duration: '12 weeks',
                desc: 'Intensive training designed specifically for competition readiness and peak performance.',
                includes: ['5 sessions per week', 'Advanced obstacles', 'Competition simulation', 'Mental preparation'],
              },
              {
                title: 'Youth Development',
                duration: 'Ongoing',
                desc: 'Age-appropriate training for young athletes (13–17) focusing on skill development and character.',
                includes: ['2–3 sessions per week', 'Age-appropriate obstacles', 'Supervised training', 'Character building'],
              },
              {
                title: 'Elite Athlete',
                duration: 'Custom',
                desc: 'Personalized programming for advanced competitors seeking championship-level performance.',
                includes: ['Custom schedule', 'One-on-one coaching', 'Video analysis', 'Nutrition planning'],
              },
            ].map((program, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-xl">{program.title}</h3>
                  <span className="text-sm bg-naija-green-100 text-naija-green-700 px-3 py-1 rounded-full font-medium">
                    {program.duration}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 leading-relaxed">{program.desc}</p>
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Includes</p>
                  <ul className="space-y-1">
                    {program.includes.map((item, j) => (
                      <li key={j} className="flex gap-2 items-center text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-naija-green-600 rounded-full flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What to Expect */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What to Expect</h2>
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Your First Visit</h3>
                <ul className="space-y-3">
                  {[
                    'Facility tour and safety orientation',
                    'Fitness assessment and goal setting',
                    'Introduction to basic obstacles',
                    'Personalized training plan development',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-naija-green-600 font-bold">{i + 1}.</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">What to Bring</h3>
                <ul className="space-y-3">
                  {[
                    'Comfortable athletic wear',
                    'Proper training shoes (no sandals)',
                    'Water bottle and towel',
                    'Positive attitude and determination',
                  ].map((item, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-naija-green-600">✓</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-naija-green-600 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Journey</h2>
            <p className="text-lg text-green-50 mb-8">
              Register for the competition while we finalise training center locations. Our team will keep you updated as facilities come online near you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register"
                className="inline-block px-8 py-3 bg-white text-naija-green-700 font-bold rounded-full hover:bg-green-50 transition">
                Register for Competition
              </Link>
              <Link href="/contact"
                className="inline-block px-8 py-3 bg-naija-green-500 hover:bg-naija-green-400 text-white font-bold rounded-full border-2 border-white transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}