// File: components/sections/nnw/WaitlistSection.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Users, MapPin, Zap, CheckCircle } from 'lucide-react'
import styles from './nnw.module.css'
import { Reveal } from './hooks'
import { NIGERIAN_STATES, STATE_TO_ZONE } from './data'

const BENEFITS = [
  'First access when applications open',
  'Exclusive pre-season updates and news',
  'Early notification of zone event dates',
  'Priority consideration for Season 1',
]

interface WaitlistSectionProps {
  waitingCount: number
}

export default function WaitlistSection({ waitingCount }: WaitlistSectionProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    state: '',
    interest_level: 'competitor',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.full_name || !formData.email) {
      toast.error('Please enter your name and email')
      return
    }

    setLoading(true)
    try {
      const geo_zone = STATE_TO_ZONE[formData.state] || null

      const { error } = await supabase.from('waiting_list').insert([{
        full_name: formData.full_name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || null,
        state: formData.state || null,
        geo_zone,
        interest_level: formData.interest_level,
        source: 'website_homepage',
      }])

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already on the waiting list')
        } else {
          throw error
        }
        return
      }

      setSuccess(true)
      toast.success("You're on the list! We'll notify you when applications open.")
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.waitlist}>
      <div className={styles.wrap}>
        <div className={styles['waitlist-grid']}>
          {/* Left - copy */}
          <Reveal>
            <div>
              <div className={styles['hero-badge']}>
                <Zap size={14} color="var(--gold-soft)" />
                <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.15em', color: 'var(--gold-soft)', textTransform: 'uppercase' }}>Applications Opening Soon</span>
              </div>
              <h2 className={styles['waitlist-title']}>Be First in Line.<br /><span>Join the Waiting List.</span></h2>
              <p className={styles['waitlist-sub']}>
                Season 1 applications are not open yet. Join the waiting list and get
                notified the moment they do - before anyone else.
              </p>

              <div className={styles['stat-row']}>
                <div className={styles['stat-chip']}>
                  <div className={styles['stat-chip-icon']}><Users size={18} color="var(--gold-soft)" /></div>
                  <div>
                    <div className={styles['stat-chip-num']}>{waitingCount.toLocaleString()}</div>
                    <div className={styles['stat-chip-label']}>Warriors waiting</div>
                  </div>
                </div>
                <div className={styles['stat-chip']}>
                  <div className={styles['stat-chip-icon']}><MapPin size={18} color="var(--gold-soft)" /></div>
                  <div>
                    <div className={styles['stat-chip-num']}>6</div>
                    <div className={styles['stat-chip-label']}>Zones competing</div>
                  </div>
                </div>
              </div>

              <div className={styles['benefit-list']}>
                {BENEFITS.map((item) => (
                  <div key={item} className={styles['benefit-item']}>
                    <CheckCircle size={16} color="var(--green-light)" style={{ flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right - form */}
          <Reveal delay={100}>
            <div className={styles['form-card']}>
              {success ? (
                <div className={styles['form-success']}>
                  <div className={styles['form-success-icon']}><CheckCircle size={32} color="var(--green)" /></div>
                  <div className={styles['form-success-title']}>You&apos;re on the list!</div>
                  <p className={styles['form-success-sub']}>
                    We&apos;ll send you an email the moment Season 1 applications open. Stay ready - the competition is coming.
                  </p>
                </div>
              ) : (
                <>
                  <div className={styles['form-card-title']}>Reserve Your Spot</div>
                  <div className={styles['form-card-sub']}>No account needed. Just your details.</div>

                  <form onSubmit={handleSubmit}>
                    <div className={styles['form-field']}>
                      <label>Full Name *</label>
                      <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="Enter your full name" required />
                    </div>
                    <div className={styles['form-field']}>
                      <label>Email Address *</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="your@email.com" required />
                    </div>
                    <div className={styles['form-field']}>
                      <label>Phone Number (optional)</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="08012345678" />
                    </div>
                    <div className={styles['form-field']}>
                      <label>State (optional)</label>
                      <select name="state" value={formData.state} onChange={handleChange}>
                        <option value="">Select your state</option>
                        {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {formData.state && <div className={styles['form-hint']}>Zone: {STATE_TO_ZONE[formData.state]}</div>}
                    </div>

                    <div className={styles['form-links']}>
                      Want to sponsor, partner, or cover this?{' '}
                      <Link href="/partners">Partners</Link> · <Link href="/investors">Investors</Link> · <Link href="/contact">Contact Us</Link>
                    </div>

                    <button type="submit" disabled={loading} className={`${styles.btn} ${styles['btn-gold']} ${styles['form-submit']}`}>
                      {loading ? 'Joining...' : 'Join the Waiting List'}
                    </button>
                    <div className={styles['form-note']}>No spam. We only email when it matters.</div>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}