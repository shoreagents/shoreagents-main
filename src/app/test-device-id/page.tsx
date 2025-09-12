'use client'

import { useState, useEffect } from 'react'
import { 
  generateUserId, 
  getDeviceInfo, 
  resetDeviceId, 
  testDeviceIdGeneration 
} from '@/lib/userEngagementService'

export default function TestDeviceIdPage() {
  const [deviceId, setDeviceId] = useState<string>('')
  const [deviceInfo, setDeviceInfo] = useState<Record<string, string | number>>({})
  const [testResults, setTestResults] = useState<string[]>([])

  useEffect(() => {
    // Generate device ID and get device info
    const id = generateUserId()
    const info = getDeviceInfo()
    
    setDeviceId(id)
    setDeviceInfo(info)
  }, [])

  const handleResetDeviceId = () => {
    const newId = resetDeviceId()
    setDeviceId(newId)
    setDeviceInfo(getDeviceInfo())
  }

  const handleRunTests = () => {
    const results: string[] = []
    
    // Run the test function and capture console output
    const originalLog = console.log
    console.log = (...args) => {
      results.push(args.join(' '))
      originalLog(...args)
    }
    
    testDeviceIdGeneration()
    
    // Restore console.log
    console.log = originalLog
    
    setTestResults(results)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Fingerprint-Based Device ID System Test
          </h1>
          
          {/* Current Device ID */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Current Device ID
            </h2>
            <div className="bg-gray-100 p-4 rounded-lg">
              <code className="text-lg font-mono text-gray-800 break-all">
                {deviceId}
              </code>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              This ID is based on comprehensive device fingerprinting including hardware, browser, and canvas characteristics.
            </p>
          </div>

          {/* Device Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Device Information
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(deviceInfo).map(([key, value]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-sm font-medium text-gray-600 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="text-sm text-gray-800 break-all">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Test Controls */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Test Controls
            </h2>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleResetDeviceId}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reset Device ID
              </button>
              <button
                onClick={handleRunTests}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Run Tests
              </button>
              <button
                onClick={() => {
                  setDeviceId(generateUserId())
                  setDeviceInfo(getDeviceInfo())
                }}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>

          {/* Test Results */}
          {testResults.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Test Results
              </h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="space-y-2">
                  {testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono text-gray-700">
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              How Fingerprint-Based Device IDs Work
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>Hardware Fingerprinting:</strong> Screen resolution, CPU cores, platform, device memory</li>
              <li>• <strong>Browser Characteristics:</strong> User agent, language, timezone, touch support</li>
              <li>• <strong>Canvas Fingerprinting:</strong> Renders unique graphics to identify device rendering differences</li>
              <li>• <strong>Comprehensive Hashing:</strong> All characteristics combined into a single unique hash</li>
              <li>• <strong>Persistence:</strong> Stored in localStorage, survives browser restarts</li>
              <li>• <strong>Privacy:</strong> No personal information, only device characteristics</li>
              <li>• <strong>Maximum Uniqueness:</strong> Most comprehensive device identification method</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
