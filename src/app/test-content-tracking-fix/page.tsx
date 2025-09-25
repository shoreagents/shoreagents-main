'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contentTracker } from '@/lib/contentTrackingService';

export default function TestContentTrackingFix() {
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

  const testContentTracking = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing content tracking with simplified user_id logic...');
      
      const result = await contentTracker.trackPageView(
        'test_page',
        'test-fix-' + Date.now(),
        {
          user_id: null, // Let the service use device_id
          content_title: 'Test Content Tracking Fix',
          page_section: 'main'
        }
      );
      
      addTestResult('Content Tracking Fix', `Result: ${result}`, result);
      console.log('🧪 Content tracking fix test result:', result);
    } catch (error) {
      addTestResult('Content Tracking Fix', `Exception: ${error}`, false);
      console.error('🧪 Content tracking fix test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDirectInsert = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const testId = 'test-direct-' + Date.now();
      
      const { data, error } = await supabase
        .from('content_views')
        .insert([{
          user_id: 'device_test_' + Date.now(),
          session_id: 'session_test_' + Date.now(),
          device_id: 'device_test_' + Date.now(),
          content_type: 'test_page',
          content_id: testId,
          content_title: 'Test Direct Insert Fix',
          page_section: 'main',
          interaction_type: 'view',
          activity_count: 1,
          scroll_depth: 0,
          view_duration: 5,
          referrer_type: 'direct'
        }])
        .select('id, user_id, content_id');
      
      if (error) {
        addTestResult('Direct Insert Fix', `Error: ${error.message}`, false);
      } else {
        addTestResult('Direct Insert Fix', `Success: ${JSON.stringify(data)}`, true);
      }
    } catch (error) {
      addTestResult('Direct Insert Fix', `Exception: ${error}`, false);
    } finally {
      setLoading(false);
    }
  };

  const checkRecentData = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('content_views')
        .select('id, user_id, content_type, content_id, interaction_type, activity_count, viewed_at')
        .order('viewed_at', { ascending: false })
        .limit(5);
      
      if (error) {
        addTestResult('Check Recent Data', `Error: ${error.message}`, false);
      } else {
        addTestResult('Check Recent Data', `Found ${data?.length || 0} records: ${JSON.stringify(data, null, 2)}`, true);
      }
    } catch (error) {
      addTestResult('Check Recent Data', `Exception: ${error}`, false);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Test Content Tracking Fix</h1>
      <p className="text-gray-600">This tests the fixed content tracking service that uses device_id as user_id directly.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={testContentTracking} disabled={loading}>
          Test Content Tracking (Fixed)
        </Button>
        <Button onClick={testDirectInsert} disabled={loading}>
          Test Direct Insert
        </Button>
        <Button onClick={checkRecentData} disabled={loading}>
          Check Recent Data
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
                  <div className="text-sm font-mono bg-gray-100 p-2 rounded max-h-40 overflow-y-auto">
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
