'use client'

import { createContext, useContext, ReactNode } from 'react'

interface AuthConfig {
  logoUrl: string
}

const AuthContext = createContext<AuthConfig | undefined>(undefined)

export function AuthConfigProvider({
  children,
  logoUrl,
}: {
  children: ReactNode
  logoUrl: string
}) {
  return (
    <AuthContext.Provider value={{ logoUrl }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthConfig() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthConfig must be used within AuthConfigProvider')
  }
  return context
}