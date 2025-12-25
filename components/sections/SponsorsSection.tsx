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
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-16 text-center">
                Supported By
            </h2>

            {sponsors.length > 0 ? (
                <div className={`grid ${sponsors.length === 1 ? 'justify-center' : 'grid-cols-2 md:grid-cols-4'} gap-6`}>
                    {sponsors.map((sponsor) => (
                        <a
                            key={sponsor.id}
                            href={sponsor.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group py-6 px-8 bg-card rounded-xl border-2 border-border hover:border-primary transition-all duration-300 flex items-center justify-center gap-3 shadow-soft hover:shadow-medium hover:scale-105 ${sponsors.length === 1 ? 'max-w-sm' : ''}`}
                        >
                            {sponsor.logo_url && (
                                <img
                                    src={sponsor.logo_url}
                                    alt={sponsor.name}
                                    className="max-w-full max-h-16 object-contain flex-shrink-0 grayscale group-hover:grayscale-0 transition-all duration-300"
                                />
                            )}
                            <p className="font-bold text-card-foreground text-center">{sponsor.name}</p>
                        </a>
                    ))}
                </div>
            ) : (
                <div className="bg-muted rounded-2xl border-2 border-border p-16 text-center">
                    <div className="inline-block p-6 bg-card rounded-full shadow-soft mb-6">
                        <svg className="w-16 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-3">Become a Sponsor</h3>
                    <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
                        Partner with Naija Ninja Warrior and reach millions of passionate viewers across Nigeria and Africa
                    </p>
                    <Link
                        href="/partners"
                        className="btn-primary rounded-full inline-flex items-center justify-center px-8 py-4 transition-transform hover:scale-105"
                    >
                        View Partnership Opportunities
                    </Link>
                </div>
            )}
        </section>
    )
}