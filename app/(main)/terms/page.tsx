'use client'

// File: app/terms/page.tsx

import Link from 'next/link'
import Image from 'next/image'
import { FileText, ShieldCheck, MapPin, Mail, Phone, AlertTriangle } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'
import aStyles from '@/components/module/about.module.css'

// Shared legal-document typography - kept local since this is the only page
// with numbered clauses at this depth; promote to a shared module if a
// third legal page appears.
const h2: React.CSSProperties = { fontFamily: "'Anton', sans-serif", fontSize: 21, textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 12 }
const h3: React.CSSProperties = { fontSize: 15.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 10, marginTop: 18 }
const p: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.75, color: 'rgba(var(--navy-rgb),0.65)', marginBottom: 14 }
const ul: React.CSSProperties = { listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 8 }
const li: React.CSSProperties = { display: 'flex', gap: 9, fontSize: 14, lineHeight: 1.6, color: 'rgba(var(--navy-rgb),0.65)' }
const dot = <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', flexShrink: 0, marginTop: 8 }} />
const section: React.CSSProperties = { marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid var(--line)' }

function Notice({ tone, title, children }: { tone: 'info' | 'warning' | 'critical'; title?: string; children: React.ReactNode }) {
  const palette = {
    info: { bg: 'rgba(11,92,46,0.05)', border: 'rgba(11,92,46,0.2)', accent: 'var(--green)' },
    warning: { bg: 'rgba(219,164,35,0.08)', border: 'rgba(219,164,35,0.3)', accent: 'var(--amber)' },
    critical: { bg: 'rgba(180,67,46,0.06)', border: 'rgba(180,67,46,0.25)', accent: 'var(--error)' },
  }[tone]
  return (
    <div style={{ background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 3, padding: 22, marginBottom: 32 }}>
      {title && (
        <p style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: palette.accent, marginBottom: 8, fontSize: 14 }}>
          <AlertTriangle size={15} /> {title}
        </p>
      )}
      <p style={{ ...p, marginBottom: 0, color: 'rgba(var(--navy-rgb),0.7)' }}>{children}</p>
    </div>
  )
}

export default function TermsPage() {
  return (
    <>

      {/* Header */}
      <header className={subStyles.subhero} style={{ paddingTop: 132 }}>
        <span className={styles['ghost-num']} style={{ fontSize: '24vw', top: '-6vw', right: '-6vw' }}>NNW</span>
        <div className={styles.wrap}>
          <div className={subStyles['subhero-badge']}>
            <span className={styles.dot} />
            <span className={styles.mono} style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--gold)' }}>Legal</span>
          </div>
          <h1 className={styles.display}>Terms &amp;<br />Conditions.</h1>
          <p>Last Updated: December 15, 2024</p>
        </div>
      </header>

      <section className={aStyles['a-section']} style={{ background: 'var(--bone)' }}>
        <div className={styles.wrap} style={{ maxWidth: 860 }}>

          {/* WLA Legal Entity Banner */}
          <div className={aStyles['wla-banner']} style={{ marginBottom: 32 }}>
            <div className={aStyles['wla-top']}>
              <div className={aStyles['wla-logo-box']}>
                <Image src="/wla-logo.png" alt="WLA Entertainment Ltd" width={100} height={100} style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <div className={aStyles['wla-eyebrow']}>Legal Entity &amp; Competition Operator</div>
                <div className={aStyles['wla-name']}>WLA Entertainment Ltd</div>
                <div className={aStyles['wla-tag']}>A WLA Entertainment Company · RC No. 9529867</div>
                <div className={aStyles['wla-badge-row']}>
                  <span className={`${aStyles['wla-badge']} ${aStyles.gold}`}><ShieldCheck size={12} /> CAC Registered</span>
                  <span className={`${aStyles['wla-badge']} ${aStyles.green}`}><MapPin size={12} /> Asaba, Delta State, Nigeria</span>
                </div>
              </div>
            </div>
            <div className={aStyles['wla-strip']}>
              <div>
                <div className={aStyles['wla-strip-label']}>Contact</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <a href="mailto:legal@naijaninja.net" className={aStyles['wla-strip-text']}><Mail size={13} color="var(--gold)" /> hello@warriorsleague.africa</a>
                  <a href="tel:+2348085952266" className={aStyles['wla-strip-text']}><Phone size={13} color="var(--gold)" /> +234 808 595 2266</a>
                </div>
              </div>
              <div>
                <div className={aStyles['wla-strip-label']}>Registered Address</div>
                <span className={aStyles['wla-strip-text']}>Flat 7, Progress House, Oduke, Asaba, Delta State, Nigeria</span>
              </div>
            </div>
          </div>

          <Notice tone="warning">
            Please read these Terms and Conditions carefully before using our website or participating in
            Naija Next Warrior competitions operated by WLA Entertainment Ltd. By accessing our website or
            registering for the competition, you agree to be bound by these terms.
          </Notice>

          <div style={section}>
            <h2 style={h2}>1. Acceptance of Terms</h2>
            <p style={p}>
              By accessing or using the Naija Next Warrior website, registering for competitions, or
              participating in any related activities organised by WLA Entertainment Ltd, you acknowledge
              that you have read, understood, and agree to be bound by these Terms and Conditions, as well
              as our Privacy Policy. If you do not agree with any part of these terms, you must not use our
              services.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>2. About the Operator</h2>
            <p style={p}>
              Naija Next Warrior is a competition series owned and operated by <strong style={{ color: 'var(--navy)' }}>WLA Entertainment Ltd</strong> (Warrior League Africa), a private company limited by shares, duly registered with the Corporate Affairs Commission of Nigeria. Naija Next Warrior is a WLA Entertainment Company:
            </p>
            <ul style={ul}>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Company Name:</strong> WLA Entertainment Ltd</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>RC Number:</strong> 9529867</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Date of Incorporation:</strong> May 8, 2026</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Registered Address:</strong> Flat 7, Progress House, Oduke, Asaba, Delta State, Nigeria</span></li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>3. Eligibility Requirements</h2>

            <h3 style={h3}>Age Requirements</h3>
            <ul style={ul}>
              <li style={li}>{dot}Competitors must be at least 18 years old as of the competition date</li>
              <li style={li}>{dot}Minors (16-17) may participate with written parental/guardian consent</li>
              <li style={li}>{dot}Youth categories (13-15) require parental supervision at all times</li>
            </ul>

            <h3 style={h3}>Citizenship &amp; Residency</h3>
            <ul style={ul}>
              <li style={li}>{dot}Participants must be Nigerian citizens or legal residents</li>
              <li style={li}>{dot}Valid government-issued identification is required</li>
              <li style={li}>{dot}Proof of residency may be requested</li>
            </ul>

            <h3 style={h3}>Health &amp; Fitness</h3>
            <ul style={ul}>
              <li style={li}>{dot}Participants must be in good physical health</li>
              <li style={li}>{dot}Medical clearance certificate required for all competitors</li>
              <li style={li}>{dot}Disclosure of any medical conditions that may affect participation</li>
              <li style={li}>{dot}Ability to complete physical activities without risk of serious injury</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>4. Registration and Application</h2>
            <p style={p}>Registration Process:</p>
            <ul style={ul}>
              <li style={li}>{dot}Complete online registration form with accurate information</li>
              <li style={li}>{dot}Submit required documents (ID, medical clearance, consent forms)</li>
              <li style={li}>{dot}Pay any applicable registration fees (non-refundable)</li>
              <li style={li}>{dot}Applications are subject to review and approval by WLA Entertainment Ltd</li>
              <li style={li}>{dot}We reserve the right to reject any application without providing reasons</li>
              <li style={li}>{dot}Approved applicants will receive confirmation via email</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>5. Competition Rules and Conduct</h2>

            <h3 style={h3}>General Rules</h3>
            <ul style={ul}>
              <li style={li}>{dot}Follow all instructions from competition officials and staff</li>
              <li style={li}>{dot}Attend mandatory safety briefings and orientation sessions</li>
              <li style={li}>{dot}Wear appropriate athletic attire and footwear</li>
              <li style={li}>{dot}No performance-enhancing substances or drugs</li>
              <li style={li}>{dot}Arrive on time for scheduled competition slots</li>
            </ul>

            <h3 style={h3}>Prohibited Conduct</h3>
            <ul style={ul}>
              <li style={li}>{dot}Unsportsmanlike behaviour or harassment of any kind</li>
              <li style={li}>{dot}Cheating, fraud, or deception</li>
              <li style={li}>{dot}Damage to competition equipment or facilities</li>
              <li style={li}>{dot}Interference with other competitors</li>
              <li style={li}>{dot}Violation of safety protocols</li>
            </ul>
            <p style={p}>
              Violation of these rules may result in disqualification, removal from the premises, and ban
              from future WLA-operated competitions.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>6. Liability Waiver and Release</h2>
            <p style={p}>
              <strong style={{ color: 'var(--navy)' }}>IMPORTANT:</strong> By participating in Naija Next Warrior, you acknowledge and agree:
            </p>
            <ul style={ul}>
              <li style={li}>{dot}Obstacle course competitions involve inherent risks including serious injury or death</li>
              <li style={li}>{dot}You voluntarily assume all risks associated with participation</li>
              <li style={li}>{dot}You release WLA Entertainment Ltd, Naija Next Warrior, its organisers, sponsors, and partners from any liability</li>
              <li style={li}>{dot}You waive any claims for injury, loss, or damage arising from participation</li>
              <li style={li}>{dot}This release extends to medical treatment provided at the event</li>
            </ul>
            <p style={p}>
              We strongly recommend obtaining personal accident insurance coverage before participating.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>7. Media Rights and Publicity</h2>
            <p style={p}>By participating, you grant WLA Entertainment Ltd and Naija Next Warrior:</p>
            <ul style={ul}>
              <li style={li}>{dot}Unrestricted rights to photograph, film, and record your participation</li>
              <li style={li}>{dot}Permission to use your name, image, likeness, and voice</li>
              <li style={li}>{dot}Rights to broadcast, stream, and distribute content globally</li>
              <li style={li}>{dot}Ability to use footage for promotional and commercial purposes across all WLA platforms</li>
              <li style={li}>{dot}Rights in perpetuity across all media platforms</li>
            </ul>
            <p style={p}>
              You waive any rights to compensation or approval of how content is used. You may not record
              or livestream competition without explicit permission from WLA Entertainment Ltd.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>8. Prizes and Awards</h2>
            <ul style={ul}>
              <li style={li}>{dot}Prize amounts and details are subject to change</li>
              <li style={li}>{dot}Prizes are awarded based on official competition results</li>
              <li style={li}>{dot}Winners must provide tax identification and banking information</li>
              <li style={li}>{dot}Prizes may be subject to applicable taxes (winner&apos;s responsibility)</li>
              <li style={li}>{dot}Non-monetary prizes cannot be exchanged for cash</li>
              <li style={li}>{dot}Prize distribution may take up to 90 days after competition</li>
              <li style={li}>{dot}Prizes are non-transferable</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>9. Disqualification</h2>
            <p style={p}>WLA Entertainment Ltd reserves the right to disqualify participants who:</p>
            <ul style={ul}>
              <li style={li}>{dot}Provide false or misleading information</li>
              <li style={li}>{dot}Fail to meet eligibility requirements</li>
              <li style={li}>{dot}Violate competition rules or safety protocols</li>
              <li style={li}>{dot}Engage in unsportsmanlike conduct</li>
              <li style={li}>{dot}Are under the influence of drugs or alcohol</li>
              <li style={li}>{dot}Fail drug testing (if administered)</li>
              <li style={li}>{dot}Refuse to comply with official instructions</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>10. Cancellation and Modifications</h2>
            <p style={p}>WLA Entertainment Ltd reserves the right to:</p>
            <ul style={ul}>
              <li style={li}>{dot}Cancel, postpone, or reschedule competitions due to weather, safety concerns, or other circumstances</li>
              <li style={li}>{dot}Modify competition format, rules, or prize structures</li>
              <li style={li}>{dot}Change venue locations if necessary</li>
              <li style={li}>{dot}Limit the number of participants</li>
            </ul>
            <p style={p}>
              In case of cancellation, registration fees may be refunded at our discretion. We are not
              responsible for travel, accommodation, or other expenses incurred.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>11. Intellectual Property</h2>
            <p style={p}>
              All content on the Naija Next Warrior website and competition materials - including the NNW
              brand, WLA brand, logos, text, graphics, videos, and software - are owned by WLA Entertainment
              Ltd and protected by copyright and trademark laws. You may not:
            </p>
            <ul style={ul}>
              <li style={li}>{dot}Reproduce, distribute, or display content without permission</li>
              <li style={li}>{dot}Use the NNW or WLA trademarks or branding without authorisation</li>
              <li style={li}>{dot}Create derivative works based on our content</li>
              <li style={li}>{dot}Use content for commercial purposes without a license from WLA Entertainment Ltd</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>12. Website Use</h2>
            <p style={p}>When using our website, you agree to:</p>
            <ul style={ul}>
              <li style={li}>{dot}Provide accurate and current information</li>
              <li style={li}>{dot}Not use automated systems to access the website</li>
              <li style={li}>{dot}Not attempt to hack, disrupt, or damage the website</li>
              <li style={li}>{dot}Not upload malicious content or viruses</li>
              <li style={li}>{dot}Respect other users and not post offensive content</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>13. Third-Party Links</h2>
            <p style={{ ...p, marginBottom: 0 }}>
              Our website may contain links to third-party websites. WLA Entertainment Ltd is not
              responsible for the content, privacy practices, or terms of these external sites. Access them
              at your own risk.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>14. Limitation of Liability</h2>
            <p style={p}>To the maximum extent permitted by law:</p>
            <ul style={ul}>
              <li style={li}>{dot}WLA Entertainment Ltd is not liable for any indirect, incidental, or consequential damages</li>
              <li style={li}>{dot}Our total liability is limited to the registration fee paid (if any)</li>
              <li style={li}>{dot}We do not guarantee uninterrupted or error-free website operation</li>
              <li style={li}>{dot}We are not responsible for technical failures or loss of data</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>15. Governing Law</h2>
            <p style={{ ...p, marginBottom: 0 }}>
              These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria. Any
              disputes shall be resolved in Nigerian courts. If any provision is found invalid, the
              remaining provisions remain in effect.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>16. Changes to Terms</h2>
            <p style={{ ...p, marginBottom: 0 }}>
              WLA Entertainment Ltd may update these Terms and Conditions at any time. Changes will be
              posted on this page with an updated &quot;Last Updated&quot; date. Continued use of our
              services after changes constitutes acceptance of the new terms.
            </p>
          </div>

          <div style={{ ...section, borderBottom: 'none', marginBottom: 32 }}>
            <h2 style={h2}>17. Contact Information</h2>
            <p style={p}>For questions about these Terms and Conditions, contact the operator:</p>
            <div style={{ background: 'var(--navy)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--line-dark)' }}>
                <Image src="/wla-logo.png" alt="WLA Entertainment Ltd" width={48} height={48} style={{ objectFit: 'contain', borderRadius: 8 }} />
                <div>
                  <p style={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', color: 'var(--bone)', fontSize: 15 }}>WLA Entertainment Ltd</p>
                  <p style={{ color: 'var(--ash)', fontSize: 11.5 }}>A WLA Entertainment Company · RC No. 9529867</p>
                </div>
              </div>
              <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="mailto:hello@warriorsleague.africa" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ash)', fontSize: 13 }}>
                  <Mail size={14} color="var(--gold)" /> hello@warriorsleague.africa
                </a>
                <a href="tel:+2348085952266" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ash)', fontSize: 13 }}>
                  <Phone size={14} color="var(--gold)" /> +234 808 595 2266
                </a>
                <span style={{ display: 'flex', alignItems: 'flex-start', gap: 8, color: 'var(--ash)', fontSize: 13 }}>
                  <MapPin size={14} color="var(--gold)" style={{ marginTop: 2, flexShrink: 0 }} /> Flat 7, Progress House, Oduke, Asaba, Delta State, Nigeria
                </span>
              </div>
            </div>
          </div>

          <Notice tone="critical" title="Important Notice">
            By registering for or participating in Naija Next Warrior, you acknowledge that you have read,
            understood, and agree to these Terms and Conditions in their entirety. These terms constitute a
            legally binding agreement with WLA Entertainment Ltd (RC No. 9529867). Naija Next Warrior is a
            WLA Entertainment Company.
          </Notice>
        </div>
      </section>
    </>
  )
}
