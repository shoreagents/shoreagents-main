"use client"

import React, { useEffect, useState } from 'react'
import { TrendingUp, Clock, BookOpen, MousePointer, RotateCcw, Database } from 'lucide-react'
import { useEngagementTracking } from '@/lib/useEngagementTracking'

interface InterestMetrics {
  activeTime: number
  contentRead: number
  interaction: number
  interestScore: number
}

export function StickyInterestLevel() {
  const [isClient, setIsClient] = useState(false)
  const [serverDown, setServerDown] = useState(false)
  
  // Use the engagement tracking hook only on client side
  const { activeTime, contentRead, interaction, interestScore, clearAllPageData } = useEngagementTracking()
  
  const interestMetrics: InterestMetrics = {
    activeTime: !serverDown ? activeTime : 0,
    contentRead: !serverDown ? contentRead : 0,
    interaction: !serverDown ? interaction : 0,
    interestScore: !serverDown ? interestScore : 0
  }

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true)
    
    // Check if server is down by testing basic connectivity
    const checkServerStatus = async () => {
      try {
        // Try to fetch the current page to test basic server connectivity
        const response = await fetch(window.location.href, { 
          method: 'HEAD',
          signal: AbortSignal.timeout(2000) // 2 second timeout
        })
        setServerDown(!response.ok)
      } catch (error) {
        // Server is down or unreachable
        setServerDown(true)
      }
    }
    
    // Check server status immediately and then every 10 seconds
    checkServerStatus()
    const interval = setInterval(checkServerStatus, 10000)
    
    return () => clearInterval(interval)
  }, [])


  const getInterestLevel = () => {
    const total = (interestMetrics.activeTime + interestMetrics.contentRead + interestMetrics.interaction + interestMetrics.interestScore) / 4
    return Math.min(Math.round(total), 100)
  }

  const getProgressColor = (value: number) => {
    if (serverDown) return 'bg-red-400'
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

  const handleResetAllData = () => {
    // Reset all data immediately
    clearAllPageData()
    console.log('All interest level data cleared')
  }

  const showStoredData = () => {
    const storedData = localStorage.getItem('pageEngagementData')
    if (storedData) {
      console.log('📊 Stored Interest Level Data:')
      console.log(JSON.parse(storedData))
      alert('Data found! Check the browser console (F12) to see the stored data.')
    } else {
      console.log('❌ No interest level data found in localStorage')
      alert('No data found. Navigate between pages to generate some data!')
    }
  }

  // Don't render until client-side to prevent hydration mismatch
  if (!isClient) {
    return null
  }

  return (
    <div className="fixed top-20 left-4 z-40 bg-white/95 backdrop-blur-md border border-lime-200 rounded-lg p-3 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-3 h-3 text-lime-600" />
          <span className="text-sm font-medium text-gray-700">Interest Level</span>
          {serverDown && (
            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
              Server Down
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-lime-600">{getInterestLevel()}%</span>
          <button
            onClick={showStoredData}
            className="p-1 rounded transition-colors bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
            title="Show stored data in console"
            type="button"
          >
            <Database className="w-3 h-3" />
          </button>
          <button
            onClick={handleResetAllData}
            className="p-1 rounded transition-colors bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
            title="Reset all interest data"
            type="button"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
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
