import Link from 'next/link'

interface Sponsor {
    id: string
    name: string
    logo_url: string
    website_url: string
}

interface SponsorsSectionProps {
    sponsors: Sponsor[]
}

export default function SponsorsSection({ sponsors }: SponsorsSectionProps) {
    return (
        <section className=" mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-100 bg-gradient-to-r from-green-900 via-green-800 to-green-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-16 text-center">Supported By</h2>

            {sponsors.length > 0 ? (
                <div className={`grid ${sponsors.length === 1 ? 'justify-center' : 'grid-cols-2 md:grid-cols-4'} gap-6`}>
                    {sponsors.map((sponsor) => (
                        <a
                            key={sponsor.id}
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group py-6 px-8 bg-white rounded-xl border-2 border-gray-100 hover:border-green-500 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-lg hover:scale-105 ${sponsors.length === 1 ? 'max-w-sm' : ''}`}
                        >
                            {sponsor.logo_url && (
                                <img
                                    src={sponsor.logo_url}
                                    alt={sponsor.name}
                                    className="max-w-full max-h-16 object-contain flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            )}
                            <p className="font-bold text-gray-900 text-center">{sponsor.name}</p>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border-2 border-green-200 p-16 text-center">
                    <div className="inline-block p-6 bg-white rounded-full shadow-lg mb-6">
                        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 mb-3">Be Our Sponsor</h3>
                    <p className="text-gray-700 mb-8 text-lg max-w-2xl mx-auto">
                        Partner with Naija Ninja Warrior and reach thousands of passionate competitors
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        Contact Us
                    </Link>
                </div>
            )}
        </div>
    </section >
  )
}