"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { candidateTracker } from '@/lib/candidateTrackingService'
import { useAuth } from '@/lib/auth-context'
import { generateUserId } from '@/lib/userEngagementService'
import { InlineLoader } from '@/components/ui/loader'

export default function TestMostViewedAggregationPage() {
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

  const testAggregationLogic = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      
      setTestResult(`🔍 Testing aggregation logic for user: ${currentUserId}`)

      // Get the most viewed candidate using the service
      const mostViewed = await candidateTracker.getUserMostViewedCandidate(currentUserId)
      
      if (mostViewed) {
        setTestResult(prev => prev + `\n✅ Most viewed candidate found:`)
        setTestResult(prev => prev + `\n  - Candidate ID: ${mostViewed.candidate_id}`)
        setTestResult(prev => prev + `\n  - Candidate Name: ${mostViewed.candidate_name}`)
        setTestResult(prev => prev + `\n  - View Duration: ${mostViewed.view_duration} seconds`)
        setTestResult(prev => prev + `\n  - Created At: ${new Date(mostViewed.created_at).toLocaleString()}`)
      } else {
        setTestResult(prev => prev + `\n❌ No most viewed candidate found`)
      }

      // Now let's manually check the raw data to compare
      const supabase = createClient()
      const { data: rawViews, error: viewsError } = await supabase
        .from('candidate_views')
        .select('candidate_id, candidate_name, view_duration, created_at')
        .eq('user_id', currentUserId)
        .order('created_at', { ascending: false })

      if (viewsError) {
        setTestResult(prev => prev + `\n❌ Error fetching raw views: ${viewsError.message}`)
      } else if (rawViews && rawViews.length > 0) {
        setTestResult(prev => prev + `\n📊 Raw view data (${rawViews.length} records):`)
        
        // Since we're now accumulating durations in single records, just sort by view_duration
        const sortedCandidates = rawViews.sort((a: any, b: any) => (b.view_duration || 0) - (a.view_duration || 0))
        
        setTestResult(prev => prev + `\n📈 Manual sorting results:`)
        sortedCandidates.forEach((candidate: any, index: number) => {
          setTestResult(prev => prev + `\n${index + 1}. ${candidate.candidate_name || candidate.candidate_id}`)
          setTestResult(prev => prev + `   - View Duration: ${candidate.view_duration || 0} seconds`)
          setTestResult(prev => prev + `   - Created At: ${new Date(candidate.created_at).toLocaleString()}`)
        })

        // Check if the service result matches the manual calculation
        if (mostViewed && sortedCandidates.length > 0) {
          const topCandidate = sortedCandidates[0] as any
          if (mostViewed.candidate_id === topCandidate.candidate_id && 
              mostViewed.view_duration === topCandidate.view_duration) {
            setTestResult(prev => prev + `\n✅ Service result matches manual calculation!`)
          } else {
            setTestResult(prev => prev + `\n❌ Service result does NOT match manual calculation!`)
            setTestResult(prev => prev + `\n   Service: ${mostViewed.candidate_id} (${mostViewed.view_duration}s)`)
            setTestResult(prev => prev + `\n   Manual:  ${topCandidate.candidate_id} (${topCandidate.view_duration}s)`)
          }
        }
      } else {
        setTestResult(prev => prev + `\n📭 No raw view data found`)
      }

    } catch (err: any) {
      console.error('Error testing aggregation logic:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const createTestData = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const supabase = createClient()
      
      setTestResult(`🔧 Creating test data for user: ${currentUserId}`)

      // Create test candidate views with different durations (single record per candidate)
      const testData = [
        { candidate_id: 'test_candidate_1', candidate_name: 'Lovell Siron', view_duration: 200 },
        { candidate_id: 'test_candidate_2', candidate_name: 'Fred Smith', view_duration: 150 },
        { candidate_id: 'test_candidate_3', candidate_name: 'Jane Doe', view_duration: 130 }
      ]

      // Insert test data
      const { error: insertError } = await supabase
        .from('candidate_views')
        .insert(testData.map(data => ({
          user_id: currentUserId,
          candidate_id: data.candidate_id,
          candidate_name: data.candidate_name,
          view_duration: data.view_duration,
          interaction_type: 'view',
          page_views: 1,
          activity_count: 1
        })))

      if (insertError) {
        setTestResult(`❌ Error creating test data: ${insertError.message}`)
      } else {
        setTestResult(`✅ Created test data:`)
        setTestResult(prev => prev + `\n  - Lovell Siron: 200s total`)
        setTestResult(prev => prev + `\n  - Fred Smith: 150s total`)
        setTestResult(prev => prev + `\n  - Jane Doe: 130s total`)
        setTestResult(prev => prev + `\n  - Expected winner: Lovell Siron (200s)`)
      }

    } catch (err: any) {
      console.error('Error creating test data:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const cleanupTestData = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const supabase = createClient()
      
      setTestResult(`🧹 Cleaning up test data for user: ${currentUserId}`)

      // Delete test data
      const { error: deleteError } = await supabase
        .from('candidate_views')
        .delete()
        .like('candidate_id', 'test_candidate_%')

      if (deleteError) {
        setTestResult(`❌ Error cleaning up: ${deleteError.message}`)
      } else {
        setTestResult(`✅ Test data cleaned up`)
      }

    } catch (err: any) {
      console.error('Error cleaning up test data:', err)
      setTestResult(`❌ Cleanup failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Most Viewed Aggregation</h1>
      <p className="mb-4">This page tests if the most viewed candidate aggregation logic is working correctly.</p>

      <div className="flex space-x-2 mb-6">
        <Button onClick={testAggregationLogic} disabled={loading} className="bg-lime-600 hover:bg-lime-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test Aggregation Logic'}
        </Button>
        <Button onClick={createTestData} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <InlineLoader size={16} text="Creating..." /> : 'Create Test Data'}
        </Button>
        <Button onClick={cleanupTestData} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
          {loading ? <InlineLoader size={16} text="Cleaning..." /> : 'Cleanup Test Data'}
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
              <p><strong>Test Aggregation Logic:</strong> Checks if service correctly finds highest view duration</p>
              <p><strong>Create Test Data:</strong> Creates sample data with known durations</p>
              <p><strong>Cleanup Test Data:</strong> Removes test data after testing</p>
              <p><strong>Expected Results:</strong></p>
              <ul className="ml-4 list-disc">
                <li>Lovell Siron should win with 200s total</li>
                <li>Fred Smith should be second with 150s</li>
                <li>Jane Doe should be third with 130s</li>
                <li>Service result should match manual calculation</li>
                <li>Durations are accumulated in single records (no duplicates)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
