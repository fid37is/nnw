'use client'

import RegisterForm from '@/components/auth/RegisterForm'

export default function RegisterPage() {
  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-naija-green-900 mb-2">Join the Challenge</h1>
        <p className="text-gray-600">Complete all steps to submit your application</p>
      </div>

      {/* Form */}
      <RegisterForm />
    </div>
  )
}