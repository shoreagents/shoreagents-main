import { supabase, UserPageVisit } from './supabase'

// Generate a unique session ID
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
}

// Get user's IP address
export async function getUserIPAddress(): Promise<string | undefined> {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.warn('Could not fetch IP address:', error)
    return undefined
  }
}

// Generate a unique user ID (for anonymous users)
export function generateUserId(): string {
  // Try to get existing user ID from localStorage, or create a new one
  if (typeof window === 'undefined') return `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
  
  let userId = localStorage.getItem('shoreagents_user_id')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    localStorage.setItem('shoreagents_user_id', userId)
  }
  return userId
}

// Get current session ID
export function getCurrentSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId()
  
  let sessionId = sessionStorage.getItem('shoreagents_session_id')
  if (!sessionId) {
    sessionId = generateSessionId()
    sessionStorage.setItem('shoreagents_session_id', sessionId)
  }
  return sessionId
}

// Save user page visit data to Supabase with upsert logic
export async function savePageVisit(
  pagePath: string,
  ipAddress?: string,
  currentSessionTimeSeconds: number = 0
): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Supabase is available
    if (!supabase) {
      console.warn('Supabase client not available. Skipping page visit save.')
      return { success: false, error: 'Supabase client not configured' }
    }

    console.log('🔍 savePageVisit called with:', { pagePath, ipAddress, currentSessionTimeSeconds })

    const userId = generateUserId()
    const now = new Date().toISOString()
    
    // First, check if this user has visited this page before
    const { data: existingVisit, error: checkError } = await supabase
      .from('user_page_visits')
      .select('*')
      .eq('user_id', userId)
      .eq('page_path', pagePath)
      .single()

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error checking for existing visit:', checkError)
      return { success: false, error: checkError.message }
    }

    console.log('🔍 Existing visit found:', existingVisit)

    if (existingVisit) {
      // Update existing visit - increment count and add current session time
      const updatedVisit = {
        visit_count: existingVisit.visit_count + 1,
        time_spent_seconds: existingVisit.time_spent_seconds + currentSessionTimeSeconds,
        last_visit_timestamp: now,
        ip_address: ipAddress || existingVisit.ip_address
      }

      console.log('🔍 Updating visit with:', updatedVisit)

      const { error: updateError } = await supabase
        .from('user_page_visits')
        .update(updatedVisit)
        .eq('id', existingVisit.id)

      if (updateError) {
        console.error('Error updating page visit:', updateError)
        return { success: false, error: updateError.message }
      }

      console.log('✅ Page visit updated:', pagePath, 'Total visits:', updatedVisit.visit_count, 'Total time:', updatedVisit.time_spent_seconds, 'Added time:', currentSessionTimeSeconds)
    } else {
      // Insert new visit
      const newVisit: Omit<UserPageVisit, 'id' | 'created_at'> = {
        user_id: userId,
        page_path: pagePath,
        ip_address: ipAddress,
        visit_timestamp: now,
        visit_count: 1,
        time_spent_seconds: currentSessionTimeSeconds,
        last_visit_timestamp: now
      }

      console.log('🔍 Creating new visit with:', newVisit)

      const { error: insertError } = await supabase
        .from('user_page_visits')
        .insert([newVisit])

      if (insertError) {
        console.error('Error inserting page visit:', insertError)
        return { success: false, error: insertError.message }
      }

      console.log('✅ New page visit created:', pagePath, 'Time spent:', currentSessionTimeSeconds)
    }

    return { success: true }
  } catch (error) {
    console.error('Error in savePageVisit:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}


// Get page visits for a specific user
export async function getUserPageVisits(userId?: string): Promise<UserPageVisit[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const targetUserId = userId || generateUserId()
    
    const { data, error } = await supabase
      .from('user_page_visits')
      .select('*')
      .eq('user_id', targetUserId)
      .order('visit_timestamp', { ascending: false })

    if (error) {
      console.error('Error fetching user page visits:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserPageVisits:', error)
    return []
  }
}


// Get aggregated page analytics
export async function getPageAnalytics(): Promise<any[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('page_analytics')
      .select('*')
      .order('total_visits', { ascending: false })

    if (error) {
      console.error('Error fetching page analytics:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getPageAnalytics:', error)
    return []
  }
}

// Get user visit analytics
export async function getUserVisitAnalytics(): Promise<any[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('user_visit_analytics')
      .select('*')
      .order('total_page_visits', { ascending: false })

    if (error) {
      console.error('Error fetching user visit analytics:', error)
      return []
    }

    return data || []
  } catch (error) {
    console.error('Error in getUserVisitAnalytics:', error)
    return []
  }
}



// Batch save multiple page visits
export async function batchSavePageVisits(
  pageVisits: Array<{
    pagePath: string
    ipAddress?: string
  }>
): Promise<{ success: boolean; error?: string; savedCount?: number }> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Skipping batch save.')
      return { success: false, error: 'Supabase client not configured' }
    }

    const userId = generateUserId()
    
    const visitsToInsert = pageVisits.map(({ pagePath, ipAddress }) => ({
      user_id: userId,
      page_path: pagePath,
      ip_address: ipAddress,
      visit_timestamp: new Date().toISOString()
    }))

    const { error } = await supabase
      .from('user_page_visits')
      .insert(visitsToInsert)

    if (error) {
      console.error('Error batch saving page visits:', error)
      return { success: false, error: error.message }
    }

    console.log(`Batch saved ${pageVisits.length} page visits successfully`)
    return { success: true, savedCount: pageVisits.length }
  } catch (error) {
    console.error('Error in batchSavePageVisits:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Get page analytics with visit counts and time spent
export async function getPageAnalyticsWithTime(): Promise<any[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('user_page_visits')
      .select('*')
      .order('visit_count', { ascending: false })

    if (error) {
      console.error('Error fetching page analytics with time:', error)
      return []
    }

    // Group by page_path and aggregate data
    const pageStats = new Map()
    
    data?.forEach(visit => {
      const pagePath = visit.page_path
      if (!pageStats.has(pagePath)) {
        pageStats.set(pagePath, {
          page_path: pagePath,
          total_visits: 0,
          total_time_spent: 0,
          unique_users: new Set(),
          last_visit: visit.last_visit_timestamp
        })
      }
      
      const stats = pageStats.get(pagePath)
      stats.total_visits += visit.visit_count
      stats.total_time_spent += visit.time_spent_seconds
      stats.unique_users.add(visit.user_id)
    })

    // Convert to array and calculate unique users
    return Array.from(pageStats.values()).map(stats => ({
      ...stats,
      unique_users: stats.unique_users.size,
      avg_time_per_visit: stats.total_visits > 0 ? Math.round(stats.total_time_spent / stats.total_visits) : 0
    }))
  } catch (error) {
    console.error('Error in getPageAnalyticsWithTime:', error)
    return []
  }
}

// Get user analytics with visit counts and time spent
export async function getUserAnalyticsWithTime(): Promise<any[]> {
  try {
    if (!supabase) {
      console.warn('Supabase client not available. Returning empty array.')
      return []
    }

    const { data, error } = await supabase
      .from('user_page_visits')
      .select('*')
      .order('time_spent_seconds', { ascending: false })

    if (error) {
      console.error('Error fetching user analytics with time:', error)
      return []
    }

    // Group by user_id and aggregate data
    const userStats = new Map()
    
    data?.forEach(visit => {
      const userId = visit.user_id
      if (!userStats.has(userId)) {
        userStats.set(userId, {
          user_id: userId,
          total_visits: 0,
          total_time_spent: 0,
          pages_visited: new Set(),
          last_visit: visit.last_visit_timestamp
        })
      }
      
      const stats = userStats.get(userId)
      stats.total_visits += visit.visit_count
      stats.total_time_spent += visit.time_spent_seconds
      stats.pages_visited.add(visit.page_path)
    })

    // Convert to array and calculate unique pages
    return Array.from(userStats.values()).map(stats => ({
      ...stats,
      pages_visited: stats.pages_visited.size,
      avg_time_per_visit: stats.total_visits > 0 ? Math.round(stats.total_time_spent / stats.total_visits) : 0
    }))
  } catch (error) {
    console.error('Error in getUserAnalyticsWithTime:', error)
    return []
  }
}

export function testSupabaseConfig(): void {
  console.log('🧪 Testing Supabase configuration...')
  console.log('Supabase client exists:', supabase !== null)
  console.log('Environment variables:', {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'
  })
  
  if (!supabase) {
    console.error('❌ Supabase client is null! You need to set up your environment variables.')
    console.log('Create a .env.local file with:')
    console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url')
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key')
  } else {
    console.log('✅ Supabase client is configured')
  }
}
