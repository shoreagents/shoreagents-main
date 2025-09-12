import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateUserId } from '@/lib/userEngagementService'
import { UserType } from '@/types/user'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phoneNumber, 
      company, 
      country 
    } = body

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !phoneNumber || !company || !country) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    if (!supabase) {
      return NextResponse.json(
        { error: 'Database connection not available' },
        { status: 500 }
      )
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          phone_number: phoneNumber,
          company,
          country,
        }
      }
    })

    if (authError) {
      console.error('Supabase auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      )
    }

    // Get the current device fingerprint ID (this preserves anonymous tracking data)
    const deviceFingerprintId = generateUserId()
    
    console.log('🔍 Sign-up debug info:', {
      deviceFingerprintId,
      authUserId: authData.user.id,
      email: authData.user.email
    })

    // Check ALL users in database to see what device IDs exist
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('user_id, auth_user_id, first_name, email')
      .order('created_at', { ascending: false })

    console.log('🔍 All users in database:', { allUsers, allUsersError })

    // First, check if anonymous user already exists with current device ID
    const { data: existingUser, error: checkError } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', deviceFingerprintId)
      .single()

    console.log('🔍 Existing user check for device ID:', { deviceFingerprintId, existingUser, checkError })

    // Also check if there are any anonymous users (users with null auth_user_id)
    const { data: anonymousUsers, error: anonymousError } = await supabase
      .from('users')
      .select('*')
      .is('auth_user_id', null)
      .order('created_at', { ascending: false })

    console.log('🔍 Anonymous users in database:', { anonymousUsers, anonymousError })

    // All new signups are regular users by default
    // Admin status must be set manually in the database
    const userType = UserType.REGULAR
    console.log('🔍 User type set to regular (admin must be set manually):', { email, userType })

    let userData, userError

    if (existingUser) {
      // Update existing anonymous user with auth data
      console.log('📝 Updating existing anonymous user with auth data')
      const { data, error } = await supabase
        .from('users')
        .update({
          auth_user_id: authData.user.id, // Add auth UUID
          user_type: userType, // Set user type
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
    } else if (anonymousUsers && anonymousUsers.length > 0) {
      // Fallback: Update the most recent anonymous user
      const mostRecentAnonymous = anonymousUsers[0]
      console.log('🔄 Fallback: Updating most recent anonymous user:', mostRecentAnonymous.user_id)
      
      const { data, error } = await supabase
        .from('users')
        .update({
          auth_user_id: authData.user.id, // Add auth UUID
          user_type: userType, // Set user type
          first_name: firstName,
          last_name: lastName,
          email: email,
          phone_number: phoneNumber,
          company,
          country,
        })
        .eq('user_id', mostRecentAnonymous.user_id)
        .select()
      
      userData = data
      userError = error
      
      console.log('🔄 Fallback update result:', { userData, userError })
    } else {
      // Create new user record
      console.log('🆕 Creating new user record')
      const { data, error } = await supabase
        .from('users')
        .insert({
          user_id: deviceFingerprintId, // Device fingerprint ID for tracking
          auth_user_id: authData.user.id, // Supabase auth UUID
          user_type: userType, // Set user type
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

    if (userError) {
      console.error('Error creating/updating user record:', userError)
      return NextResponse.json(
        { error: 'Account created but failed to link tracking data. Please contact support.' },
        { status: 500 }
      )
    }

    console.log('✅ User record created/updated successfully:', userData)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully - your anonymous tracking data has been preserved!',
      user: {
        id: authData.user.id,
        deviceFingerprintId: deviceFingerprintId,
        email: authData.user.email,
        firstName,
        lastName,
        company,
        country,
      }
    })

  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
