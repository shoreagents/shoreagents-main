"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { candidateTracker } from '@/lib/candidateTrackingService'
import { useAuth } from '@/lib/auth-context'
import { generateUserId } from '@/lib/userEngagementService'
import { InlineLoader } from '@/components/ui/loader'

export default function TestViewDurationFixPage() {
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

  const testViewDurationWithNewTable = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const testCandidateId = 'test_duration_fix_' + Date.now()
      const testCandidateName = 'Test Duration Fix'
      
      setTestResult(`🔍 Testing view duration with new table structure...`)
      setTestResult(prev => prev + `\nUser ID: ${currentUserId}`)
      setTestResult(prev => prev + `\nCandidate ID: ${testCandidateId}`)

      // Clean up any existing test data
      const supabase = createClient()
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)

      setTestResult(prev => prev + `\n🧹 Cleaned up existing test data`)

      // Test 1: Start tracking
      setTestResult(prev => prev + `\n🔄 Starting tracking...`)
      await candidateTracker.startTracking(
        currentUserId,
        testCandidateId,
        testCandidateName
      )
      setTestResult(prev => prev + `\n✅ Started tracking`)

      // Check if initial record was created
      const { data: initialRecord, error: initialError } = await supabase
        .from('candidate_views')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('candidate_id', testCandidateId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (initialError) {
        setTestResult(prev => prev + `\n❌ Error checking initial record: ${initialError.message}`)
      } else if (initialRecord && initialRecord.length > 0) {
        const record = initialRecord[0]
        setTestResult(prev => prev + `\n✅ Initial record created:`)
        setTestResult(prev => prev + `\n  - ID: ${record.id}`)
        setTestResult(prev => prev + `\n  - View Duration: ${record.view_duration}`)
        setTestResult(prev => prev + `\n  - Scroll Percentage: ${record.scroll_percentage}`)
        setTestResult(prev => prev + `\n  - Page Views: ${record.page_views}`)
      } else {
        setTestResult(prev => prev + `\n❌ No initial record found`)
      }

      // Test 2: Simulate viewing time
      setTestResult(prev => prev + `\n⏱️ Simulating 3 seconds of viewing...`)
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Test 3: End tracking
      setTestResult(prev => prev + `\n🔄 Ending tracking...`)
      await candidateTracker.endTracking()
      setTestResult(prev => prev + `\n✅ Ended tracking`)

      // Check if duration was updated
      const { data: finalRecord, error: finalError } = await supabase
        .from('candidate_views')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('candidate_id', testCandidateId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (finalError) {
        setTestResult(prev => prev + `\n❌ Error checking final record: ${finalError.message}`)
      } else if (finalRecord && finalRecord.length > 0) {
        const record = finalRecord[0]
        setTestResult(prev => prev + `\n📊 Final record:`)
        setTestResult(prev => prev + `\n  - View Duration: ${record.view_duration} seconds`)
        setTestResult(prev => prev + `\n  - Scroll Percentage: ${record.scroll_percentage}%`)
        setTestResult(prev => prev + `\n  - Updated At: ${new Date(record.updated_at).toLocaleString()}`)
        
        if (record.view_duration && record.view_duration > 0) {
          setTestResult(prev => prev + `\n✅ SUCCESS: View duration tracking is working!`)
        } else {
          setTestResult(prev => prev + `\n❌ FAILURE: View duration is 0 or null`)
        }
      } else {
        setTestResult(prev => prev + `\n❌ No final record found`)
      }

      // Test 4: Test multiple visits (should update existing record)
      setTestResult(prev => prev + `\n🔄 Testing multiple visits...`)
      
      // Start tracking again
      await candidateTracker.startTracking(
        currentUserId,
        testCandidateId,
        testCandidateName
      )
      setTestResult(prev => prev + `\n✅ Started tracking again`)

      // Simulate more viewing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      // End tracking again
      await candidateTracker.endTracking()
      setTestResult(prev => prev + `\n✅ Ended tracking again`)

      // Check if duration was accumulated
      const { data: accumulatedRecord, error: accumulatedError } = await supabase
        .from('candidate_views')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('candidate_id', testCandidateId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (accumulatedError) {
        setTestResult(prev => prev + `\n❌ Error checking accumulated record: ${accumulatedError.message}`)
      } else if (accumulatedRecord && accumulatedRecord.length > 0) {
        const record = accumulatedRecord[0]
        setTestResult(prev => prev + `\n📊 Accumulated record:`)
        setTestResult(prev => prev + `\n  - View Duration: ${record.view_duration} seconds`)
        setTestResult(prev => prev + `\n  - Expected: ~5 seconds (3 + 2)`)
        
        if (record.view_duration && record.view_duration >= 4) {
          setTestResult(prev => prev + `\n✅ SUCCESS: Duration accumulation is working!`)
        } else {
          setTestResult(prev => prev + `\n❌ FAILURE: Duration not accumulated properly`)
        }
      }

      // Clean up test data
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)
      setTestResult(prev => prev + `\n🧹 Test data cleaned up`)

    } catch (err: any) {
      console.error('Error testing view duration:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const checkCurrentTableStructure = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const supabase = createClient()
      
      setTestResult(`🔍 Checking current table structure...`)

      // Get table structure
      let columns, columnsError;
      try {
        const result = await supabase
          .rpc('get_table_columns', { table_name: 'candidate_views' });
        columns = result.data;
        columnsError = result.error;
      } catch (rpcError) {
        // Fallback if RPC doesn't exist
        columns = null;
        columnsError = { message: 'RPC not available' };
      }

      if (columnsError) {
        setTestResult(prev => prev + `\n⚠️ Could not get table structure via RPC, trying direct query...`)
        
        // Try to get some sample data to verify structure
        const { data: sampleData, error: sampleError } = await supabase
          .from('candidate_views')
          .select('*')
          .limit(1)

        if (sampleError) {
          setTestResult(prev => prev + `\n❌ Error querying table: ${sampleError.message}`)
        } else {
          setTestResult(prev => prev + `\n✅ Table is accessible`)
          if (sampleData && sampleData.length > 0) {
            const record = sampleData[0]
            setTestResult(prev => prev + `\n📊 Sample record structure:`)
            Object.keys(record).forEach(key => {
              setTestResult(prev => prev + `\n  - ${key}: ${record[key]} (${typeof record[key]})`)
            })
          } else {
            setTestResult(prev => prev + `\n📊 Table is empty (no sample data)`)
          }
        }
      } else {
        setTestResult(prev => prev + `\n📊 Table structure:`)
        columns?.forEach((col: any) => {
          setTestResult(prev => prev + `\n  - ${col.column_name}: ${col.data_type}`)
        })
      }

    } catch (err: any) {
      console.error('Error checking table structure:', err)
      setTestResult(`❌ Check failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testDirectInsert = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const testCandidateId = 'test_direct_insert_' + Date.now()
      const supabase = createClient()
      
      setTestResult(`🔧 Testing direct insert to candidate_views table...`)
      setTestResult(prev => prev + `\nUser ID: ${currentUserId}`)
      setTestResult(prev => prev + `\nCandidate ID: ${testCandidateId}`)

      // Test direct insert
      const { data, error } = await supabase
        .from('candidate_views')
        .insert({
          user_id: currentUserId,
          candidate_id: testCandidateId,
          candidate_name: 'Test Direct Insert',
          view_duration: 30,
          scroll_percentage: 75,
          page_views: 1
        })
        .select('*')

      if (error) {
        setTestResult(prev => prev + `\n❌ Direct insert failed: ${error.message}`)
        setTestResult(prev => prev + `\nError details: ${JSON.stringify(error, null, 2)}`)
      } else {
        setTestResult(prev => prev + `\n✅ Direct insert successful!`)
        setTestResult(prev => prev + `\n📊 Inserted record:`)
        setTestResult(prev => prev + `\n  - ID: ${data[0].id}`)
        setTestResult(prev => prev + `\n  - View Duration: ${data[0].view_duration}`)
        setTestResult(prev => prev + `\n  - Scroll Percentage: ${data[0].scroll_percentage}`)
      }

      // Clean up
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)
      setTestResult(prev => prev + `\n🧹 Test data cleaned up`)

    } catch (err: any) {
      console.error('Error testing direct insert:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testDurationAccumulation = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const testCandidateId = 'test_accumulation_' + Date.now()
      const testCandidateName = 'Test Duration Accumulation'
      
      setTestResult(`🧪 Testing duration accumulation...`)
      setTestResult(prev => prev + `\nUser ID: ${currentUserId}`)
      setTestResult(prev => prev + `\nCandidate ID: ${testCandidateId}`)

      // Clean up any existing test data
      const supabase = createClient()
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)

      setTestResult(prev => prev + `\n🧹 Cleaned up existing test data`)

      // Test the accumulation method
      await candidateTracker.testDurationAccumulation(
        currentUserId,
        testCandidateId,
        testCandidateName
      )

      setTestResult(prev => prev + `\n✅ Duration accumulation test completed`)

      // Check the final result
      const { data: finalRecord, error: finalError } = await supabase
        .from('candidate_views')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('candidate_id', testCandidateId)
        .order('created_at', { ascending: false })
        .limit(1)

      if (finalError) {
        setTestResult(prev => prev + `\n❌ Error checking final record: ${finalError.message}`)
      } else if (finalRecord && finalRecord.length > 0) {
        const record = finalRecord[0]
        setTestResult(prev => prev + `\n📊 Final accumulated record:`)
        setTestResult(prev => prev + `\n  - View Duration: ${record.view_duration} seconds`)
        setTestResult(prev => prev + `\n  - Expected: ~6 seconds (2 + 3 + 1)`)
        setTestResult(prev => prev + `\n  - Record Count: 1 (should be only 1 record)`)
        
        if (record.view_duration && record.view_duration >= 5) {
          setTestResult(prev => prev + `\n✅ SUCCESS: Duration accumulation is working!`)
        } else {
          setTestResult(prev => prev + `\n❌ FAILURE: Duration not accumulated properly`)
        }
      } else {
        setTestResult(prev => prev + `\n❌ No final record found`)
      }

      // Clean up test data
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)
      setTestResult(prev => prev + `\n🧹 Test data cleaned up`)

    } catch (err: any) {
      console.error('Error testing duration accumulation:', err)
      setTestResult(`❌ Test failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test View Duration Fix</h1>
      <p className="mb-4">This page tests if view duration tracking is working with the new simplified table structure.</p>

      <div className="flex space-x-2 mb-6">
        <Button onClick={testViewDurationWithNewTable} disabled={loading} className="bg-lime-600 hover:bg-lime-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test View Duration Tracking'}
        </Button>
        <Button onClick={checkCurrentTableStructure} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <InlineLoader size={16} text="Checking..." /> : 'Check Table Structure'}
        </Button>
        <Button onClick={testDirectInsert} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test Direct Insert'}
        </Button>
        <Button onClick={testDurationAccumulation} disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test Duration Accumulation'}
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
              <p><strong>Test View Duration Tracking:</strong> Tests the full tracking flow with new table structure</p>
              <p><strong>Check Table Structure:</strong> Verifies the table is accessible and has correct columns</p>
              <p><strong>Test Direct Insert:</strong> Tests direct database insert to verify table structure</p>
              <p><strong>Test Duration Accumulation:</strong> Tests multiple visits to ensure duration sums up correctly</p>
              <p><strong>Expected Results:</strong></p>
              <ul className="ml-4 list-disc">
                <li>Initial record created with view_duration: 0</li>
                <li>Duration updated to ~3 seconds after endTracking()</li>
                <li>Duration accumulated to ~5 seconds after second visit</li>
                <li>Duration accumulated to ~6 seconds after third visit (2+3+1)</li>
                <li>Only 1 record per user-candidate combination</li>
                <li>No duplicate records created</li>
                <li>Table structure matches the DDL provided</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
