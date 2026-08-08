import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Verify the caller is an authenticated admin or super_admin ──────
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const callerToken = authHeader.replace('Bearer ', '')

    const callerClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user: callerUser } } = await callerClient.auth.getUser(callerToken)

    if (!callerUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: callerData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', callerUser.id)
      .single()

    if (callerData?.role !== 'admin' && callerData?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // ── 2. Parse body ────────────────────────────────────────────────────────
    const { user_id } = await req.json()
    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 })
    }

    // Guard against self-deletion / accidental admin deletion via this endpoint
    if (user_id === callerUser.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 })
    }

    // ── 3. Delete dependent rows first to avoid FK violations ──────────────
    // investor_documents is global (not user-scoped), so nothing to clean up there.
    const { error: profileDeleteError } = await supabaseAdmin
      .from('investor_profiles')
      .delete()
      .eq('user_id', user_id)

    if (profileDeleteError) {
      console.warn('Failed to delete investor_profiles row (continuing):', profileDeleteError.message)
    }

    // ── 4. Delete the users table row ───────────────────────────────────────
    const { error: userDeleteError } = await supabaseAdmin
      .from('users')
      .delete()
      .eq('id', user_id)

    if (userDeleteError) throw userDeleteError

    // ── 5. Delete the actual Supabase Auth user ─────────────────────────────
    const { error: authDeleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id)
    if (authDeleteError) throw authDeleteError

    return NextResponse.json({ success: true })

  } catch (err: any) {
    console.error('Delete investor error:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}