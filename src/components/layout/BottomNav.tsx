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
  Unlock,
  FileText,
  DollarSign,
  Star,
  Target,
  Mail,
  ArrowRight,
  ChevronDown
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEngagementTracking } from '@/lib/useEngagementTracking'
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
  const [isVisible, setIsVisible] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isDrawerLocked, setIsDrawerLocked] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [hottestCandidate, setHottestCandidate] = useState<EmployeeCardData | null>(null)
  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false)
  const [isInterviewModalOpen, setIsInterviewModalOpen] = useState(false)
  
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

  // Fetch hottest candidate when drawer opens
  useEffect(() => {
    if (isDrawerOpen && !hottestCandidate && !isLoadingCandidate) {
      fetchHottestCandidate()
    }
  }, [isDrawerOpen, hottestCandidate, isLoadingCandidate])

  const handleChatWithClaude = () => {
    recordInteraction('chat')
    console.log('Chat button clicked - interaction recorded')
    setIsChatOpen(true)
  }

  const handleBrowseTalent = () => {
    recordInteraction('navigation')
    console.log('Browse Talent button clicked - interaction recorded')
    router.push('/we-got-talent')
  }

  const handleSeePricing = () => {
    recordInteraction('navigation')
    console.log('See Pricing button clicked - interaction recorded')
    router.push('/pricing')
  }

  const fetchHottestCandidate = async () => {
    try {
      setIsLoadingCandidate(true)
      const employees = await getEmployeeCardData()
      
      if (employees.length === 0) {
        setHottestCandidate(null)
        return
      }

      // Get hotness scores for all candidates
      const candidatesWithScores = await Promise.all(
        employees.map(async (employee) => {
          try {
            const analytics = await candidateTracker.getCandidateAnalytics(employee.user.id)
            const hotnessScore = analytics?.hotness_score || 0
            return { ...employee, hotnessScore }
          } catch (error) {
            console.error('Error fetching hotness score for:', employee.user.id, error)
            return { ...employee, hotnessScore: 0 }
          }
        })
      )

      // Find the candidate with the highest hotness score
      const hottest = candidatesWithScores.reduce((prev, current) => 
        (current.hotnessScore > prev.hotnessScore) ? current : prev
      )

      setHottestCandidate(hottest)
    } catch (error) {
      console.error('Error fetching hottest candidate:', error)
      setHottestCandidate(null)
    } finally {
      setIsLoadingCandidate(false)
    }
  }

  const handleAskForInterview = () => {
    recordInteraction('interview-request')
    console.log('Ask for interview clicked for hottest candidate')
    setIsInterviewModalOpen(true)
  }

  const handleViewProfile = () => {
    if (hottestCandidate) {
      recordInteraction('view-profile')
      console.log('View profile clicked for hottest candidate')
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
          className={`max-h-[60vh] shadow-lg border-t-2 border-lime-200 max-w-6xl mx-auto ${
            isDrawerLocked ? 'fixed bottom-0 left-1/2 transform -translate-x-1/2 z-[100]' : ''
          }`}
          style={{
            backgroundColor: 'rgb(101, 163, 13)',
            // Force scrollbar to always be visible to prevent content shift
            '--vaul-overlay-bg': 'transparent',
            scrollbarGutter: 'stable'
          } as React.CSSProperties}
        >
          <DrawerHeader className="border-b border-lime-200 px-6 py-2 relative" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
            <DrawerTitle className="text-lime-50 ">AI Recommendations</DrawerTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLockToggle}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-lime-50 hover:bg-lime-600"
            >
              {isDrawerLocked ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Unlock className="w-4 h-4" />
              )}
            </Button>
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