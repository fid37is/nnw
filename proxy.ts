// File: proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

const PUBLIC_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'naijaninja.net'
const ADMIN_SUB     = 'admin'
const INVESTOR_SUB  = 'investor'

// ✅ Public paths that never need auth
const ADMIN_PUBLIC_PATHS    = ['/login', '/admin/login']
const INVESTOR_PUBLIC_PATHS = ['/login', '/investor/login']

async function getSessionRole(req: NextRequest): Promise<string | null> {
  try {
    let role: string | null = null

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

    role = data?.role ?? null
    return role
  } catch {
    return null
  }
}

export async function proxy(req: NextRequest) {
  const url        = req.nextUrl.clone()
  const host       = req.headers.get('host') || ''
  const hostname   = host.split(':')[0]
  const isLocalDev = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  let subdomain: string | null = null

  if (isLocalDev) {
    const parts = hostname.split('.')
    if (parts.length >= 2) {
      if (parts[0] === ADMIN_SUB)    subdomain = ADMIN_SUB
      if (parts[0] === INVESTOR_SUB) subdomain = INVESTOR_SUB
    }
    if (!subdomain) {
      if (url.pathname.startsWith('/admin'))                                     subdomain = ADMIN_SUB
      if (url.pathname === '/investor' || url.pathname.startsWith('/investor/')) subdomain = INVESTOR_SUB
    }
  } else {
    if (hostname.endsWith(`.${PUBLIC_DOMAIN}`)) {
      subdomain = hostname.replace(`.${PUBLIC_DOMAIN}`, '')
    }
  }

  // ── ADMIN ──────────────────────────────────────────────────────────────────
  if (subdomain === ADMIN_SUB) {
    const cleanPath = url.pathname.startsWith('/admin/')
      ? url.pathname.replace(/^\/admin/, '')
      : url.pathname

    // Strip /admin/ prefix — redirect to clean URL
    if (url.pathname.startsWith('/admin/')) {
      const cleanUrl    = req.nextUrl.clone()
      cleanUrl.pathname = cleanPath
      return NextResponse.redirect(cleanUrl)
    }

    // Root → /dashboard
    if (url.pathname === '/' || url.pathname === '/admin') {
      const cleanUrl    = req.nextUrl.clone()
      cleanUrl.pathname = '/dashboard'
      return NextResponse.redirect(cleanUrl)
    }

    // ✅ Public paths — no auth needed
    const isPublic = ADMIN_PUBLIC_PATHS.includes(url.pathname)
    if (!isPublic) {
      const role = await getSessionRole(req)
      if (role !== 'admin') {
        const loginUrl    = req.nextUrl.clone()
        loginUrl.pathname = '/admin/login'
        return NextResponse.redirect(loginUrl)
      }
    }

    // Rewrite to /admin/* internally
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`
    }
    return NextResponse.rewrite(url)
  }

  // ── INVESTOR ───────────────────────────────────────────────────────────────
  if (subdomain === INVESTOR_SUB) {
    // Strip /investor/ prefix
    if (url.pathname.startsWith('/investor/')) {
      const cleanUrl    = req.nextUrl.clone()
      cleanUrl.pathname = url.pathname.replace(/^\/investor/, '') || '/'
      return NextResponse.redirect(cleanUrl)
    }

    // Root → /dashboard
    if (url.pathname === '/' || url.pathname === '/investor') {
      const cleanUrl    = req.nextUrl.clone()
      cleanUrl.pathname = '/dashboard'
      return NextResponse.redirect(cleanUrl)
    }

    // ✅ Public paths — no auth needed
    const isPublic = INVESTOR_PUBLIC_PATHS.includes(url.pathname)
    if (!isPublic) {
      const role = await getSessionRole(req)
      if (role !== 'investor') {
        const loginUrl    = req.nextUrl.clone()
        loginUrl.pathname = '/investor/login'
        return NextResponse.redirect(loginUrl)
      }
    }

    // Rewrite to /investor/* internally
    if (!url.pathname.startsWith('/investor')) {
      url.pathname = `/investor${url.pathname}`
    }
    return NextResponse.rewrite(url)
  }

  // ── Main domain ────────────────────────────────────────────────────────────
  if (!isLocalDev) {
    if (url.pathname.startsWith('/admin')) {
      url.host     = `${ADMIN_SUB}.${PUBLIC_DOMAIN}`
      url.pathname = url.pathname.replace('/admin', '') || '/'
      return NextResponse.redirect(url)
    }
    if (url.pathname === '/investor' || url.pathname.startsWith('/investor/')) {
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
