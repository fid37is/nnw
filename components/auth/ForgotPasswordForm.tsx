'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { ArrowLeft, Mail } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import aStyles from '@/components/module/auth.module.css'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!email.includes('@')) {
      toast.error('Please enter a valid email')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        toast.error(error.message)
        setLoading(false)
        return
      }

      setSent(true)
      toast.success('Password reset link sent to your email!')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div>
        <div className={aStyles['confirm-icon']}><Mail size={24} color="var(--green)" /></div>
        <h2 className={`${styles.display} ${aStyles['form-title']}`}>Check your email.</h2>
        <p className={aStyles['form-sub']}>
          If an account exists for <strong style={{ color: 'var(--navy)' }}>{email}</strong>, a password reset link
          is on its way — click the link in that email to set a new password.
        </p>
        <p style={{ fontSize: 13.5, color: 'rgba(var(--navy-rgb),0.58)', marginBottom: 22 }}>
          Didn&apos;t receive an email? Check your spam folder or{' '}
          <button onClick={() => setSent(false)} className={aStyles['link-mono']} style={{ display: 'inline' }}>try again</button>
        </p>
        <Link href="/login" className={aStyles['back-link']} style={{ marginBottom: 0 }}>
          <ArrowLeft size={13} /> Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className={aStyles['form-badge']}>
        <span className={styles.dot} style={{ background: 'var(--green)' }} />
        <span className={aStyles['form-badge-text']}>Password Reset</span>
      </div>
      <h2 className={`${styles.display} ${aStyles['form-title']}`}>Reset password.</h2>
      <p className={aStyles['form-sub']}>Enter your email and we&apos;ll send you a link to reset your password.</p>

      <form onSubmit={handleSubmit}>
        <div className={aStyles['a-group']}>
          <label className={aStyles['a-label']}>Email</label>
          <div className={aStyles['input-wrap']}>
            <span className={aStyles['input-icon']}><Mail size={15} /></span>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className={aStyles['a-input']}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className={`${styles.btn} ${styles['btn-gold']}`} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Sending…' : 'Send Reset Link'}
        </button>

        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <Link href="/login" className={aStyles['link-mono']} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </form>
    </div>
  )
}