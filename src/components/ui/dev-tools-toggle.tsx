"use client"

import React, { useState } from 'react'
import { BarChart3, TrendingUp, Eye, EyeOff } from 'lucide-react'

interface DevToolsToggleProps {
  onToggleAnalytics: (show: boolean) => void
  onToggleInterest: (show: boolean) => void
}

export function DevToolsToggle({ onToggleAnalytics, onToggleInterest }: DevToolsToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showInterest, setShowInterest] = useState(false)

  const handleToggle = () => {
    const newExpanded = !isExpanded
    setIsExpanded(newExpanded)
    
    if (newExpanded) {
      // Show both components
      setShowAnalytics(true)
      setShowInterest(true)
      onToggleAnalytics(true)
      onToggleInterest(true)
    } else {
      // Hide both components
      setShowAnalytics(false)
      setShowInterest(false)
      onToggleAnalytics(false)
      onToggleInterest(false)
    }
  }

  const handleIndividualToggle = (type: 'analytics' | 'interest') => {
    if (type === 'analytics') {
      const newShow = !showAnalytics
      setShowAnalytics(newShow)
      onToggleAnalytics(newShow)
    } else {
      const newShow = !showInterest
      setShowInterest(newShow)
      onToggleInterest(newShow)
    }
  }

  return (
    <div className="fixed top-4 left-4 z-[9999] w-64">
      <div className="bg-white/95 backdrop-blur-md border border-lime-200 rounded-lg shadow-lg">
        {/* Main Toggle Button */}
        <button
          onClick={handleToggle}
          className="flex items-center space-x-2 p-3 hover:bg-lime-50/50 transition-colors rounded-lg"
          title={isExpanded ? "Hide Dev Tools" : "Show Dev Tools"}
        >
          {isExpanded ? (
            <EyeOff className="w-4 h-4 text-lime-600" />
          ) : (
            <Eye className="w-4 h-4 text-lime-600" />
          )}
          <span className="text-sm font-medium text-gray-700">
            {isExpanded ? "Hide" : "Show"} Dev Tools
          </span>
        </button>

        {/* Individual Toggle Options */}
        {isExpanded && (
          <div className="border-t border-lime-200 p-2 space-y-1">
            <button
              onClick={() => handleIndividualToggle('analytics')}
              className={`w-full flex items-center space-x-2 p-2 rounded transition-colors text-sm ${
                showAnalytics 
                  ? 'bg-lime-100 text-lime-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-lime-50'
              }`}
            >
              <BarChart3 className="w-3 h-3" />
              <span>Page Analytics</span>
              <div className={`w-2 h-2 rounded-full ml-auto ${
                showAnalytics ? 'bg-lime-500' : 'bg-gray-400'
              }`} />
            </button>
            
            <button
              onClick={() => handleIndividualToggle('interest')}
              className={`w-full flex items-center space-x-2 p-2 rounded transition-colors text-sm ${
                showInterest 
                  ? 'bg-lime-100 text-lime-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-lime-50'
              }`}
            >
              <TrendingUp className="w-3 h-3" />
              <span>Interest Level</span>
              <div className={`w-2 h-2 rounded-full ml-auto ${
                showInterest ? 'bg-lime-500' : 'bg-gray-400'
              }`} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
