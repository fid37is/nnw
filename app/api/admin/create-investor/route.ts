import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    // ── 1. Verify the caller is an authenticated admin ──────────────────────
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const callerToken = authHeader.replace('Bearer ', '')

    // Validate the caller's session using the anon key client
    const callerClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: { user: callerUser } } = await callerClient.auth.getUser(callerToken)

    if (!callerUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check caller is admin
    const { data: callerData } = await supabaseAdmin
      .from('users')
      .select('role')
      .eq('id', callerUser.id)
      .single()

    if (callerData?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    // ── 2. Parse request body ───────────────────────────────────────────────
    const body = await req.json()
    const {
      full_name,
      email,
      phone,
      password,
      investment_amount,
      investment_structure,
      equity_percentage,
      notes,
    } = body

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: 'full_name, email, and password are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // ── 3. Create Supabase Auth user with email already confirmed ───────────
    // Using the admin API (service role) bypasses email verification entirely
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,          // ← skips email verification
      user_metadata: { full_name },
    })

    if (createError) {
      // Handle duplicate email gracefully
      if (createError.message.includes('already been registered') ||
          createError.message.includes('already exists')) {
        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 409 }
        )
      }
      throw createError
    }

    if (!newUser.user) {
      throw new Error('User creation returned no user')
    }

    const newUserId = newUser.user.id

    // ── 4. Create user row with investor role ───────────────────────────────
    const { error: userRowError } = await supabaseAdmin
      .from('users')
      .upsert({
        id:                   newUserId,
        email,
        full_name,
        phone:                phone || null,
        role:                 'investor',
        must_change_password: true,
        profile_completed:    true,
      })

    if (userRowError) throw userRowError

    // ── 5. Create investment profile if amount provided ─────────────────────
    if (investment_amount && Number(investment_amount) > 0) {
      const { error: profileError } = await supabaseAdmin
        .from('investor_profiles')
        .insert({
          user_id:              newUserId,
          investment_amount:    Number(investment_amount),
          investment_structure: investment_structure || 'equity',
          equity_percentage:    equity_percentage ? Number(equity_percentage) : null,
          investment_date:      new Date().toISOString(),
          notes:                notes || '',
        })

      if (profileError) {
        // Non-fatal — profile can be set later
        console.warn('Failed to create investor profile:', profileError.message)
      }
    }

    return NextResponse.json({
      success:  true,
      user_id:  newUserId,
      message:  `Investor account created for ${full_name}. They can log in immediately — no email verification required.`,
    })

  } catch (err: any) {
    console.error('Create investor error:', err)
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 }
    )
  }
}