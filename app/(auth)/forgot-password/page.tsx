'use client'

import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default function ForgotPasswordPage() {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-naija-green-900 mb-2">Reset Your Password</h1>
        <p className="text-gray-600">Enter your email to receive a password reset link</p>
      </div>

      {/* Form */}
      <ForgotPasswordForm />

      {/* Footer Note */}
      <p className="text-xs text-gray-500 text-center mt-6">
        Remember your password? <a href="/login" className="text-naija-green-600 hover:text-naija-green-700 font-semibold">Login here</a>
      </p>
    </div>
  )
}