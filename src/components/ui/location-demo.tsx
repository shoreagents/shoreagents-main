"use client"

import React, { useState } from 'react'
import { useCurrency } from '@/lib/currencyContext'
import { ipDetectionService, clearLocationCache } from '@/lib/ipDetection'

export function LocationDemo() {
  const { userLocation, isDetectingLocation, detectUserLocation, isAutoDetected } = useCurrency()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefreshLocation = async () => {
    setIsRefreshing(true)
    try {
      // Clear cache and re-detect
      clearLocationCache()
      await detectUserLocation()
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-md">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">🌍 Location Detection Demo</h3>
      
      <div className="space-y-4">
        {/* Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <span className={`text-sm font-medium ${isDetectingLocation ? 'text-blue-600' : 'text-green-600'}`}>
            {isDetectingLocation ? 'Detecting...' : 'Ready'}
          </span>
        </div>

        {/* Location Info */}
        {userLocation && (
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium text-gray-700">Country:</span>
              <span className="ml-2 text-gray-900">{userLocation.country}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">City:</span>
              <span className="ml-2 text-gray-900">{userLocation.city}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Region:</span>
              <span className="ml-2 text-gray-900">{userLocation.regionName}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">Timezone:</span>
              <span className="ml-2 text-gray-900">{userLocation.timezone}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">ISP:</span>
              <span className="ml-2 text-gray-900">{userLocation.isp}</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-700">IP Address:</span>
              <span className="ml-2 text-gray-900 font-mono">{userLocation.query}</span>
            </div>
          </div>
        )}

        {/* Auto-detection Status */}
        {isAutoDetected && (
          <div className="bg-lime-50 border border-lime-200 rounded-md p-3">
            <div className="flex items-center">
              <span className="text-lime-600 mr-2">✓</span>
              <span className="text-sm text-lime-800 font-medium">
                Currency auto-detected based on your location
              </span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleRefreshLocation}
            disabled={isDetectingLocation || isRefreshing}
            className="flex-1 bg-lime-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-lime-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh Location'}
          </button>
          
          <button
            onClick={() => ipDetectionService.clearCache()}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
            title="Clear cached location data"
          >
            Clear Cache
          </button>
        </div>

        {/* API Info */}
        <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
          <p>Using IP-API service for location detection</p>
          <p>Data cached for 5 minutes to reduce API calls</p>
        </div>
      </div>
    </div>
  )
}
