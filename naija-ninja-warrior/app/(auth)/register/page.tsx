'use client'

import Link from 'next/link'
import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-naija-green-50 to-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-naija-green-100">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-naija-green-600 to-naija-green-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">NNW</span>
            </div>
            <span className="font-bold text-lg text-naija-green-900">Naija Ninja</span>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-naija-green-900 mb-2">Join the Challenge</h1>
            <p className="text-gray-600">Complete all steps to submit your application</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-naija-green-100">
            <RegisterForm />
          </div>

          {/* Footer Note */}
          <p className="text-xs text-gray-500 text-center mt-6">
            By registering, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </main>
  )
}