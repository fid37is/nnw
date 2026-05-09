'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Shield, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

export default function PrivacyPage() {
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
            <Shield size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600">Last Updated: March 2026</p>
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
              <p className="text-yellow-400 text-xs font-bold tracking-widest uppercase mb-0.5">Data Controller & Legal Entity</p>
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
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <p className="text-gray-700 leading-relaxed m-0">
              WLA Entertainment Ltd, parent company of Naija Ninja Warrior, is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or participate in our competition.
            </p>
          </div>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              When you register for the competition or interact with our website, we may collect:
            </p>
            <ul className="space-y-2 text-gray-700 mb-4">
              <li>Full name, date of birth, and gender</li>
              <li>Contact information (email address, phone number, physical address)</li>
              <li>Emergency contact details</li>
              <li>Medical information relevant to competition participation</li>
              <li>Photography and video footage captured during competitions</li>
              <li>Social media handles (if provided)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Technical Information</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We automatically collect certain information when you visit our website:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring website addresses</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use the collected information for the following purposes:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Competition Management:</strong> Process applications, manage registrations, and coordinate competition logistics</li>
              <li><strong>Safety & Medical:</strong> Ensure participant safety and provide appropriate medical support</li>
              <li><strong>Communication:</strong> Send competition updates, results, and important announcements</li>
              <li><strong>Broadcasting:</strong> Produce and broadcast competition content across various media platforms</li>
              <li><strong>Marketing:</strong> Promote the competition and share athlete stories (with consent)</li>
              <li><strong>Analytics:</strong> Improve our website and competition experience</li>
              <li><strong>Legal Compliance:</strong> Meet legal and regulatory requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Information Sharing and Disclosure</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may share your information with:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Service Providers:</strong> Third parties who help operate our competition (event coordinators, medical staff, production crews)</li>
              <li><strong>Broadcasting Partners:</strong> TV networks, streaming platforms, and media outlets (for competition footage)</li>
              <li><strong>Sponsors:</strong> Corporate partners (only with your explicit consent)</li>
              <li><strong>WLA Group Companies:</strong> Other entities operating under WLA Entertainment Ltd, as we expand across Africa</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our legal rights</li>
              <li><strong>Business Transfers:</strong> In connection with any merger, sale, or transfer of our business</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              We do not sell your personal information to third parties.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Photography and Video Rights</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              By participating in Naija Ninja Warrior, you acknowledge and agree that:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Your image, likeness, and performance may be recorded and broadcast</li>
              <li>We may use this content for promotional purposes across various media</li>
              <li>You waive any rights to compensation for such use</li>
              <li>You can request removal of specific content from our social media (subject to contractual obligations with broadcasters)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement appropriate technical and organisational measures to protect your personal information:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>Secure servers and encrypted data transmission</li>
              <li>Limited access to personal information (only authorised personnel)</li>
              <li>Regular security audits and updates</li>
              <li>Staff training on data protection practices</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You have the following rights regarding your personal information:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time</li>
              <li><strong>Data Portability:</strong> Request your data in a portable format</li>
              <li><strong>Object:</strong> Object to certain types of processing</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise these rights, contact us at: <a href="mailto:legal@naijaninja.net" className="text-naija-green-600 hover:text-naija-green-700 font-medium">legal@naijaninja.net</a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We use cookies and similar technologies to enhance your experience:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Essential Cookies:</strong> Required for website functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You can control cookies through your browser settings. Note that disabling cookies may affect website functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed">
              Participants must be at least 18 years old or have parental/guardian consent. We do not knowingly collect information from children under 13 without verifiable parental consent. If you believe we have collected information from a child without proper consent, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Data Transfers</h2>
            <p className="text-gray-700 leading-relaxed">
              Your information may be transferred to and processed in countries outside Nigeria, particularly as WLA Entertainment Ltd expands operations across Africa or works with international broadcasting partners. We ensure appropriate safeguards are in place for such transfers.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, unless a longer retention period is required by law. Competition footage and results may be retained indefinitely for historical and archival purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact the data controller:
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

          <div className="bg-naija-green-50 border border-naija-green-200 rounded-xl p-6 mt-8">
            <p className="text-gray-900 font-semibold mb-2">Your Privacy Matters</p>
            <p className="text-gray-700 m-0">
              WLA Entertainment Ltd is committed to transparency and protecting your personal information. If you have any concerns about how your data is handled, please don't hesitate to reach out.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
