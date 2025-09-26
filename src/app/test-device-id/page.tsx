"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestDeviceIdPage() {
  const [deviceId, setDeviceId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [userAgent, setUserAgent] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDeviceId(localStorage.getItem('content_tracking_device_id'))
      setSessionId(sessionStorage.getItem('content_tracking_session_id'))
      setUserAgent(navigator.userAgent)
    }
  }, [])

  const clearDeviceId = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('content_tracking_device_id')
      setDeviceId(null)
      console.log('Device ID cleared')
    }
  }

  const generateNewDeviceId = () => {
    if (typeof window !== 'undefined') {
      // Use the same device fingerprinting logic as the content tracking service
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
      setDeviceId(newDeviceId)
      console.log('New device fingerprint ID generated:', newDeviceId)
      console.log('Device info used:', deviceInfo)
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
      <h1 className="text-2xl font-bold mb-4">Device ID Test Page</h1>
      <p className="mb-4">This page helps debug device ID generation and uniqueness.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Device ID</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">Device ID from localStorage:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
              {deviceId || 'No device ID found'}
            </p>
            <div className="mt-4 space-x-2">
              <Button onClick={clearDeviceId} variant="outline" size="sm">
                Clear Device ID
              </Button>
              <Button onClick={generateNewDeviceId} size="sm" className="bg-lime-600 hover:bg-lime-700">
                Generate New
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Info</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">Session ID:</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">
              {sessionId || 'No session ID found'}
            </p>
            <p className="text-sm text-gray-600 mt-4 mb-2">User Agent (last 8 chars):</p>
            <p className="font-mono text-sm bg-gray-100 p-2 rounded">
              {userAgent ? userAgent.slice(-8) : 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Device Fingerprinting Logic (Same as User Page Visits)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Format:</strong> device_[hash] (where hash is based on device characteristics)</p>
              <p><strong>User Agent:</strong> {userAgent ? userAgent.substring(0, 50) + '...' : 'N/A'}</p>
              <p><strong>Language:</strong> {navigator.language}</p>
              <p><strong>Screen:</strong> {screen.width}x{screen.height}x{screen.colorDepth}</p>
              <p><strong>CPU Cores:</strong> {navigator.hardwareConcurrency || 'unknown'}</p>
              <p><strong>Platform:</strong> {navigator.platform}</p>
              <p><strong>Timezone:</strong> {new Date().getTimezoneOffset()}</p>
              <p><strong>Touch Points:</strong> {navigator.maxTouchPoints || '0'}</p>
              <p><strong>Device Memory:</strong> {(navigator as { deviceMemory?: number }).deviceMemory || 'unknown'}</p>
              <p><strong>Canvas Fingerprint:</strong> {getCanvasFingerprint()}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}