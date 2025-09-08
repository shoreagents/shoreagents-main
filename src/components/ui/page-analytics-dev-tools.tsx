"use client"

import React, { useEffect, useState } from 'react'
import { BarChart3, Globe, MapPin, Clock, Eye, MousePointer, TrendingUp, Download, Trash2, RefreshCw } from 'lucide-react'
import { useEngagementTracking } from '@/lib/useEngagementTracking'
import { ipDetectionService, type LocationData } from '@/lib/ipDetection'

interface PageAnalytics {
  pathname: string
  activeTime: number
  contentRead: number
  interaction: number
  interestScore: number
  lastVisit: string
  visitCount: number
}

interface LocationInfo {
  location: LocationData | null
  currency: string
  timezone: string
  ip: string
}

export function PageAnalyticsDevTools() {
  const [isClient, setIsClient] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  
  const { getAllPageData, clearAllPageData } = useEngagementTracking()
  
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([])

  useEffect(() => {
    setIsClient(true)
    loadPageAnalytics()
    loadLocationInfo()
    
    // Set up real-time updates every 5 seconds
    const interval = setInterval(() => {
      loadPageAnalytics()
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const loadPageAnalytics = () => {
    try {
      const allData = getAllPageData()
      const analytics: PageAnalytics[] = Object.entries(allData).map(([pathname, data]) => ({
        pathname: pathname === 'home' ? '/' : `/${pathname}`,
        activeTime: data.activeTime,
        contentRead: data.contentRead,
        interaction: data.interaction,
        interestScore: data.interestScore,
        lastVisit: new Date().toLocaleString(),
        visitCount: 1 // This would need to be tracked separately for accurate counts
      }))
      
      // Sort by interest score descending
      analytics.sort((a, b) => b.interestScore - a.interestScore)
      setPageAnalytics(analytics)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading page analytics:', error)
    }
  }

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

  const handleClearAllData = () => {
    clearAllPageData()
    setPageAnalytics([])
    console.log('All page analytics data cleared')
  }

  const handleRefreshData = () => {
    loadPageAnalytics()
    loadLocationInfo()
  }

  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      location: locationInfo,
      pageAnalytics: pageAnalytics,
      rawData: getAllPageData()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `page-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getInterestColor = (score: number) => {
    if (score >= 80) return 'text-lime-600 bg-lime-50'
    if (score >= 60) return 'text-lime-500 bg-lime-50'
    if (score >= 40) return 'text-yellow-600 bg-yellow-50'
    return 'text-gray-600 bg-gray-50'
  }

  if (!isClient) return null

  return (
    <div className="bg-white/95 backdrop-blur-md border border-lime-200 rounded-lg shadow-lg">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-lime-50/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-4 h-4 text-lime-600" />
          <span className="text-sm font-medium text-gray-700">Page Analytics</span>
          <span className="text-xs bg-lime-100 text-lime-700 px-2 py-1 rounded-full">
            {pageAnalytics.length} pages
          </span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse" />
            <span className="text-xs text-gray-500">
              {lastUpdated.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {locationInfo && (
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Globe className="w-3 h-3" />
              <span>{locationInfo.ip}</span>
            </div>
          )}
          <div className={`w-2 h-2 rounded-full ${isExpanded ? 'bg-lime-500' : 'bg-gray-400'}`} />
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-lime-200 p-3 max-h-80 overflow-y-auto">
          {/* Location Info */}
          <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
            <div className="flex items-center space-x-1 mb-1">
              <MapPin className="w-3 h-3 text-lime-600" />
              <span className="font-medium text-gray-700">Location</span>
            </div>
            {isLoadingLocation ? (
              <div className="text-gray-500">Loading...</div>
            ) : locationInfo ? (
              <div className="text-gray-600 space-y-1">
                <div>IP: {locationInfo.ip}</div>
                <div>{locationInfo.location?.city || 'Unknown'}, {locationInfo.location?.country || 'Unknown'}</div>
                <div>{locationInfo.currency} • {locationInfo.timezone}</div>
              </div>
            ) : (
              <div className="text-red-500">Failed to load location</div>
            )}
          </div>

          {/* Page Analytics List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-700">Pages</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={handleRefreshData}
                  className="p-1 rounded transition-colors bg-gray-100 text-gray-600 hover:bg-lime-100 hover:text-lime-600"
                  title="Refresh data"
                  type="button"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
                <button
                  onClick={exportData}
                  className="p-1 rounded transition-colors bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600"
                  title="Export data"
                  type="button"
                >
                  <Download className="w-3 h-3" />
                </button>
                <button
                  onClick={handleClearAllData}
                  className="p-1 rounded transition-colors bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                  title="Clear all data"
                  type="button"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>

            {pageAnalytics.length === 0 ? (
              <div className="text-xs text-gray-500 text-center py-4">
                No page data available. Navigate between pages to generate analytics.
              </div>
            ) : (
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {pageAnalytics.map((page, index) => (
                  <div key={index} className="p-2 bg-white border border-gray-200 rounded text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-800 truncate max-w-24">
                        {page.pathname}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getInterestColor(page.interestScore)}`}>
                        {page.interestScore}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-2 h-2 text-lime-500" />
                        <span>{formatTime(page.activeTime)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-2 h-2 text-lime-500" />
                        <span>{page.contentRead}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MousePointer className="w-2 h-2 text-lime-500" />
                        <span>{page.interaction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {pageAnalytics.length > 0 && (
            <div className="mt-2 p-2 bg-lime-50 rounded text-xs">
              <div className="font-medium text-gray-700 mb-1">Summary</div>
              <div className="grid grid-cols-2 gap-1 text-gray-600">
                <div>Pages: {pageAnalytics.length}</div>
                <div>Avg: {Math.round(pageAnalytics.reduce((sum, page) => sum + page.interestScore, 0) / pageAnalytics.length)}%</div>
                <div>Time: {formatTime(pageAnalytics.reduce((sum, page) => sum + page.activeTime, 0))}</div>
                <div>Clicks: {pageAnalytics.reduce((sum, page) => sum + page.interaction, 0)}</div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
