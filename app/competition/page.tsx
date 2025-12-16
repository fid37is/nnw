'use client'

import Link from 'next/link'
import { ArrowLeft, Trophy, MapPin, Calendar, Users, Award, Target } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function CompetitionPage() {
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
            <Trophy size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Competition Format</h1>
          </div>
          <p className="text-xl text-gray-600">How Naija Ninja Warrior Works</p>
        </div>

        {/* Overview */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">The Ultimate Test of Strength & Will</h2>
          <p className="text-lg text-green-50 leading-relaxed">
            Naija Ninja Warrior is a multi-stage competition that tests athletes across speed, strength, agility, and mental toughness. Competitors face increasingly difficult obstacle courses, with only the best advancing to the Grand Finale in Abuja.
          </p>
        </div>

        {/* Competition Structure */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Competition Structure</h2>
          <div className="space-y-6">
            {[
              { 
                stage: '01', 
                name: 'Regional Qualifiers', 
                icon: <MapPin size={24} />,
                desc: 'Six regional competitions across Nigeria\'s geopolitical zones. Athletes compete on challenging obstacle courses with timed runs. Top performers from each region advance to the semi-finals.',
                details: ['Duration: 2-3 days per region', 'Top 20 competitors advance', 'Obstacles: 6-8 challenges']
              },
              { 
                stage: '02', 
                name: 'Semi-Finals', 
                icon: <Users size={24} />,
                desc: 'Top regional performers compete in more advanced courses testing agility, upper body strength, and mental determination. Only the elite move forward to represent their regions.',
                details: ['Duration: 1 week', 'Top 30 competitors advance', 'Obstacles: 10-12 challenges']
              },
              { 
                stage: '03', 
                name: 'Grand Finale', 
                icon: <Award size={24} />,
                desc: 'The ultimate showdown in Abuja. Nigeria\'s best ninja warriors face the most difficult course for championship glory and national recognition.',
                details: ['Duration: 3 days', 'Final 30 competitors', 'Obstacles: 15+ challenges', 'Live broadcast nationwide']
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-naija-green-300 transition">
                <div className="flex-shrink-0">
                  <div className="text-3xl font-bold text-naija-green-600 mb-4">{item.stage}</div>
                  <div className="w-12 h-12 bg-naija-green-100 rounded-lg flex items-center justify-center">
                    <div className="text-naija-green-600">{item.icon}</div>
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-900 text-2xl mb-3">{item.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{item.desc}</p>
                  <div className="flex flex-wrap gap-3">
                    {item.details.map((detail, j) => (
                      <span key={j} className="text-sm bg-white px-3 py-1.5 rounded-full text-gray-700 border border-gray-200">
                        {detail}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Obstacle Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Obstacle Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                title: 'Speed & Agility', 
                desc: 'Quick steps, balance beams, and precision jumps that test reaction time and footwork.',
                examples: 'Quintuple Steps, Rolling Log, Spinning Bridge'
              },
              { 
                title: 'Upper Body Strength', 
                desc: 'Hanging obstacles requiring grip strength, arm endurance, and strategic technique.',
                examples: 'Salmon Ladder, Flying Bar, Ring Swing'
              },
              { 
                title: 'Balance & Precision', 
                desc: 'Narrow platforms and unstable surfaces demanding focus and body control.',
                examples: 'Warped Wall, Balance Tank, Floating Steps'
              },
              { 
                title: 'Grip & Endurance', 
                desc: 'Extended hanging challenges that drain arm strength and test mental fortitude.',
                examples: 'Cliffhanger, Spider Climb, Cargo Net'
              },
              { 
                title: 'Power Moves', 
                desc: 'Explosive strength obstacles requiring bursts of power and momentum.',
                examples: 'Warped Wall, Box Jump, Swing Kick'
              },
              { 
                title: 'Mental Challenges', 
                desc: 'Complex sequences requiring strategy, timing, and problem-solving under pressure.',
                examples: 'Puzzle Course, Timed Combination, Memory Maze'
              },
            ].map((obstacle, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-naija-green-400 transition">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">{obstacle.title}</h3>
                <p className="text-sm text-gray-600 mb-3 leading-relaxed">{obstacle.desc}</p>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 mb-1">Examples:</p>
                  <p className="text-xs text-gray-600">{obstacle.examples}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Judging & Scoring */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Judging & Scoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">How We Judge</h3>
              <ul className="space-y-3">
                <li className="flex gap-3 items-start">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Competitors are timed from start to finish or until elimination</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Falling or touching water results in immediate elimination</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">Furthest distance + fastest time determines advancement</span>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-naija-green-600 font-bold">✓</span>
                  <span className="text-gray-700">All decisions are final and reviewed by certified judges</span>
                </li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-8 border border-green-200">
              <h3 className="font-bold text-gray-900 mb-4 text-xl">Fair Competition</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We maintain the highest standards of fairness and transparency. Multiple camera angles capture every moment, and certified judges review all runs to ensure accurate results.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Athletes compete in age and skill brackets to ensure competitive balance, with special categories for veterans, women, and youth competitors.
              </p>
            </div>
          </div>
        </div>

        {/* Prizes & Recognition */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Prizes & Recognition</h2>
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 border border-amber-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Trophy className="text-yellow-900" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Champion</h3>
                <p className="text-2xl font-bold text-naija-green-600 mb-2">₦5,000,000</p>
                <p className="text-sm text-gray-600">Trophy + National Recognition</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Award className="text-gray-700" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Runner-Up</h3>
                <p className="text-2xl font-bold text-naija-green-600 mb-2">₦2,500,000</p>
                <p className="text-sm text-gray-600">Medal + Recognition</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Target className="text-orange-800" size={32} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Third Place</h3>
                <p className="text-2xl font-bold text-naija-green-600 mb-2">₦1,000,000</p>
                <p className="text-sm text-gray-600">Medal + Recognition</p>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-amber-300 text-center">
              <p className="text-gray-700">All finalists receive certificates, merchandise, and eligibility for sponsorship opportunities</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Compete?</h2>
            <p className="text-lg text-green-50 mb-8">
              Think you have what it takes to become Nigeria's next Ninja Warrior? Register now and test yourself against the best.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition">
                Register Now
              </Link>
              <Link href="/training" className="inline-block px-8 py-3 bg-naija-green-500 text-white font-bold rounded-full hover:bg-naija-green-400 border-2 border-white transition">
                Find Training Centers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}