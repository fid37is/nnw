/**
 * Auth utilities — centralised redirect paths
 *
 * On subdomains the login pages live at /login relative to each subdomain:
 *   admin.naijaninja.net/login    → app/admin/login/page.tsx
 *   investor.naijaninja.net/login → app/investor/login/page.tsx
 *   naijaninja.net/login          → app/(auth)/login/page.tsx
 *
 * Every admin/investor page imports from here so there's one place to change.
 */

export const AUTH_ROUTES = {
  adminLogin:    '/admin/login',
  investorLogin: '/investor/login',
  publicLogin:   '/login',
  adminHome:     '/admin/dashboard',
  investorHome:  '/investor/dashboard',
  userHome:      '/user/dashboard',
} as const

/** Redirect unauthenticated admin visitors to the admin login page */
export function redirectToAdminLogin(): never {
  window.location.href = AUTH_ROUTES.adminLogin
  throw new Error('Redirecting')   // stops execution; never actually thrown
}

/** Redirect unauthenticated investor visitors to the investor login page */
export function redirectToInvestorLogin(): never {
  window.location.href = AUTH_ROUTES.investorLogin
  throw new Error('Redirecting')
}

/** Redirect non-admin to user dashboard */
export function redirectToUserDashboard(): never {
  window.location.href = AUTH_ROUTES.userHome
  throw new Error('Redirecting')
}