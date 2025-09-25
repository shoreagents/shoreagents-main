'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contentTrackerSimple } from '@/lib/contentTrackingServiceSimple';

export default function TestSimpleContentTracking() {
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

  const testSimpleContentTracking = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing simple content tracking...');
      
      const result = await contentTrackerSimple.trackPageView(
        'test_page',
        'test-simple-tracking',
        {
          content_title: 'Test Simple Tracking',
          page_section: 'main'
        }
      );
      
      addTestResult('Simple Content Tracking', `Result: ${result}`, result);
      console.log('🧪 Simple content tracking test result:', result);
    } catch (error) {
      addTestResult('Simple Content Tracking', `Exception: ${error}`, false);
      console.error('🧪 Simple content tracking test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSimpleInteraction = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing simple interaction tracking...');
      
      const result = await contentTrackerSimple.trackInteraction(
        'test_page',
        'test-simple-interaction',
        {
          content_title: 'Test Simple Interaction',
          page_section: 'main'
        }
      );
      
      addTestResult('Simple Interaction Tracking', `Result: ${result}`, result);
      console.log('🧪 Simple interaction tracking test result:', result);
    } catch (error) {
      addTestResult('Simple Interaction Tracking', `Exception: ${error}`, false);
      console.error('🧪 Simple interaction tracking test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testSimpleFormSubmission = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing simple form submission tracking...');
      
      const result = await contentTrackerSimple.trackFormSubmission(
        'test_page',
        'test-simple-form',
        {
          content_title: 'Test Simple Form',
          page_section: 'main'
        }
      );
      
      addTestResult('Simple Form Submission Tracking', `Result: ${result}`, result);
      console.log('🧪 Simple form submission tracking test result:', result);
    } catch (error) {
      addTestResult('Simple Form Submission Tracking', `Exception: ${error}`, false);
      console.error('🧪 Simple form submission tracking test error:', error);
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
        .select('id, user_id, content_type, content_id, interaction_type, activity_count, scroll_depth, view_duration, viewed_at')
        .order('viewed_at', { ascending: false })
        .limit(10);
      
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
      <h1 className="text-3xl font-bold">Test Simple Content Tracking</h1>
      <p className="text-gray-600">This uses a simplified version that uses device_id as user_id directly, without relying on user lookup functions.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={testSimpleContentTracking} disabled={loading}>
          Test Simple Content Tracking
        </Button>
        <Button onClick={testSimpleInteraction} disabled={loading}>
          Test Simple Interaction Tracking
        </Button>
        <Button onClick={testSimpleFormSubmission} disabled={loading}>
          Test Simple Form Submission Tracking
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
