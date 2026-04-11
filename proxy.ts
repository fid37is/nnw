import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_DOMAIN  = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'naijaninja.net'
const ADMIN_SUB      = 'admin'
const INVESTOR_SUB   = 'investor'

// ── Paths that are always public — never auth-checked ─────────────────────────
// Keep this list tight. Every path here bypasses the session check entirely.
const ADMIN_PUBLIC_PATHS    = ['/admin/login']
const INVESTOR_PUBLIC_PATHS = ['/investor/login']

// ── Helper: build a Supabase server client from the request cookies ───────────
// This reads the existing session cookie — it does NOT make a network call
// unless the token needs refreshing, so it is very fast.
function makeSupabaseClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: ()                => req.cookies.getAll(),
        setAll: (cookiesToSet)    => {
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )
}

// ── Helper: get session without throwing ──────────────────────────────────────
async function getSession(req: NextRequest, res: NextResponse) {
  try {
    const supabase = makeSupabaseClient(req, res)
    const { data: { session } } = await supabase.auth.getSession()
    return session
  } catch {
    // If Supabase is unreachable, treat as unauthenticated — fail safe
    return null
  }
}

// ── Helper: get user role from session ────────────────────────────────────────
// We read role from the JWT metadata so there's no extra DB round-trip.
// Make sure you set app_metadata.role when creating users server-side.
function getRoleFromSession(session: Awaited<ReturnType<typeof getSession>>) {
  if (!session) return null
  // app_metadata is set server-side and cannot be spoofed by the client
  return (session.user?.app_metadata?.role as string | undefined) ?? null
}

export async function proxy(req: NextRequest) {
  const url      = req.nextUrl.clone()
  const host     = req.headers.get('host') || ''
  const hostname = host.split(':')[0]
  const isLocalDev = hostname.includes('localhost') || hostname.includes('127.0.0.1')

  // ── Determine subdomain ────────────────────────────────────────────────────
  let subdomain: string | null = null
  if (isLocalDev) {
    const parts = hostname.split('.')
    if (parts.length >= 2) subdomain = parts[0]
  } else {
    if (hostname.endsWith(`.${PUBLIC_DOMAIN}`)) {
      subdomain = hostname.replace(`.${PUBLIC_DOMAIN}`, '')
    }
  }

  // We need a mutable response to forward refreshed cookies downstream
  const res = NextResponse.next()

  // ── ADMIN subdomain ────────────────────────────────────────────────────────
  if (subdomain === ADMIN_SUB) {
    const targetPath = url.pathname === '/' ? '/admin/dashboard' : `/admin${url.pathname}`

    // Always allow login page — no session check needed
    if (url.pathname === '/login' || ADMIN_PUBLIC_PATHS.includes(targetPath)) {
      url.pathname = '/admin/login'
      return NextResponse.rewrite(url)
    }

    // Check session before serving any other admin page
    const session = await getSession(req, res)

    if (!session) {
      // No session → redirect to admin login
      // Use redirect (not rewrite) so the browser URL changes to /login
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }

    // Optional: enforce role — uncomment if you store role in app_metadata
    // const role = getRoleFromSession(session)
    // if (role !== 'admin') {
    //   const loginUrl = req.nextUrl.clone()
    //   loginUrl.pathname = '/login'
    //   return NextResponse.redirect(loginUrl)
    // }

    // Authenticated — rewrite to the correct internal path
    if (url.pathname === '/') {
      url.pathname = '/admin/dashboard'
      return NextResponse.redirect(url)
    }
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`
    }
    return NextResponse.rewrite(url, {
      headers: res.headers, // forward any refreshed session cookies
    })
  }

  // ── INVESTOR subdomain ─────────────────────────────────────────────────────
  if (subdomain === INVESTOR_SUB) {
    const targetPath = url.pathname === '/' ? '/investor/dashboard' : `/investor${url.pathname}`

    // Always allow login page
    if (url.pathname === '/login' || INVESTOR_PUBLIC_PATHS.includes(targetPath)) {
      url.pathname = '/investor/login'
      return NextResponse.rewrite(url)
    }

    // Check session before serving any other investor page
    const session = await getSession(req, res)

    if (!session) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = '/login'
      return NextResponse.redirect(loginUrl)
    }

    // Optional: enforce investor role
    // const role = getRoleFromSession(session)
    // if (role !== 'investor') {
    //   const loginUrl = req.nextUrl.clone()
    //   loginUrl.pathname = '/login'
    //   return NextResponse.redirect(loginUrl)
    // }

    // Authenticated — rewrite to the correct internal path
    if (url.pathname === '/') {
      url.pathname = '/investor/dashboard'
      return NextResponse.redirect(url)
    }
    if (!url.pathname.startsWith('/investor')) {
      url.pathname = `/investor${url.pathname}`
    }
    return NextResponse.rewrite(url, {
      headers: res.headers,
    })
  }

  // ── Main domain — block direct /admin and /investor path access ────────────
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