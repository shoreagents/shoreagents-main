"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { candidateTracker } from '@/lib/candidateTrackingService'
import { useAuth } from '@/lib/auth-context'
import { generateUserId } from '@/lib/userEngagementService'
import { InlineLoader } from '@/components/ui/loader'

interface User {
  user_id: string;
  user_type: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
}

interface CandidateView {
  id: number;
  user_id: string;
  candidate_id: string;
  candidate_name: string;
  interaction_type: string;
  created_at: string;
}

export default function DebugCandidateViewsIssuePage() {
  const [users, setUsers] = useState<User[] | null>(null)
  const [candidateViews, setCandidateViews] = useState<CandidateView[] | null>(null)
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

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    setUsers(null)
    setCandidateViews(null)

    const supabase = createClient()
    if (!supabase) {
      setError('Supabase client not initialized.')
      setLoading(false)
      return
    }

    try {
      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('user_id, user_type, first_name, last_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      if (usersError) throw usersError
      setUsers(usersData as User[])

      // Fetch candidate_views
      const { data: viewsData, error: viewsError } = await supabase
        .from('candidate_views')
        .select('id, user_id, candidate_id, candidate_name, interaction_type, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      if (viewsError) throw viewsError
      setCandidateViews(viewsData as CandidateView[])

    } catch (err: any) {
      console.error('Error fetching debug data:', err)
      setError(err.message || 'An unknown error occurred.')
    } finally {
      setLoading(false)
    }
  }

  const testCandidateTracking = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const supabase = createClient()
      
      // Test 1: Check if current user/device exists in users table
      const currentUserId = appUser?.user_id || generateUserId()
      console.log('Testing with user ID:', currentUserId)
      console.log('Device ID from localStorage (content_tracking):', deviceId)
      console.log('Device ID from generateUserId (users.user_id source):', generateUserId())
      console.log('App User ID:', appUser?.user_id)
      
      if (!currentUserId) {
        setTestResult('❌ No user ID or device ID available')
        setLoading(false)
        return
      }

      // Check if user exists in users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, user_type')
        .eq('user_id', currentUserId)
        .single()

      if (userError && userError.code !== 'PGRST116') {
        throw userError
      }

      if (!userData) {
        setTestResult(`❌ User ${currentUserId} not found in users table. This is why candidate_views insert fails due to foreign key constraint.`)
        setLoading(false)
        return
      }

      setTestResult(`✅ User ${currentUserId} found in users table (type: ${userData.user_type})`)

      // Test 2: Try to insert a test candidate view
      const testCandidateId = `test_candidate_${Date.now()}`
      const testCandidateName = 'Test Candidate'
      
      const { data: insertData, error: insertError } = await supabase
        .from('candidate_views')
        .insert({
          user_id: currentUserId,
          candidate_id: testCandidateId,
          candidate_name: testCandidateName,
          interaction_type: 'view'
        })
        .select()

      if (insertError) {
        setTestResult(`❌ Failed to insert candidate view: ${insertError.message}`)
        setLoading(false)
        return
      }

      setTestResult(`✅ Successfully inserted candidate view with ID: ${insertData[0].id}`)

      // Clean up test data
      await supabase
        .from('candidate_views')
        .delete()
        .eq('id', insertData[0].id)

      setTestResult(prev => prev + '\n✅ Test data cleaned up')

    } catch (err: any) {
      console.error('Error testing candidate tracking:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testUserCreation = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const supabase = createClient()
      
      // Test creating a user via user_page_visits trigger
      const testUserId = `test_device_${Date.now()}`
      
      const { data: pageVisitData, error: pageVisitError } = await supabase
        .from('user_page_visits')
        .insert({
          user_id: testUserId,
          page_path: '/test-page'
        })
        .select()

      if (pageVisitError) {
        setTestResult(`❌ Failed to create page visit: ${pageVisitError.message}`)
        setLoading(false)
        return
      }

      setTestResult(`✅ Created page visit with ID: ${pageVisitData[0].id}`)

      // Check if user was created by trigger
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('user_id, user_type, created_at')
        .eq('user_id', testUserId)
        .single()

      if (userError && userError.code !== 'PGRST116') {
        throw userError
      }

      if (!userData) {
        setTestResult(prev => prev + '\n❌ User was not created by trigger')
        setLoading(false)
        return
      }

      setTestResult(prev => prev + `\n✅ User created by trigger: ${userData.user_id} (${userData.user_type})`)

      // Clean up test data
      await supabase.from('users').delete().eq('user_id', testUserId)
      await supabase.from('user_page_visits').delete().eq('user_id', testUserId)

      setTestResult(prev => prev + '\n✅ Test data cleaned up')

    } catch (err: any) {
      console.error('Error testing user creation:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Debug Candidate Views Issue</h1>
      <p className="mb-4">This page helps debug why anonymous users aren't saving to the candidate_views table.</p>

      <div className="flex space-x-2 mb-6">
        <Button onClick={fetchData} disabled={loading} className="bg-lime-600 hover:bg-lime-700 text-white">
          {loading ? <InlineLoader size={16} text="Loading..." /> : 'Fetch Data'}
        </Button>
        <Button onClick={testCandidateTracking} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test Candidate Tracking'}
        </Button>
        <Button onClick={testUserCreation} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test User Creation'}
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

      {!loading && (
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
              <CardTitle>Recent Users (from users table)</CardTitle>
            </CardHeader>
            <CardContent>
              {users && users.length > 0 ? (
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.user_id} className="text-sm border-b pb-2">
                      <p><strong>ID:</strong> {user.user_id}</p>
                      <p><strong>Type:</strong> {user.user_type}</p>
                      <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                      <p><strong>Email:</strong> {user.email || 'N/A'}</p>
                      <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No users found.</p>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Candidate Views</CardTitle>
            </CardHeader>
            <CardContent>
              {candidateViews && candidateViews.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {candidateViews.map((view) => (
                        <tr key={view.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{view.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">{view.user_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 truncate max-w-xs">{view.candidate_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{view.candidate_name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{view.interaction_type}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(view.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No candidate views found.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
