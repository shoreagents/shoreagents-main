"use client"

import { useAuth } from '@/lib/auth-context'
import { ReactNode } from 'react'

interface AdminGuardProps {
  children: ReactNode
  fallback?: ReactNode
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  const { isAdmin, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAdmin) {
    return <>{fallback}</>
  }

  return <>{children}</>
}
