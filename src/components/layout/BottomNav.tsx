"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  MessageCircle, 
  Lock,
  Unlock
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEngagementTracking } from '@/lib/useEngagementTracking'
import ChatConsole from '@/components/ui/ai-chat-console'

export function BottomNav() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDrawerLocked, setIsDrawerLocked] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  // Use the engagement tracking hook only on client side
  const { recordInteraction } = useEngagementTracking()
  

  useEffect(() => {
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

  const handleSeePricing = () => {
    recordInteraction('navigation')
    console.log('See Pricing button clicked - interaction recorded')
    router.push('/pricing')
  }

  const handleLockToggle = () => {
    if (!isDrawerLocked) {
      // When locking, open the drawer and keep it open
      setIsDrawerLocked(true)
      setIsDrawerOpen(true)
    } else {
      // When unlocking, close the drawer and restore normal behavior
      setIsDrawerLocked(false)
      setIsDrawerOpen(false)
    }
  }

  const handleDrawerOpenChange = (open: boolean) => {
    // If drawer is locked, prevent it from closing
    if (isDrawerLocked && !open) {
      return
    }
    setIsDrawerOpen(open)
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-[100] transition-all duration-700 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Clean Bottom Navigation Bar - Entirely Clickable */}
      <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpenChange}>
        {!isDrawerLocked && !isDrawerOpen && (
          <DrawerTrigger asChild>
            <div className="relative bg-lime-700/60 backdrop-blur-md border-t-2 border-lime-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] py-1 cursor-pointer hover:bg-lime-700 transition-all duration-300 ease-in-out">
              {/* Blank Clickable Area */}<p className='text-lime-50 text-center'>AI Recommendations</p>
              <div className="w-full h-full"></div>
            </div>
          </DrawerTrigger>
        )}
        
        <DrawerContent 
          className={`max-h-[80vh] shadow-lg border-t-2 border-lime-200 ${
            isDrawerLocked ? 'fixed bottom-0 left-0 right-0 z-[100]' : ''
          }`}
          style={{
            // Force scrollbar to always be visible to prevent content shift
            '--vaul-overlay-bg': 'transparent',
            scrollbarGutter: 'stable'
          } as React.CSSProperties}
        >
          <DrawerHeader className="bg-lime-700 border-b border-lime-200 px-6 py-2 relative">
            <DrawerTitle className="text-lime-50 ">AI Recommendations</DrawerTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLockToggle}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lime-50 hover:bg-lime-600"
            >
              {isDrawerLocked ? (
                <Unlock className="w-4 h-4" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
            </Button>
          </DrawerHeader>
          
          {/* AI-Powered Sections - Simple Grid Layout */}
          <div className="px-6 py-6 bg-lime-200 drawer-content-scrollable">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Section 1: Next Step CTA */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">Next Step</h3>
                  </div>
                  <p className="text-sm text-gray-700 flex-grow">Based on your browsing:</p>
                  <Button
                    onClick={handleSeePricing}
                    size="sm"
                    className="w-full bg-lime-600 hover:bg-lime-700 text-white transition-colors"
                  >
                    View Pricing
                  </Button>
                </div>
              </div>

              {/* Section 2: Suggested Case Study */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">Case Study</h3>
                  </div>
                  <p className="text-sm text-gray-700 flex-grow">Gallery Group Success</p>
                  <Button
                    onClick={() => router.push('/case-studies')}
                    size="sm"
                    variant="outline"
                    className="w-full border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white transition-colors"
                  >
                    Read More
                  </Button>
                </div>
              </div>

              {/* Section 3: Suggested Candidate */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">Top Candidate</h3>
                  </div>
                  <p className="text-sm text-gray-700 flex-grow">Sarah Johnson - RE Specialist</p>
                  <Button
                    onClick={handleBrowseTalent}
                    size="sm"
                    variant="outline"
                    className="w-full border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white transition-colors"
                  >
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Section 4: Suggested Blog */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">Learn More</h3>
                  </div>
                  <p className="text-sm text-gray-700 flex-grow">"5 Tips for RE Success"</p>
                  <Button
                    onClick={() => router.push('/blogs')}
                    size="sm"
                    variant="outline"
                    className="w-full border-lime-600 text-lime-600 hover:bg-lime-600 hover:text-white transition-colors"
                  >
                    Read Blog
                  </Button>
                </div>
              </div>

              {/* Section 5: Empty/Reserved */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col h-full items-center justify-center text-center space-y-2">
                  <span className="text-gray-500 text-lg">?</span>
                  <p className="text-sm text-gray-600">More suggestions soon...</p>
                </div>
              </div>

              {/* Section 6: AI Chat CTA */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col h-full space-y-3">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-5 h-5 text-lime-600" />
                    <h3 className="text-base font-semibold text-gray-900">Chat with Maya</h3>
                  </div>
                  <p className="text-sm text-gray-700 flex-grow">Get personalized help</p>
                  <Button
                    onClick={handleChatWithClaude}
                    size="sm"
                    className="w-full bg-lime-600 hover:bg-lime-700 text-white transition-colors"
                  >
                    Start Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </DrawerContent>
      </Drawer>
      
      {/* AI Chat Console */}
      <ChatConsole 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  )
}