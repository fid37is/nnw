import { useState, useEffect } from 'react'
import { 
  Heart, 
  UserPlus, 
  LogIn, 
  FileText, 
  Search, 
  CheckCircle, 
  CreditCard, 
  Award,
  Trophy,
  Medal,
  Star,
  ChevronRight
} from 'lucide-react'

export default function CompetitionProcessSection() {
  const [activeStep, setActiveStep] = useState(1)
  const [isPaused, setIsPaused] = useState(false)

  const steps = [
    {
      id: 1,
      icon: Heart,
      title: 'Show Interest',
      description: 'Discover and decide to take on the challenge',
      details: [
        'Explore the competition and watch highlights',
        'Understand challenges and requirements',
        'Get inspired by past champions'
      ]
    },
    {
      id: 2,
      icon: UserPlus,
      title: 'Sign Up',
      description: 'Create your warrior account',
      details: [
        'Provide your information and photo',
        'Verify your email address',
        'Complete your warrior profile'
      ]
    },
    {
      id: 3,
      icon: LogIn,
      title: 'Sign In',
      description: 'Access your dashboard',
      details: [
        'Log in to your account',
        'View application status',
        'Update your profile anytime'
      ]
    },
    {
      id: 4,
      icon: FileText,
      title: 'Apply',
      description: 'Submit your formal application',
      details: [
        'Fill out the application form',
        'Share your fitness background',
        'Upload required documents'
      ]
    },
    {
      id: 5,
      icon: Search,
      title: 'Review',
      description: 'We evaluate your application',
      details: [
        'Admin reviews your submission',
        'Verification process (3-5 days)',
        'Assessment of qualifications'
      ]
    },
    {
      id: 6,
      icon: CheckCircle,
      title: 'Acceptance',
      description: "You've been selected!",
      details: [
        'Receive acceptance notification',
        'Access payment instructions',
        'View competition schedule'
      ]
    },
    {
      id: 7,
      icon: CreditCard,
      title: 'Pay Fee',
      description: 'Complete your payment',
      details: [
        'Pay the participation fee',
        'Upload payment proof',
        'Secure your competition slot'
      ]
    },
    {
      id: 8,
      icon: Award,
      title: 'Approval',
      description: 'Payment confirmed!',
      details: [
        'Receive official confirmation',
        'Get your competition number',
        'Access participant materials'
      ]
    }
  ]

  const step9 = {
    id: 9,
    icon: Trophy,
    title: 'Compete',
    description: "You're ready! Time to shine",
    isFinish: true,
    outcomes: [
      { icon: Trophy, label: 'Champion', desc: '1st place', color: 'text-yellow-600' },
      { icon: Medal, label: 'Runner-Up', desc: '2nd/3rd', color: 'text-gray-600' },
      { icon: Star, label: 'Warrior', desc: 'Experience', color: 'text-orange-600' }
    ]
  }

  // Auto-animation for steps 1-8
  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setActiveStep((prev) => (prev >= 8 ? 1 : prev + 1))
      }, 3000)
      
      return () => clearInterval(interval)
    }
  }, [isPaused])

  const activeStepData = steps.find(s => s.id === activeStep)

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full mb-4">
            <span className="text-green-700 font-bold text-sm uppercase tracking-wide">
              Your Journey
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            9 Steps to Glory
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            From first click to champion. Hover over any step to pause and read more.
          </p>
        </div>
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <div className="flex gap-12 mb-12">
            {/* Left Side - Steps 1-8 */}
            <div className="w-96 flex-shrink-0 relative">
              <div className="space-y-3">
                {steps.map((step) => {
                  const isActive = activeStep === step.id

                  return (
                    <div
                      key={step.id}
                      className="relative"
                      onMouseEnter={() => {
                        setIsPaused(true)
                        setActiveStep(step.id)
                      }}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      <div className={`
                        bg-white rounded-lg p-4 border-2 cursor-pointer transition-all flex items-center gap-4
                        ${isActive 
                          ? 'border-green-400 shadow-md' 
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}>
                        <div className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          font-bold text-white transition-all flex-shrink-0
                          ${isActive 
                            ? 'bg-green-400' 
                            : 'bg-green-200'
                          }
                        `}>
                          {step.id}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 text-base mb-0.5">
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-tight">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Connecting lines to junction */}
              <svg className="absolute left-full top-0 w-32 h-full pointer-events-none" style={{ marginLeft: '-1px' }}>
                {/* Lines from each step to junction point */}
                {steps.map((step, index) => {
                  const yStart = 32 + (index * 88) // Approximate center of each step
                  const junctionY = 200 // Junction point Y position
                  
                  return (
                    <line
                      key={step.id}
                      x1="0"
                      y1={yStart}
                      x2="80"
                      y2={junctionY}
                      stroke="#d1d5db"
                      strokeWidth="2"
                    />
                  )
                })}
                {/* Vertical line from junction to panels */}
                <line
                  x1="80"
                  y1="200"
                  x2="128"
                  y2="200"
                  stroke="#d1d5db"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* Right Side - Details Panels */}
            <div className="flex-1 space-y-6">
              {/* Step 1-8 Details Panel */}
              <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200 min-h-[300px] flex items-center justify-center">
                {activeStepData && (
                  <div className="w-full">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-full bg-green-400 flex items-center justify-center font-bold text-white text-xl">
                        {activeStep}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {activeStepData.title}
                        </h3>
                        <p className="text-gray-600">
                          {activeStepData.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {activeStepData.details.map((detail, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="text-white" size={14} />
                          </div>
                          <p className="text-gray-700">{detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 9 Badge */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center font-bold text-white flex-shrink-0">
                  9
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-base mb-0.5">
                    {step9.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-tight">
                    {step9.description}
                  </p>
                </div>
              </div>

              {/* Step 9 Details Panel */}
              <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-200 min-h-[200px]">
                <div className="w-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Competition Day!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You've made it! Now it's time to showcase your strength and determination.
                  </p>
                  
                  <h4 className="font-bold text-gray-900 mb-4">Possible Outcomes:</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {step9.outcomes.map((outcome, i) => {
                      const OutcomeIcon = outcome.icon
                      return (
                        <div key={i} className="bg-white rounded-xl p-6 text-center border-2 border-gray-100 shadow-md">
                          <OutcomeIcon className={`${outcome.color} mx-auto mb-3`} size={40} />
                          <p className="font-bold text-gray-900 mb-1">{outcome.label}</p>
                          <p className="text-sm text-gray-500">{outcome.desc}</p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Instruction */}
          <div className="text-center mb-4">
            <p className="text-sm text-gray-600">
              👆 Click any number to view step details
            </p>
          </div>

          {/* Horizontal Number Badges 1-8 */}
          <div className="flex justify-center gap-2 mb-6 flex-wrap">
            {steps.map((step) => {
              const isActive = activeStep === step.id

              return (
                <button
                  key={step.id}
                  onClick={() => {
                    setActiveStep(step.id)
                  }}
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all
                    ${isActive 
                      ? 'bg-green-400 scale-110 shadow-lg' 
                      : 'bg-green-200 hover:bg-green-300'
                    }
                  `}
                >
                  {step.id}
                </button>
              )
            })}
          </div>

          {/* Active Step Details */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
            {activeStepData && (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-400 flex items-center justify-center font-bold text-white text-lg">
                    {activeStep}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {activeStepData.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {activeStepData.description}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {activeStepData.details.map((detail, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckCircle className="text-white" size={12} />
                      </div>
                      <p className="text-sm text-gray-700">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Step 9 */}
          <div className="bg-white rounded-lg p-3 border-2 border-gray-200 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-400 flex items-center justify-center font-bold text-white flex-shrink-0">
                9
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-sm mb-0.5">
                  {step9.title}
                </h3>
                <p className="text-xs text-gray-600 leading-tight">
                  {step9.description}
                </p>
              </div>
            </div>
          </div>

          {/* Step 9 Details */}
          <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Competition Day!
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              You've made it! Now it's time to showcase your strength and determination.
            </p>
            <h4 className="font-bold text-gray-900 mb-3 text-sm">Possible Outcomes:</h4>
            <div className="space-y-3">
              {step9.outcomes.map((outcome, i) => {
                const OutcomeIcon = outcome.icon
                return (
                  <div key={i} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                    <OutcomeIcon className={`${outcome.color} flex-shrink-0`} size={24} />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{outcome.label}</p>
                      <p className="text-xs text-gray-500">{outcome.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border-2 border-green-200 shadow-lg text-center">
          <p className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
            Ready to Begin Your Journey?
          </p>
          <p className="text-gray-600 mb-6">
            Every champion started with step one. Take yours today.
          </p>
          <a
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white text-lg font-bold rounded-full hover:bg-green-700 transition shadow-lg hover:shadow-xl"
          >
            Start Your Journey
            <ChevronRight size={20} />
          </a>
        </div>
      </div>
    </section>
  )
}