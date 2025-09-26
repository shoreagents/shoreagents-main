"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { candidateTracker } from '@/lib/candidateTrackingService'
import { useAuth } from '@/lib/auth-context'
import { generateUserId } from '@/lib/userEngagementService'
import { InlineLoader } from '@/components/ui/loader'

export default function TestDuplicatePreventionPage() {
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

  const testDuplicatePrevention = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const testCandidateId = 'test_duplicate_prevention_' + Date.now()
      const testCandidateName = 'Test Duplicate Prevention'
      
      setTestResult(`🔍 Testing duplicate prevention for user: ${currentUserId}`)
      setTestResult(prev => prev + `\nCandidate ID: ${testCandidateId}`)

      // First, clean up any existing test data
      const supabase = createClient()
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)

      setTestResult(prev => prev + `\n🧹 Cleaned up any existing test data`)

      // Call startTracking multiple times to simulate the duplicate issue
      setTestResult(prev => prev + `\n🔄 Calling startTracking() multiple times...`)
      
      await candidateTracker.startTracking(currentUserId, testCandidateId, testCandidateName)
      setTestResult(prev => prev + `\n✅ First startTracking() call`)
      
      await candidateTracker.startTracking(currentUserId, testCandidateId, testCandidateName)
      setTestResult(prev => prev + `\n✅ Second startTracking() call`)
      
      await candidateTracker.startTracking(currentUserId, testCandidateId, testCandidateName)
      setTestResult(prev => prev + `\n✅ Third startTracking() call`)

      // Check how many records were created
      const { data: records, error: recordsError } = await supabase
        .from('candidate_views')
        .select('id, user_id, candidate_id, candidate_name, view_duration, scroll_percentage, created_at')
        .eq('user_id', currentUserId)
        .eq('candidate_id', testCandidateId)
        .order('created_at', { ascending: false })

      if (recordsError) {
        setTestResult(prev => prev + `\n❌ Error fetching records: ${recordsError.message}`)
      } else {
        setTestResult(prev => prev + `\n📊 Records created: ${records?.length || 0}`)
        
        if (records && records.length > 0) {
          setTestResult(prev => prev + `\n📋 Record details:`)
          records.forEach((record, index) => {
            setTestResult(prev => prev + `\n  ${index + 1}. ID: ${record.id}, Duration: ${record.view_duration}s, Scroll: ${record.scroll_percentage}%, Created: ${new Date(record.created_at).toLocaleString()}`)
          })
          
          if (records.length === 1) {
            setTestResult(prev => prev + `\n✅ SUCCESS: Only 1 record created (duplicates prevented!)`)
          } else {
            setTestResult(prev => prev + `\n❌ FAILURE: ${records.length} records created (duplicates not prevented)`)
          }
        } else {
          setTestResult(prev => prev + `\n❌ No records found`)
        }
      }

      // Clean up test data
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)
      setTestResult(prev => prev + `\n🧹 Test data cleaned up`)

    } catch (err: any) {
      console.error('Error testing duplicate prevention:', err)
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
      const testCandidateId = 'test_duration_accumulation_' + Date.now()
      const testCandidateName = 'Test Duration Accumulation'
      
      setTestResult(`🔍 Testing duration accumulation for user: ${currentUserId}`)
      setTestResult(prev => prev + `\nCandidate ID: ${testCandidateId}`)

      const supabase = createClient()
      
      // Clean up any existing test data
      await supabase.from('candidate_views').delete().eq('candidate_id', testCandidateId)

      // Start tracking
      await candidateTracker.startTracking(currentUserId, testCandidateId, testCandidateName)
      setTestResult(prev => prev + `\n✅ Started tracking`)

      // Simulate some viewing time
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // End tracking (should add 2 seconds)
      await candidateTracker.endTracking()
      setTestResult(prev => prev + `\n✅ Ended tracking (should have 2 seconds)`)

      // Start tracking again
      await candidateTracker.startTracking(currentUserId, testCandidateId, testCandidateName)
      setTestResult(prev => prev + `\n✅ Started tracking again`)

      // Simulate more viewing time
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // End tracking (should add 3 more seconds, total = 5)
      await candidateTracker.endTracking()
      setTestResult(prev => prev + `\n✅ Ended tracking again (should have 5 seconds total)`)

      // Check the final record
      const { data: records, error: recordsError } = await supabase
        .from('candidate_views')
        .select('id, user_id, candidate_id, candidate_name, view_duration, scroll_percentage, created_at')
        .eq('user_id', currentUserId)
        .eq('candidate_id', testCandidateId)
        .order('created_at', { ascending: false })

      if (recordsError) {
        setTestResult(prev => prev + `\n❌ Error fetching records: ${recordsError.message}`)
      } else {
        setTestResult(prev => prev + `\n📊 Final records: ${records?.length || 0}`)
        
        if (records && records.length > 0) {
          const record = records[0]
          setTestResult(prev => prev + `\n📋 Final record:`)
          setTestResult(prev => prev + `\n  - Duration: ${record.view_duration} seconds`)
          setTestResult(prev => prev + `\n  - Created: ${new Date(record.created_at).toLocaleString()}`)
          
          if (record.view_duration === 5) {
            setTestResult(prev => prev + `\n✅ SUCCESS: Duration correctly accumulated (5 seconds)`)
          } else {
            setTestResult(prev => prev + `\n❌ FAILURE: Expected 5 seconds, got ${record.view_duration}`)
          }
        }
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

  const checkExistingDuplicates = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const currentUserId = appUser?.user_id || generateUserId()
      const supabase = createClient()
      
      setTestResult(`🔍 Checking for existing duplicates for user: ${currentUserId}`)

      // Find duplicate records (same user and candidate)
      const { data: duplicates, error: duplicatesError } = await supabase
        .from('candidate_views')
        .select('candidate_id, candidate_name, COUNT(*) as count')
        .eq('user_id', currentUserId)
        .group('candidate_id, candidate_name')
        .having('COUNT(*) > 1')

      if (duplicatesError) {
        setTestResult(`❌ Error checking for duplicates: ${duplicatesError.message}`)
      } else if (duplicates && duplicates.length > 0) {
        setTestResult(`❌ Found ${duplicates.length} candidates with duplicate view records:`)
        duplicates.forEach((dup, index) => {
          setTestResult(prev => prev + `\n${index + 1}. ${dup.candidate_name || dup.candidate_id} - ${dup.count} records`)
        })
      } else {
        setTestResult(`✅ No duplicate view records found for this user`)
      }

    } catch (err: any) {
      console.error('Error checking for duplicates:', err)
      setTestResult(`❌ Check failed: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Test Duplicate Prevention</h1>
      <p className="mb-4">This page tests if duplicate candidate view records are being prevented.</p>

      <div className="flex space-x-2 mb-6">
        <Button onClick={testDuplicatePrevention} disabled={loading} className="bg-lime-600 hover:bg-lime-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test Duplicate Prevention'}
        </Button>
        <Button onClick={testDurationAccumulation} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
          {loading ? <InlineLoader size={16} text="Testing..." /> : 'Test Duration Accumulation'}
        </Button>
        <Button onClick={checkExistingDuplicates} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white">
          {loading ? <InlineLoader size={16} text="Checking..." /> : 'Check Existing Duplicates'}
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
              <p><strong>Test Duplicate Prevention:</strong> Calls startTracking() multiple times to test if duplicates are prevented</p>
              <p><strong>Test Duration Accumulation:</strong> Tests if durations are properly accumulated in existing records</p>
              <p><strong>Check Existing Duplicates:</strong> Scans database for existing duplicate records</p>
              <p><strong>Expected Results:</strong></p>
              <ul className="ml-4 list-disc">
                <li>Only 1 record should be created per candidate</li>
                <li>Durations should accumulate in the same record</li>
                <li>Scroll percentage should be tracked</li>
                <li>No duplicate view records should exist</li>
                <li>Existing records should be updated, not duplicated</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
