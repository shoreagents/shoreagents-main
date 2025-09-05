"use client"

import React, { useEffect, useState } from 'react'
import { TrendingUp, Clock, BookOpen, MousePointer } from 'lucide-react'
import { useEngagementTracking } from '@/lib/useEngagementTracking'

interface InterestMetrics {
  activeTime: number
  contentRead: number
  interaction: number
  interestScore: number
}

export function StickyInterestLevel() {
  const [isClient, setIsClient] = useState(false)
  
  // Use the engagement tracking hook only on client side
  const { activeTime, contentRead, interaction, interestScore } = useEngagementTracking()
  
  const interestMetrics: InterestMetrics = {
    activeTime: isClient ? activeTime : 0,
    contentRead: isClient ? contentRead : 0,
    interaction: isClient ? interaction : 0,
    interestScore: isClient ? interestScore : 0
  }

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true)
  }, [])

  const getInterestLevel = () => {
    const total = (interestMetrics.activeTime + interestMetrics.contentRead + interestMetrics.interaction + interestMetrics.interestScore) / 4
    return Math.round(total)
  }

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'bg-lime-500'
    if (value >= 60) return 'bg-lime-400'
    if (value >= 40) return 'bg-yellow-400'
    return 'bg-gray-300'
  }

  const formatActiveTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className="fixed top-20 left-4 z-40 bg-white/95 backdrop-blur-md border border-lime-200 rounded-lg p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-3 h-3 text-lime-600" />
          <span className="text-sm font-medium text-gray-700">Interest Level</span>
        </div>
        <span className="text-lg font-bold text-lime-600">{getInterestLevel()}%</span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner mb-2">
        <div 
          className={`h-full transition-all duration-1000 ease-out ${getProgressColor(getInterestLevel())}`}
          style={{ width: `${getInterestLevel()}%` }}
        />
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
        <div className="flex items-center space-x-1">
          <Clock className="w-3 h-3 text-lime-500" />
          <span>Active: {formatActiveTime(interestMetrics.activeTime)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <BookOpen className="w-3 h-3 text-lime-500" />
          <span>Content: {interestMetrics.contentRead}%</span>
        </div>
        <div className="flex items-center space-x-1">
          <MousePointer className="w-3 h-3 text-lime-500" />
          <span>Clicks: {interestMetrics.interaction}</span>
        </div>
        <div className="flex items-center space-x-1">
          <TrendingUp className="w-3 h-3 text-lime-500" />
          <span>Score: {interestMetrics.interestScore}%</span>
        </div>
      </div>
    </div>
  )
}
