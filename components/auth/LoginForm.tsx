'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import styles from '@/components/sections/nnw/nnw.module.css'
import aStyles from '@/components/module/auth.module.css'

export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!formData.email.includes('@')) {
      toast.error('Valid email is required')
      setLoading(false)
      return
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters')
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
        toast.error(error.message)
        setLoading(false)
        return
      }

      if (!data.user) {
        toast.error('Login failed')
        setLoading(false)
        return
      }

      // Get user role from users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role, must_change_password')
        .eq('id', data.user.id)
        .single()

      if (userError) {
        toast.error('Failed to load user data')
        setLoading(false)
        return
      }

      // Block admins and investors from the public login page
      // Do this BEFORE showing any success message — sign out immediately
      // and redirect to their correct portal with a neutral message
      const isProd = !window.location.hostname.includes('localhost')
      const encodedEmail = encodeURIComponent(formData.email)

      if (userData.role === 'admin') {
        await supabase.auth.signOut()
        toast.info(isProd ? 'Admin portal: admin.naijaninja.net' : 'Admin portal: /admin/login')
        window.location.href = isProd
          ? `https://admin.naijaninja.net/login?email=${encodedEmail}`
          : `/admin/login?email=${encodedEmail}`
        return
      }

      if (userData.role === 'investor') {
        await supabase.auth.signOut()
        toast.info(isProd ? 'Investor portal: investor.naijaninja.net' : 'Investor portal: /investor/login')
        window.location.href = isProd
          ? `https://investor.naijaninja.net/login?email=${encodedEmail}`
          : `/investor/login?email=${encodedEmail}`
        return
      }

      // Regular users only
      toast.success('Login successful! Redirecting...')
      window.location.href = '/user/dashboard'
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div>
      <div className={aStyles['form-badge']}>
        <span className={styles.dot} style={{ background: 'var(--green)' }} />
        <span className={aStyles['form-badge-text']}>Warrior Sign In</span>
      </div>
      <h2 className={`${styles.display} ${aStyles['form-title']}`}>Welcome back.</h2>
      <p className={aStyles['form-sub']}>Sign in to track your zone round, your standing, and your season.</p>

      <form onSubmit={handleSubmit}>
        <div className={aStyles['a-group']}>
          <label className={aStyles['a-label']}>Email</label>
          <div className={aStyles['input-wrap']}>
            <span className={aStyles['input-icon']}><Mail size={15} /></span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className={aStyles['a-input']}
            />
          </div>
        </div>

        <div className={aStyles['a-group']}>
          <label className={aStyles['a-label']}>Password</label>
          <div className={aStyles['input-wrap']}>
            <span className={aStyles['input-icon']}><Lock size={15} /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={aStyles['a-input']}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className={aStyles['input-suffix-btn']}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <div className={aStyles['row-between']}>
          <div className={aStyles['remember-row']}>
            <button
              type="button"
              onClick={() => setRemember(!remember)}
              style={{
                width: 19, height: 19, borderRadius: 4, border: `1.5px solid ${remember ? 'var(--green)' : 'var(--line)'}`,
                background: remember ? 'var(--green)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}
            >
              {remember && <Check size={12} color="var(--bone)" strokeWidth={3} />}
            </button>
            <span onClick={() => setRemember(!remember)} style={{ cursor: 'pointer' }}>Remember me</span>
          </div>
          <Link href="/forgot-password" className={aStyles['link-mono']}>Forgot password?</Link>
        </div>

        <button type="submit" disabled={loading} className={`${styles.btn} ${styles['btn-gold']}`} style={{ width: '100%' }}>
          {loading ? 'Signing in…' : <>Sign In <ArrowRight size={16} /></>}
        </button>

        <div className={aStyles['switch-line']}>
          New warrior?<Link href="/register">Apply for Season 1</Link>
        </div>
      </form>
    </div>
  )
}