'use client'

import Link from 'next/link'
import { ArrowLeft, MapPin, Phone, Clock, Dumbbell, Users, Award } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function TrainingPage() {
  const trainingCenters = [
    { 
      name: 'Lagos Ninja Academy', 
      location: 'Victoria Island, Lagos', 
      address: '15 Akin Adesola Street, Victoria Island',
      phone: '+234 123 456 7890', 
      hours: '6:00 AM - 10:00 PM',
      facilities: ['Full obstacle course', 'Weight training', 'Cardio equipment', 'Personal trainers'],
      zone: 'South West'
    },
    { 
      name: 'Abuja Elite Gym', 
      location: 'Wuse 2, Abuja', 
      address: '23 Adetokunbo Ademola Crescent, Wuse 2',
      phone: '+234 234 567 8901', 
      hours: '6:00 AM - 9:00 PM',
      facilities: ['Ninja obstacles', 'CrossFit area', 'Climbing wall', 'Group classes'],
      zone: 'North Central'
    },
    { 
      name: 'Ibadan Warrior Center', 
      location: 'Jericho, Ibadan', 
      address: '45 Mokola Road, Jericho',
      phone: '+234 345 678 9012', 
      hours: '7:00 AM - 8:00 PM',
      facilities: ['Outdoor course', 'Strength training', 'Agility drills', 'Coaching'],
      zone: 'South West'
    },
    { 
      name: 'Port Harcourt Fitness Hub', 
      location: 'GRA Phase 2, Port Harcourt', 
      address: '12 Aba Road, GRA Phase 2',
      phone: '+234 456 789 0123', 
      hours: '6:00 AM - 9:00 PM',
      facilities: ['Modern equipment', 'Ninja training', 'Nutritionist', 'Recovery zone'],
      zone: 'South South'
    },
    { 
      name: 'Kano Strength Center', 
      location: 'Sabon Gari, Kano', 
      address: '78 Murtala Mohammed Way, Sabon Gari',
      phone: '+234 567 890 1234', 
      hours: '6:00 AM - 8:00 PM',
      facilities: ['Training obstacles', 'Gym equipment', 'Group sessions', 'Youth programs'],
      zone: 'North West'
    },
    { 
      name: 'Enugu Performance Zone', 
      location: 'Independence Layout, Enugu', 
      address: '34 Okpara Avenue, Independence Layout',
      phone: '+234 678 901 2345', 
      hours: '7:00 AM - 9:00 PM',
      facilities: ['Competition prep', 'Technique training', 'Mental coaching', 'Recovery'],
      zone: 'South East'
    },
  ]

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
            <Dumbbell size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Training Centers</h1>
          </div>
          <p className="text-xl text-gray-600">Certified Facilities Across Nigeria</p>
        </div>

        {/* Intro */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Train Like a Warrior</h2>
          <p className="text-lg text-green-50 leading-relaxed mb-6">
            Our certified training centers provide world-class facilities and expert coaching to help you prepare for the competition. Each location features ninja-specific obstacles, strength training equipment, and experienced trainers who understand what it takes to succeed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Users className="mb-2" size={28} />
              <p className="font-bold mb-1">Expert Coaches</p>
              <p className="text-green-100 text-sm">Certified trainers with competition experience</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Dumbbell className="mb-2" size={28} />
              <p className="font-bold mb-1">Full Equipment</p>
              <p className="text-green-100 text-sm">Competition-grade obstacles and training gear</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <Award className="mb-2" size={28} />
              <p className="font-bold mb-1">Proven Results</p>
              <p className="text-green-100 text-sm">Past competitors trained at our facilities</p>
            </div>
          </div>
        </div>

        {/* Training Centers Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Find a Center Near You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingCenters.map((center, i) => (
              <div key={i} className="bg-white rounded-xl border-2 border-gray-200 hover:border-naija-green-400 transition overflow-hidden">
                <div className="bg-naija-green-600 text-white px-6 py-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{center.name}</h3>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">{center.zone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-50 text-sm">
                    <MapPin size={14} />
                    <span>{center.location}</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                      <span>{center.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-naija-green-600" />
                      <a href={`tel:${center.phone}`} className="text-naija-green-600 font-medium hover:underline">
                        {center.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock size={16} />
                      <span>{center.hours}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-500 mb-2">FACILITIES:</p>
                    <div className="flex flex-wrap gap-2">
                      {center.facilities.map((facility, j) => (
                        <span key={j} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-700">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                includes: ['3 sessions per week', 'Basic obstacle training', 'Strength fundamentals', 'Flexibility work']
              },
              {
                title: 'Competition Prep',
                duration: '12 weeks',
                desc: 'Intensive training designed specifically for competition readiness and peak performance.',
                includes: ['5 sessions per week', 'Advanced obstacles', 'Competition simulation', 'Mental preparation']
              },
              {
                title: 'Youth Development',
                duration: 'Ongoing',
                desc: 'Age-appropriate training for young athletes (13-17) focusing on skill development.',
                includes: ['2-3 sessions per week', 'Age-appropriate obstacles', 'Supervised training', 'Character building']
              },
              {
                title: 'Elite Athlete',
                duration: 'Custom',
                desc: 'Personalized programming for advanced competitors seeking championship-level performance.',
                includes: ['Custom schedule', 'One-on-one coaching', 'Video analysis', 'Nutrition planning']
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
                  <p className="text-xs font-semibold text-gray-500 mb-2">INCLUDES:</p>
                  <ul className="space-y-1">
                    {program.includes.map((item, j) => (
                      <li key={j} className="flex gap-2 items-center text-sm text-gray-700">
                        <span className="w-1.5 h-1.5 bg-naija-green-600 rounded-full"></span>
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
          <div className="bg-blue-50 rounded-xl p-8 border border-blue-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Your First Visit</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <span className="text-naija-green-600 font-bold">1.</span>
                    <span className="text-gray-700">Facility tour and safety orientation</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-naija-green-600 font-bold">2.</span>
                    <span className="text-gray-700">Fitness assessment and goal setting</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-naija-green-600 font-bold">3.</span>
                    <span className="text-gray-700">Introduction to basic obstacles</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-naija-green-600 font-bold">4.</span>
                    <span className="text-gray-700">Personalized training plan development</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4 text-lg">What to Bring</h3>
                <ul className="space-y-3">
                  <li className="flex gap-3 items-start">
                    <span className="text-naija-green-600">✓</span>
                    <span className="text-gray-700">Comfortable athletic wear</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-naija-green-600">✓</span>
                    <span className="text-gray-700">Proper training shoes (no sandals)</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-naija-green-600">✓</span>
                    <span className="text-gray-700">Water bottle and towel</span>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="text-naija-green-600">✓</span>
                    <span className="text-gray-700">Positive attitude and determination</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Journey Today</h2>
            <p className="text-lg text-green-50 mb-8">
              Contact a training center near you to schedule your first session and begin preparing for the competition of a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition">
                Register for Competition
              </Link>
              <Link href="/contact" className="inline-block px-8 py-3 bg-naija-green-500 text-white font-bold rounded-full hover:bg-naija-green-400 border-2 border-white transition">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}