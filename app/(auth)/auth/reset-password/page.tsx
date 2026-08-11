'use client'

/* eslint-disable @typescript-eslint/no-unused-vars */

// File: app/(auth)/auth/reset-password/page.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import { Eye, EyeOff, Lock, Check, X } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import aStyles from '@/components/module/auth.module.css'
import { passwordStrength, STRENGTH_LABELS } from '@/components/sections/nnw/data'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Check if user has a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setError('Invalid or expired reset link. Please request a new one.')
      }
    }

    checkSession()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        toast.error(updateError.message)
        setLoading(false)
        return
      }

      setSuccess(true)
      toast.success('Password reset successfully!')
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      toast.error('Failed to reset password')
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div className={aStyles['error-icon']}><X size={26} color="var(--error)" strokeWidth={3} /></div>
        <h1 className={`${styles.display} ${aStyles['form-title']}`} style={{ color: 'var(--error)' }}>Invalid link.</h1>
        <p className={aStyles['form-sub']} style={{ margin: '0 auto 22px' }}>{error}</p>
        <Link href="/forgot-password" className={`${styles.btn} ${styles['btn-gold']}`} style={{ width: '100%' }}>Request New Link</Link>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div className={aStyles['confirm-icon']} style={{ background: 'var(--green)' }}>
          <Check size={26} color="var(--bone)" strokeWidth={3} />
        </div>
        <h1 className={`${styles.display} ${aStyles['form-title']}`}>Password reset!</h1>
        <p className={aStyles['form-sub']} style={{ margin: '0 auto' }}>Redirecting you to login…</p>
      </div>
    )
  }

  return (
    <div>
      <div className={aStyles['form-badge']}>
        <span className={styles.dot} style={{ background: 'var(--green)' }} />
        <span className={aStyles['form-badge-text']}>New Password</span>
      </div>
      <h2 className={`${styles.display} ${aStyles['form-title']}`}>Set new password.</h2>
      <p className={aStyles['form-sub']}>Create a strong password for your account.</p>

      <form onSubmit={handleSubmit}>
        <div className={aStyles['a-group']}>
          <label className={aStyles['a-label']}>New Password</label>
          <div className={aStyles['input-wrap']}>
            <span className={aStyles['input-icon']}><Lock size={15} /></span>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className={aStyles['a-input']}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className={aStyles['input-suffix-btn']}>
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {password && (
            <div className={aStyles.strength}>
              <div className={aStyles['strength-bars']}>
                {[0, 1, 2, 3].map(i => {
                  const s = passwordStrength(password)
                  return <div key={i} className={`${aStyles['strength-bar']} ${i < s ? `${aStyles.filled} ${aStyles['s' + s]}` : ''}`} />
                })}
              </div>
              <span className={aStyles['strength-label']}>{STRENGTH_LABELS[passwordStrength(password)]}</span>
            </div>
          )}
        </div>

        <div className={aStyles['a-group']}>
          <label className={aStyles['a-label']}>Confirm Password</label>
          <div className={aStyles['input-wrap']}>
            <span className={aStyles['input-icon']}><Lock size={15} /></span>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className={aStyles['a-input']}
            />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={aStyles['input-suffix-btn']}>
              {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <div className={`${aStyles['field-hint']} ${aStyles.bad}`}>Passwords do not match</div>
          )}
        </div>

        <button type="submit" disabled={loading} className={`${styles.btn} ${styles['btn-gold']}`} style={{ width: '100%', marginTop: 8 }}>
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </div>
  )
}