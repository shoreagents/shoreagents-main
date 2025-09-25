"use client"

import React, { useState } from 'react'
import { Loader, FullScreenLoader, InlineLoader, ButtonLoader } from '@/components/ui/loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoaderDemo() {
  const [showFullScreen, setShowFullScreen] = useState(false)
  const [showInline, setShowInline] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Loader Components Demo</h1>
          <p className="text-lg text-gray-600">Various loader components with infinite spinner and animated backgrounds</p>
        </div>

        {/* Full Screen Loader Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Full Screen Loader</CardTitle>
            <CardDescription>Overlay loader with animated background and large infinite spinner</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => {
                setShowFullScreen(true)
                setTimeout(() => setShowFullScreen(false), 3000)
              }}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              Show Full Screen Loader (3s)
            </Button>
          </CardContent>
        </Card>

        {/* Main Loader Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Main Loader with Animated Background</CardTitle>
            <CardDescription>Big infinite spinner with animated gradient background and floating particles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-96 border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden">
              <Loader 
                size={80}
                text="Loading your content..."
                showBackground={true}
              />
            </div>
          </CardContent>
        </Card>

        {/* Inline Loader Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Inline Loader</CardTitle>
            <CardDescription>Compact loader for inline use without background</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={() => {
                  setShowInline(true)
                  setTimeout(() => setShowInline(false), 2000)
                }}
                variant="outline"
                className="border-lime-600 text-lime-600 hover:bg-lime-50"
              >
                Show Inline Loader (2s)
              </Button>
              
              {showInline && (
                <InlineLoader 
                  size={40}
                  text="Processing..."
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Button Loader Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Button Loader</CardTitle>
            <CardDescription>Small spinner for buttons and form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button disabled className="bg-lime-600 text-white">
                <ButtonLoader size={16} className="mr-2" />
                Loading...
              </Button>
              
              <Button disabled variant="outline" className="border-lime-600 text-lime-600">
                <ButtonLoader size={14} className="mr-2" />
                Submitting
              </Button>
              
              <Button disabled variant="ghost">
                <ButtonLoader size={12} className="mr-2" />
                Processing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Different Sizes Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Different Sizes</CardTitle>
            <CardDescription>Infinite spinner in various sizes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <Loader size={32} text="Small" showBackground={false} />
              </div>
              <div className="text-center">
                <Loader size={48} text="Medium" showBackground={false} />
              </div>
              <div className="text-center">
                <Loader size={64} text="Large" showBackground={false} />
              </div>
              <div className="text-center">
                <Loader size={80} text="Extra Large" showBackground={false} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* No Background Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Loader Without Background</CardTitle>
            <CardDescription>Clean loader without animated background</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <Loader 
                size={60}
                text="Clean Loading..."
                showBackground={false}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Screen Loader Overlay */}
      {showFullScreen && (
        <FullScreenLoader 
          size={100}
          text="Loading your application..."
        />
      )}
    </div>
  )
}
