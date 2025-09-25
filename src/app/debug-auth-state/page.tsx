'use client';

import { useAuth } from '@/lib/auth-context';
import { createClient } from '@/lib/supabase/client';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function DebugAuthState() {
  const { user, appUser } = useAuth();
  const [supabaseAuth, setSupabaseAuth] = useState<any>(null);
  const [usersTableData, setUsersTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSupabaseAuth = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      setSupabaseAuth(session);
    };
    checkSupabaseAuth();
  }, []);

  const fetchUsersTableData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('users')
        .select('user_id, auth_user_id, email, user_type, created_at')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsersTableData(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Debug Auth State</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Auth Context State */}
        <Card>
          <CardHeader>
            <CardTitle>Auth Context State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <span className="font-semibold">User (Supabase):</span>
              <div className="mt-2">
                {user ? (
                  <div className="space-y-2">
                    <Badge variant="outline">ID: {user.id}</Badge>
                    <Badge variant="outline">Email: {user.email}</Badge>
                  </div>
                ) : (
                  <Badge variant="destructive">No User</Badge>
                )}
              </div>
            </div>
            
            <div>
              <span className="font-semibold">App User:</span>
              <div className="mt-2">
                {appUser ? (
                  <div className="space-y-2">
                    <Badge variant="outline">User ID: {appUser.user_id}</Badge>
                    <Badge variant="outline">Email: {appUser.email}</Badge>
                    <Badge variant="outline">Type: {appUser.user_type}</Badge>
                  </div>
                ) : (
                  <Badge variant="destructive">No App User</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supabase Auth State */}
        <Card>
          <CardHeader>
            <CardTitle>Supabase Auth State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {supabaseAuth ? (
              <div className="space-y-2">
                <Badge variant="outline">ID: {supabaseAuth.user?.id}</Badge>
                <Badge variant="outline">Email: {supabaseAuth.user?.email}</Badge>
                <Badge variant="outline">Access Token: {supabaseAuth.access_token ? 'Present' : 'Missing'}</Badge>
              </div>
            ) : (
              <Badge variant="destructive">No Supabase Session</Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Users Table Data */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users Table Data</CardTitle>
          <Button onClick={fetchUsersTableData} disabled={loading}>
            {loading ? 'Loading...' : 'Fetch Users'}
          </Button>
        </CardHeader>
        <CardContent>
          {usersTableData.length > 0 ? (
            <div className="space-y-4">
              {usersTableData.map((user, index) => (
                <div key={index} className="border rounded p-4 space-y-2">
                  <div className="flex gap-2">
                    <Badge variant="outline">User ID: {user.user_id}</Badge>
                    <Badge variant="outline">Auth ID: {user.auth_user_id || 'NULL'}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary">Email: {user.email}</Badge>
                    <Badge variant="secondary">Type: {user.user_type}</Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Created: {new Date(user.created_at).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No users data loaded. Click "Fetch Users" to load.</p>
          )}
        </CardContent>
      </Card>

      {/* Content Tracking Test */}
      <Card>
        <CardHeader>
          <CardTitle>Content Tracking Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Expected user_id for content tracking:</span>
              <div className="mt-2">
                {appUser?.user_id ? (
                  <Badge variant="default">{appUser.user_id}</Badge>
                ) : (
                  <Badge variant="destructive">No user_id available</Badge>
                )}
              </div>
            </div>
            
            <div>
              <span className="font-semibold">Fallback would be:</span>
              <div className="mt-2">
                <Badge variant="outline">Device ID (anonymous tracking)</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
