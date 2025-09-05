interface UserEngagementData {
  activeTime: number // Total accumulated time spent on this page across all visits (in seconds)
  contentRead: number // Scroll percentage (0-100)
  interaction: number // Number of clicks/interactions
  interestScore: number // Calculated interest score
  pageStartTime: number // Start time of current session
  lastActivityTime: number
  scrollDepth: number
  totalScrollHeight: number
  interactionCount: number
  sessionStartTime: number // When current session started
}

class UserEngagementTracker {
  private static instance: UserEngagementTracker
  private engagementData: UserEngagementData
  private updateCallbacks: ((data: UserEngagementData) => void)[] = []
  private isTracking: boolean = false
  private activityTimer: NodeJS.Timeout | null = null
  private scrollThrottleTimer: NodeJS.Timeout | null = null
  private currentPage: string = ''
  private pageData: Map<string, UserEngagementData> = new Map()
  private lastClickTime: number = 0

  private constructor() {
    this.engagementData = {
      activeTime: 0,
      contentRead: 0,
      interaction: 0,
      interestScore: 0,
      pageStartTime: 0, // Start with 0 to prevent hydration mismatch
      lastActivityTime: 0, // Start with 0 to prevent hydration mismatch
      scrollDepth: 0,
      totalScrollHeight: 0,
      interactionCount: 0,
      sessionStartTime: 0
    }
    this.loadPageDataFromStorage()
  }

  public static getInstance(): UserEngagementTracker {
    if (!UserEngagementTracker.instance) {
      UserEngagementTracker.instance = new UserEngagementTracker()
    }
    return UserEngagementTracker.instance
  }

  private loadPageDataFromStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      const savedData = localStorage.getItem('pageEngagementData')
      if (savedData) {
        const parsedData = JSON.parse(savedData)
        this.pageData = new Map(Object.entries(parsedData))
        console.log('Tracker: Loaded page data from storage', this.pageData.size, 'pages')
      }
    } catch (error) {
      console.error('Error loading page data from storage:', error)
    }
  }

  private savePageDataToStorage(): void {
    if (typeof window === 'undefined') return
    
    try {
      const dataToSave = Object.fromEntries(this.pageData)
      localStorage.setItem('pageEngagementData', JSON.stringify(dataToSave))
    } catch (error) {
      console.error('Error saving page data to storage:', error)
    }
  }

  private getPageKey(pathname: string): string {
    // Use pathname as the key, or 'home' for root path
    return pathname === '/' ? 'home' : pathname.replace(/^\//, '').replace(/\//g, '-')
  }

  public startTracking(pathname: string = ''): void {
    if (this.isTracking) {
      console.log('Tracker: Already tracking, skipping start')
      return
    }
    
    console.log('Tracker: Starting tracking for page:', pathname)
    this.isTracking = true
    this.currentPage = pathname
    
    // Load existing data for this page or create new data
    const pageKey = this.getPageKey(pathname)
    const existingData = this.pageData.get(pageKey)
    
    if (existingData) {
      // Load existing data for this page
      this.engagementData = { ...existingData }
      console.log('Tracker: Loaded existing data for page:', pageKey)
    } else {
      // Create new data for this page
      const now = Date.now()
      this.engagementData = {
        activeTime: 0,
        contentRead: 0,
        interaction: 0,
        interestScore: 0,
        pageStartTime: now,
        lastActivityTime: now,
        scrollDepth: 0,
        totalScrollHeight: 0,
        interactionCount: 0,
        sessionStartTime: now
      }
      console.log('Tracker: Created new data for page:', pageKey)
    }
    
    // Always update timestamps for current session
    const now = Date.now()
    this.engagementData.pageStartTime = now
    this.engagementData.lastActivityTime = now
    this.engagementData.sessionStartTime = now
    
    this.setupEventListeners()
    this.startActivityTimer()
    this.calculateInitialMetrics()
    console.log('Tracker: Tracking started successfully')
  }

  public stopTracking(): void {
    if (this.isTracking && this.currentPage) {
      // Calculate and add current session time to accumulated time
      const now = Date.now()
      if (this.engagementData.sessionStartTime > 0) {
        const sessionTime = Math.floor((now - this.engagementData.sessionStartTime) / 1000)
        this.engagementData.activeTime += sessionTime
        
        // Cap the accumulated time
        const maxActiveTime = 7200
        this.engagementData.activeTime = Math.min(this.engagementData.activeTime, maxActiveTime)
      }
      
      // Save current page data before stopping
      const pageKey = this.getPageKey(this.currentPage)
      this.pageData.set(pageKey, { ...this.engagementData })
      this.savePageDataToStorage()
      console.log('Tracker: Saved data for page:', pageKey, 'Total active time:', this.engagementData.activeTime)
    }
    
    this.isTracking = false
    this.clearTimers()
    this.removeEventListeners()
  }

  public subscribe(callback: (data: UserEngagementData) => void): () => void {
    this.updateCallbacks.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.updateCallbacks.indexOf(callback)
      if (index > -1) {
        this.updateCallbacks.splice(index, 1)
      }
    }
  }

  public getCurrentData(): UserEngagementData {
    return { ...this.engagementData }
  }

  private setupEventListeners(): void {
    console.log('Tracker: Setting up event listeners')
    
    // Track scroll events
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true })
    
    // Track all button clicks automatically
    document.addEventListener('click', this.handleClick.bind(this), { passive: true })
    console.log('Tracker: Click listener added - tracking all button clicks')
    
    // Track navigation events
    window.addEventListener('beforeunload', this.handlePageUnload.bind(this))
    
    // Track visibility changes (tab switching, etc.)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    
    // Track mouse movement for activity
    document.addEventListener('mousemove', this.handleMouseMove.bind(this), { passive: true })
    
    // Track keyboard activity
    document.addEventListener('keydown', this.handleKeyPress.bind(this), { passive: true })
  }

  private removeEventListeners(): void {
    window.removeEventListener('scroll', this.handleScroll.bind(this))
    document.removeEventListener('click', this.handleClick.bind(this))
    window.removeEventListener('beforeunload', this.handlePageUnload.bind(this))
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this))
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this))
    document.removeEventListener('keydown', this.handleKeyPress.bind(this))
  }

  private handleScroll(): void {
    if (!this.isTracking) return

    // Throttle scroll events
    if (this.scrollThrottleTimer) return

    this.scrollThrottleTimer = setTimeout(() => {
      this.updateScrollMetrics()
      this.scrollThrottleTimer = null
    }, 100)
  }

  private handleClick(event: Event): void {
    if (!this.isTracking) return
    
    const now = Date.now()
    
    // Debounce: only count clicks that are at least 200ms apart
    if (now - this.lastClickTime < 200) {
      return
    }
    
    // Check if the clicked element is a button or has a button-like role
    const target = event.target as HTMLElement
    const isButton = target.tagName === 'BUTTON' || 
                    target.getAttribute('role') === 'button' ||
                    target.closest('button') ||
                    target.classList.contains('btn') ||
                    target.classList.contains('button')
    
    if (isButton) {
      // Check if this is a utility button that should not be counted
      const actualButton = target.tagName === 'BUTTON' ? target : target.closest('button') || target
      
      // Skip counting for utility buttons (reset, database, etc.)
      const isUtilityButton = actualButton?.getAttribute('title')?.includes('Reset') ||
                             actualButton?.getAttribute('title')?.includes('Show stored data') ||
                             actualButton?.getAttribute('title')?.includes('reset') ||
                             actualButton?.getAttribute('title')?.includes('data') ||
                             actualButton?.classList.contains('utility-button') ||
                             actualButton?.closest('.utility-buttons')
      
      if (!isUtilityButton) {
        // Update last click time
        this.lastClickTime = now
        
        // Increment interaction count by exactly 1
        this.engagementData.interactionCount++
        this.engagementData.interaction = this.engagementData.interactionCount
        this.engagementData.lastActivityTime = now
        console.log('Tracker: Button click detected, interaction count:', this.engagementData.interactionCount)
        this.updateMetrics()
      } else {
        console.log('Tracker: Utility button click ignored:', actualButton?.getAttribute('title'))
      }
    }
  }

  private handleKeyPress(): void {
    if (!this.isTracking) return
    
    this.engagementData.lastActivityTime = Date.now()
    this.updateMetrics()
  }

  private handleMouseMove(): void {
    if (!this.isTracking) return
    
    this.engagementData.lastActivityTime = Date.now()
  }

  private handlePageUnload(): void {
    this.stopTracking()
  }

  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Page is hidden, pause tracking
      this.pauseTracking()
    } else {
      // Page is visible, resume tracking
      this.resumeTracking()
    }
  }

  private pauseTracking(): void {
    this.clearTimers()
  }

  private resumeTracking(): void {
    if (this.isTracking) {
      this.startActivityTimer()
    }
  }

  private startActivityTimer(): void {
    this.activityTimer = setInterval(() => {
      this.updateActiveTime()
      this.updateMetrics()
    }, 1000) // Update every second
  }

  private clearTimers(): void {
    if (this.activityTimer) {
      clearInterval(this.activityTimer)
      this.activityTimer = null
    }
    if (this.scrollThrottleTimer) {
      clearTimeout(this.scrollThrottleTimer)
      this.scrollThrottleTimer = null
    }
  }

  private updateActiveTime(): void {
    const now = Date.now()
    
    // Ensure sessionStartTime is valid
    if (this.engagementData.sessionStartTime === 0 || this.engagementData.sessionStartTime > now) {
      this.engagementData.sessionStartTime = now
      return
    }
    
    // Calculate time spent in current session
    const sessionTime = Math.floor((now - this.engagementData.sessionStartTime) / 1000)
    
    // The activeTime field stores the accumulated time from previous visits
    // We don't add current session time here - that will be added when the session ends
    // For display purposes, we show: accumulated time + current session time
    const totalDisplayTime = this.engagementData.activeTime + sessionTime
    
    // Cap the display time to prevent unrealistic values (max 2 hours = 7200 seconds)
    const maxActiveTime = 7200
    const cappedDisplayTime = Math.min(totalDisplayTime, maxActiveTime)
    
    // Update the display value (we'll use a temporary field for this)
    // For now, we'll store the current session time separately and calculate total on demand
  }

  private updateScrollMetrics(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    
    // Always update scroll depth and total height
    this.engagementData.scrollDepth = scrollTop + windowHeight
    this.engagementData.totalScrollHeight = documentHeight
    
    // Calculate current scroll percentage
    const currentScrollPercentage = Math.min(100, Math.round((this.engagementData.scrollDepth / this.engagementData.totalScrollHeight) * 100))
    
    // Only update contentRead if it's higher than the current value (track maximum reached)
    if (currentScrollPercentage > this.engagementData.contentRead) {
      this.engagementData.contentRead = currentScrollPercentage
    }
    
    // Don't go back to 0 - maintain the highest scroll percentage reached
  }

  private calculateInitialMetrics(): void {
    // Don't calculate scroll metrics initially - start at 0
    // this.updateScrollMetrics() // Commented out - let user scroll first
    this.updateMetrics()
  }

  private updateMetrics(): void {
    // Calculate interest score based on realistic factors
    // Active Time: 15% weight (lowest - users can leave laptop open)
    const timeScore = Math.min(100, this.engagementData.activeTime / 60 * 15) // Max 15 points, reaches 100 at 60 seconds
    
    // Content Read: 25% weight (shows engagement with content)
    const scrollScore = this.engagementData.contentRead * 0.25 // 25% weight for scroll
    
    // Interactions: 60% weight (highest - shows active engagement and intent)
    const interactionScore = Math.min(100, this.engagementData.interactionCount * 10) * 0.6 // 60% weight, max 60 points
    
    this.engagementData.interestScore = Math.round(timeScore + scrollScore + interactionScore)
    
    // Ensure score stays within 0-100 range
    this.engagementData.interestScore = Math.max(0, Math.min(100, this.engagementData.interestScore))
    
    // Notify subscribers
    this.notifySubscribers()
  }

  private notifySubscribers(): void {
    console.log('Tracker: Notifying subscribers, interaction count:', this.engagementData.interactionCount)
    
    // Save current page data periodically
    if (this.isTracking && this.currentPage) {
      const pageKey = this.getPageKey(this.currentPage)
      this.pageData.set(pageKey, { ...this.engagementData })
      this.savePageDataToStorage()
    }
    
    this.updateCallbacks.forEach(callback => {
      try {
        callback({ ...this.engagementData })
      } catch (error) {
        console.error('Error in engagement tracker callback:', error)
      }
    })
  }

  // Public method to manually trigger interaction (for programmatic interactions)
  public recordInteraction(type: string = 'click'): void {
    this.engagementData.interactionCount++
    this.engagementData.interaction = this.engagementData.interactionCount // Sync the fields
    this.engagementData.lastActivityTime = Date.now()
    console.log('Tracker: Interaction recorded, count now:', this.engagementData.interactionCount)
    this.updateMetrics()
  }

  // Public method to reset tracking for new page
  public resetForNewPage(pathname: string): void {
    // Stop current tracking first (this will save current page data and accumulate session time)
    this.stopTracking()
    
    // Start tracking for the new page
    this.startTracking(pathname)
    
    console.log('Tracker: Reset for new page:', pathname)
  }

  // Get current total active time (accumulated + current session)
  private getCurrentTotalActiveTime(): number {
    const now = Date.now()
    if (this.engagementData.sessionStartTime > 0) {
      const sessionTime = Math.floor((now - this.engagementData.sessionStartTime) / 1000)
      return this.engagementData.activeTime + sessionTime
    }
    return this.engagementData.activeTime
  }

  // Get formatted metrics for display
  public getFormattedMetrics() {
    return {
      activeTime: this.getCurrentTotalActiveTime(),
      contentRead: this.engagementData.contentRead,
      interaction: this.engagementData.interactionCount,
      interestScore: this.engagementData.interestScore
    }
  }

  // Debug method to log current state
  public debug(): void {
    console.log('User Engagement Tracker Debug:', {
      isTracking: this.isTracking,
      data: this.engagementData,
      subscribers: this.updateCallbacks.length
    })
  }

  // Method to get raw data for analytics
  public getRawData(): UserEngagementData {
    return { ...this.engagementData }
  }

  // Method to get all page data for analytics
  public getAllPageData(): Record<string, UserEngagementData> {
    return Object.fromEntries(this.pageData)
  }

  // Method to get data for a specific page
  public getPageData(pathname: string): UserEngagementData | null {
    const pageKey = this.getPageKey(pathname)
    return this.pageData.get(pageKey) || null
  }

  // Method to clear all page data (for testing or reset)
  public clearAllPageData(): void {
    // Stop current tracking first
    this.stopTracking()
    
    // Clear all page data
    this.pageData.clear()
    
    // Reset current engagement data
    this.engagementData = {
      activeTime: 0,
      contentRead: 0,
      interaction: 0,
      interestScore: 0,
      pageStartTime: 0,
      lastActivityTime: 0,
      scrollDepth: 0,
      totalScrollHeight: 0,
      interactionCount: 0,
      sessionStartTime: 0
    }
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('pageEngagementData')
        console.log('Tracker: Cleared all page data from localStorage')
      } catch (error) {
        console.error('Error clearing page data from storage:', error)
      }
    }
    
    // Restart tracking for the current page if we have a current page
    if (this.currentPage) {
      console.log('Tracker: Restarting tracking after reset for page:', this.currentPage)
      this.startTracking(this.currentPage)
    }
    
    // Notify subscribers of the reset
    this.notifySubscribers()
    
    console.log('Tracker: Cleared all page data and restarted tracking')
  }
}

// Export singleton instance
export const userEngagementTracker = UserEngagementTracker.getInstance()

// Export types for use in components
export type { UserEngagementData }
