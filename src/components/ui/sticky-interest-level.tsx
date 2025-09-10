"use client"

import React, { useEffect, useState } from 'react'
import { TrendingUp, Clock, BookOpen, MousePointer, RotateCcw, Database, Globe, MapPin } from 'lucide-react'
import { useEngagementTracking } from '@/lib/useEngagementTracking'
import { ipDetectionService, type LocationData } from '@/lib/ipDetection'

interface InterestMetrics {
  activeTime: number
  contentRead: number
  interaction: number
  interestScore: number
}

interface LocationInfo {
  location: LocationData | null
  currency: string
  timezone: string
  ip: string
}

export function StickyInterestLevel() {
  const [isClient, setIsClient] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [serverDown, setServerDown] = useState(false)
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  
  // Use the engagement tracking hook only on client side
  const { activeTime, contentRead, interactionCount, interestScore, clearAllPageData } = useEngagementTracking()
  
  const interestMetrics: InterestMetrics = {
    activeTime: !serverDown ? activeTime : 0,
    contentRead: !serverDown ? contentRead : 0,
    interaction: !serverDown ? interactionCount : 0,
    interestScore: !serverDown ? interestScore : 0
  }

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true)
    
    // Load location info
    loadLocationInfo()
    
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

  const loadLocationInfo = async () => {
    setIsLoadingLocation(true)
    try {
      const info = await ipDetectionService.getLocationInfo()
      setLocationInfo({
        location: info.location,
        currency: info.currency,
        timezone: info.timezone,
        ip: info.location?.query || 'Unknown'
      })
    } catch (error) {
      console.error('Error loading location info:', error)
      setLocationInfo({
        location: null,
        currency: 'USD',
        timezone: 'UTC',
        ip: 'Unknown'
      })
    } finally {
      setIsLoadingLocation(false)
    }
  }


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
    <div className="bg-white/95 backdrop-blur-md border border-lime-200 rounded-lg shadow-lg">
      {/* Header - Clickable to toggle */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-lime-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
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
          <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-lime-500' : 'bg-gray-400'}`} />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-lime-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Controls</span>
            <div className="flex items-center space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  showStoredData()
                }}
                className="p-1 rounded transition-colors bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                title="Show stored data in console"
                type="button"
              >
                <Database className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleResetAllData()
                }}
                className="p-1 rounded transition-colors bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                title="Reset all interest data"
                type="button"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

      {/* IP Address and Location Info */}
      <div className="mb-2 p-2 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <Globe className="w-3 h-3 text-lime-600" />
          <span className="text-xs font-medium text-gray-700">Location</span>
        </div>
        {isLoadingLocation ? (
          <div className="text-xs text-gray-500">Loading...</div>
        ) : locationInfo ? (
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex items-center space-x-1">
              <MapPin className="w-2 h-2 text-lime-500" />
              <span>IP: {locationInfo.ip}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>📍 {locationInfo.location?.city || 'Unknown'}, {locationInfo.location?.country || 'Unknown'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>💰 {locationInfo.currency}</span>
              <span>🕐 {locationInfo.timezone}</span>
            </div>
          </div>
        ) : (
          <div className="text-xs text-red-500">Failed to load location</div>
        )}
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
      )}
    </div>
  )
}
