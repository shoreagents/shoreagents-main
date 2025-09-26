'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { candidateTracker } from '@/lib/candidateTrackingService';

export default function DebugCandidateViewsPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testCandidateViews = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const supabase = createClient();
      
      // Test 1: Check if candidate_views table has any data
      console.log('🔍 Test 1: Checking candidate_views table...');
      const { data: allViews, error: viewsError } = await supabase
        .from('candidate_views')
        .select('*')
        .limit(5);

      console.log('📊 All views result:', { allViews, viewsError });

      // Test 2: Check users table
      console.log('🔍 Test 2: Checking users table...');
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('user_id, user_type')
        .limit(5);

      console.log('👥 Users result:', { users, usersError });

      // Test 3: Try to get device ID from localStorage
      const deviceId = localStorage.getItem('content_tracking_device_id');
      console.log('📱 Device ID from localStorage:', deviceId);

      // Test 4: Try the getUserMostViewedCandidate function
      if (deviceId) {
        console.log('🔍 Test 4: Testing getUserMostViewedCandidate...');
        const mostViewed = await candidateTracker.getUserMostViewedCandidate(deviceId);
        console.log('🎯 Most viewed result:', mostViewed);
      }

      setResults({
        allViews,
        viewsError,
        users,
        usersError,
        deviceId,
        totalViews: allViews?.length || 0,
        totalUsers: users?.length || 0
      });

    } catch (err) {
      console.error('❌ Test error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Debug Candidate Views</h1>
      
      <button
        onClick={testCandidateViews}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Candidate Views'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">📊 Candidate Views Table</h3>
            <p><strong>Total records:</strong> {results.totalViews}</p>
            <p><strong>Error:</strong> {results.viewsError?.message || 'None'}</p>
            {results.allViews && results.allViews.length > 0 && (
              <div className="mt-2">
                <p><strong>Sample data:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(results.allViews[0], null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">👥 Users Table</h3>
            <p><strong>Total users:</strong> {results.totalUsers}</p>
            <p><strong>Error:</strong> {results.usersError?.message || 'None'}</p>
            {results.users && results.users.length > 0 && (
              <div className="mt-2">
                <p><strong>Sample users:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(results.users, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">📱 Device ID</h3>
            <p><strong>Device ID:</strong> {results.deviceId || 'Not found'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
