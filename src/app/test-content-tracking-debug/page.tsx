'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contentTracker } from '@/lib/contentTrackingService';

export default function TestContentTrackingDebug() {
  const [testResults, setTestResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (test: string, result: any, success: boolean) => {
    setTestResults(prev => [...prev, {
      test,
      result,
      success,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Test basic connection
      const { data, error } = await supabase
        .from('users')
        .select('count')
        .limit(1);
      
      if (error) {
        addTestResult('Supabase Connection', `Error: ${error.message}`, false);
      } else {
        addTestResult('Supabase Connection', 'Connected successfully', true);
      }
    } catch (error) {
      addTestResult('Supabase Connection', `Exception: ${error}`, false);
    } finally {
      setLoading(false);
    }
  };

  const testSimpleFunctions = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Test simple_get_anonymous_user
      const { data: anonData, error: anonError } = await supabase
        .rpc('simple_get_anonymous_user');
      
      if (anonError) {
        addTestResult('simple_get_anonymous_user', `Error: ${anonError.message}`, false);
      } else {
        addTestResult('simple_get_anonymous_user', `Result: ${anonData}`, true);
      }
      
      // Test simple_get_authenticated_user with a dummy UUID
      const { data: authData, error: authError } = await supabase
        .rpc('simple_get_authenticated_user', {
          p_auth_user_id: '00000000-0000-0000-0000-000000000000'
        });
      
      if (authError) {
        addTestResult('simple_get_authenticated_user', `Error: ${authError.message}`, false);
      } else {
        addTestResult('simple_get_authenticated_user', `Result: ${authData}`, true);
      }
    } catch (error) {
      addTestResult('Simple Functions Test', `Exception: ${error}`, false);
    } finally {
      setLoading(false);
    }
  };

  const testContentTracking = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing content tracking...');
      
      const result = await contentTracker.trackPageView(
        'test_page',
        'test-debug-page',
        {
          user_id: null, // Let the service determine user_id
          content_title: 'Test Debug Page',
          page_section: 'main'
        }
      );
      
      addTestResult('Content Tracking', `Result: ${result}`, result);
      console.log('🧪 Content tracking test result:', result);
    } catch (error) {
      addTestResult('Content Tracking', `Exception: ${error}`, false);
      console.error('🧪 Content tracking test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectInsert = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Test direct insert to content_views
      const { data, error } = await supabase
        .from('content_views')
        .insert([{
          user_id: 'test_user_123',
          session_id: 'test_session_456',
          device_id: 'test_device_789',
          content_type: 'test_page',
          content_id: 'test-direct-insert',
          content_title: 'Test Direct Insert',
          page_section: 'main',
          referrer_type: 'direct'
        }])
        .select('id');
      
      if (error) {
        addTestResult('Direct Insert', `Error: ${error.message}`, false);
      } else {
        addTestResult('Direct Insert', `Success: ${data?.[0]?.id}`, true);
      }
    } catch (error) {
      addTestResult('Direct Insert', `Exception: ${error}`, false);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Content Tracking Debug Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={testSupabaseConnection} disabled={loading}>
          Test Supabase Connection
        </Button>
        <Button onClick={testSimpleFunctions} disabled={loading}>
          Test Simple Functions
        </Button>
        <Button onClick={testContentTracking} disabled={loading}>
          Test Content Tracking
        </Button>
        <Button onClick={testDirectInsert} disabled={loading}>
          Test Direct Insert
        </Button>
        <Button onClick={clearResults} variant="outline">
          Clear Results
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-gray-600">No test results yet. Run some tests above.</p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="border rounded p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "✅ Success" : "❌ Failed"}
                    </Badge>
                    <span className="font-semibold">{result.test}</span>
                    <span className="text-sm text-gray-600">{result.timestamp}</span>
                  </div>
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded">
                    {typeof result.result === 'string' ? result.result : JSON.stringify(result.result, null, 2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
