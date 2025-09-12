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

    const body = await request.json()
    const { testAuthId = 'test-auth-123' } = body

    // Get current device fingerprint ID
    const deviceFingerprintId = generateUserId()
    
    console.log('🧪 Testing user update process with:', { deviceFingerprintId, testAuthId })

    // First, check if anonymous user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)
      .single()

    console.log('🔍 Existing user check:', { existingUser, checkError })

    let result

    if (existingUser) {
      // Update existing anonymous user with auth data
      console.log('📝 Updating existing anonymous user with auth data')
      const { data, error } = await supabase
        .from('users')
        .update({
          auth_user_id: testAuthId, // Add test auth UUID
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone_number: '+1234567890',
          company: 'Test Company',
          country: 'Test Country',
        })
        .eq('user_id', deviceFingerprintId)
        .select()
      
      result = { action: 'update', data, error }
    } else {
      // Create new user record
      console.log('🆕 Creating new user record')
      const { data, error } = await supabase
        .from('users')
        .insert({
          user_id: deviceFingerprintId,
          auth_user_id: testAuthId,
          first_name: 'Test',
          last_name: 'User',
          email: 'test@example.com',
          phone_number: '+1234567890',
          company: 'Test Company',
          country: 'Test Country',
        })
        .select()
      
      result = { action: 'insert', data, error }
    }

    // Get final user record
    const { data: finalUser, error: finalError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)
      .single()

    return NextResponse.json({
      success: true,
      test: {
        deviceFingerprintId,
        testAuthId,
        existingUser,
        checkError: checkError?.message || null,
        result,
        finalUser,
        finalError: finalError?.message || null,
      }
    })

  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
