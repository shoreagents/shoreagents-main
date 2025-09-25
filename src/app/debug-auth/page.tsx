'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';

export default function DebugAuthPage() {
  const { user, appUser, isAuthenticated, loading } = useAuth();
  const [supabaseUser, setSupabaseUser] = useState<any>(null);
  const [usersTableData, setUsersTableData] = useState<any[]>([]);

  useEffect(() => {
    const checkSupabaseAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        setSupabaseUser(session?.user || null);
      } catch (error) {
        console.error('Error checking Supabase auth:', error);
      }
    };

    const fetchUsersTable = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .limit(10);
        
        if (error) {
          console.error('Error fetching users table:', error);
        } else {
          setUsersTableData(data || []);
        }
      } catch (error) {
        console.error('Error fetching users table:', error);
      }
    };

    checkSupabaseAuth();
    fetchUsersTable();
  }, []);

  const testLogin = async () => {
    try {
      const supabase = createClient();
      // You can add a test login here if needed
      console.log('Test login functionality');
    } catch (error) {
      console.error('Error with test login:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
          Authentication Debug Page
        </h1>
        <div className="text-center mb-8 p-4 bg-lime-50 border border-lime-200 rounded-lg">
          <p className="text-lime-800 font-medium">
            📱 Content Tracking now uses <strong>device_id</strong> as <strong>user_id</strong> for anonymous tracking
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Auth Context State */}
          <Card>
            <CardHeader>
              <CardTitle>Auth Context State</CardTitle>
              <CardDescription>
                Current authentication state from useAuth hook
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Loading:</strong>
                  <Badge variant={loading ? "destructive" : "default"} className="ml-2">
                    {loading ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <strong>Is Authenticated:</strong>
                  <Badge variant={isAuthenticated ? "default" : "secondary"} className="ml-2">
                    {isAuthenticated ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              
              <div>
                <strong>Supabase User (user):</strong>
                <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                  {user ? JSON.stringify(user, null, 2) : "null"}
                </div>
              </div>
              
              <div>
                <strong>App User (appUser):</strong>
                <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                  {appUser ? JSON.stringify(appUser, null, 2) : "null"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supabase Auth State */}
          <Card>
            <CardHeader>
              <CardTitle>Supabase Auth State</CardTitle>
              <CardDescription>
                Direct Supabase authentication state
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Supabase User:</strong>
                <div className="mt-2 p-3 bg-gray-50 rounded text-xs font-mono">
                  {supabaseUser ? JSON.stringify(supabaseUser, null, 2) : "null"}
                </div>
              </div>
              
              <Button onClick={testLogin} className="w-full">
                Test Login (placeholder)
              </Button>
            </CardContent>
          </Card>

          {/* Users Table Data */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Users Table Data</CardTitle>
              <CardDescription>
                Recent entries from the users table
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">user_id</th>
                      <th className="text-left p-2">auth_user_id</th>
                      <th className="text-left p-2">email</th>
                      <th className="text-left p-2">user_type</th>
                      <th className="text-left p-2">created_at</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersTableData.map((user, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-mono text-xs">{user.user_id}</td>
                        <td className="p-2 font-mono text-xs">{user.auth_user_id || 'NULL'}</td>
                        <td className="p-2">{user.email || 'NULL'}</td>
                        <td className="p-2">
                          <Badge variant="outline">{user.user_type}</Badge>
                        </td>
                        <td className="p-2 text-xs">{new Date(user.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
