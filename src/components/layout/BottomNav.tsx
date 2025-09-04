"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Users, DollarSign, TrendingUp, Clock, BookOpen, MousePointer, ChevronUp, ChevronDown, MessageCircle, Search, Calendar, Zap, Sparkles, Minimize2, Lock, Unlock, Pin, PinOff } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEngagementTracking } from '@/lib/useEngagementTracking'
import ChatConsole from '@/components/ui/ai-chat-console'

interface InterestMetrics {
  activeTime: number
  contentRead: number
  interaction: number
  interestScore: number
}

export function BottomNav() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [navbarHeight, setNavbarHeight] = useState(200) // Default height in pixels
  const [isResizing, setIsResizing] = useState(false)
  
  // Use the engagement tracking hook only on client side
  const { activeTime, contentRead, interaction, interestScore, recordInteraction } = useEngagementTracking()
  
  const interestMetrics: InterestMetrics = {
    activeTime: isClient ? activeTime : 0,
    contentRead: isClient ? contentRead : 0,
    interaction: isClient ? interaction : 0,
    interestScore: isClient ? interestScore : 0
  }

  useEffect(() => {
    // Set client-side flag to prevent hydration mismatch
    setIsClient(true)
    
    // Show the nav after a delay for smooth entrance
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  const handleChatWithClaude = () => {
    recordInteraction('chat')
    console.log('Chat button clicked - interaction recorded')
    setIsChatOpen(true)
  }

  const handleBrowseTalent = () => {
    recordInteraction('navigation')
    console.log('Browse Talent button clicked - interaction recorded')
    router.push('/employees')
  }

  const handleMeetAgents = () => {
    recordInteraction('navigation')
    console.log('Meet Agents button clicked - interaction recorded')
    router.push('/about/team')
  }

  const handleSeePricing = () => {
    recordInteraction('navigation')
    console.log('See Pricing button clicked - interaction recorded')
    router.push('/pricing')
  }

  const handleBookCall = () => {
    recordInteraction('navigation')
    console.log('Book Call button clicked - interaction recorded')
    router.push('/gettingstart')
  }

  const handleToggleCollapse = () => {
    recordInteraction('toggle')
    console.log('Toggle button clicked - interaction recorded')
    setIsCollapsed(!isCollapsed)
  }

  const handleMinimize = () => {
    recordInteraction('minimize')
    console.log('Minimize button clicked - interaction recorded')
    setIsMinimized(!isMinimized)
  }

  const handleLock = () => {
    recordInteraction('lock')
    console.log('Lock button clicked - interaction recorded')
    setIsLocked(!isLocked)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    recordInteraction('resize')
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return
    
    const windowHeight = window.innerHeight
    const newHeight = windowHeight - e.clientY
    const minHeight = 60 // Minimum height
    const maxHeight = windowHeight * 0.8 // Maximum 80% of screen height
    
    if (newHeight >= minHeight && newHeight <= maxHeight) {
      setNavbarHeight(newHeight)
    }
  }

  const handleMouseUp = () => {
    setIsResizing(false)
  }

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ns-resize'
      document.body.style.userSelect = 'none'
    } else {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'default'
      document.body.style.userSelect = 'auto'
    }
  }, [isResizing])

  const getInterestLevel = () => {
    const total = (interestMetrics.activeTime + interestMetrics.contentRead + interestMetrics.interaction + interestMetrics.interestScore) / 4
    return Math.round(total)
  }

  const getProgressColor = (value: number) => {
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

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      } ${isLocked ? 'shadow-2xl border-t-4 border-lime-400' : ''}`}
      style={{ height: isMinimized ? '4px' : `${navbarHeight}px` }}
    >
      {/* Resize Handle */}
      {!isMinimized && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute top-0 left-0 right-0 h-2 cursor-ns-resize hover:bg-lime-200/50 transition-colors duration-200 z-20"
          title="Drag to resize navbar"
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-0.5 bg-lime-400 rounded-full"></div>
          </div>
        </div>
      )}

      {/* Minimized State - Lime Bar */}
      {isMinimized && (
        <div className="h-full bg-gradient-to-r from-lime-200 via-lime-400 to-lime-200 animate-pulse"></div>
      )}

      {/* Main Navigation Bar */}
      {!isMinimized && (
        <div className="relative bg-white/95 backdrop-blur-md border-t-2 border-lime-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] h-full">
          {/* Control Buttons - Upper Right */}
          <div className="absolute top-2 right-2 flex items-center space-x-2 z-10">
            {/* Minimize Button */}
            <Button
              onClick={handleMinimize}
              variant={isMinimized ? "default" : "outline"}
              size="sm"
              className={`transition-all duration-200 ${
                isMinimized 
                  ? 'bg-lime-500 hover:bg-lime-600 text-white border-lime-500 hover:border-lime-600 active:bg-lime-700 active:border-lime-700' 
                  : 'bg-white hover:bg-lime-50 text-lime-700 border-lime-200 hover:border-lime-300 active:bg-lime-100 active:border-lime-400'
              }`}
              title={isMinimized ? "Restore navbar" : "Minimize navbar"}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            
            {/* Lock Button */}
            <Button
              onClick={handleLock}
              variant={isLocked ? "default" : "outline"}
              size="sm"
              className={`transition-all duration-200 ${
                isLocked 
                  ? 'bg-lime-500 hover:bg-lime-600 text-white border-lime-500 hover:border-lime-600 active:bg-lime-700 active:border-lime-700' 
                  : 'bg-white hover:bg-lime-50 text-lime-700 border-lime-200 hover:border-lime-300 active:bg-lime-100 active:border-lime-400'
              }`}
              title={isLocked ? "Unlock navbar" : "Lock navbar in place"}
            >
              {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex justify-center lg:hidden pt-2">
            <button
              onClick={handleToggleCollapse}
              className="bg-lime-100 text-lime-700 p-1 rounded-t-lg"
            >
              {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Minimal View when Collapsed (Mobile Only) */}
          {isCollapsed && (
            <div className="lg:hidden px-4 py-2 text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <span className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-lime-600" />
                  <span className="font-medium">Interest: {getInterestLevel()}%</span>
                </span>
                <span className="text-lime-600 font-bold">•</span>
                <span className="text-gray-500">Tap to expand</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col h-full pt-8">
            <div className={`flex-1 max-w-7xl mx-auto px-4 py-3 transition-all duration-500 ease-in-out overflow-y-auto ${
              isCollapsed ? 'max-h-0 overflow-hidden py-0' : ''
            }`}>
              {/* Mobile: Stack vertically, Desktop: Horizontal layout */}
              <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
                {/* Navigation Buttons */}
                <div className="flex items-center justify-center lg:justify-start space-x-2 lg:space-x-3 flex-wrap">
                  <Button
                    onClick={handleChatWithClaude}
                    variant="ghost"
                    className="bg-lime-200 hover:bg-lime-100 text-lime-900 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">Chat with Claude</span>
                  </Button>

                  <Button
                    onClick={handleBrowseTalent}
                    variant="ghost"
                    className="bg-lime-300 hover:bg-lime-200 text-lime-900 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">Browse Talent</span>
                  </Button>

                  <Button
                    onClick={handleMeetAgents}
                    variant="ghost"
                    className="bg-lime-400 hover:bg-lime-300 text-lime-900 px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">Meet Agents</span>
                  </Button>

                  <Button
                    onClick={handleSeePricing}
                    variant="ghost"
                    className="bg-lime-500 hover:bg-lime-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">See Pricing</span>
                  </Button>

                  <Button
                    onClick={handleBookCall}
                    variant="ghost"
                    className="bg-lime-600 hover:bg-lime-500 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <span className="text-sm font-medium">Book Call</span>
                  </Button>
                </div>

                {/* Interest Level Section */}
                <div className="flex flex-col items-center lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-lime-600" />
                    <span className="text-sm font-medium text-gray-700">Interest Level:</span>
                    <span className="text-lg font-bold text-lime-600">{getInterestLevel()}%</span>
                  </div>
                  
                  {/* Interest Level Progress Bar */}
                  <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out ${getProgressColor(getInterestLevel())}`}
                      style={{ width: `${getInterestLevel()}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Maya Santos AI Assistant Section */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="bg-gradient-to-r from-lime-50 to-lime-100 border border-lime-200 rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {/* Maya Santos Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full shadow-lg border-2 border-white overflow-hidden">
                          <img 
                            src="https://api.dicebear.com/7.x/avataaars/svg?seed=maya-santos&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&size=48"
                            alt="Maya Santos Avatar"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Online indicator */}
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        </div>
                        {/* Sparkle effect */}
                        <div className="absolute -top-1 -right-1">
                          <Sparkles className="w-4 h-4 text-lime-500 animate-pulse" />
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-semibold text-lime-800">Maya Santos</span>
                          <span className="text-xs bg-lime-200 text-lime-700 px-2 py-1 rounded-full">AI Assistant</span>
                        </div>
                        <span className="text-xs text-lime-600">Ready to help you find the perfect agent!</span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={handleChatWithClaude}
                      className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      <span className="text-sm font-medium">Chat Now</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* Detailed Metrics Bar - Hidden on very small screens */}
              <div className="mt-3 pt-3 border-t border-gray-100 hidden sm:block">
                <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between text-xs text-gray-600">
                  <div className="flex items-center justify-center lg:justify-start space-x-2 lg:space-x-4 flex-wrap">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-3 h-3 text-lime-500" />
                      <span>Active: {formatActiveTime(interestMetrics.activeTime)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-3 h-3 text-lime-500" />
                      <span>Content: {interestMetrics.contentRead}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MousePointer className="w-3 h-3 text-lime-500" />
                      <span>Clicks: {interestMetrics.interaction}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-3 h-3 text-lime-500" />
                      <span>Score: {interestMetrics.interestScore}%</span>
                    </div>
                  </div>
                  
                  {/* Individual Progress Bars */}
                  <div className="flex items-center justify-center lg:justify-end space-x-2">
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-2 h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`w-full transition-all duration-1000 ease-out ${getProgressColor(Math.min(100, interestMetrics.activeTime / 60 * 15))}`}
                          style={{ height: `${Math.min(100, interestMetrics.activeTime / 60 * 15)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{formatActiveTime(interestMetrics.activeTime)}</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-2 h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`w-full transition-all duration-1000 ease-out ${getProgressColor(interestMetrics.contentRead)}`}
                          style={{ height: `${interestMetrics.contentRead}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{interestMetrics.contentRead}%</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-2 h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`w-full transition-all duration-1000 ease-out ${getProgressColor(Math.min(100, interestMetrics.interaction * 10))}`}
                          style={{ height: `${Math.min(100, interestMetrics.interaction * 10)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{interestMetrics.interaction}</span>
                    </div>
                    <div className="flex flex-col items-center space-y-1">
                      <div className="w-2 h-8 bg-gray-500 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`w-full transition-all duration-1000 ease-out ${getProgressColor(interestMetrics.interestScore)}`}
                          style={{ height: `${interestMetrics.interestScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{interestMetrics.interestScore}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* AI Chat Console */}
      <ChatConsole 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  )
}