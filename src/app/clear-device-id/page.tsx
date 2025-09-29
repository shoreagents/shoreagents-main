"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ClearDeviceIdPage() {
  const [currentDeviceId, setCurrentDeviceId] = useState<string | null>(null)
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const deviceId = localStorage.getItem('content_tracking_device_id')
      setCurrentDeviceId(deviceId)
    }
  }, [])

  const clearDeviceId = () => {
    if (typeof window !== 'undefined') {
      // Clear the old device ID
      localStorage.removeItem('content_tracking_device_id')
      
      // Also clear any other related keys
      localStorage.removeItem('shoreagents_device_id')
      localStorage.removeItem('content_tracking_session_id')
      
      setCurrentDeviceId(null)
      setCleared(true)
      
      console.log('🗑️ All device IDs cleared from localStorage')
      console.log('🔄 Next page load will generate a new device fingerprint')
    }
  }

  const generateNewDeviceId = () => {
    if (typeof window !== 'undefined') {
      // Generate new device fingerprint
      const deviceInfo = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
        navigator.hardwareConcurrency || 'unknown',
        navigator.platform,
        new Date().getTimezoneOffset().toString(),
        navigator.maxTouchPoints || '0',
        (navigator as { deviceMemory?: number }).deviceMemory || 'unknown',
        getCanvasFingerprint()
      ].join('|')
      
      const hash = createSimpleHash(deviceInfo)
      const newDeviceId = `device_${hash}`
      
      localStorage.setItem('content_tracking_device_id', newDeviceId)
      setCurrentDeviceId(newDeviceId)
      setCleared(false)
      
      console.log('🆕 New device fingerprint generated:', newDeviceId)
    }
  }

  const getCanvasFingerprint = () => {
    try {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return 'no-canvas'
      
      ctx.textBaseline = 'top'
      ctx.font = '14px Arial'
      ctx.fillStyle = '#f60'
      ctx.fillRect(125, 1, 62, 20)
      ctx.fillStyle = '#069'
      ctx.fillText('Device fingerprint', 2, 15)
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)'
      ctx.fillText('Device fingerprint', 4, 17)
      
      return canvas.toDataURL().substring(22, 50)
    } catch {
      return 'canvas-error'
    }
  }

  const createSimpleHash = (str: string) => {
    let hash = 0
    if (str.length === 0) return hash.toString(36)
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    
    return Math.abs(hash).toString(36).substring(0, 12)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Clear Device ID</h1>
      <p className="mb-4">This page helps clear the cached device ID and generate a new one.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Device ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">Cached device ID:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
              {currentDeviceId || 'No device ID found'}
            </p>
            {currentDeviceId && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ This is the old cached device ID that needs to be cleared
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button 
                onClick={clearDeviceId} 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
              >
                Clear Device ID
              </Button>
              
              <Button 
                onClick={generateNewDeviceId} 
                className="w-full bg-lime-600 hover:bg-lime-700 text-white"
              >
                Generate New Device ID
              </Button>
            </div>
            
            {cleared && (
              <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
                <p className="text-sm text-green-700">
                  ✅ Device ID cleared! Next page load will generate a new fingerprint.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Why This Happens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Problem:</strong> The old device ID <code>device_nsm01z</code> is cached in localStorage</p>
              <p><strong>Cause:</strong> Device ID was generated before the fingerprinting update</p>
              <p><strong>Solution:</strong> Clear localStorage to force new fingerprint generation</p>
              <p><strong>Result:</strong> Each browser will get a unique device fingerprint</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


