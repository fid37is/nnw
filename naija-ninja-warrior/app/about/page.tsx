'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden">
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
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/leaderboard" className="text-gray-600 hover:text-gray-900">Leaderboard</Link>
            <Link href="/participants" className="text-gray-600 hover:text-gray-900">Participants</Link>
            <Link href="/merch" className="text-gray-600 hover:text-gray-900">Shop</Link>
            <Link href="/about" className="text-naija-green-600">About</Link>
          </div>
          <Link href="/register" className="px-6 py-2 bg-naija-green-600 text-white text-sm font-semibold rounded-lg hover:bg-naija-green-700">
            Apply
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">About</h1>
          <p className="text-gray-600">Learn about Naija Ninja Warrior</p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To provide a world-class platform where Nigerians can test their physical abilities, compete at the highest level, and achieve recognition for their warrior spirit and determination.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To build a global movement of elite athletes who inspire millions, break barriers, and represent Nigeria on the world stage as champions of strength and endurance.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: 1, title: 'Apply Online', desc: 'Submit your video & photos' },
              { step: 2, title: 'Get Approved', desc: 'Review within 48 hours' },
              { step: 3, title: 'Train Hard', desc: 'Prepare at certified gyms' },
              { step: 4, title: 'Compete', desc: 'Face challenges & climb ranks' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 bg-naija-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Requirements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-bold text-gray-900 mb-4">To Compete</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Must be 18+ years old</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Nigerian citizen or resident</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Good physical health</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-600">Commitment to training</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-4">Disqualifying Factors</h3>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span className="text-gray-600">Serious health conditions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span className="text-gray-600">Previous doping violations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span className="text-gray-600">Criminal record</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-red-600 font-bold">✗</span>
                  <span className="text-gray-600">Incomplete forms</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Competition Stages */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Stages</h2>
          <div className="space-y-4">
            {[
              { stage: '01', name: 'Elimination Round', desc: 'Initial challenges to determine fitness' },
              { stage: '02', name: 'Semi-Finals', desc: 'Advanced obstacles testing agility & strength' },
              { stage: '03', name: 'Finals', desc: 'Ultimate challenge for the championship' },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-naija-green-600">{item.stage}</div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Training Locations */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Training Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Lagos Academy', location: 'Victoria Island', phone: '+234 123 456 7890', hours: '6AM - 10PM' },
              { name: 'Abuja Gym', location: 'Wuse', phone: '+234 234 567 8901', hours: '6AM - 9PM' },
              { name: 'Ibadan Elite', location: 'Jericho', phone: '+234 345 678 9012', hours: '7AM - 8PM' },
              { name: 'Port Harcourt Hub', location: 'Lekki', phone: '+234 456 789 0123', hours: '6AM - 9PM' },
              { name: 'Kano Center', location: 'Sabon Gari', phone: '+234 567 890 1234', hours: '6AM - 8PM' },
              { name: 'Enugu Zone', location: 'Independence', phone: '+234 678 901 2345', hours: '7AM - 9PM' },
            ].map((gym, i) => (
              <div key={i} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-2">{gym.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{gym.location}</p>
                <p className="text-sm font-medium text-naija-green-600 mb-2">{gym.phone}</p>
                <p className="text-xs text-gray-500">{gym.hours}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-naija-green-600 text-white rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to compete?</h2>
          <p className="text-green-100 mb-8">Join warriors from across Nigeria</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-lg hover:bg-green-50">
            Apply Now
          </Link>
        </div>
      </div>
    </main>
  )
}