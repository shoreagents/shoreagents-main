"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from './supabase/client'
import type { User } from '@supabase/supabase-js'

const supabase = createClient()

export interface AppUser {
  id: string
  user_id: string
  first_name?: string
  last_name?: string
  email?: string
  phone_number?: string
  company?: string
  country?: string
  created_at: string
  updated_at: string
  auth_user_id?: string
  user_type: 'Anonymous' | 'Regular' | 'Admin'
}

interface AuthContextType {
  user: User | null
  appUser: AppUser | null
  userType: 'Anonymous' | 'Regular' | 'Admin' | null
  isAdmin: boolean
  isRegular: boolean
  isAnonymous: boolean
  isAuthenticated: boolean
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [appUser, setAppUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedUserId, setLastFetchedUserId] = useState<string | null>(null)

  // Fetch app user data from our custom users table
  const fetchAppUser = async (authUser: User | null) => {
    if (!authUser || !supabase) {
      setAppUser(null)
      setLastFetchedUserId(null)
      return
    }

    // Skip fetch if we already have data for this user
    if (lastFetchedUserId === authUser.id && appUser) {
      return
    }

    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', authUser.id)
        .single()

      if (error) {
        console.error('Error fetching app user:', error)
        setAppUser(null)
        setLastFetchedUserId(null)
      } else {
        setAppUser(userData)
        setLastFetchedUserId(authUser.id)
      }
    } catch (error) {
      console.error('Error in fetchAppUser:', error)
      setAppUser(null)
      setLastFetchedUserId(null)
    }
  }

  // Memoize the refresh function to prevent unnecessary re-renders
  const refreshUser = async () => {
    if (user) {
      await fetchAppUser(user)
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase?.auth.getSession() || { data: { session: null } }
      setUser(session?.user ?? null)
      await fetchAppUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase?.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        await fetchAppUser(session?.user ?? null)
        setLoading(false)
      }
    ) || { data: { subscription: null } }

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    try {
      console.log('🔍 Starting sign out process...')
      
      if (supabase) {
        // Sign out from Supabase
        const { error } = await supabase.auth.signOut()
        
        if (error) {
          console.error('❌ Supabase signOut error:', error)
          throw error
        }
        
        console.log('✅ Supabase signOut successful')
      }
      
      // Clear local state immediately
      setUser(null)
      setAppUser(null)
      setLastFetchedUserId(null)
      
      console.log('✅ Local state cleared')
      
      // Force a page reload to ensure complete cleanup
      // This prevents any lingering state issues
      setTimeout(() => {
        window.location.href = '/'
      }, 100)
      
    } catch (error) {
      console.error('❌ Sign out error:', error)
      
      // Even if there's an error, clear local state
      setUser(null)
      setAppUser(null)
      setLastFetchedUserId(null)
      
      // Still redirect to home page
      window.location.href = '/'
    }
  }


  // Computed values
  const userType = appUser?.user_type || (user ? 'Regular' : 'Anonymous')
  const isAdmin = userType === 'Admin'
  const isRegular = userType === 'Regular'
  const isAnonymous = userType === 'Anonymous'
  const isAuthenticated = !!user


  const value = {
    user,
    appUser,
    userType,
    isAdmin,
    isRegular,
    isAnonymous,
    isAuthenticated,
    loading,
    signOut,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
