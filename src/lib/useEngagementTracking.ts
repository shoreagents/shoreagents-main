import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { userEngagementTracker, type UserEngagementData } from './userEngagementTracker'

export function useEngagementTracking() {
  const pathname = usePathname()
  const [engagementData, setEngagementData] = useState<UserEngagementData>({
    activeTime: 0,
    contentRead: 0,
    interaction: 0,
    interestScore: 0,
    pageStartTime: 0, // Start with 0 to prevent hydration mismatch
    lastActivityTime: 0, // Start with 0 to prevent hydration mismatch
    scrollDepth: 0,
    totalScrollHeight: 0,
    interactionCount: 0
  })

  useEffect(() => {
    // Reset tracking when pathname changes
    userEngagementTracker.resetForNewPage()

    // Subscribe to updates
    const unsubscribe = userEngagementTracker.subscribe((data: UserEngagementData) => {
      setEngagementData(data)
    })

    // Start tracking
    userEngagementTracker.startTracking()

    return () => {
      unsubscribe()
      userEngagementTracker.stopTracking()
    }
  }, [pathname])

  // Helper function to manually record interactions
  const recordInteraction = (type: string = 'click') => {
    userEngagementTracker.recordInteraction(type)
    // Immediately update local state to reflect the new interaction
    setEngagementData(prev => ({
      ...prev,
      interaction: prev.interaction + 1,
      interactionCount: prev.interactionCount + 1
    }))
  }

  // Helper function to get formatted metrics
  const getFormattedMetrics = () => {
    return userEngagementTracker.getFormattedMetrics()
  }

  return {
    engagementData,
    recordInteraction,
    getFormattedMetrics,
    // Individual metrics for easy access
    activeTime: engagementData.activeTime,
    contentRead: engagementData.contentRead,
    interaction: engagementData.interaction,
    interestScore: engagementData.interestScore
  }
}
