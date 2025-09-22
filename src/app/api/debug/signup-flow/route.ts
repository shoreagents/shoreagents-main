import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateUserId } from '@/lib/userEngagementService'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current device fingerprint ID
    const deviceFingerprintId = generateUserId()
    
    // Check all users in the database
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    // Check if current device ID exists
    const { data: currentUser, error: currentUserError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)
      .single()

    // Check page visits for current device
    const { data: pageVisits, error: pageVisitsError } = await supabase
      .from('user_page_visits')
      .select('*')
      .eq('user_id', deviceFingerprintId)

    // Check if there are any users with null auth_user_id (anonymous users)
    const { data: anonymousUsers, error: anonymousUsersError } = await supabase
      .from('users')
      .select('*')
      .is('auth_user_id', null)

    return NextResponse.json({
      success: true,
      debug: {
        currentDeviceFingerprintId: deviceFingerprintId,
        currentUserExists: !!currentUser,
        currentUser: currentUser || null,
        currentUserError: currentUserError?.message || null,
        pageVisitsCount: pageVisits?.length || 0,
        pageVisits: pageVisits || [],
        pageVisitsError: pageVisitsError?.message || null,
        allUsersCount: allUsers?.length || 0,
        allUsers: allUsers || [],
        allUsersError: allUsersError?.message || null,
        anonymousUsersCount: anonymousUsers?.length || 0,
        anonymousUsers: anonymousUsers || [],
        anonymousUsersError: anonymousUsersError?.message || null,
      }
    })

  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
