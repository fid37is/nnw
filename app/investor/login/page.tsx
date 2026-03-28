// File: app/investor/login/page.tsx
import { Suspense } from 'react'
import InvestorLoginForm from '../../../components/investor/InvestorLoginForm'

export default function InvestorLoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-naija-green-900 via-naija-green-800 to-naija-green-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-naija-green-400 border-t-white rounded-full animate-spin" />
      </main>
    }>
      <InvestorLoginForm />
    </Suspense>
  )
}