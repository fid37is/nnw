// File: app/admin/login/page.tsx
import { Suspense } from 'react'
import AdminLoginForm from '../../../components/admin/AdminLoginForm'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-naija-green-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-600 border-t-white rounded-full animate-spin" />
      </main>
    }>
      <AdminLoginForm />
    </Suspense>
  )
}