// File: components/sections/nnw/InquirySection.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import styles from './nnw.module.css'
import { Reveal } from './hooks'

export default function InquirySection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.subject || !form.message) {
      toast.error('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase.from('inquiries').insert([{
        name: form.name, email: form.email, subject: form.subject, message: form.message, status: 'new',
      }])
      if (error) throw error

      toast.success('Thank you! Your inquiry has been sent. We will respond to your email shortly.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      console.error('Error submitting inquiry:', err)
      toast.error('Failed to send inquiry. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className={styles.section} style={{ background: 'var(--bone)' }}>
      <div className={styles.wrap}>
        <Reveal>
          <div className={styles.eyebrow}><span className={styles['eyebrow-bar']} style={{ background: 'var(--green)' }} /><span className={styles['eyebrow-text']} style={{ color: 'var(--green)' }}>Get in Touch</span></div>
        </Reveal>
        <Reveal delay={60}>
          <h2 className={styles.display} style={{ fontSize: 'clamp(34px,6vw,58px)', lineHeight: 0.95, maxWidth: 620 }}>Got Questions?</h2>
        </Reveal>

        <div className={styles['inquiry-grid']} style={{ marginTop: 48 }}>
          <Reveal delay={100}>
            <div className={styles['inquiry-photo']}>
              <img src="/inquery-hero.png" alt="Contact NNW" />
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className={styles['form-card']}>
              <div className={styles['form-card-title']}>Send an Inquiry</div>
              <div className={styles['form-card-sub']}>We&apos;ll get back to you shortly</div>

              <form onSubmit={handleSubmit}>
                <div className={styles['form-field']}>
                  <label>Name</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" required />
                </div>
                <div className={styles['form-field']}>
                  <label>Email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
                </div>
                <div className={styles['form-field']}>
                  <label>Subject</label>
                  <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} placeholder="What is this about?" required />
                </div>
                <div className={styles['form-field']}>
                  <label>Message</label>
                  <textarea rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." required />
                </div>

                <button type="submit" disabled={submitting} className={`${styles.btn} ${styles['btn-gold']} ${styles['form-submit']}`}>
                  {submitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}