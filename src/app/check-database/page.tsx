'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function CheckDatabasePage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkDatabase = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const supabase = createClient();
      
      // Check total records
      const { data: totalData, error: totalError } = await supabase
        .from('candidate_views')
        .select('*', { count: 'exact' });

      // Check records with view_duration
      const { data: durationData, error: durationError } = await supabase
        .from('candidate_views')
        .select('*')
        .not('view_duration', 'is', null);

      // Check records with positive view_duration
      const { data: positiveData, error: positiveError } = await supabase
        .from('candidate_views')
        .select('*')
        .gt('view_duration', 0);

      // Get sample data
      const { data: sampleData, error: sampleError } = await supabase
        .from('candidate_views')
        .select('user_id, candidate_id, candidate_name, view_duration, page_views, interaction_type, created_at')
        .order('created_at', { ascending: false })
        .limit(10);

      // Check for the specific device ID
      const { data: deviceData, error: deviceError } = await supabase
        .from('candidate_views')
        .select('*')
        .eq('user_id', 'device_1758768582481_rke8ch83y');

      setResults({
        totalRecords: totalData?.length || 0,
        totalError,
        durationRecords: durationData?.length || 0,
        durationError,
        positiveRecords: positiveData?.length || 0,
        positiveError,
        sampleData,
        sampleError,
        deviceData,
        deviceError
      });

    } catch (err) {
      console.error('❌ Database check error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Check Database - Candidate Views</h1>
      
      <button
        onClick={checkDatabase}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Checking...' : 'Check Database'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {results && (
        <div className="mt-6 space-y-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">📊 Database Summary</h3>
            <p><strong>Total records:</strong> {results.totalRecords}</p>
            <p><strong>Records with view_duration:</strong> {results.durationRecords}</p>
            <p><strong>Records with positive view_duration:</strong> {results.positiveRecords}</p>
            {results.totalError && <p className="text-red-600"><strong>Total Error:</strong> {results.totalError.message}</p>}
            {results.durationError && <p className="text-red-600"><strong>Duration Error:</strong> {results.durationError.message}</p>}
            {results.positiveError && <p className="text-red-600"><strong>Positive Error:</strong> {results.positiveError.message}</p>}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">📱 Device-Specific Data</h3>
            <p><strong>Records for device_1758768582481_rke8ch83y:</strong> {results.deviceData?.length || 0}</p>
            {results.deviceError && <p className="text-red-600"><strong>Device Error:</strong> {results.deviceError.message}</p>}
            {results.deviceData && results.deviceData.length > 0 && (
              <div className="mt-2">
                <p><strong>Device data:</strong></p>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(results.deviceData, null, 2)}
                </pre>
              </div>
            )}
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-bold text-lg mb-2">📋 Sample Data (Latest 10 Records)</h3>
            {results.sampleError && <p className="text-red-600"><strong>Sample Error:</strong> {results.sampleError.message}</p>}
            {results.sampleData && results.sampleData.length > 0 ? (
              <div className="mt-2">
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(results.sampleData, null, 2)}
                </pre>
              </div>
            ) : (
              <p className="text-gray-600">No sample data available</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
