"use client"

import { useAdminAuth } from '@/lib/admin-auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AdminGuardProps {
  children: React.ReactNode
  requiredPermission?: keyof import('@/lib/admin-auth-context').AdminAppUser['permissions']
  fallback?: React.ReactNode
}

export function AdminGuard({ 
  children, 
  requiredPermission,
  fallback = <div>Loading...</div> 
}: AdminGuardProps) {
  const { admin, loading, isAuthenticated, isVerified, hasPermission } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Redirect to admin login page
        router.push('/admin/login')
        return
      }

      if (!isVerified) {
        // Redirect to admin verification page
        router.push('/admin/verify')
        return
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        // Redirect to admin dashboard with error
        router.push('/admin?error=insufficient_permissions')
        return
      }
    }
  }, [loading, isAuthenticated, isVerified, requiredPermission, hasPermission, router])

  if (loading) {
    return <>{fallback}</>
  }

  if (!isAuthenticated) {
    return <>{fallback}</>
  }

  if (!isVerified) {
    return <>{fallback}</>
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}