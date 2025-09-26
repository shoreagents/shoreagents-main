"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { candidateTracker } from '@/lib/candidateTrackingService'
import { useAuth } from '@/lib/auth-context'
import { generateUserId } from '@/lib/userEngagementService'
import { InlineLoader } from '@/components/ui/loader'

export default function TestViewDurationPage() {
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

  const testViewDurationTracking = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const testCandidateId = 'test_candidate_duration_' + Date.now()
      const testCandidateName = 'Test Candidate Duration'
      
      console.log('Testing view duration tracking with:', {
        userId: currentUserId,
        candidateId: testCandidateId,
        candidateName: testCandidateName
      })
      
      setTestResult(`🔍 Testing view duration tracking...\nUser ID: ${currentUserId}\nCandidate ID: ${testCandidateId}`)

      // Start tracking
      await candidateTracker.startTracking(
        currentUserId,
        testCandidateId,
        testCandidateName
      )

      setTestResult(prev => prev + '\n✅ Started tracking candidate view')

      // Simulate user spending time on the page (5 seconds)
      setTestResult(prev => prev + '\n⏱️ Simulating 5 seconds of viewing...')
      await new Promise(resolve => setTimeout(resolve, 5000))

      // End tracking
      await candidateTracker.endTracking()

      setTestResult(prev => prev + '\n✅ Ended tracking - should have recorded 5 seconds duration')

      // Check if the view duration was recorded
      const supabase = createClient()
      const { data: candidateViews, error: viewsError } = await supabase
        .from('candidate_views')
        .select('id, user_id, candidate_id, candidate_name, view_duration, interaction_type, created_at')
        .eq('user_id', currentUserId)
        .eq('candidate_id', testCandidateId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (viewsError) {
        setTestResult(prev => prev + `\n❌ Error fetching candidate views: ${viewsError.message}`)
      } else if (candidateViews && candidateViews.length > 0) {
        const view = candidateViews[0]
        setTestResult(prev => prev + `\n📊 Recorded view duration: ${view.view_duration} seconds`)
        setTestResult(prev => prev + `\n📊 Interaction type: ${view.interaction_type}`)
        setTestResult(prev => prev + `\n📊 Created at: ${new Date(view.created_at).toLocaleString()}`)
        
        if (view.view_duration && view.view_duration > 0) {
          setTestResult(prev => prev + '\n✅ View duration tracking is working!')
        } else {
          setTestResult(prev => prev + '\n❌ View duration is 0 or null - tracking not working')
        }
      } else {
        setTestResult(prev => prev + '\n❌ No candidate views found')
      }

      // Clean up test data
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)

      setTestResult(prev => prev + '\n✅ Test data cleaned up')

    } catch (err: any) {
      console.error('Error testing view duration tracking:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkExistingViewDurations = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const supabase = createClient()
      
      setTestResult(`🔍 Checking existing view durations for user: ${currentUserId}`)

      // Get recent candidate views with view durations
      const { data: candidateViews, error: viewsError } = await supabase
        .from('candidate_views')
        .select('id, user_id, candidate_id, candidate_name, view_duration, interaction_type, created_at')
        .eq('user_id', currentUserId)
        .not('view_duration', 'is', null)
        .order('view_duration', { ascending: false })
        .limit(10)

      if (viewsError) {
        setTestResult(`❌ Error fetching candidate views: ${viewsError.message}`)
      } else if (candidateViews && candidateViews.length > 0) {
        setTestResult(`📊 Found ${candidateViews.length} candidate views with duration data:`)
        candidateViews.forEach((view, index) => {
          setTestResult(prev => prev + `\n${index + 1}. ${view.candidate_name || view.candidate_id} - ${view.view_duration} seconds (${view.interaction_type})`)
        })
      } else {
        setTestResult('📭 No candidate views with duration data found for this user')
      }

    } catch (err: any) {
      console.error('Error checking existing view durations:', err)
      setTestResult(`❌ Check failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testManualDurationUpdate = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const testCandidateId = 'test_manual_duration_' + Date.now()
      const testCandidateName = 'Test Manual Duration'
      
      setTestResult(`🔧 Testing manual duration update...\nUser ID: ${currentUserId}\nCandidate ID: ${testCandidateId}`)

      // First create a view record
      await candidateTracker.startTracking(
        currentUserId,
        testCandidateId,
        testCandidateName
      )

      setTestResult(prev => prev + '\n✅ Created initial view record')

      // Wait a moment
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Manually update the duration
      await candidateTracker.updateViewDurationManually(
        currentUserId,
        testCandidateId,
        30 // 30 seconds
      )

      setTestResult(prev => prev + '\n✅ Manually updated duration to 30 seconds')

      // Check if the duration was updated
      const supabase = createClient()
      const { data: candidateViews, error: viewsError } = await supabase
        .from('candidate_views')
        .select('id, user_id, candidate_id, candidate_name, view_duration, interaction_type, created_at')
        .eq('user_id', currentUserId)
        .eq('candidate_id', testCandidateId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (viewsError) {
        setTestResult(prev => prev + `\n❌ Error fetching updated record: ${viewsError.message}`)
      } else if (candidateViews && candidateViews.length > 0) {
        const view = candidateViews[0]
        setTestResult(prev => prev + `\n📊 Updated view duration: ${view.view_duration} seconds`)
        
        if (view.view_duration === 30) {
          setTestResult(prev => prev + '\n✅ Manual duration update is working!')
        } else {
          setTestResult(prev => prev + `\n❌ Expected 30 seconds, got ${view.view_duration}`)
        }
      } else {
        setTestResult(prev => prev + '\n❌ No updated record found')
      }

      // Clean up test data
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)

      setTestResult(prev => prev + '\n✅ Test data cleaned up')

    } catch (err: any) {
      console.error('Error testing manual duration update:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test View Duration Tracking</h1>
      <p className="mb-4">This page tests if view duration is being properly tracked for candidate views.</p>

      <div className="flex space-x-2 mb-6">
        <Button onClick={testViewDurationTracking} disabled={loading} className="bg-lime-600 hover:bg-lime-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test View Duration Tracking'}
        </Button>
        <Button onClick={testManualDurationUpdate} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test Manual Duration Update'}
        </Button>
        <Button onClick={checkExistingViewDurations} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <InlineLoader size={16} text="Checking..." /> : 'Check Existing View Durations'}
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
              <p><strong>Test View Duration Tracking:</strong> Simulates viewing a candidate for 5 seconds</p>
              <p><strong>Test Manual Duration Update:</strong> Tests the duration update mechanism directly</p>
              <p><strong>Check Existing View Durations:</strong> Shows your current viewing history</p>
              <p><strong>Expected Results:</strong></p>
              <ul className="ml-4 list-disc">
                <li>View duration should be recorded in seconds</li>
                <li>Duration should be > 0 for actual viewing time</li>
                <li>Manual update should work even if automatic tracking fails</li>
                <li>Most viewed candidate should be based on duration</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
