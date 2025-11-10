'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validation
    if (!formData.email.includes('@')) {
      setError('Valid email is required')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      // Sign in with Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        setError('Login failed')
        setLoading(false)
        return
      }

      // Get user role from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (userError) {
        setError('Failed to load user data')
        setLoading(false)
        return
      }

      // Redirect based on role
      const redirectPath = userData.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'
      window.location.href = redirectPath
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-slide-up">
      {/* Error Message */}
      {error && (
        <div className="bg-naija-red/10 border border-naija-red/30 text-naija-red px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Email Field */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
        />
      </div>

      {/* Password Field */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-semibold text-gray-700">Password</label>
          <Link
            href="/forgot-password"
            className="text-xs text-naija-green-600 hover:text-naija-green-700 font-semibold"
          >
            Forgot password?
          </Link>
        </div>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:border-naija-green-600 focus:ring-2 focus:ring-naija-green-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-naija-green-600 transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Remember Me */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="remember"
          className="w-4 h-4 rounded border-gray-300 text-naija-green-600"
        />
        <label htmlFor="remember" className="text-sm text-gray-700">
          Remember me on this device
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-3 rounded-lg bg-naija-green-600 text-white font-semibold hover:bg-naija-green-700 transition disabled:opacity-50 mt-8"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/register" className="text-naija-green-600 font-semibold hover:text-naija-green-700">
          Sign up here
        </Link>
      </p>
    </form>
  )
}