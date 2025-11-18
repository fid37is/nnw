'use client'

import { createContext, useContext, ReactNode } from 'react'

interface LogoConfig {
  logoUrl: string
}

const LogoContext = createContext<LogoConfig | undefined>(undefined)

export function LogoConfigProvider({
  children,
  logoUrl,
}: {
  children: ReactNode
  logoUrl: string
}) {
  return (
    <LogoContext.Provider value={{ logoUrl }}>
      {children}
    </LogoContext.Provider>
  )
}

export function useLogoConfig() {
  const context = useContext(LogoContext)
  if (!context) {
    throw new Error('useLogoConfig must be used within LogoConfigProvider')
  }
  return context
}