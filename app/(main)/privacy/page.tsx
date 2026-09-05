'use client'

// File: app/privacy/page.tsx

import Image from 'next/image'
import { ShieldCheck, MapPin, Mail, Phone } from 'lucide-react'
import styles from '@/components/sections/nnw/nnw.module.css'
import subStyles from '@/components/module/subpage.module.css'
import aStyles from '@/components/module/about.module.css'

// Shared legal-document typography - same pattern as app/(main)/terms/page.tsx.
// If a third legal page appears, promote these into a shared module instead
// of copying a third time.
const h2: React.CSSProperties = { fontFamily: "'Anton', sans-serif", fontSize: 21, textTransform: 'uppercase', color: 'var(--navy)', marginBottom: 12 }
const h3: React.CSSProperties = { fontSize: 15.5, fontWeight: 700, color: 'var(--navy)', marginBottom: 10, marginTop: 18 }
const p: React.CSSProperties = { fontSize: 14.5, lineHeight: 1.75, color: 'rgba(var(--navy-rgb),0.65)', marginBottom: 14 }
const ul: React.CSSProperties = { listStyle: 'none', padding: 0, margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: 8 }
const li: React.CSSProperties = { display: 'flex', gap: 9, fontSize: 14, lineHeight: 1.6, color: 'rgba(var(--navy-rgb),0.65)' }
const dot = <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', flexShrink: 0, marginTop: 8 }} />
const section: React.CSSProperties = { marginBottom: 40, paddingBottom: 40, borderBottom: '1px solid var(--line)' }

function Notice({ tone, title, children }: { tone: 'info' | 'positive'; title?: string; children: React.ReactNode }) {
  const palette = {
    info: { bg: 'rgba(59,130,246,0.06)', border: 'rgba(59,130,246,0.2)', accent: '#3b82f6' },
    positive: { bg: 'rgba(11,92,46,0.05)', border: 'rgba(11,92,46,0.2)', accent: 'var(--green)' },
  }[tone]
  return (
    <div style={{ background: palette.bg, border: `1px solid ${palette.border}`, borderRadius: 3, padding: 22, marginBottom: 32 }}>
      {title && <p style={{ fontWeight: 700, color: palette.accent, marginBottom: 8, fontSize: 14 }}>{title}</p>}
      <p style={{ ...p, marginBottom: 0, color: 'rgba(var(--navy-rgb),0.7)' }}>{children}</p>
    </div>
  )
}

export default function PrivacyPage() {
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
          <h1 className={styles.display}>Privacy<br />Policy.</h1>
          <p>Last Updated: August 2026</p>
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
                <div className={aStyles['wla-eyebrow']}>Data Controller &amp; Legal Entity</div>
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

          <Notice tone="info">
            WLA Entertainment Ltd, parent company of Naija Next Warrior, is committed to protecting your
            privacy and ensuring the security of your personal information. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when you visit our website or
            participate in our competition.
          </Notice>

          <div style={section}>
            <h2 style={h2}>1. Information We Collect</h2>

            <h3 style={h3}>Personal Information</h3>
            <p style={p}>When you register for the competition or interact with our website, we may collect:</p>
            <ul style={ul}>
              <li style={li}>{dot}Full name, date of birth, and gender</li>
              <li style={li}>{dot}Contact information (email address, phone number, physical address)</li>
              <li style={li}>{dot}Emergency contact details</li>
              <li style={li}>{dot}Medical information relevant to competition participation</li>
              <li style={li}>{dot}Photography and video footage captured during competitions</li>
              <li style={li}>{dot}Social media handles (if provided)</li>
            </ul>

            <h3 style={h3}>Technical Information</h3>
            <p style={p}>We automatically collect certain information when you visit our website:</p>
            <ul style={ul}>
              <li style={li}>{dot}IP address and device information</li>
              <li style={li}>{dot}Browser type and version</li>
              <li style={li}>{dot}Pages visited and time spent on pages</li>
              <li style={li}>{dot}Referring website addresses</li>
              <li style={li}>{dot}Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>2. How We Use Your Information</h2>
            <p style={p}>We use the collected information for the following purposes:</p>
            <ul style={ul}>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Competition Management:</strong> Process applications, manage registrations, and coordinate competition logistics</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Safety &amp; Medical:</strong> Ensure participant safety and provide appropriate medical support</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Communication:</strong> Send competition updates, results, and important announcements</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Broadcasting:</strong> Produce and broadcast competition content across various media platforms</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Marketing:</strong> Promote the competition and share athlete stories (with consent)</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Analytics:</strong> Improve our website and competition experience</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Legal Compliance:</strong> Meet legal and regulatory requirements</span></li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>3. Information Sharing and Disclosure</h2>
            <p style={p}>We may share your information with:</p>
            <ul style={ul}>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Service Providers:</strong> Third parties who help operate our competition (event coordinators, medical staff, production crews)</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Broadcasting Partners:</strong> TV networks, streaming platforms, and media outlets (for competition footage)</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Sponsors:</strong> Corporate partners (only with your explicit consent)</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>WLA Group Companies:</strong> Other entities operating under WLA Entertainment Ltd, as we expand across Africa</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Legal Authorities:</strong> When required by law or to protect our legal rights</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business</span></li>
            </ul>
            <p style={{ ...p, marginBottom: 0 }}>We do not sell your personal information to third parties.</p>
          </div>

          <div style={section}>
            <h2 style={h2}>4. Photography and Video Rights</h2>
            <p style={p}>By participating in Naija Next Warrior, you acknowledge and agree that:</p>
            <ul style={{ ...ul, marginBottom: 0 }}>
              <li style={li}>{dot}Your image, likeness, and performance may be recorded and broadcast</li>
              <li style={li}>{dot}We may use this content for promotional purposes across various media</li>
              <li style={li}>{dot}You waive any rights to compensation for such use</li>
              <li style={li}>{dot}You can request removal of specific content from our social media (subject to contractual obligations with broadcasters)</li>
            </ul>
          </div>

          <div style={section}>
            <h2 style={h2}>5. Data Security</h2>
            <p style={p}>We implement appropriate technical and organisational measures to protect your personal information:</p>
            <ul style={ul}>
              <li style={li}>{dot}Secure servers and encrypted data transmission</li>
              <li style={li}>{dot}Limited access to personal information (only authorised personnel)</li>
              <li style={li}>{dot}Regular security audits and updates</li>
              <li style={li}>{dot}Staff training on data protection practices</li>
            </ul>
            <p style={{ ...p, marginBottom: 0 }}>
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee
              absolute security of your information.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>6. Your Rights and Choices</h2>
            <p style={p}>You have the following rights regarding your personal information:</p>
            <ul style={ul}>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Access:</strong> Request a copy of the personal information we hold about you</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Correction:</strong> Request correction of inaccurate or incomplete information</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Opt-Out:</strong> Unsubscribe from marketing communications at any time</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Data Portability:</strong> Request your data in a portable format</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Object:</strong> Object to certain types of processing</span></li>
            </ul>
            <p style={{ ...p, marginBottom: 0 }}>
              To exercise these rights, contact us at:{' '}
              <a href="mailto:legal@naijaninja.net" style={{ color: 'var(--green)', fontWeight: 600 }}>legal@naijaninja.net</a>
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>7. Cookies and Tracking Technologies</h2>
            <p style={p}>We use cookies and similar technologies to enhance your experience:</p>
            <ul style={ul}>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Essential Cookies:</strong> Required for website functionality</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Analytics Cookies:</strong> Help us understand how visitors use our website</span></li>
              <li style={li}>{dot}<span><strong style={{ color: 'var(--navy)' }}>Marketing Cookies:</strong> Used to deliver relevant advertisements</span></li>
            </ul>
            <p style={{ ...p, marginBottom: 0 }}>
              You can control cookies through your browser settings. Note that disabling cookies may affect
              website functionality.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>8. Children&apos;s Privacy</h2>
            <p style={{ ...p, marginBottom: 0 }}>
              Participants must be at least 18 years old or have parental/guardian consent. We do not
              knowingly collect information from children under 13 without verifiable parental consent. If
              you believe we have collected information from a child without proper consent, please contact
              us immediately.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>9. International Data Transfers</h2>
            <p style={{ ...p, marginBottom: 0 }}>
              Your information may be transferred to and processed in countries outside Nigeria,
              particularly as WLA Entertainment Ltd expands operations across Africa or works with
              international broadcasting partners. We ensure appropriate safeguards are in place for such
              transfers.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>10. Data Retention</h2>
            <p style={{ ...p, marginBottom: 0 }}>
              We retain your personal information for as long as necessary to fulfil the purposes outlined
              in this policy, unless a longer retention period is required by law. Competition footage and
              results may be retained indefinitely for historical and archival purposes.
            </p>
          </div>

          <div style={section}>
            <h2 style={h2}>11. Changes to This Privacy Policy</h2>
            <p style={{ ...p, marginBottom: 0 }}>
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new policy on our website and updating the &quot;Last Updated&quot;
              date. Your continued use of our services after changes constitutes acceptance of the updated
              policy.
            </p>
          </div>

          <div style={{ ...section, borderBottom: 'none', marginBottom: 32 }}>
            <h2 style={h2}>12. Contact Us</h2>
            <p style={p}>
              If you have questions, concerns, or requests regarding this Privacy Policy or our data
              practices, please contact the data controller:
            </p>
            <div style={{ background: 'var(--navy)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--line-dark)' }}>
                <Image src="/wla-logo.png" alt="WLA Entertainment Ltd" width={48} height={48} style={{ objectFit: 'contain', borderRadius: 8 }} />
                <div>
                  <p style={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', color: 'var(--bone)', fontSize: 15 }}>WLA Entertainment Ltd</p>
                  <p style={{ color: 'var(--ash)', fontSize: 11.5 }}>A WLA Entertainment Company · RC No. 9529867</p>
                </div>
              </div>
              <div style={{ padding: '18px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="mailto:legal@naijaninja.net" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--ash)', fontSize: 13 }}>
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

          <Notice tone="positive" title="Your Privacy Matters">
            WLA Entertainment Ltd is committed to transparency and protecting your personal information. If
            you have any concerns about how your data is handled, please don&apos;t hesitate to reach out.
          </Notice>
        </div>
      </section>
    </>
  )
}
