'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { createClient } from '@/lib/supabase/client';

export default function TestSupabasePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabaseConnection = async () => {
    setIsLoading(true);
    addLog('🔗 Testing Supabase connection...');
    
    try {
      const supabase = createClient();
      addLog('✅ Supabase client created');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('content_views')
        .select('id')
        .limit(1);
        
      if (error) {
        addLog(`❌ Supabase connection error: ${error.message}`);
        addLog(`   Code: ${error.code}`);
        addLog(`   Details: ${error.details}`);
        addLog(`   Hint: ${error.hint}`);
      } else {
        addLog('✅ Supabase connection successful');
        addLog(`   Retrieved ${data?.length || 0} records`);
      }
    } catch (error) {
      addLog(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  const testInsertContentView = async () => {
    setIsLoading(true);
    addLog('💾 Testing content_views insert...');
    
    try {
      const supabase = createClient();
      
      const testData = {
        user_id: 'test_device_123',
        session_id: 'test_session_456',
        device_id: 'test_device_123',
        content_type: 'test_page',
        content_id: 'test-insert',
        content_title: 'Test Insert',
        page_section: 'main'
      };
      
      addLog(`📊 Inserting test data: ${JSON.stringify(testData)}`);
      
      const { data, error } = await supabase
        .from('content_views')
        .insert([testData])
        .select('id');
        
      if (error) {
        addLog(`❌ Insert error: ${error.message}`);
        addLog(`   Code: ${error.code}`);
        addLog(`   Details: ${error.details}`);
        addLog(`   Hint: ${error.hint}`);
      } else {
        addLog('✅ Insert successful!');
        addLog(`   Inserted record ID: ${data?.[0]?.id}`);
      }
    } catch (error) {
      addLog(`❌ Insert test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  const testContentTrackingService = async () => {
    setIsLoading(true);
    addLog('🎯 Testing ContentTrackingService...');
    
    try {
      const { contentTracker } = await import('@/lib/contentTrackingService');
      
      const result = await contentTracker.trackContentView({
        content_type: 'test_service',
        content_id: 'test-service-call',
        content_title: 'Test Service Call',
        page_section: 'main'
      });
      
      if (result) {
        addLog('✅ ContentTrackingService test successful!');
      } else {
        addLog('❌ ContentTrackingService test failed (returned false)');
      }
    } catch (error) {
      addLog(`❌ ContentTrackingService test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
          Supabase Connection Test
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Test Actions</CardTitle>
              <CardDescription>
                Test different aspects of the Supabase connection
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
                onClick={testInsertContentView}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Test Insert to content_views
              </Button>
              
              <Button 
                onClick={testContentTrackingService}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Test ContentTrackingService
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
              <CardTitle>Test Logs</CardTitle>
              <CardDescription>
                Real-time logs from the tests
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
                  <strong>Supabase URL:</strong> 
                  <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"} className="ml-2">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Missing'}
                  </Badge>
                </div>
                <div>
                  <strong>Supabase Key:</strong> 
                  <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"} className="ml-2">
                    {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing'}
                  </Badge>
                </div>
                <div>
                  <strong>Window Available:</strong> 
                  <Badge variant={typeof window !== 'undefined' ? "default" : "destructive"} className="ml-2">
                    {typeof window !== 'undefined' ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
