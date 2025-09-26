'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestDbConnectionPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      // Test 1: Simple query to check connection
      const { data: testData, error: testError } = await supabase
        .from('candidate_views')
        .select('count(*)')
        .limit(1);

      // Test 2: Get actual count
      const { count: totalCount, error: countError } = await supabase
        .from('candidate_views')
        .select('*', { count: 'exact', head: true });

      // Test 3: Get some actual data
      const { data: actualData, error: dataError } = await supabase
        .from('candidate_views')
        .select('user_id, candidate_id, view_duration, created_at')
        .limit(5);

      setResults({
        testData,
        testError,
        totalCount,
        countError,
        actualData,
        dataError
      });

    } catch (error) {
      console.error('Connection test error:', error);
      setResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Test Database Connection</h1>
      
      <button
        onClick={testConnection}
        disabled={loading}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Connection'}
      </button>

      {results && (
        <div className="mt-6 bg-white p-4 rounded shadow">
          <h3 className="font-bold text-lg mb-2">🔍 Results</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
