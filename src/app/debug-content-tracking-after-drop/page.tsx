'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { contentTracker } from '@/lib/contentTrackingService';

export default function DebugContentTrackingAfterDrop() {
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

  const testDirectInsert = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Test direct insert with current structure (after dropping columns)
      const { data, error } = await supabase
        .from('content_views')
        .insert([{
          user_id: 'test_user_123',
          session_id: 'test_session_456',
          device_id: 'test_device_789',
          content_type: 'test_page',
          content_id: 'test-direct-after-drop',
          content_title: 'Test Direct After Drop',
          page_section: 'main',
          interaction_type: 'view',
          activity_count: 1,
          scroll_depth: 0,
          view_duration: 5,
          referrer_type: 'direct'
        }])
        .select('id, interaction_type, activity_count');
      
      if (error) {
        addTestResult('Direct Insert (After Drop)', `Error: ${error.message}`, false);
      } else {
        addTestResult('Direct Insert (After Drop)', `Success: ${JSON.stringify(data)}`, true);
      }
    } catch (error) {
      addTestResult('Direct Insert (After Drop)', `Exception: ${error}`, false);
    } finally {
      setLoading(false);
    }
  };

  const testContentTrackingService = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing content tracking service after dropping columns...');
      
      const result = await contentTracker.trackPageView(
        'test_page',
        'test-service-after-drop',
        {
          user_id: null, // Let the service determine user_id
          content_title: 'Test Service After Drop',
          page_section: 'main'
        }
      );
      
      addTestResult('Content Tracking Service', `Result: ${result}`, result);
      console.log('🧪 Content tracking service test result:', result);
    } catch (error) {
      addTestResult('Content Tracking Service', `Exception: ${error}`, false);
      console.error('🧪 Content tracking service test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testInteractionTracking = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing interaction tracking after dropping columns...');
      
      const result = await contentTracker.trackInteraction(
        'test_page',
        'test-interaction-after-drop',
        {
          user_id: null,
          content_title: 'Test Interaction After Drop',
          page_section: 'main'
        }
      );
      
      addTestResult('Interaction Tracking', `Result: ${result}`, result);
      console.log('🧪 Interaction tracking test result:', result);
    } catch (error) {
      addTestResult('Interaction Tracking', `Exception: ${error}`, false);
      console.error('🧪 Interaction tracking test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testFormSubmissionTracking = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing form submission tracking after dropping columns...');
      
      const result = await contentTracker.trackFormSubmission(
        'test_page',
        'test-form-after-drop',
        {
          user_id: null,
          content_title: 'Test Form After Drop',
          page_section: 'main'
        }
      );
      
      addTestResult('Form Submission Tracking', `Result: ${result}`, result);
      console.log('🧪 Form submission tracking test result:', result);
    } catch (error) {
      addTestResult('Form Submission Tracking', `Exception: ${error}`, false);
      console.error('🧪 Form submission tracking test error:', error);
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

  const testUserLookup = async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      // Test the user lookup functions
      const { data: anonData, error: anonError } = await supabase
        .rpc('simple_get_anonymous_user');
      
      if (anonError) {
        addTestResult('User Lookup (Anonymous)', `Error: ${anonError.message}`, false);
      } else {
        addTestResult('User Lookup (Anonymous)', `Result: ${anonData}`, true);
      }
    } catch (error) {
      addTestResult('User Lookup (Anonymous)', `Exception: ${error}`, false);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Content Tracking After Drop</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button onClick={testDirectInsert} disabled={loading}>
          Test Direct Insert (After Drop)
        </Button>
        <Button onClick={testContentTrackingService} disabled={loading}>
          Test Content Tracking Service
        </Button>
        <Button onClick={testInteractionTracking} disabled={loading}>
          Test Interaction Tracking
        </Button>
        <Button onClick={testFormSubmissionTracking} disabled={loading}>
          Test Form Submission Tracking
        </Button>
        <Button onClick={testUserLookup} disabled={loading}>
          Test User Lookup
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
