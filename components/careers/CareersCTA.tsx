// components/careers/CareersCTA.tsx
import Link from 'next/link'

export default function CareersCTA() {
  return (
    <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't See Your Role?</h2>
        <p className="text-lg text-green-50 mb-8">
          We're always looking for exceptional talent. Send us your CV and tell us how you can contribute to building Africa's premier sports entertainment company.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:support@naijaninja.net?subject=Career Enquiry - WLA Entertainment"
            className="inline-block px-8 py-3 bg-white text-naija-green-700 font-bold rounded-full hover:bg-green-50 transition"
          >
            Send Your CV
          </a>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 bg-naija-green-500 hover:bg-naija-green-400 text-white font-bold rounded-full border-2 border-white transition"
          >
            Contact the Team
          </Link>
        </div>
        <p className="text-green-200 text-sm mt-6">
          WLA Entertainment Ltd · RC No. 9529867 · Asaba, Delta State, Nigeria
        </p>
      </div>
    </div>
  )
}