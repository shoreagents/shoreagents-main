"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/lib/auth-context'
import { useAdminAuth } from '@/lib/admin-auth-context'

export default function AuthCallback() {
  const router = useRouter()
  const { refreshUser } = useAuth()
  const { refreshAdmin } = useAdminAuth()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const supabase = createClient()
        
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          router.push('/login?error=auth_failed')
          return
        }

        if (data.session) {
          // User is authenticated, refresh both user and admin contexts
          await Promise.all([refreshUser(), refreshAdmin()])
          
          // Check if this is an admin user by looking at the user data
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('is_admin, user_type')
            .eq('auth_user_id', data.session.user.id)
            .single()
          
          if (!userError && userData && userData.user_type === 'Admin') {
            // This is an admin user, redirect to admin dashboard
            router.push('/admin')
          } else {
            // This is a regular user, redirect to user dashboard
            router.push('/user-dashboard')
          }
        } else {
          // No session found, redirect to home page
          router.push('/')
        }
      } catch (error) {
        console.error('Auth callback error:', error)
        router.push('/login?error=auth_failed')
      }
    }

    handleAuthCallback()
  }, [router, refreshUser, refreshAdmin])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  )
}
