import { useState, useEffect } from 'react'

export default function CompetitionProcessSection({ isApplicationOpen = false }) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      id: 1,
      title: 'Show Interest',
      description: 'Discover and decide to take on the challenge',
      bullets: ['Explore competition highlights', 'Understand requirements', 'Get inspired by champions']
    },
    {
      id: 2,
      title: 'Sign Up',
      description: 'Create your warrior account',
      bullets: ['Provide your information', 'Verify your email', 'Complete warrior profile']
    },
    {
      id: 3,
      title: 'Sign In',
      description: 'Access your dashboard',
      bullets: ['Log in to account', 'View application status', 'Update profile anytime']
    },
    {
      id: 4,
      title: 'Apply',
      description: 'Submit your formal application',
      bullets: ['Fill application form', 'Share fitness background', 'Upload required documents']
    },
    {
      id: 5,
      title: 'Review',
      description: 'We evaluate your application',
      bullets: ['Admin reviews submission', 'Verification process (3-5 days)', 'Assessment of qualifications']
    },
    {
      id: 6,
      title: 'Acceptance',
      description: "You've been selected!",
      bullets: ['Receive acceptance notification', 'Access payment instructions', 'View competition schedule']
    },
    {
      id: 7,
      title: 'Pay Fee',
      description: 'Complete your payment',
      bullets: ['Pay participation fee', 'Upload payment proof', 'Secure competition slot']
    },
    {
      id: 8,
      title: 'Approval',
      description: 'Payment confirmed!',
      bullets: ['Receive official confirmation', 'Get competition number', 'Access participant materials']
    },
    {
      id: 9,
      title: 'Compete',
      description: "You're ready! Time to shine",
      bullets: ['🏆 Champion - 1st place', '🥈 Runner-Up - 2nd/3rd', '⭐ Warrior - Experience gained']
    }
  ]

  // Border animation - cycles through steps every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length)
    }, 3000)
    
    return () => clearInterval(timer)
  }, [])

  const StepCard = ({ step, index }: { step: typeof steps[0], index: number }) => {
    const isCurrent = currentStep === index
    const isStep9 = step.id === 9

    return (
      <div className="relative">
        {/* Drawing border animation - only on current step */}
        {isCurrent && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
            <rect
              x="2"
              y="2"
              width="calc(100% - 4px)"
              height="calc(100% - 4px)"
              fill="none"
              strokeWidth="4"
              strokeDasharray="1000"
              strokeDashoffset="1000"
              rx="12"
              className={`animate-draw-border ${isStep9 ? 'stroke-secondary' : 'stroke-primary'}`}
            />
          </svg>
        )}

        {/* Content card */}
        <div className="bg-white rounded-xl p-6 h-full">
          {/* Step Number Badge */}
          <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full mb-4 font-bold ${isStep9 ? 'bg-secondary text-secondary-foreground' : 'bg-primary text-primary-foreground'}`}>
            {step.id}
          </div>

          {/* Title */}
          <h3 className={`font-bold text-gray-900 mb-2 ${isStep9 ? 'text-2xl' : 'text-xl'}`}>
            {step.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-3">
            {step.description}
          </p>

          {/* Bullets */}
          <ul className="space-y-2">
            {step.bullets.map((bullet, idx) => (
              <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            9 Steps to Glory
          </h2>
          <p className="text-lg text-gray-600">
            Your journey from interest to champion
          </p>
        </div>

        {/* Whiteboard - Grid Layout */}
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Steps 1-8 in 2 rows, 4 columns */}
            {steps.slice(0, 8).map((step, idx) => (
              <StepCard key={step.id} step={step} index={idx} />
            ))}
          </div>
            
          {/* Step 9 and Action Button in same row */}
          <div className="mt-8 pt-8 border-t-2 border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
              {/* Step 9 - Final Round */}
              <StepCard step={steps[8]} index={8} />
              
              {/* Action Button Area */}
              <div className="flex flex-col items-center justify-center text-center p-6 rounded-xl border-2 border-primary-100">
                {isApplicationOpen ? (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin?</h3>
                    <a
                      href="/register"
                      className="btn-primary rounded-full group flex items-center justify-center gap-2 text-lg px-8 py-4 shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                      Apply Now
                    </a>
                  </>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Applications Currently Closed</h3>
                    <p className="text-gray-600 mb-4 max-w-md">
                      Don't miss the next season! Register now to get updates and be first to know when applications open.
                    </p>
                    <a
                      href="/register"
                      className="btn-primary rounded-full group flex items-center justify-center gap-2 text-lg px-8 py-3 shadow-xl hover:shadow-2xl hover:scale-105 mb-3"
                    >
                      Register
                    </a>
                    <p className="text-sm text-gray-500">
                      Follow us on social media for the latest news and warrior stories
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}