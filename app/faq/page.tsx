'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Navbar from '../navbar'
import Footer from '../footer'

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
      question: 'How do I register for the competition?',
      answer: 'Visit our registration page and complete the online application form. You\'ll need to provide personal information, upload a valid ID, submit a medical clearance certificate, and pay any applicable registration fees. Applications are reviewed within 5-7 business days.'
    },
    {
      category: 'Registration',
      question: 'What are the age requirements?',
      answer: 'Competitors must be at least 18 years old as of the competition date. Minors aged 16-17 may participate with written parental/guardian consent. Youth categories (13-15) are available with mandatory parental supervision.'
    },
    {
      category: 'Registration',
      question: 'Do I need to be a Nigerian citizen to compete?',
      answer: 'Yes, participants must be Nigerian citizens or legal residents. Valid government-issued identification and proof of residency are required during registration.'
    },
    {
      category: 'Registration',
      question: 'Is there a registration fee?',
      answer: 'Registration fees vary by competition level and are announced each season. Fees are non-refundable once your application is approved. Check our registration page for current fee information.'
    },
    
    // Training & Preparation
    {
      category: 'Training',
      question: 'Do I need prior ninja warrior experience?',
      answer: 'No prior ninja warrior experience is required, but you should be in good physical condition. We recommend training at one of our certified facilities for 2-3 months before competing to familiarize yourself with obstacle techniques.'
    },
    {
      category: 'Training',
      question: 'Where can I train for the competition?',
      answer: 'We have certified training centers across all 6 geopolitical zones in Nigeria. Visit our Training Centers page to find the nearest facility. These centers offer specialized ninja warrior training programs and equipment.'
    },
    {
      category: 'Training',
      question: 'What should I focus on in my training?',
      answer: 'Focus on grip strength, upper body endurance, core stability, agility, and cardiovascular fitness. Practice specific obstacle techniques at training centers and work with certified coaches who understand competition requirements.'
    },
    
    // Competition Format
    {
      category: 'Competition',
      question: 'How does the competition work?',
      answer: 'The competition has three stages: Regional Qualifiers (6 zones), Semi-Finals, and the Grand Finale in Abuja. Competitors face increasingly difficult obstacle courses, with the best performers advancing to the next stage. Your time and distance determine advancement.'
    },
    {
      category: 'Competition',
      question: 'What happens if I fall during my run?',
      answer: 'Falling or touching water results in immediate elimination from that round. Your distance and time up to that point are recorded. The furthest distance and fastest times determine who advances to the next stage.'
    },
    {
      category: 'Competition',
      question: 'Can I compete in multiple regional qualifiers?',
      answer: 'No, you must compete in the regional qualifier for your zone of residence. This ensures fair representation across all geopolitical zones of Nigeria.'
    },
    {
      category: 'Competition',
      question: 'What should I wear to compete?',
      answer: 'Wear comfortable, fitted athletic clothing that allows full range of motion. Proper athletic shoes are required (no sandals or minimalist shoes). Remove all jewelry and accessories. Specific clothing requirements will be provided upon registration approval.'
    },
    
    // Health & Safety
    {
      category: 'Health & Safety',
      question: 'Do I need a medical clearance?',
      answer: 'Yes, all competitors must submit a medical clearance certificate from a licensed physician stating you are physically fit to participate. This must be dated within 30 days of the competition date.'
    },
    {
      category: 'Health & Safety',
      question: 'What medical conditions disqualify me?',
      answer: 'Conditions that significantly increase risk of serious injury may result in disqualification, including uncontrolled heart conditions, severe respiratory issues, recent surgeries, or seizure disorders. Consult with your physician and disclose all conditions during registration.'
    },
    {
      category: 'Health & Safety',
      question: 'Is medical staff available during competition?',
      answer: 'Yes, certified medical personnel and emergency response teams are present at all competitions. We have protocols for immediate medical attention if needed.'
    },
    {
      category: 'Health & Safety',
      question: 'What insurance do I need?',
      answer: 'We strongly recommend obtaining personal accident insurance before competing. Participation involves inherent risks, and you assume full responsibility. Our liability is limited as outlined in the Terms and Conditions.'
    },
    
    // Prizes & Recognition
    {
      category: 'Prizes',
      question: 'What are the prizes for winners?',
      answer: 'The champion receives ₦5,000,000 plus trophy and national recognition. Runner-up receives ₦2,500,000, and third place receives ₦1,000,000. All finalists receive certificates, merchandise, and eligibility for sponsorship opportunities.'
    },
    {
      category: 'Prizes',
      question: 'How and when are prizes paid out?',
      answer: 'Winners must provide tax identification and banking information. Prize distribution typically occurs within 90 days after competition. Prizes may be subject to applicable taxes, which are the winner\'s responsibility.'
    },
    {
      category: 'Prizes',
      question: 'Are there prizes for regional winners?',
      answer: 'Regional winners receive recognition, advancement to semi-finals, and merchandise. Major cash prizes are awarded at the Grand Finale level.'
    },
    
    // Media & Broadcasting
    {
      category: 'Media',
      question: 'Will the competition be televised?',
      answer: 'Yes, Naija Ninja Warrior will be broadcast on national TV, DSTV, and streamed on platforms like Netflix and YouTube. Specific broadcast schedules will be announced closer to competition dates.'
    },
    {
      category: 'Media',
      question: 'Can I record my own run?',
      answer: 'Personal recording or livestreaming during competition is not permitted without explicit permission. Official footage will be available through our channels. You may take photos in designated areas.'
    },
    {
      category: 'Media',
      question: 'Will I be interviewed on camera?',
      answer: 'Selected competitors may be interviewed for TV segments. Participation is voluntary but encouraged. All participants grant media rights as outlined in our Terms and Conditions.'
    },
    
    // Logistics
    {
      category: 'Logistics',
      question: 'Are travel and accommodation provided?',
      answer: 'Travel and accommodation are the competitor\'s responsibility for regional qualifiers. For semi-finals and finals, we may provide support for select competitors - details will be communicated to qualified participants.'
    },
    {
      category: 'Logistics',
      question: 'Can spectators attend?',
      answer: 'Yes, tickets are available for spectators to attend live competitions. Ticket information, pricing, and availability will be announced on our website before each competition.'
    },
    {
      category: 'Logistics',
      question: 'What time should I arrive on competition day?',
      answer: 'Arrive at least 2 hours before your scheduled slot for check-in, safety briefing, and warm-up. Exact times will be provided in your confirmation email. Late arrival may result in disqualification.'
    },
    
    // General
    {
      category: 'General',
      question: 'Can I withdraw after registering?',
      answer: 'Yes, but registration fees are non-refundable. Notify us immediately if you need to withdraw. Your spot may be given to another competitor.'
    },
    {
      category: 'General',
      question: 'How are winners determined?',
      answer: 'Winners are determined by furthest distance completed and fastest time. If multiple competitors complete the course, the fastest time wins. All decisions by judges and officials are final.'
    },
    {
      category: 'General',
      question: 'Can I bring a coach or support team?',
      answer: 'Yes, you may bring a limited support team. They must register for event access and will be assigned designated areas. They cannot interfere with competition or access restricted areas.'
    }
  ]

  const categories = ['All', 'Registration', 'Training', 'Competition', 'Health & Safety', 'Prizes', 'Media', 'Logistics', 'General']

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 mt-14">
        {/* Header */}
        <div className="mb-12">
          <Link href="/" className="flex items-center gap-2 text-naija-green-600 hover:text-naija-green-700 mb-4 w-fit">
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <HelpCircle size={40} className="text-naija-green-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Frequently Asked Questions</h1>
          </div>
          <p className="text-xl text-gray-600">Find answers to common questions about Naija Ninja Warrior</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  selectedCategory === category
                    ? 'bg-naija-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:border-naija-green-300 transition"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition"
              >
                <div className="flex-grow pr-4">
                  <span className="text-xs font-semibold text-naija-green-600 mb-1 block">
                    {faq.category}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="text-naija-green-600" size={24} />
                  ) : (
                    <ChevronDown className="text-gray-400" size={24} />
                  )}
                </div>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 pt-2 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="bg-gradient-to-br from-naija-green-600 to-naija-green-700 text-white rounded-xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg text-green-50 mb-8">
              Can't find what you're looking for? Our team is here to help. Contact us directly and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-block px-8 py-3 bg-white text-naija-green-600 font-bold rounded-full hover:bg-green-50 transition">
                Contact Us
              </Link>
              <a href="mailto:phyd3lid@gmail.com" className="inline-block px-8 py-3 bg-naija-green-500 text-white font-bold rounded-full hover:bg-naija-green-400 border-2 border-white transition">
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}