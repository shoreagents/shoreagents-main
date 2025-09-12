import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateUserId } from '@/lib/userEngagementService'

export async function POST(request: NextRequest) {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Get current device fingerprint ID
    const deviceFingerprintId = generateUserId()
    
    console.log('🧪 Creating anonymous user with device ID:', deviceFingerprintId)

    // Create anonymous user record
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        user_id: deviceFingerprintId,
        auth_user_id: null, // Anonymous user
        first_name: null,
        last_name: null,
        email: null,
        phone_number: null,
        company: null,
        country: null,
      })
      .select()

    if (insertError) {
      console.error('❌ Failed to create anonymous user:', insertError)
      return NextResponse.json(
        { error: 'Failed to create anonymous user', details: insertError },
        { status: 500 }
      )
    }

    // Also create some test page visits
    const { data: visitData, error: visitError } = await supabase
      .from('user_page_visits')
      .insert([
        {
          user_id: deviceFingerprintId,
          page_path: '/',
          visit_count: 1,
          time_spent_seconds: 30,
          visit_timestamp: new Date().toISOString(),
          last_visit_timestamp: new Date().toISOString(),
        },
        {
          user_id: deviceFingerprintId,
          page_path: '/pricing',
          visit_count: 1,
          time_spent_seconds: 45,
          visit_timestamp: new Date().toISOString(),
          last_visit_timestamp: new Date().toISOString(),
        }
      ])
      .select()

    return NextResponse.json({
      success: true,
      message: 'Anonymous user and test data created successfully',
      data: {
        deviceFingerprintId,
        user: insertData,
        visits: visitData,
        visitError: visitError?.message || null,
      }
    })

  } catch (error) {
    console.error('Create anonymous user error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
