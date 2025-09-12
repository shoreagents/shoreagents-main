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
    const { 
      firstName = 'Test',
      lastName = 'User',
      email = 'test@example.com',
      phoneNumber = '+1234567890',
      company = 'Test Company',
      country = 'Test Country'
    } = body

    // Get current device fingerprint ID
    const deviceFingerprintId = generateUserId()
    const testAuthId = `test-auth-${Date.now()}`
    
    console.log('🧪 Testing signup update process:', { deviceFingerprintId, testAuthId })

    // First, check if anonymous user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)
      .single()

    console.log('🔍 Existing user check:', { existingUser, checkError })

    let userData, userError, action

    if (existingUser) {
      // Update existing anonymous user with auth data
      console.log('📝 Updating existing anonymous user with auth data')
      action = 'update'
      const { data, error } = await supabase
        .from('users')
        .update({
          auth_user_id: testAuthId, // Add auth UUID
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          company,
          country,
        })
        .eq('user_id', deviceFingerprintId)
        .select()
      
      userData = data
      userError = error
    } else {
      // Create new user record
      console.log('🆕 Creating new user record')
      action = 'insert'
      const { data, error } = await supabase
        .from('users')
        .insert({
          user_id: deviceFingerprintId, // Device fingerprint ID for tracking
          auth_user_id: testAuthId, // Test auth UUID
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          company,
          country,
        })
        .select()
      
      userData = data
      userError = error
    }

    // Get final user record to verify
    const { data: finalUser, error: finalError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)
      .single()

    // Count total users with this device ID (should be 1)
    const { data: allUsersWithDeviceId, error: countError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)

    return NextResponse.json({
      success: true,
      test: {
        deviceFingerprintId,
        testAuthId,
        action,
        existingUser,
        checkError: checkError?.message || null,
        userData,
        userError: userError?.message || null,
        finalUser,
        finalError: finalError?.message || null,
        totalUsersWithDeviceId: allUsersWithDeviceId?.length || 0,
        allUsersWithDeviceId: allUsersWithDeviceId || [],
        countError: countError?.message || null,
      }
    })

  } catch (error) {
    console.error('Test signup update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
    }
}
