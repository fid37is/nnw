import { NextRequest, NextResponse } from 'next/server'

/**
 * Subdomain routing middleware
 *
 * admin.naijaninja.net    → rewrites to /admin/* internally
 * investor.naijaninja.net → rewrites to /investor/* internally
 * naijaninja.net          → public site, normal routing
 *
 * In development (localhost) use:
 *   admin.localhost:3000    for admin
 *   investor.localhost:3000 for investor
 */

const PUBLIC_DOMAIN   = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'naijaninja.net'
const ADMIN_SUB       = 'admin'
const INVESTOR_SUB    = 'investor'

// Routes that don't need subdomain rewriting on the main domain
const MAIN_DOMAIN_ONLY = ['/admin', '/investor']

export function proxy(req: NextRequest) {
  const url   = req.nextUrl.clone()
  const host  = req.headers.get('host') || ''

  // Strip port for local dev comparison
  const hostname = host.split(':')[0]

  // ── Determine subdomain ──────────────────────────────────────────────────

  // Production: admin.naijaninja.net, investor.naijaninja.net
  // Development: admin.localhost, investor.localhost
  const isLocalDev = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  let subdomain: string | null = null

  if (isLocalDev) {
    // e.g. "admin.localhost" → "admin"
    const parts = hostname.split('.')
    if (parts.length >= 2) subdomain = parts[0]
  } else {
    // e.g. "admin.naijaninja.net" → "admin"
    if (hostname.endsWith(`.${PUBLIC_DOMAIN}`)) {
      subdomain = hostname.replace(`.${PUBLIC_DOMAIN}`, '')
    }
  }

  // ── Admin subdomain ──────────────────────────────────────────────────────
  if (subdomain === ADMIN_SUB) {
    // "/" → /admin/dashboard
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }

    // /login → /admin/login
    if (url.pathname === '/login') {
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }

    // Already prefixed — serve as-is
    if (url.pathname.startsWith('/admin')) {
      return NextResponse.rewrite(url)
    }

    // Anything else — prepend /admin
    url.pathname = `/admin${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // ── Investor subdomain ───────────────────────────────────────────────────
  if (subdomain === INVESTOR_SUB) {
    // "/" → /investor/dashboard
    if (url.pathname === '/') {
      url.pathname = '/investor/dashboard'
      return NextResponse.redirect(url)
    }

    // /login → /investor/login (dedicated investor login)
    if (url.pathname === '/login') {
      url.pathname = '/investor/login'
      return NextResponse.rewrite(url)
    }

    // If path doesn't start with /investor, prepend it
    if (!url.pathname.startsWith('/investor')) {
      url.pathname = `/investor${url.pathname}`
    }

    return NextResponse.rewrite(url)
  }

  // ── Main domain — block direct access to /admin and /investor paths ──────
  // These should only be accessed via their subdomains
  // (Keeps routes clean; direct access still works in dev for convenience)
  if (!isLocalDev) {
    for (const blocked of MAIN_DOMAIN_ONLY) {
      if (url.pathname.startsWith(blocked)) {
        // Redirect to the appropriate subdomain
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
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}