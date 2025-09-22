"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  TrendingUp, 
  BookOpen, 
  MessageCircle
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEngagementTracking } from '@/lib/useEngagementTracking'
import ChatConsole from '@/components/ui/ai-chat-console'
import { useState } from 'react'

export default function UserDashboardPage() {
  const { user } = useUserAuth()
  const router = useRouter()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { recordInteraction } = useEngagementTracking()

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

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Dashboard</h1>
              <Badge variant="secondary" className="text-xs">
                Welcome back, {user?.first_name}!
              </Badge>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* AI Recommendations Content */}
            <div className="grid gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">AI Recommendations</h2>
                <p className="text-muted-foreground">
                  Personalized suggestions based on your browsing behavior
                </p>
              </div>
            </div>

            {/* AI-Powered Sections - Same as drawer content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Section 1: Next Step CTA */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
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
                </CardContent>
              </Card>

              {/* Section 2: Suggested Case Study */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
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
                </CardContent>
              </Card>

              {/* Section 3: Suggested Candidate */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
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
                </CardContent>
              </Card>

              {/* Section 4: Suggested Blog */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
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
                </CardContent>
              </Card>

              {/* Section 5: Empty/Reserved */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex flex-col h-full items-center justify-center text-center space-y-2">
                    <span className="text-gray-500 text-lg">?</span>
                    <p className="text-sm text-gray-600">More suggestions soon...</p>
                  </div>
                </CardContent>
              </Card>

              {/* Section 6: AI Chat CTA */}
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
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
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* AI Chat Console */}
          <ChatConsole 
            isOpen={isChatOpen} 
            onClose={() => setIsChatOpen(false)} 
          />
        </SidebarInset>
      </SidebarProvider>
    </UserGuard>
  )
}
