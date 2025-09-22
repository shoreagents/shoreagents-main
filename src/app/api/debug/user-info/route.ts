import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateUserId } from '@/lib/userEngagementService'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get current device fingerprint ID
    const deviceFingerprintId = generateUserId()
    
    // Check if user exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)
      .single()

    // Check if user exists in user_page_visits table
    const { data: visitsData, error: visitsError } = await supabase
      .from('user_page_visits')
      .select('*')
      .eq('user_id', deviceFingerprintId)

    return NextResponse.json({
      success: true,
      debug: {
        deviceFingerprintId,
        userExists: !!userData,
        userData: userData || null,
        userError: userError?.message || null,
        visitsCount: visitsData?.length || 0,
        visitsData: visitsData || [],
        visitsError: visitsError?.message || null,
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
