'use client'

import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-naija-green-900 mb-2">Welcome Back</h1>
        <p className="text-gray-600">Login to your Naija Ninja Warrior account</p>
      </div>

      {/* Form */}
      <LoginForm />

      {/* Pro Tip */}
      <div className="mt-8 bg-naija-green-50 rounded-lg p-4 border border-naija-green-100">
        <p className="text-xs text-gray-700">
          <span className="font-semibold text-naija-green-700">Pro Tip:</span> After login, you can track your application status and upload your video for the competition.
        </p>
      </div>
    </div>
  )
}