// File: proxy.ts

import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_DOMAIN  = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'naijaninja.net'
const ADMIN_SUB      = 'admin'
const INVESTOR_SUB   = 'investor'

const MAIN_DOMAIN_ONLY = ['/admin', '/investor']

// ✅ Paths that must NEVER be rewritten — always pass through as-is
const BYPASS_PREFIXES = [
  '/api/',
  '/_next/',
  '/favicon.ico',
  '/manifest.json',  // ← also fixes your manifest 404
]

export function proxy(req: NextRequest) {
  const url      = req.nextUrl.clone()
  const host     = req.headers.get('host') || ''
  const hostname = host.split(':')[0]

  // ✅ Always bypass API routes and static assets — never rewrite these
  if (BYPASS_PREFIXES.some(prefix => url.pathname.startsWith(prefix) || url.pathname === prefix.replace('/', ''))) {
    return NextResponse.next()
  }

  const isLocalDev = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  let subdomain: string | null = null

  if (isLocalDev) {
    const parts = hostname.split('.')
    if (parts.length >= 2) subdomain = parts[0]
  } else {
    if (hostname.endsWith(`.${PUBLIC_DOMAIN}`)) {
      subdomain = hostname.replace(`.${PUBLIC_DOMAIN}`, '')
    }
  }

  // ── Admin subdomain ──────────────────────────────────────────────────────
  if (subdomain === ADMIN_SUB) {
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    if (url.pathname === '/login') {
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }

    if (url.pathname.startsWith('/admin')) {
      return NextResponse.rewrite(url)
    }

    url.pathname = `/admin${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // ── Investor subdomain ───────────────────────────────────────────────────
  if (subdomain === INVESTOR_SUB) {
    if (url.pathname === '/') {
      url.pathname = '/investor/dashboard'
      return NextResponse.redirect(url)
    }

    if (url.pathname === '/login') {
      url.pathname = '/investor/login'
      return NextResponse.rewrite(url)
    }

    if (!url.pathname.startsWith('/investor')) {
      url.pathname = `/investor${url.pathname}`
    }

    return NextResponse.rewrite(url)
  }

  // ── Main domain — block direct /admin and /investor access ───────────────
  if (!isLocalDev) {
    for (const blocked of MAIN_DOMAIN_ONLY) {
      if (url.pathname.startsWith(blocked)) {
        const sub = url.pathname.startsWith('/admin') ? ADMIN_SUB : INVESTOR_SUB
        url.host = `${sub}.${PUBLIC_DOMAIN}`
        url.pathname = url.pathname.replace(`/${sub}`, '') || '/'
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}