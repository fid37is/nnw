'use client'

import { useState, useEffect } from 'react'
import { useScrollReveal } from '@/lib/hooks'
import { Search, UserPlus, ClipboardList, Clock, CheckCircle, CreditCard, Dumbbell, Zap, Trophy } from 'lucide-react'

export default function CompetitionProcessSection({ isApplicationOpen = false }: { isApplicationOpen?: boolean }) {
  const { ref, visible } = useScrollReveal(0.05)
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    { id:1, Icon:Search,       title:'Discover',  desc:'Explore the competition, understand the format, get inspired.' },
    { id:2, Icon:UserPlus,     title:'Register',  desc:'Create your warrior account with your details.' },
    { id:3, Icon:ClipboardList,title:'Apply',     desc:'Submit your formal application with fitness background.' },
    { id:4, Icon:Clock,        title:'Review',    desc:'Our team evaluates your application within 3-5 days.' },
    { id:5, Icon:CheckCircle,  title:'Selected',  desc:'Receive your acceptance notification and schedule.' },
    { id:6, Icon:CreditCard,   title:'Pay',       desc:'Complete your participation fee to secure your slot.' },
    { id:7, Icon:Dumbbell,     title:'Train',     desc:'Prepare with certified training gyms nationwide.' },
    { id:8, Icon:Zap,          title:'Compete',   desc:'Show up, give everything, and fight for the title.' },
    { id:9, Icon:Trophy,       title:'Champion',  desc:'Win your zone, advance to Abuja, become a legend.' },
  ]

  useEffect(()=>{
    const id=setInterval(()=>setCurrentStep(p=>(p+1)%steps.length), 2800)
    return()=>clearInterval(id)
  },[])

  return (
    <section ref={ref as any} className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16"
          style={{opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(24px)',transition:'all 0.6s ease'}}>
          <span className="inline-block text-naija-green-600 text-xs font-black tracking-widest uppercase mb-4 px-4 py-2 border border-naija-green-200 rounded-full bg-naija-green-50">
            The Journey
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight mt-3">
            9 Steps to Glory
          </h2>
          <p className="text-gray-500 text-lg mt-4">From interest to champion — your path is clear.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {steps.slice(0,8).map((step, i) => (
            <StepCard key={step.id} step={step} index={i} active={currentStep===i} visible={visible}/>
          ))}
          {/* Step 9 spans full on mobile, larger on desktop */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-1">
            <StepCard step={steps[8]} index={8} active={currentStep===8} visible={visible} featured/>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-10 flex gap-1.5 justify-center"
          style={{opacity:visible?1:0,transition:'all 0.6s ease 800ms'}}>
          {steps.map((_,i)=>(
            <div key={i}
              className={`h-1 rounded-full transition-all duration-500 ${i===currentStep?'w-8 bg-naija-green-600':'w-2 bg-gray-200'}`}/>
          ))}
        </div>

        {isApplicationOpen && (
          <div className="text-center mt-12"
            style={{opacity:visible?1:0,transition:'all 0.6s ease 900ms'}}>
            <a href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 bg-naija-green-600 hover:bg-naija-green-700 text-white font-black rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
              Begin Your Journey
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

function StepCard({step,index,active,visible,featured=false}:{step:{id:number;Icon:any;title:string;desc:string};index:number;active:boolean;visible:boolean;featured?:boolean}) {
  return (
    <div
      className={`relative rounded-2xl border-2 p-6 transition-all duration-500 ${active?'border-naija-green-400 bg-naija-green-50 shadow-lg shadow-naija-green-100':'border-gray-100 bg-white hover:border-gray-200'} ${featured?'flex flex-col justify-center':''}` }
      style={{opacity:visible?1:0,transform:visible?'translateY(0)':'translateY(32px)',transition:`all 0.6s ease ${index*60}ms`}}>
      {active && <div className="absolute inset-0 rounded-2xl ring-2 ring-naija-green-400 ring-offset-2 pointer-events-none"/>}
      <div className={`mb-3 ${active?'text-naija-green-600':'text-gray-400'}`}><step.Icon size={22}/></div>
      <div className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black mb-3 ${active?'bg-naija-green-600 text-white':'bg-gray-100 text-gray-500'}`}>
        {step.id}
      </div>
      <h3 className={`font-black text-base mb-1.5 ${active?'text-naija-green-800':'text-gray-900'} ${featured?'text-xl':''}`}>{step.title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
    </div>
  )
}