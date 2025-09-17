"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserType } from '@/types/user'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

interface User {
  user_id: string
  auth_user_id: string | null
  user_type: UserType
  first_name: string | null
  last_name: string | null
  email: string | null
  company: string | null
  created_at: string
}

export function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      if (!supabase) return

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        toast.error('Failed to fetch users')
        return
      }

      setUsers(data || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }

  const updateUserType = async (userId: string, newUserType: UserType) => {
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/promote-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          newUserType,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user type')
      }

      toast.success(`User type updated to ${newUserType}`)
      fetchUsers() // Refresh the list
    } catch (error) {
      console.error('Error updating user type:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update user type')
    } finally {
      setUpdating(null)
    }
  }

  const getUserTypeBadge = (userType: UserType) => {
    const variants = {
      [UserType.ANONYMOUS]: 'secondary',
      [UserType.REGULAR]: 'default',
      [UserType.ADMIN]: 'destructive',
    } as const

    return (
      <Badge variant={variants[userType]}>
        {userType}
      </Badge>
    )
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage user types and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user types and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-medium">
                    {user.first_name && user.last_name 
                      ? `${user.first_name} ${user.last_name}`
                      : 'Anonymous User'
                    }
                  </h3>
                  {getUserTypeBadge(user.user_type)}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {user.email && <div>Email: {user.email}</div>}
                  {user.company && <div>Company: {user.company}</div>}
                  <div>User ID: {user.user_id}</div>
                  <div>Created: {new Date(user.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select
                  value={user.user_type}
                  onValueChange={(value) => updateUserType(user.user_id, value as UserType)}
                  disabled={updating === user.user_id}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserType.ANONYMOUS}>Anonymous</SelectItem>
                    <SelectItem value={UserType.REGULAR}>Regular</SelectItem>
                    <SelectItem value={UserType.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
                {updating === user.user_id && (
                  <div className="w-4 h-4 border-2 border-lime-600 border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}


