// components/careers/CareersCTA.tsx
import Link from 'next/link'

export default function CareersCTA() {
  return (
    <div className="bg-gradient-to-br from-nnw-navy to-nnw-green text-white rounded-lg p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display uppercase mb-4">Don&apos;t See Your Role?</h2>
        <p className="text-lg text-nnw-bone/90 mb-8">
          We&apos;re always looking for exceptional talent. Send us your CV and tell us how you can contribute to building Africa&apos;s premier sports entertainment company.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@naijaninja.net?subject=Career Enquiry - WLA Entertainment"
            className="inline-block px-8 py-3 bg-nnw-gold text-nnw-navy font-mono uppercase tracking-wide font-bold rounded-full hover:bg-nnw-gold-soft transition"
          >
            Send Your CV
          </a>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-transparent hover:bg-white/10 text-white font-mono uppercase tracking-wide font-bold rounded-full border-2 border-white transition"
          >
            Contact the Team
          </Link>
        </div>
        <p className="text-nnw-bone/70 text-sm mt-6">
          WLA Entertainment Ltd · RC No. 9529867 · Asaba, Delta State, Nigeria
        </p>
      </div>
    </div>
  )
}