"use client"

import React from 'react'
import { Button } from './button'
import { useEngagementTracking } from '@/lib/useEngagementTracking'
import { userEngagementTracker } from '@/lib/userEngagementTracker'

export function EngagementDemo() {
  const { activeTime, contentRead, interaction, interestScore, recordInteraction } = useEngagementTracking()

  const handleTestInteraction = () => {
    recordInteraction('test-button')
  }

  const handleDebug = () => {
    userEngagementTracker.debug()
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Engagement Tracking Demo</h3>
      
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Active Time:</span>
          <span className="font-medium">{activeTime}s</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Content Read:</span>
          <span className="font-medium">{contentRead}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Interactions:</span>
          <span className="font-medium">{interaction}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Interest Score:</span>
          <span className="font-medium">{interestScore}%</span>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <Button 
          onClick={handleTestInteraction}
          variant="secondary"
          className="w-full"
        >
          Test Interaction (+1)
        </Button>
        
        <Button 
          onClick={handleDebug}
          variant="outline"
          className="w-full"
        >
          Debug Console
        </Button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p>• Scroll down to see content read percentage increase</p>
        <p>• Click buttons to see interaction count increase</p>
        <p>• Time spent will increase automatically</p>
        <p>• Check browser console for debug info</p>
      </div>
    </div>
  )
}
