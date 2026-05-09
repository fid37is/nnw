'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, FileText, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <FileText size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Terms & Conditions</h1>
          </div>
          <p className="text-gray-600">Last Updated: December 15, 2024</p>
        </div>

        {/* WLA Legal Entity Banner */}
        <div className="rounded-2xl overflow-hidden border border-gray-800 shadow-lg mb-10">
          <div className="bg-gray-950 px-6 py-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-gray-800">
              <Image
                src="/wla-logo.png"
                alt="WLA Entertainment Ltd"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-0.5">Legal Entity & Competition Operator</p>
              <h2 className="text-xl font-black text-white mb-1">WLA Entertainment Ltd</h2>
              <p className="text-gray-400 text-xs mb-2">A WLA Entertainment Company · RC No. 9529867</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 rounded-full text-xs font-semibold">
                  <ShieldCheck size={11} />
                  CAC Registered
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                  <MapPin size={11} />
                  Asaba, Delta State, Nigeria
                </span>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 border-t border-gray-800 px-6 py-3 flex flex-wrap gap-4">
            <a href="mailto:legal@naijaninja.net" className="flex items-center gap-1.5 text-gray-300 text-xs hover:text-yellow-400 transition">
              <Mail size={12} className="text-yellow-500" /> legal@naijaninja.net
            </a>
            <a href="tel:+2348085952266" className="flex items-center gap-1.5 text-gray-300 text-xs hover:text-yellow-400 transition">
              <Phone size={12} className="text-yellow-500" /> +234 808 595 2266
            </a>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed m-0">
              Please read these Terms and Conditions carefully before using our website or participating in Naija Ninja Warrior competitions operated by WLA Entertainment Ltd. By accessing our website or registering for the competition, you agree to be bound by these terms.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing or using the Naija Ninja Warrior website, registering for competitions, or participating in any related activities organised by WLA Entertainment Ltd, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. About the Operator</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Naija Ninja Warrior is a competition series owned and operated by <strong>WLA Entertainment Ltd</strong> (Warrior League Africa), a private company limited by shares, duly registered with the Corporate Affairs Commission of Nigeria. Naija Ninja Warrior is a WLA Entertainment Company:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Company Name:</strong> WLA Entertainment Ltd</li>
              <li><strong>RC Number:</strong> 9529867</li>
              <li><strong>Date of Incorporation:</strong> May 8, 2026</li>
              <li><strong>Registered Address:</strong> Flat 7, Progress House, Oduke, Asaba, Delta State, Nigeria</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Eligibility Requirements</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Age Requirements</h3>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>Competitors must be at least 18 years old as of the competition date</li>
              <li>Minors (16–17) may participate with written parental/guardian consent</li>
              <li>Youth categories (13–15) require parental supervision at all times</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Citizenship & Residency</h3>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>Participants must be Nigerian citizens or legal residents</li>
              <li>Valid government-issued identification is required</li>
              <li>Proof of residency may be requested</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Health & Fitness</h3>
            <ul className="space-y-2 text-gray-700">
              <li>Participants must be in good physical health</li>
              <li>Medical clearance certificate required for all competitors</li>
              <li>Disclosure of any medical conditions that may affect participation</li>
              <li>Ability to complete physical activities without risk of serious injury</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Registration and Application</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Registration Process:</p>
            <ul className="space-y-2 text-gray-700">
              <li>Complete online registration form with accurate information</li>
              <li>Submit required documents (ID, medical clearance, consent forms)</li>
              <li>Pay any applicable registration fees (non-refundable)</li>
              <li>Applications are subject to review and approval by WLA Entertainment Ltd</li>
              <li>We reserve the right to reject any application without providing reasons</li>
              <li>Approved applicants will receive confirmation via email</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Competition Rules and Conduct</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">General Rules</h3>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>Follow all instructions from competition officials and staff</li>
              <li>Attend mandatory safety briefings and orientation sessions</li>
              <li>Wear appropriate athletic attire and footwear</li>
              <li>No performance-enhancing substances or drugs</li>
              <li>Arrive on time for scheduled competition slots</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Prohibited Conduct</h3>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>Unsportsmanlike behaviour or harassment of any kind</li>
              <li>Cheating, fraud, or deception</li>
              <li>Damage to competition equipment or facilities</li>
              <li>Interference with other competitors</li>
              <li>Violation of safety protocols</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              Violation of these rules may result in disqualification, removal from the premises, and ban from future WLA-operated competitions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Liability Waiver and Release</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>IMPORTANT:</strong> By participating in Naija Ninja Warrior, you acknowledge and agree:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>Obstacle course competitions involve inherent risks including serious injury or death</li>
              <li>You voluntarily assume all risks associated with participation</li>
              <li>You release WLA Entertainment Ltd, Naija Ninja Warrior, its organisers, sponsors, and partners from any liability</li>
              <li>You waive any claims for injury, loss, or damage arising from participation</li>
              <li>This release extends to medical treatment provided at the event</li>
            </ul>
            <p className="text-gray-700 leading-relaxed">
              We strongly recommend obtaining personal accident insurance coverage before participating.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Media Rights and Publicity</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By participating, you grant WLA Entertainment Ltd and Naija Ninja Warrior:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Unrestricted rights to photograph, film, and record your participation</li>
              <li>Permission to use your name, image, likeness, and voice</li>
              <li>Rights to broadcast, stream, and distribute content globally</li>
              <li>Ability to use footage for promotional and commercial purposes across all WLA platforms</li>
              <li>Rights in perpetuity across all media platforms</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You waive any rights to compensation or approval of how content is used. You may not record or livestream competition without explicit permission from WLA Entertainment Ltd.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Prizes and Awards</h2>
            <ul className="space-y-2 text-gray-700">
              <li>Prize amounts and details are subject to change</li>
              <li>Prizes are awarded based on official competition results</li>
              <li>Winners must provide tax identification and banking information</li>
              <li>Prizes may be subject to applicable taxes (winner's responsibility)</li>
              <li>Non-monetary prizes cannot be exchanged for cash</li>
              <li>Prize distribution may take up to 90 days after competition</li>
              <li>Prizes are non-transferable</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Disqualification</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              WLA Entertainment Ltd reserves the right to disqualify participants who:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Provide false or misleading information</li>
              <li>Fail to meet eligibility requirements</li>
              <li>Violate competition rules or safety protocols</li>
              <li>Engage in unsportsmanlike conduct</li>
              <li>Are under the influence of drugs or alcohol</li>
              <li>Fail drug testing (if administered)</li>
              <li>Refuse to comply with official instructions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Cancellation and Modifications</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              WLA Entertainment Ltd reserves the right to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Cancel, postpone, or reschedule competitions due to weather, safety concerns, or other circumstances</li>
              <li>Modify competition format, rules, or prize structures</li>
              <li>Change venue locations if necessary</li>
              <li>Limit the number of participants</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              In case of cancellation, registration fees may be refunded at our discretion. We are not responsible for travel, accommodation, or other expenses incurred.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content on the Naija Ninja Warrior website and competition materials - including the NNW brand, WLA brand, logos, text, graphics, videos, and software - are owned by WLA Entertainment Ltd and protected by copyright and trademark laws. You may not:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Reproduce, distribute, or display content without permission</li>
              <li>Use the NNW or WLA trademarks or branding without authorisation</li>
              <li>Create derivative works based on our content</li>
              <li>Use content for commercial purposes without a license from WLA Entertainment Ltd</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Website Use</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              When using our website, you agree to:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Provide accurate and current information</li>
              <li>Not use automated systems to access the website</li>
              <li>Not attempt to hack, disrupt, or damage the website</li>
              <li>Not upload malicious content or viruses</li>
              <li>Respect other users and not post offensive content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Third-Party Links</h2>
            <p className="text-gray-700 leading-relaxed">
              Our website may contain links to third-party websites. WLA Entertainment Ltd is not responsible for the content, privacy practices, or terms of these external sites. Access them at your own risk.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To the maximum extent permitted by law:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>WLA Entertainment Ltd is not liable for any indirect, incidental, or consequential damages</li>
              <li>Our total liability is limited to the registration fee paid (if any)</li>
              <li>We do not guarantee uninterrupted or error-free website operation</li>
              <li>We are not responsible for technical failures or loss of data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Governing Law</h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms and Conditions are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved in Nigerian courts. If any provision is found invalid, the remaining provisions remain in effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">16. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed">
              WLA Entertainment Ltd may update these Terms and Conditions at any time. Changes will be posted on this page with an updated "Last Updated" date. Continued use of our services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">17. Contact Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              For questions about these Terms and Conditions, contact the operator:
            </p>
            <div className="bg-gray-950 rounded-xl overflow-hidden border border-gray-800">
              <div className="px-6 py-5 flex items-center gap-4 border-b border-gray-800">
                <Image
                  src="/wla-logo.png"
                  alt="WLA Entertainment Ltd"
                  width={48}
                  height={48}
                  className="rounded-lg object-contain bg-black"
                />
                <div>
                  <p className="font-bold text-white">WLA Entertainment Ltd</p>
                  <p className="text-gray-400 text-xs">A WLA Entertainment Company · RC No. 9529867</p>
                </div>
              </div>
              <div className="px-6 py-4 space-y-2">
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  <Mail size={14} className="text-yellow-500 flex-shrink-0" />
                  <a href="mailto:legal@naijaninja.net" className="hover:text-yellow-400 transition">legal@naijaninja.net</a>
                </p>
                <p className="text-gray-300 text-sm flex items-center gap-2">
                  <Phone size={14} className="text-yellow-500 flex-shrink-0" />
                  <a href="tel:+2348085952266" className="hover:text-yellow-400 transition">+234 808 595 2266</a>
                </p>
                <p className="text-gray-300 text-sm flex items-start gap-2">
                  <MapPin size={14} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                  <span>Flat 7, Progress House, Oduke, Asaba, Delta State, Nigeria</span>
                </p>
              </div>
            </div>
          </section>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mt-8">
            <p className="text-gray-900 font-semibold mb-2">⚠️ Important Notice</p>
            <p className="text-gray-700 m-0">
              By registering for or participating in Naija Ninja Warrior, you acknowledge that you have read, understood, and agree to these Terms and Conditions in their entirety. These terms constitute a legally binding agreement with WLA Entertainment Ltd (RC No. 9529867). Naija Ninja Warrior is a WLA Entertainment Company.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
