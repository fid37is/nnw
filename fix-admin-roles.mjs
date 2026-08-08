// fix-admin-roles.mjs
// Run from project root: node fix-admin-roles.mjs
// Fixes auth role checks that only check for 'admin' but miss 'super_admin'

import { readFileSync, writeFileSync } from 'fs'

// Files with auth-gate role checks that need fixing
// (dashboard lines 206/209/231 are data filters — leave them alone)
const AUTH_GATE_FILES = [
  './app/admin/applications/page.tsx',
  './app/admin/audit-logs/page.tsx',
  './app/admin/champions/page.tsx',
  './app/admin/investors/page.tsx',
  './app/admin/job-applications/page.tsx',
  './app/admin/merch-sponsor/page.tsx',
  './app/admin/messages/page.tsx',
  './app/admin/payment/page.tsx',
  './app/admin/performance/page.tsx',
  './app/admin/seasons/page.tsx',
  './app/admin/stage-progress/page.tsx',
  './app/admin/stages/page.tsx',
  './app/admin/users/page.tsx',
]

// Patterns to find and their replacements
// Each entry: [searchString, replacement]
// We handle both common patterns seen in the grep output
const REPLACEMENTS = [
  // Pattern 1: u?.role !== 'admin'
  [
    `u?.role !== 'admin'`,
    `u?.role !== 'admin' && u?.role !== 'super_admin'`,
  ],
  // Pattern 2: userData?.role !== 'admin'
  [
    `userData?.role !== 'admin'`,
    `userData?.role !== 'admin' && userData?.role !== 'super_admin'`,
  ],
  // Pattern 3: userError || userData?.role !== 'admin' (payment/page.tsx)
  // Already covered by pattern 2 above — no separate handling needed

  // Also fix the redirect targets — should go to /login not /user/dashboard
  [
    `window.location.href = '/user/dashboard'`,
    `window.location.href = '/login'`,
  ],
]

let totalFixed = 0

for (const filePath of AUTH_GATE_FILES) {
  let content
  try {
    content = readFileSync(filePath, 'utf8')
  } catch {
    console.warn(`⚠️  Could not read: ${filePath}`)
    continue
  }

  let updated = content
  let fileChanged = false

  for (const [search, replace] of REPLACEMENTS) {
    if (updated.includes(search)) {
      updated = updated.split(search).join(replace)
      fileChanged = true
    }
  }

  if (fileChanged) {
    writeFileSync(filePath, updated, 'utf8')
    console.log(`✅ Fixed: ${filePath}`)
    totalFixed++
  } else {
    console.log(`—  No changes: ${filePath}`)
  }
}

console.log(`\nDone — ${totalFixed} file(s) updated.`)
console.log('\nVerify with:')
console.log(`  grep -rn "role !== 'admin'" ./app/admin --include="*.tsx"`)
console.log('Only dashboard data-filter lines (206/209/231) should remain.')
