// File: proxy.ts
// Auth checks removed from proxy — routing only.
// Auth is handled client-side in each dashboard page via useAuthGuard hook.
// See: hooks/useAuthGuard.ts

import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'naijaninja.net'
const ADMIN_SUB     = 'admin'
const INVESTOR_SUB  = 'investor'

export async function proxy(req: NextRequest) {
  const url      = req.nextUrl.clone()
  const host     = req.headers.get('host') || ''
  const hostname = host.split(':')[0]
  const isLocalDev = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  let subdomain: string | null = null

  if (isLocalDev) {
    // Local dev: derive subdomain from path prefix since subdomains
    // don't work on localhost without hosts file changes
    if (url.pathname.startsWith('/admin'))    subdomain = ADMIN_SUB
    if (url.pathname.startsWith('/investor')) subdomain = INVESTOR_SUB
  } else {
    if (hostname.endsWith(`.${PUBLIC_DOMAIN}`)) {
      subdomain = hostname.replace(`.${PUBLIC_DOMAIN}`, '')
    }
  }

  // ── ADMIN ─────────────────────────────────────────────────────────────────
  if (subdomain === ADMIN_SUB) {
    if (url.pathname === '/login' || url.pathname === '/admin/login') {
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }
    if (url.pathname === '/' || url.pathname === '/admin') {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`
    }
    return NextResponse.rewrite(url)
  }

  // ── INVESTOR ──────────────────────────────────────────────────────────────
  if (subdomain === INVESTOR_SUB) {
    if (url.pathname === '/login' || url.pathname === '/investor/login') {
      url.pathname = '/investor/login'
      return NextResponse.rewrite(url)
    }
    if (url.pathname === '/investor') {
  url.pathname = '/investor/dashboard'
  return NextResponse.redirect(url)
}
    if (!url.pathname.startsWith('/investor')) {
      url.pathname = `/investor${url.pathname}`
    }
    return NextResponse.rewrite(url)
  }

  // ── Main domain — redirect direct /admin or /investor access ─────────────
  if (!isLocalDev) {
    if (url.pathname.startsWith('/admin')) {
      url.host     = `${ADMIN_SUB}.${PUBLIC_DOMAIN}`
      url.pathname = url.pathname.replace('/admin', '') || '/'
      return NextResponse.redirect(url)
    }
    if (url.pathname.startsWith('/investor')) {
      url.host     = `${INVESTOR_SUB}.${PUBLIC_DOMAIN}`
      url.pathname = url.pathname.replace('/investor', '') || '/'
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
}
