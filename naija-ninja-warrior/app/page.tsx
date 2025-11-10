'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-naija-green-600 to-naija-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">NNW</span>
            </div>
            <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
          </div>
          <div className="flex gap-3">
            <Link
              href="/login"
              className="px-5 py-2 text-naija-green-700 font-semibold hover:text-naija-green-900 transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 bg-naija-green-600 text-white rounded-lg font-semibold hover:bg-naija-green-700 shadow-md hover:shadow-lg transition"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-naija-green-900 mb-4 leading-tight">
            Welcome to <span className="text-naija-green-600">Naija Ninja Warrior</span>
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Test your strength, agility, and determination. Apply now to compete in Nigeria's ultimate physical competition challenge.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-naija-green-600 text-white rounded-lg font-bold text-lg hover:bg-naija-green-700 shadow-lg hover:shadow-xl transition transform hover:scale-105"
          >
            Start Your Journey
          </Link>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-2 border border-naija-green-100">
            <div className="w-14 h-14 bg-naija-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">💪</span>
            </div>
            <h3 className="font-bold text-lg text-naija-green-900 mb-2">Test Your Strength</h3>
            <p className="text-gray-600">Push your physical limits and prove your worth on the obstacle course.</p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-2 border border-naija-green-100">
            <div className="w-14 h-14 bg-naija-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🎥</span>
            </div>
            <h3 className="font-bold text-lg text-naija-green-900 mb-2">Easy Application</h3>
            <p className="text-gray-600">Upload a short video and photos. Our team reviews and approves your application.</p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-2 border border-naija-green-100">
            <div className="w-14 h-14 bg-naija-green-100 rounded-xl flex items-center justify-center mb-4">
              <span className="text-2xl">🏆</span>
            </div>
            <h3 className="font-bold text-lg text-naija-green-900 mb-2">Win Glory</h3>
            <p className="text-gray-600">Compete for prizes, recognition, and the title of Naija Ninja Warrior champion.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-naija-green-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Compete?</h2>
          <p className="text-lg mb-8 text-naija-green-50">
            Join hundreds of warriors from across Nigeria. Apply today and show us what you're made of.
          </p>
          <Link
            href="/register"
            className="inline-block px-8 py-4 bg-white text-naija-green-600 rounded-lg font-bold text-lg hover:bg-naija-green-50 shadow-lg transition transform hover:scale-105"
          >
            Apply Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-naija-green-900 text-white py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-naija-green-200">© 2025 Naija Ninja Warrior. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}