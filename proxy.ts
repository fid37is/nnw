// File: proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_DOMAIN  = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'naijaninja.net'
const ADMIN_SUB      = 'admin'
const INVESTOR_SUB   = 'investor'

// ── Public paths per subdomain (clean paths — no prefix) ──────────────────────
// These are the paths AFTER the proxy strips the subdomain prefix.
// On admin.localhost:3001/login → clean path is /login → matches here.
const ADMIN_PUBLIC_PATHS    = ['/login']
const INVESTOR_PUBLIC_PATHS = ['/login', '/change-password']

async function getSessionRole(req: NextRequest): Promise<string | null> {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
          setAll: () => {},
        },
      }
    )
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return null

    const { data } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .maybeSingle()

    return data?.role ?? null
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  const url       = req.nextUrl.clone()
  const host      = req.headers.get('host') || ''
  const hostname  = host.split(':')[0]
  const isLocalDev = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  let subdomain: string | null = null

  if (isLocalDev) {
    const parts = hostname.split('.')
    // admin.localhost → parts = ['admin', 'localhost'] → parts[0] = 'admin'
    // investor.localhost → parts[0] = 'investor'
    // localhost (plain) → parts = ['localhost'] → length 1 → no subdomain
    if (parts.length >= 2) {
      if (parts[0] === ADMIN_SUB)    subdomain = ADMIN_SUB
      if (parts[0] === INVESTOR_SUB) subdomain = INVESTOR_SUB
    }
    // Fallback: path-based detection for plain localhost
    if (!subdomain) {
      if (url.pathname.startsWith('/admin'))    subdomain = ADMIN_SUB
      if (url.pathname.startsWith('/investor')) subdomain = INVESTOR_SUB
    }
  } else {
    if (hostname.endsWith(`.${PUBLIC_DOMAIN}`)) {
      subdomain = hostname.replace(`.${PUBLIC_DOMAIN}`, '')
    }
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  if (subdomain === ADMIN_SUB) {

    // 1. Strip /admin/ prefix if someone navigates with it — redirect to clean URL
    if (url.pathname.startsWith('/admin/') || url.pathname === '/admin') {
      const cleanUrl = req.nextUrl.clone()
      cleanUrl.pathname = url.pathname.replace(/^\/admin/, '') || '/'
      return NextResponse.redirect(cleanUrl)
    }

    // 2. Root → /dashboard
    if (url.pathname === '/') {
      const cleanUrl = req.nextUrl.clone()
      cleanUrl.pathname = '/dashboard'
      return NextResponse.redirect(cleanUrl)
    }

    // 3. API routes — pass through untouched (no rewrite, no auth)
    if (url.pathname.startsWith('/api/')) {
      return NextResponse.next()
    }

    // 4. Static/system paths — pass through
    if (
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/favicon')
    ) {
      return NextResponse.next()
    }

    // 5. Auth — skip for public paths
    const isPublic = ADMIN_PUBLIC_PATHS.some(p =>
      url.pathname === p || url.pathname.startsWith(p + '/')
    )

    if (!isPublic) {
      const role = await getSessionRole(req)
      if (role !== 'admin' && role !== 'super_admin') {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/login' // ✅ clean path — no double-prefix
        return NextResponse.redirect(loginUrl)
      }
    }

    // 6. Rewrite to /admin/* internally
    url.pathname = `/admin${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // ── INVESTOR ───────────────────────────────────────────────────────────────
  if (subdomain === INVESTOR_SUB) {

    // 1. Strip /investor/ prefix
    if (url.pathname.startsWith('/investor/') || url.pathname === '/investor') {
      const cleanUrl = req.nextUrl.clone()
      cleanUrl.pathname = url.pathname.replace(/^\/investor/, '') || '/'
      return NextResponse.redirect(cleanUrl)
    }

    // 2. Root → /dashboard
    if (url.pathname === '/') {
      const cleanUrl = req.nextUrl.clone()
      cleanUrl.pathname = '/dashboard'
      return NextResponse.redirect(cleanUrl)
    }

    // 3. API routes — pass through untouched
    if (url.pathname.startsWith('/api/')) {
      return NextResponse.next()
    }

    // 4. Static/system paths — pass through
    if (
      url.pathname.startsWith('/_next') ||
      url.pathname.startsWith('/favicon')
    ) {
      return NextResponse.next()
    }

    // 5. Auth — skip for public paths
    const isPublic = INVESTOR_PUBLIC_PATHS.some(p =>
      url.pathname === p || url.pathname.startsWith(p + '/')
    )

    if (!isPublic) {
      const role = await getSessionRole(req)
      if (role !== 'investor') {
        const loginUrl = req.nextUrl.clone()
        loginUrl.pathname = '/login' // ✅ clean path — no double-prefix
        return NextResponse.redirect(loginUrl)
      }
    }

    // 6. Rewrite to /investor/* internally
    url.pathname = `/investor${url.pathname}`
    return NextResponse.rewrite(url)
  }

  // ── Main domain ────────────────────────────────────────────────────────────
  if (!isLocalDev) {
    // Redirect /admin/* to admin subdomain
    if (url.pathname.startsWith('/admin')) {
      const redirect = url.clone()
      redirect.host     = `${ADMIN_SUB}.${PUBLIC_DOMAIN}`
      redirect.pathname = url.pathname.replace(/^\/admin/, '') || '/'
      return NextResponse.redirect(redirect)
    }
    // Redirect /investor/* to investor subdomain
    if (url.pathname.startsWith('/investor')) {
      const redirect = url.clone()
      redirect.host     = `${INVESTOR_SUB}.${PUBLIC_DOMAIN}`
      redirect.pathname = url.pathname.replace(/^\/investor/, '') || '/'
      return NextResponse.redirect(redirect)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf)$).*)',
  ],
}