'use client'

import Link from 'next/link'
import { ArrowLeft, Info, Award, Globe, Target, Users } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <Info size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">About Naija Ninja Warrior</h1>
          </div>
          <p className="text-xl text-gray-600">Africa's First Ninja Competition Series</p>
        </div>

        {/* Hero Statement */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Strength. Speed. Spirit.</h2>
          <p className="text-lg text-green-50 leading-relaxed">
            Naija Ninja Warrior is a groundbreaking national fitness and entertainment challenge, adapted from the globally successful Ninja Warrior franchise and tailored for the Nigerian audience. Our competition showcases extraordinary athletes across all 6 geopolitical zones, celebrating the resilience, determination, and warrior spirit of Nigeria.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg max-w-none text-gray-700">
            <p className="leading-relaxed mb-4">
              Naija Ninja Warrior was born from a vision to create a platform where Nigerians can test their physical limits, compete at the highest level, and inspire millions across the continent. We recognized that Nigeria, with its young, vibrant population and growing entertainment industry, was the perfect place to launch Africa's first ninja competition series.
            </p>
            <p className="leading-relaxed">
              The global success of Ninja Warrior franchises worldwide proved that audiences crave authentic displays of human determination and athletic excellence. We're bringing that same excitement to Nigeria while celebrating our unique culture, diversity, and indomitable spirit.
            </p>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="w-12 h-12 bg-naija-green-100 rounded-lg flex items-center justify-center mb-4">
              <Target className="text-naija-green-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To provide a world-class platform where Nigerians can test their physical abilities, compete at the highest level, and achieve recognition for their warrior spirit and determination. We inspire millions while promoting fitness, perseverance, and national pride.
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
            <div className="w-12 h-12 bg-naija-green-100 rounded-lg flex items-center justify-center mb-4">
              <Globe className="text-naija-green-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To build a movement of elite athletes who inspire millions, break barriers, and represent Nigeria on the world stage as champions of strength and endurance. We envision expanding across the continent as the "Africa Ninja Challenge."
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { 
                icon: <Award size={24} />,
                title: 'Excellence', 
                desc: 'We strive for the highest standards in every aspect of our competition, from course design to athlete care.',
                color: 'bg-blue-100 text-blue-600'
              },
              { 
                icon: <Users size={24} />,
                title: 'Inclusivity', 
                desc: 'Our platform welcomes athletes from all backgrounds, celebrating Nigeria\'s diversity and unity.',
                color: 'bg-green-100 text-green-600'
              },
              { 
                icon: <Target size={24} />,
                title: 'Integrity', 
                desc: 'Fair competition, transparent judging, and respect for all participants are foundational to everything we do.',
                color: 'bg-purple-100 text-purple-600'
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

        {/* What Makes Us Different */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">What Makes Us Different</h2>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Nationwide Coverage</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We're not just a Lagos or Abuja event. Our competition spans all 6 geopolitical zones, giving every Nigerian the opportunity to compete and showcase their abilities on a national stage.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Cultural Authenticity</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  While inspired by the global Ninja Warrior format, we've adapted the competition to reflect Nigerian culture, values, and the unique athletic spirit of our people.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Professional Production</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our competition features world-class course design, professional broadcasting, and comprehensive athlete support to ensure every participant has the best possible experience.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-xl">Community Impact</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Beyond entertainment, we're building a fitness movement that encourages healthy living, discipline, and personal development across Nigeria.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Movement</h2>
            <p className="text-lg text-green-50 mb-8">
              Whether you're an aspiring competitor, a fitness enthusiast, or someone looking to support Nigerian excellence, there's a place for you in the Naija Ninja Warrior community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition">
                Apply as Competitor
              </Link>
              <Link href="/contact" className="inline-block px-8 py-3 bg-naija-green-500 text-white font-bold rounded-full hover:bg-naija-green-400 border-2 border-white transition">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}