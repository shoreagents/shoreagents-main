'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function TestEnvPage() {
  const [envVars, setEnvVars] = useState<any>({});

  const checkEnvVars = () => {
    const vars = {
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      // Check if the key exists but don't show the full value for security
      NEXT_PUBLIC_SUPABASE_ANON_KEY_LENGTH: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    };
    setEnvVars(vars);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Environment Variables Test
        </h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>
              Check if required environment variables are available
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <button 
              onClick={checkEnvVars}
              className="px-4 py-2 bg-lime-600 text-white rounded hover:bg-lime-700"
            >
              Check Environment Variables
            </button>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">NODE_ENV:</span>
                <Badge variant={envVars.NODE_ENV ? "default" : "destructive"}>
                  {envVars.NODE_ENV || 'Not Set'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL:</span>
                <Badge variant={envVars.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                  {envVars.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not Set'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <Badge variant={envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                  {envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? `Set (${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY_LENGTH} chars)` : 'Not Set'}
                </Badge>
              </div>
            </div>
            
            {envVars.NEXT_PUBLIC_SUPABASE_URL && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-800">
                  <strong>Supabase URL:</strong> {envVars.NEXT_PUBLIC_SUPABASE_URL}
                </p>
              </div>
            )}
            
            {!envVars.NEXT_PUBLIC_SUPABASE_URL && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">
                  <strong>Missing Environment Variables!</strong><br/>
                  Make sure you have a <code>.env.local</code> file with:<br/>
                  <code>NEXT_PUBLIC_SUPABASE_URL=your_supabase_url</code><br/>
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key</code>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
