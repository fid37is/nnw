import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'naijaninja.net'
const ADMIN_SUB     = 'admin'
const INVESTOR_SUB  = 'investor'

export function proxy(req: NextRequest) {
  const url      = req.nextUrl.clone()
  const host     = req.headers.get('host') || ''
  const hostname = host.split(':')[0]
  const isLocalDev = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  // Determine subdomain
  let subdomain: string | null = null
  if (isLocalDev) {
    const parts = hostname.split('.')
    if (parts.length >= 2) subdomain = parts[0]
  } else {
    if (hostname.endsWith(`.${PUBLIC_DOMAIN}`)) {
      subdomain = hostname.replace(`.${PUBLIC_DOMAIN}`, '')
    }
  }

  // ── Admin subdomain ────────────────────────────────────────────────────────
  if (subdomain === ADMIN_SUB) {
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
    if (url.pathname === '/login') {
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`
    }
    return NextResponse.rewrite(url)
  }

  // ── Investor subdomain ─────────────────────────────────────────────────────
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

  // ── Main domain — block /admin and /investor direct access ─────────────────
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
    /*
     * Only run middleware on page routes — NOT on:
     * - _next/static  (static files)
     * - _next/image   (image optimisation)
     * - favicon, images, fonts, css, js
     * This is critical for performance — middleware ran on EVERY request before
     */
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
}