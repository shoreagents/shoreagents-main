'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { contentTracker } from '@/lib/contentTrackingService';

export default function DebugTrackingPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testBasicTracking = async () => {
    setIsLoading(true);
    addLog('Starting basic tracking test...');
    
    try {
      const result = await contentTracker.trackContentView({
        content_type: 'debug_page',
        content_id: 'debug-test',
        content_title: 'Debug Test Page',
        page_section: 'main'
      });
      
      addLog(`Basic tracking result: ${result ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      addLog(`Basic tracking error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  const testPageViewTracking = async () => {
    setIsLoading(true);
    addLog('Starting page view tracking test...');
    
    try {
      const result = await contentTracker.trackPageView(
        'debug_page',
        'debug-page-view-test',
        {
          content_title: 'Debug Page View Test',
          page_section: 'main'
        }
      );
      
      addLog(`Page view tracking result: ${result ? 'SUCCESS' : 'FAILED'}`);
    } catch (error) {
      addLog(`Page view tracking error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    addLog('Testing Supabase connection...');
    
    try {
      const { createClient } = await import('@supabase/supabase-js');
      
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      addLog(`Supabase URL: ${supabaseUrl ? 'Set' : 'Missing'}`);
      addLog(`Supabase Key: ${supabaseKey ? 'Set' : 'Missing'}`);
      
      if (!supabaseUrl || !supabaseKey) {
        addLog('ERROR: Missing Supabase environment variables');
        setIsLoading(false);
        return;
      }
      
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Test a simple query
      const { data, error } = await supabase
        .from('content_views')
        .select('id')
        .limit(1);
      
      if (error) {
        addLog(`Supabase connection error: ${error.message}`);
      } else {
        addLog('Supabase connection successful');
      }
      
    } catch (error) {
      addLog(`Supabase test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Content Tracking Debug Page
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
              <CardDescription>
                Test different aspects of the content tracking system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={testSupabaseConnection}
                disabled={isLoading}
                className="w-full"
              >
                Test Supabase Connection
              </Button>
              
              <Button 
                onClick={testBasicTracking}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Test Basic Tracking
              </Button>
              
              <Button 
                onClick={testPageViewTracking}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Test Page View Tracking
              </Button>
              
              <Button 
                onClick={clearLogs}
                variant="secondary"
                className="w-full"
              >
                Clear Logs
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Debug Logs</CardTitle>
              <CardDescription>
                Real-time logs from the tracking system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg h-96 overflow-y-auto font-mono text-sm">
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet. Run a test to see output.</div>
                ) : (
                  logs.map((log, index) => (
                    <div key={index} className="mb-1">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Environment Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
                </div>
                <div>
                  <strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}
                </div>
                <div>
                  <strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
                </div>
                <div>
                  <strong>Window Available:</strong> {typeof window !== 'undefined' ? 'Yes' : 'No'}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
