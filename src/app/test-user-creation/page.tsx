"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { candidateTracker } from '@/lib/candidateTrackingService'
import { useAuth } from '@/lib/auth-context'
import { generateUserId } from '@/lib/userEngagementService'
import { InlineLoader } from '@/components/ui/loader'

export default function TestUserCreationPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const { appUser } = useAuth()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDeviceId(localStorage.getItem('content_tracking_device_id'))
    }
  }, [])

  const testUserCreation = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const supabase = createClient()
      const testUserId = 'device_test_creation_' + Date.now()
      
      console.log('Testing user creation with ID:', testUserId)
      
      // Test 1: Check if user exists (should not exist)
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', testUserId)
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError
      }

      if (existingUser) {
        setTestResult('❌ User already exists (unexpected)')
        setLoading(false)
        return
      }

      setTestResult('✅ User does not exist (expected)')

      // Test 2: Create user manually
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          user_id: testUserId,
          user_type: 'Anonymous'
        })
        .select('user_id')
        .single()

      if (createError) {
        setTestResult(prev => prev + `\n❌ Error creating user: ${createError.message}`)
        setLoading(false)
        return
      }

      setTestResult(prev => prev + `\n✅ User created successfully: ${newUser.user_id}`)

      // Test 3: Test candidate tracking with the new user
      await candidateTracker.startTracking(
        testUserId,
        'test_candidate_' + Date.now(),
        'Test Candidate'
      )

      setTestResult(prev => prev + '\n✅ Candidate tracking started successfully')

      // Test 4: Check if candidate view was recorded
      const { data: candidateViews, error: viewsError } = await supabase
        .from('candidate_views')
        .select('id, user_id, candidate_id, candidate_name, interaction_type, created_at')
        .eq('user_id', testUserId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (viewsError) {
        setTestResult(prev => prev + `\n❌ Error fetching candidate views: ${viewsError.message}`)
      } else {
        setTestResult(prev => prev + `\n✅ Found ${candidateViews?.length || 0} candidate views`)
        if (candidateViews && candidateViews.length > 0) {
          setTestResult(prev => prev + `\n   Latest: ${candidateViews[0].candidate_name} (${candidateViews[0].interaction_type})`)
        }
      }

      // Clean up test data
      await supabase.from('candidate_views').delete().eq('user_id', testUserId)
      await supabase.from('users').delete().eq('user_id', testUserId)

      setTestResult(prev => prev + '\n✅ Test data cleaned up')

    } catch (err: any) {
      console.error('Error testing user creation:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testWithCurrentDevice = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      
      if (!currentUserId) {
        setTestResult('❌ No user ID or device ID available')
        setLoading(false)
        return
      }

      console.log('Testing with current user/device ID:', currentUserId)
      setTestResult(`🔍 Testing with user ID: ${currentUserId}`)

      // Test candidate tracking
      await candidateTracker.startTracking(
        currentUserId,
        'test_candidate_current_' + Date.now(),
        'Test Candidate Current'
      )

      setTestResult(prev => prev + '\n✅ Candidate tracking started')

      // Check if candidate view was recorded
      const supabase = createClient()
      const { data: candidateViews, error: viewsError } = await supabase
        .from('candidate_views')
        .select('id, user_id, candidate_id, candidate_name, interaction_type, created_at')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })
        .limit(5)

      if (viewsError) {
        setTestResult(prev => prev + `\n❌ Error fetching candidate views: ${viewsError.message}`)
      } else {
        setTestResult(prev => prev + `\n✅ Found ${candidateViews?.length || 0} candidate views`)
        if (candidateViews && candidateViews.length > 0) {
          setTestResult(prev => prev + `\n   Latest: ${candidateViews[0].candidate_name} (${candidateViews[0].interaction_type})`)
        }
      }

    } catch (err: any) {
      console.error('Error testing with current device:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test User Creation</h1>
      <p className="mb-4">This page tests the user creation functionality for candidate tracking.</p>

      <div className="flex space-x-2 mb-6">
        <Button onClick={testUserCreation} disabled={loading} className="bg-lime-600 hover:bg-lime-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test User Creation'}
        </Button>
        <Button onClick={testWithCurrentDevice} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test with Current Device'}
        </Button>
      </div>

      {error && <div className="text-red-500 mb-4">Error: {error}</div>}

      {testResult && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm bg-gray-100 p-3 rounded">
              {testResult}
            </pre>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current User/Device Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Authenticated User ID:</strong> {appUser?.user_id || 'N/A'}</p>
            <p><strong>Device ID:</strong> {deviceId || 'N/A'}</p>
            <p><strong>User Type:</strong> {appUser ? 'Authenticated' : 'Anonymous'}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Test User Creation:</strong> Creates a new user and tests candidate tracking</p>
              <p><strong>Test with Current Device:</strong> Uses your current device ID to test tracking</p>
              <p><strong>Expected Results:</strong></p>
              <ul className="ml-4 list-disc">
                <li>User should be created in users table</li>
                <li>Candidate view should be recorded in candidate_views table</li>
                <li>No foreign key constraint violations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
