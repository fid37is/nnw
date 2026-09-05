'use client'

// File: app/(main)/faq/page.tsx

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const faqs: FAQItem[] = [
    // Registration & Eligibility
    {
      category: 'Registration',
      question: 'How do I register for Nigeria Next Warrior?',
      answer: 'Registration is free and opens on our website when Season 1 launches. You’ll create an account, select your competition zone, and submit your application details - including physical stats and motivation - once applications officially open.'
    },
    {
      category: 'Registration',
      question: 'What are the age requirements?',
      answer: 'You must be at least 18 years old at the time of application. There is no upper age limit - NNW celebrates competitors of every age.'
    },
    {
      category: 'Registration',
      question: 'Do I need to be a Nigerian citizen to compete?',
      answer: 'For Season 1, competitors must be Nigerian nationals or legal residents of Nigeria. Your zone is assigned based on your state of origin or current residence, which you declare at registration.'
    },
    {
      category: 'Registration',
      question: 'Is there a registration fee?',
      answer: 'Registration itself is free. If you’re shortlisted after screening, you’ll pay a registration fee to secure your competition spot - this self-selects for serious, committed contestants. Full fee details are shared at the shortlisting stage.'
    },
    {
      category: 'Registration',
      question: 'What is the selection process?',
      answer: 'It runs in stages: online registration → screening, where we check your submitted materials and information against our standard requirements → qualifying, where you compete for your spot in your regional semi-final → zone allocation for contestants who qualify. Each zone’s semi-final has a minimum of 10 and up to 50 contestants, depending on registration volume.'
    },
    // The Zone System
    {
      category: 'Zones',
      question: 'How does the zone system work?',
      answer: 'Nigeria Next Warrior is built around Nigeria’s six geopolitical zones - South West, South East, South South, North Central, North East, and North West. Each zone runs its own qualifying week with its own contestant pool, its own zone champion, and its own identity. You’re not just competing for yourself - you’re competing for your zone.'
    },
    {
      category: 'Zones',
      question: 'Do obstacle courses differ by zone?',
      answer: 'Yes. Each zone week’s course draws on that region’s geography and culture - for example, water transitions and narrow beams for South West’s coastal identity, or endurance-based obstacles reflecting North East’s terrain. The course frame stays fixed at the venue for the season, with obstacle elements that are modular and swappable between zone weeks.'
    },
    {
      category: 'Zones',
      question: 'How do zone champions reach the Grand Finale?',
      answer: 'Each zone week crowns one zone champion - the fastest or highest-scoring contestant from that week. All six zone champions advance directly to the Grand Finale.'
    },
    // Competition Format
    {
      category: 'Competition',
      question: 'How does the competition work overall?',
      answer: 'The season runs through zone qualifying weeks, semi-finals, and zone finals, before the six zone champions meet at the Grand Finale. Zone week courses are single-lane and linear, with six main obstacles plus a steep climb finish. Scoring is pass/fail first, with time as the tiebreaker.'
    },
    {
      category: 'Competition',
      question: 'How is the Grand Finale different?',
      answer: 'The Grand Finale uses a completely different, dual-lane course where two zone champions compete head-to-head at the same time. The first competitor to reach the course’s diversion point chooses their lane - an easier, slower left lane, or a harder, faster right lane - and the second competitor automatically takes the other. Both lanes reconverge for a shared final obstacle, and whoever finishes first wins.'
    },
    {
      category: 'Competition',
      question: 'What happens if I fall during my run?',
      answer: 'A fall or failure ends your run at that point - your distance and time up to that moment are what’s recorded. In zone weeks, the deepest obstacle reached and fastest time determine advancement in the event of a tie.'
    },
    {
      category: 'Competition',
      question: 'Can I compete in a zone other than my own?',
      answer: 'No - you compete in the zone matching your state of origin or current residence, as declared at registration. This keeps zone representation fair across the whole country.'
    },
    // Health & Safety
    {
      category: 'Health & Safety',
      question: 'Do I need a medical clearance?',
      answer: 'You’ll self-certify that you’re physically fit to compete, and we recommend a medical check before training. If you have a known cardiac condition, severe hypertension, or another condition that intense exertion could aggravate, you’ll need to provide medical clearance from a qualified doctor before you’re permitted to run.'
    },
    {
      category: 'Health & Safety',
      question: 'Is medical staff available on competition day?',
      answer: 'Yes. A Medical Officer must be physically present before any competitor enters the course, with authority to prevent a competitor from running on medical grounds. A dedicated Safety & Security Officer also has authority to halt any run for safety reasons.'
    },
    // Prizes
    {
      category: 'Prizes',
      question: 'How does the prize model work?',
      answer: 'NNW uses a progressive prize structure - starting from semi-finals, every contestant who advances a stage earns money, so no one goes home from a stage they’ve reached empty-handed. Awards increase at each stage: semi-finals, zone finals, Grand Finale qualification, and Grand Finale participation all carry their own payout, on top of the top-three prizes at the Grand Finale. Screening and qualifying, which determine your spot in the semi-final, are not paid stages.'
    },
    {
      category: 'Prizes',
      question: 'What do the top three finishers win?',
      answer: 'The Season Champion, Runner-Up, and third-place finisher all receive significant sponsor-funded cash prizes, along with trophies, national recognition, and eligibility for future sponsorship opportunities.'
    },
    {
      category: 'Prizes',
      question: 'How and when are prizes paid out?',
      answer: 'Winners provide tax identification and banking information, and prize distribution follows within a defined window after the competition. Prizes may be subject to applicable taxes, which are the winner’s responsibility.'
    },
    // Media & Broadcasting
    {
      category: 'Media',
      question: 'Will Nigeria Next Warrior be broadcast?',
      answer: 'Yes - NNW is built to broadcast standard from the ground up, with multi-camera coverage, dedicated hosts, and a sideline reporter at every zone week. Specific broadcast partners and schedules will be announced closer to launch.'
    },
    {
      category: 'Media',
      question: 'Can I record or livestream my own run?',
      answer: 'Personal recording or livestreaming during competition isn’t permitted without explicit permission - official footage is made available through our channels. You’re welcome to take photos in designated spectator areas.'
    },
    {
      category: 'Media',
      question: 'Will I be interviewed on camera?',
      answer: 'Selected competitors may be interviewed for broadcast segments. It’s voluntary but encouraged, and all participants grant media rights as outlined in our Terms and Conditions.'
    },
    // Logistics
    {
      category: 'Logistics',
      question: 'Are travel and accommodation provided?',
      answer: 'All zone contestants are housed in hotel blocks near the fixed venue for the duration of their zone week. Travel arrangements are coordinated as part of the zone allocation process once you’ve been screened.'
    },
    {
      category: 'Logistics',
      question: 'Can my family or supporters attend?',
      answer: 'Yes - this is built into the format as “Zone Squad”: a small group of each zone’s family, friends, and community representatives that WLA transports to the venue to provide live atmosphere and support during that zone’s week.'
    },
    {
      category: 'Logistics',
      question: 'Can spectators attend?',
      answer: 'Zone weeks currently center on Zone Squad attendance rather than general ticketed admission. Broader public ticketing is being considered for future seasons depending on demand - updates will be posted on our website ahead of each competition.'
    },
    // General
    {
      category: 'General',
      question: 'What is Nigeria Next Warrior?',
      answer: 'Nigeria Next Warrior (NNW) is Africa’s first obstacle-based sports entertainment franchise - the flagship edition of WLA Entertainment’s continental format. It’s an original obstacle competition built specifically around Nigerian and African identity, not an adaptation of an existing international format.'
    },
    {
      category: 'General',
      question: 'What makes NNW different from other obstacle competitions?',
      answer: 'NNW combines athletic performance with a strategic decision-making layer that no other obstacle format uses. We’re keeping the specifics under wraps for now while that mechanic is fully protected - full details will be published closer to Season 1 launch.'
    },
    {
      category: 'General',
      question: 'Can I withdraw after registering?',
      answer: 'Yes - notify us as soon as possible if you need to withdraw so your spot can be offered to another contestant. Any registration fee already paid is non-refundable.'
    },
    {
      category: 'General',
      question: 'How are winners determined?',
      answer: 'Completion is scored pass/fail first, with time as the tiebreaker. In a tie on completion, the contestant who reached the deepest point on the course ranks higher. All decisions by competition officials are final on competition day.'
    },
    {
      category: 'General',
      question: 'Does NNW expand beyond Nigeria?',
      answer: 'Yes - NNW is the flagship edition of a wider WLA format that’s designed to license into other African markets as national editions, with national champions eventually competing at a continental championship level. Nigeria is the starting point for a broader African footprint.'
    },
  ]

  const categories = ['All', 'Registration', 'Zones', 'Competition', 'Health & Safety', 'Prizes', 'Media', 'Logistics', 'General']

  const filteredFaqs = selectedCategory === 'All'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      <header className="relative overflow-hidden bg-gradient-to-br from-nnw-navy via-nnw-navy to-nnw-green pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-4">
          </div>
          <div className="flex items-center gap-4 mb-3">
            <HelpCircle size={36} className="text-nnw-gold" />
            <h1 className="font-display uppercase text-4xl md:text-6xl text-nnw-bone leading-none">FAQ.</h1>
          </div>
          <p className="text-nnw-ash text-lg max-w-xl">Find answers to common questions about Nigeria Next Warrior.</p>
        </div>
      </header>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-mono text-xs tracking-wider uppercase transition ${
                  selectedCategory === category
                    ? 'bg-nnw-navy text-nnw-bone'
                    : 'bg-nnw-navy/5 text-nnw-navy/60 hover:bg-nnw-navy/10'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 mb-16">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-2 border-nnw-navy/10 overflow-hidden hover:border-nnw-green/40 transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-nnw-navy/[0.02] transition"
              >
                <div className="flex-grow pr-4">
                  <span className="text-xs font-mono tracking-wider uppercase text-nnw-green mb-1 block">
                    {faq.category}
                  </span>
                  <h3 className="font-display uppercase text-nnw-navy text-lg">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="text-nnw-green" size={22} />
                  ) : (
                    <ChevronDown className="text-nnw-navy/30" size={22} />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5 pt-1 bg-nnw-navy/[0.02] border-t border-nnw-navy/10">
                  <p className="text-nnw-navy/65 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="bg-gradient-to-br from-nnw-navy to-nnw-green text-nnw-bone rounded-lg p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display uppercase text-3xl md:text-4xl mb-4">Still Have Questions?</h2>
            <p className="text-lg text-nnw-ash mb-8">
              Can&apos;t find what you&apos;re looking for? Our team is here to help. Contact us directly and we&apos;ll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-block px-8 py-3 bg-nnw-gold text-nnw-navy font-mono text-sm tracking-wider uppercase font-bold rounded hover:bg-nnw-gold-soft transition">
                Contact Us
              </Link>
              <a href="mailto:phyd3lis@gmail.com" className="inline-block px-8 py-3 border-2 border-nnw-bone/40 text-nnw-bone font-mono text-sm tracking-wider uppercase font-bold rounded hover:bg-nnw-bone/10 transition">
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}