"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger
} from '@/components/ui/drawer'
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  MessageCircle, 
  Sparkles
} from 'lucide-react'
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
  const [isClient, setIsClient] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  
  // Use the engagement tracking hook only on client side
  const { activeTime, contentRead, interaction, interestScore, recordInteraction } = useEngagementTracking()
  

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

  const handleSeePricing = () => {
    recordInteraction('navigation')
    console.log('See Pricing button clicked - interaction recorded')
    router.push('/pricing')
  }

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      {/* Clean Bottom Navigation Bar - Entirely Clickable */}
      <Drawer>
        <DrawerTrigger asChild>
          <div className="relative bg-white/95 backdrop-blur-md border-t-2 border-lime-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] py-4 cursor-pointer hover:bg-lime-50/95 transition-colors duration-200">
            {/* Blank Clickable Area */}
            <div className="w-full h-full"></div>
          </div>
        </DrawerTrigger>
        
        <DrawerContent className="max-h-[80vh] shadow-lg border-t-2 border-lime-200">
          <DrawerHeader className="pb-2">
            <DrawerTitle className="text-lime-800 text-lg">AI Recommendations</DrawerTitle>
            <DrawerDescription className="text-sm">
              Personalized suggestions based on your activity
            </DrawerDescription>
          </DrawerHeader>
          
          {/* AI-Powered Sections - Grid Layout */}
          <div className="px-3 pb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {/* Section 1: Next Step CTA */}
              <div className="bg-gradient-to-r from-lime-50 to-lime-100 border border-lime-200 rounded-md p-3 shadow-sm">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-7 h-7 bg-lime-200 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-lime-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-lime-800">Next Step</h3>
                  </div>
                  <p className="text-xs text-lime-600 mb-2 flex-grow">Based on your browsing:</p>
                  <Button
                    onClick={handleSeePricing}
                    size="sm"
                    className="bg-lime-500 hover:bg-lime-600 text-white w-full h-7 text-xs"
                  >
                    View Pricing
                  </Button>
                </div>
              </div>

              {/* Section 2: Suggested Case Study */}
              <div className="bg-gradient-to-r from-lime-50 to-lime-100 border border-lime-200 rounded-md p-3 shadow-sm">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-7 h-7 bg-lime-200 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-lime-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-lime-800">Case Study</h3>
                  </div>
                  <p className="text-xs text-lime-600 mb-2 flex-grow">Gallery Group Success</p>
                  <Button
                    onClick={() => router.push('/case-studies')}
                    size="sm"
                    variant="outline"
                    className="border-lime-300 text-lime-700 hover:bg-lime-100 w-full h-7 text-xs"
                  >
                    Read More
                  </Button>
                </div>
              </div>

              {/* Section 3: Suggested Candidate */}
              <div className="bg-gradient-to-r from-lime-50 to-lime-100 border border-lime-200 rounded-md p-3 shadow-sm">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-7 h-7 bg-lime-200 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-lime-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-lime-800">Top Candidate</h3>
                  </div>
                  <p className="text-xs text-lime-600 mb-2 flex-grow">Sarah Johnson - RE Specialist</p>
                  <Button
                    onClick={handleBrowseTalent}
                    size="sm"
                    variant="outline"
                    className="border-lime-300 text-lime-700 hover:bg-lime-100 w-full h-7 text-xs"
                  >
                    View Profile
                  </Button>
                </div>
              </div>

              {/* Section 4: Suggested Blog */}
              <div className="bg-gradient-to-r from-lime-50 to-lime-100 border border-lime-200 rounded-md p-3 shadow-sm">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-7 h-7 bg-lime-200 rounded-full flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-lime-700" />
                    </div>
                    <h3 className="text-sm font-semibold text-lime-800">Learn More</h3>
                  </div>
                  <p className="text-xs text-lime-600 mb-2 flex-grow">"5 Tips for RE Success"</p>
                  <Button
                    onClick={() => router.push('/blogs')}
                    size="sm"
                    variant="outline"
                    className="border-lime-300 text-lime-700 hover:bg-lime-100 w-full h-7 text-xs"
                  >
                    Read Blog
                  </Button>
                </div>
              </div>

              {/* Section 5: Empty/Reserved */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-md p-3 shadow-sm">
                <div className="flex flex-col h-full items-center justify-center text-center">
                  <div className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <span className="text-gray-500 text-xs">?</span>
                  </div>
                  <p className="text-xs text-gray-500">More suggestions soon...</p>
                </div>
              </div>

              {/* Section 6: AI Chat CTA */}
              <div className="bg-gradient-to-r from-lime-50 to-lime-100 border border-lime-200 rounded-md p-3 shadow-sm">
                <div className="flex flex-col h-full">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="relative">
                      <div className="w-7 h-7 bg-lime-200 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-4 h-4 text-lime-700" />
                      </div>
                      <div className="absolute -top-0.5 -right-0.5">
                        <Sparkles className="w-3 h-3 text-lime-500 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-sm font-semibold text-lime-800">Chat with Maya</h3>
                  </div>
                  <p className="text-xs text-lime-600 mb-2 flex-grow">Get personalized help</p>
                  <Button
                    onClick={handleChatWithClaude}
                    size="sm"
                    className="bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-600 hover:to-lime-700 text-white w-full h-7 text-xs"
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