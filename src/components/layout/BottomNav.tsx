"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
// import { ButtonLoader } from '@/components/ui/loader' // Removed - will be recreated later
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '@/components/ui/drawer'
import { 
  ChevronDown
} from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import { useEngagementTracking } from '@/lib/useEngagementTracking'
import { useAuth } from '@/lib/auth-context'
import ChatConsole from '@/components/ui/ai-chat-console'
import { getEmployeeCardData } from '@/lib/api'
import { EmployeeCardData } from '@/types/api'
import { candidateTracker } from '@/lib/candidateTrackingService'
import {
  ContentBlogCard,
  ContentCaseStudyCard,
  PricingCard,
  TopViewedCandidateCard,
  BestMatchCandidateCard,
  PersonalisedMessageCard,
  NextStepCard,
  MayaChatCard
} from '@/components/ui/ai-recommendation-cards'
import { InterviewRequestModal, InterviewRequestData } from '@/components/ui/interview-request-modal'

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [hottestCandidate, setHottestCandidate] = useState<EmployeeCardData | null>(null)
  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false)
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  
  // Use the engagement tracking hook only on client side
  const { recordInteraction } = useEngagementTracking()
  const { appUser } = useAuth()
  

  useEffect(() => {
    // Show the nav after a delay for smooth entrance
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 300)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  // Fetch hottest candidate when drawer opens
  useEffect(() => {
    if (isDrawerOpen && !hottestCandidate && !isLoadingCandidate) {
      fetchHottestCandidate()
    }
  }, [isDrawerOpen, hottestCandidate, isLoadingCandidate])

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing AI recommendations...')
      fetchHottestCandidate(true) // Force refresh
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Refresh on navigation (pathname change)
  useEffect(() => {
    console.log('🔄 Navigation detected, refreshing AI recommendations...')
    fetchHottestCandidate(true) // Force refresh on navigation
  }, [pathname])

  // Listen for custom event to close AI drawer
  useEffect(() => {
    const handleCloseAIDrawer = () => {
      setIsDrawerOpen(false)
    }

    window.addEventListener('closeAIDrawer', handleCloseAIDrawer)
    
    return () => {
      window.removeEventListener('closeAIDrawer', handleCloseAIDrawer)
    }
  }, [])

  const handleChatWithClaude = () => {
    recordInteraction('chat')
    console.log('Chat button clicked - interaction recorded')
    setIsDrawerOpen(false) // Close drawer before opening chat
    setIsChatOpen(true)
  }

  const handleBrowseTalent = () => {
    recordInteraction('navigation')
    console.log('Browse Talent button clicked - interaction recorded')
    setIsDrawerOpen(false) // Close drawer before navigation
    router.push('/we-got-talent')
  }

  const handleSeePricing = () => {
    recordInteraction('navigation')
    console.log('See Pricing button clicked - interaction recorded')
    setIsDrawerOpen(false) // Close drawer before navigation
    router.push('/pricing')
  }

  const fetchHottestCandidate = async () => {
    try {
      console.log('🔄 Fetching hottest candidate...')
      setIsLoadingCandidate(true)
      
      let userId = null
      
      // Get user ID - either from authenticated user or device ID for anonymous users
      if (appUser?.user_id) {
        userId = appUser.user_id
        console.log('Using authenticated user ID:', userId)
      } else {
        // For anonymous users, get device ID from localStorage
        if (typeof window !== 'undefined') {
          userId = localStorage.getItem('content_tracking_device_id')
          console.log('Using device ID for anonymous user:', userId)
          
          // Also check for alternative device ID keys
          const altDeviceId = localStorage.getItem('device_id') || localStorage.getItem('session_id')
          console.log('Alternative device IDs found:', { altDeviceId })
        }
      }

      // If no user ID or device ID available, show no candidate
      if (!userId) {
        console.log('No user ID or device ID available')
        setHottestCandidate(null)
        return
      }

      // Get the most viewed candidate for this specific user/device
      const mostViewedData = await candidateTracker.getUserMostViewedCandidate(userId)
      
      console.log('🔍 Most viewed data received:', mostViewedData)
      console.log('🔍 User ID being queried:', userId)
      
      if (!mostViewedData) {
        console.log('❌ No most viewed candidate data found - showing fallback candidate')
        console.log('❌ This means getUserMostViewedCandidate returned null/undefined')
        // Show a fallback candidate when no viewing history exists
        const employees = await getEmployeeCardData()
        if (employees.length > 0) {
          // Show the first available candidate as fallback
          const fallbackCandidate = {
            ...employees[0],
            hotnessScore: 0 // No viewing history
          }
          console.log('✅ Setting fallback candidate:', fallbackCandidate.user.name)
          setHottestCandidate(fallbackCandidate)
          return
        } else {
          setHottestCandidate(null)
          return
        }
      }

      // Get all employees to find the one that matches the most viewed candidate
      const employees = await getEmployeeCardData()
      
      // Try multiple matching strategies
      let targetEmployee = employees.find(emp => emp.user.id === mostViewedData.candidate_id)
      
      // If not found by ID, try matching by name
      if (!targetEmployee && mostViewedData.candidate_name) {
        targetEmployee = employees.find(emp => 
          emp.user.name.toLowerCase().includes(mostViewedData.candidate_name.toLowerCase()) ||
          mostViewedData.candidate_name.toLowerCase().includes(emp.user.name.toLowerCase())
        )
      }
      
      // If still not found, try matching by first name or last name
      if (!targetEmployee && mostViewedData.candidate_name) {
        const nameParts = mostViewedData.candidate_name.split(' ')
        targetEmployee = employees.find(emp => {
          const empNameParts = emp.user.name.split(' ')
          return nameParts.some(part => 
            empNameParts.some(empPart => 
              part.toLowerCase() === empPart.toLowerCase()
            )
          )
        })
      }
      
      if (!targetEmployee) {
        console.log('Target employee not found in employee data', {
          candidate_id: mostViewedData.candidate_id,
          candidate_name: mostViewedData.candidate_name,
          availableEmployees: employees.map(emp => ({ id: emp.user.id, name: emp.user.name }))
        })
        setHottestCandidate(null)
        return
      }

      // Add the view duration as hotness score for display
      const employeeWithScore = {
        ...targetEmployee,
        hotnessScore: mostViewedData.view_duration || 0
      }

      console.log('✅ Setting hottest candidate:', employeeWithScore.user.name)
      setHottestCandidate(employeeWithScore)
    } catch (error) {
      console.error('Error fetching user most viewed candidate:', error)
      setHottestCandidate(null)
    } finally {
      setIsLoadingCandidate(false)
    }
  }

  const handleAskForInterview = () => {
    recordInteraction('interview-request')
    console.log('Ask for interview clicked for hottest candidate')
    setIsDrawerOpen(false) // Close drawer before opening interview modal
    setIsInterviewModalOpen(true)
  }

  const handleViewProfile = () => {
    if (hottestCandidate) {
      recordInteraction('view-profile')
      console.log('View profile clicked for hottest candidate')
      setIsDrawerOpen(false) // Close drawer before navigation
      router.push(`/employee/${hottestCandidate.user.id}`)
    }
  }

  const handleInterviewSubmit = async (data: InterviewRequestData) => {
    try {
      // Here you would typically send the interview request to your backend
      console.log('Interview request submitted:', {
        candidateId: hottestCandidate?.user.id,
        candidateName: hottestCandidate?.user.name,
        candidatePosition: hottestCandidate?.user.position,
        requesterData: data
      })
      
      // For now, we'll just log it and show success
      // In a real implementation, you'd make an API call here
      alert('Interview request submitted successfully! We will contact you soon.')
      
    } catch (error) {
      console.error('Error submitting interview request:', error)
      throw error // Re-throw to let the modal handle the error display
    }
  }

  const handleDrawerOpenChange = (open: boolean) => {
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
        {!isDrawerOpen && (
          <div className="max-w-6xl mx-auto">
            {/* Arrow Down Indicator - Floating Above */}
            <div className="flex justify-center mb-2">
              <ChevronDown className="w-6 h-6 text-lime-600 bg-white rounded-full p-1.5 shadow-md animate-bounce" />
            </div>
            
            <DrawerTrigger asChild>
              <div 
                className="relative backdrop-blur-md border-t-2 border-lime-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] py-1 cursor-pointer transition-all duration-300 ease-in-out rounded-t-lg hover:brightness-110" 
                style={{ backgroundColor: 'rgb(101, 163, 13)' }}
              >
                {/* Blank Clickable Area */}
                <p className='text-lime-50 text-center'>AI Recommendations</p>
                <div className="w-full h-full"></div>
              </div>
            </DrawerTrigger>
          </div>
        )}
        
        <DrawerContent 
          className="max-h-[60vh] shadow-lg border-t-2 border-lime-200 max-w-6xl mx-auto"
          style={{
            backgroundColor: 'rgb(101, 163, 13)',
            // Force scrollbar to always be visible to prevent content shift
            '--vaul-overlay-bg': 'transparent',
            scrollbarGutter: 'stable'
          } as React.CSSProperties}
        >
        <DrawerHeader className="border-b border-lime-200 px-6 py-2" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
          <DrawerTitle className="text-lime-50">AI Recommendations</DrawerTitle>
        </DrawerHeader>
          
          {/* AI-Powered Sections - 4x2 Grid Layout */}
          <div className="px-6 py-6 bg-gradient-to-br from-lime-50 via-lime-100 to-lime-200 drawer-content-scrollable relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div 
                className="absolute top-0 left-0 w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }}
              ></div>
            </div>
            
            {/* Floating Orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
              <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
            </div>
            
            {/* Content positioned above background elements */}
            <div className="relative z-10 max-w-6xl mx-auto">
              {/* 4x2 Grid Layout */}
              <div className="grid grid-cols-4 gap-3">
                {/* Row 1 */}
                <ContentBlogCard onClick={() => router.push('/blogs')} />
                <ContentCaseStudyCard onClick={() => router.push('/case-studies')} />
                <PricingCard onClick={handleSeePricing} />
                <TopViewedCandidateCard 
                  candidate={hottestCandidate}
                  isLoading={isLoadingCandidate}
                  onAskForInterview={handleAskForInterview}
                  onViewProfile={handleViewProfile}
                />

                {/* Row 2 */}
                <BestMatchCandidateCard onClick={handleBrowseTalent} />
                <PersonalisedMessageCard onClick={() => router.push('/contact')} />
                <NextStepCard onClick={handleSeePricing} />
                <MayaChatCard onClick={handleChatWithClaude} />
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

      {/* Interview Request Modal */}
      {hottestCandidate && (
        <InterviewRequestModal
          isOpen={isInterviewModalOpen}
          onClose={() => setIsInterviewModalOpen(false)}
          candidateName={hottestCandidate.user.name}
          candidatePosition={hottestCandidate.user.position || 'No position specified'}
          onSubmit={handleInterviewSubmit}
        />
      )}
    </div>
  )
}