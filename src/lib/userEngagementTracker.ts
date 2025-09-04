interface UserEngagementData {
  activeTime: number // Time spent on current page in seconds
  contentRead: number // Scroll percentage (0-100)
  interaction: number // Number of clicks/interactions
  interestScore: number // Calculated interest score
  pageStartTime: number
  lastActivityTime: number
  scrollDepth: number
  totalScrollHeight: number
  interactionCount: number
}

class UserEngagementTracker {
  private static instance: UserEngagementTracker
  private engagementData: UserEngagementData
  private updateCallbacks: ((data: UserEngagementData) => void)[] = []
  private isTracking: boolean = false
  private activityTimer: NodeJS.Timeout | null = null
  private scrollThrottleTimer: NodeJS.Timeout | null = null

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
      interactionCount: 0
    }
  }

  public static getInstance(): UserEngagementTracker {
    if (!UserEngagementTracker.instance) {
      UserEngagementTracker.instance = new UserEngagementTracker()
    }
    return UserEngagementTracker.instance
  }

  public startTracking(): void {
    if (this.isTracking) {
      console.log('Tracker: Already tracking, skipping start')
      return
    }
    
    console.log('Tracker: Starting tracking')
    this.isTracking = true
    
    // Only set timestamps when actually starting tracking (client-side)
    if (typeof window !== 'undefined') {
      this.engagementData.pageStartTime = Date.now()
      this.engagementData.lastActivityTime = Date.now()
    }
    
    this.engagementData.interactionCount = 0
    this.engagementData.scrollDepth = 0
    
    this.setupEventListeners()
    this.startActivityTimer()
    this.calculateInitialMetrics()
    console.log('Tracker: Tracking started successfully')
  }

  public stopTracking(): void {
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
    
    // Don't track document clicks automatically - use manual recordInteraction() instead
    // document.addEventListener('click', this.handleClick.bind(this), { passive: true })
    console.log('Tracker: Click listener removed - using manual tracking only')
    
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
    // document.removeEventListener('click', this.handleClick.bind(this)) // Removed click listener
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

  // Removed handleClick method - using manual recordInteraction() instead

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
    const timeDiff = now - this.engagementData.pageStartTime
    this.engagementData.activeTime = Math.floor(timeDiff / 1000) // Convert to seconds
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
  public resetForNewPage(): void {
    this.engagementData = {
      activeTime: 0,
      contentRead: 0, // This will now start at 0
      interaction: 0,
      interestScore: 0,
      pageStartTime: 0, // Start with 0 to prevent hydration mismatch
      lastActivityTime: 0, // Start with 0 to prevent hydration mismatch
      scrollDepth: 0,
      totalScrollHeight: 0,
      interactionCount: 0
    }
    
    // Ensure both interaction fields are in sync
    this.engagementData.interaction = this.engagementData.interactionCount
    
    // Don't start tracking immediately - let the hook handle it
    // this.startTracking() // Commented out to prevent conflicts
  }

  // Get formatted metrics for display
  public getFormattedMetrics() {
    return {
      activeTime: this.engagementData.activeTime,
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
}

// Export singleton instance
export const userEngagementTracker = UserEngagementTracker.getInstance()

// Export types for use in components
export type { UserEngagementData }
