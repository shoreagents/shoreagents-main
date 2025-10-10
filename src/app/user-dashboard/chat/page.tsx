"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Badge } from '@/components/ui/badge'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { AI_CONFIG, getRandomWelcomeMessage } from '@/lib/ai-config'
import { PricingCalculatorModal } from '@/components/ui/pricing-calculator-modal'
import { InterviewRequestModal } from '@/components/ui/interview-request-modal'
import { AnonymousUserModal } from '@/components/ui/anonymous-user-modal'

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  relatedContent?: Array<{
    title: string;
    content: string;
    url?: string;
  }>;
  suggestedComponents?: string[];
  userData?: {
    userType: string;
    hasQuotes: boolean;
    leadCaptureStatus: {
      first_lead_capture: boolean;
      second_lead_capture: boolean;
      third_lead_capture: boolean;
    };
  };
}

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export default function ChatPage() {
  const { user } = useUserAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  
  // Modal states
  const [showPricingModal, setShowPricingModal] = useState(false)
  const [showInterviewModal, setShowInterviewModal] = useState(false)
  const [showAnonymousModal, setShowAnonymousModal] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize with welcome message if no messages exist
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: getRandomWelcomeMessage(),
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [])

  // Add dashboard-page class to body to prevent scrolling
  useEffect(() => {
    document.body.classList.add('dashboard-page')
    return () => {
      document.body.classList.remove('dashboard-page')
    }
  }, [])

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('chat-conversations')
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations))
    }
  }, [])

  // Save conversations to localStorage
  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem('chat-conversations', JSON.stringify(conversations))
    }
  }, [conversations])

  const generateAIResponse = async (message: string, conversationHistory: Message[]) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationHistory: conversationHistory.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          userId: user?.user_id || ''
        }),
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      return {
        response: data.content || 'I apologize, but I encountered an error processing your request.',
        relatedContent: data.components || [],
        suggestedComponents: data.suggestedComponents || [],
        userData: data.userData || null
      }
    } catch (error) {
      console.error('API call error:', error)
      throw error
    }
  }

  const handleModalTrigger = (modalType: string) => {
    switch (modalType) {
      case 'pricing_calculator_modal':
        setShowPricingModal(true)
        break
      case 'interview_request_modal':
        setShowInterviewModal(true)
        break
      case 'anonymous_user_modal':
        setShowAnonymousModal(true)
        break
      default:
        console.log(`Unknown modal type: ${modalType}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const { response, relatedContent, suggestedComponents, userData } = await generateAIResponse(inputValue, messages)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        relatedContent: relatedContent.length > 0 ? relatedContent : undefined,
        suggestedComponents: suggestedComponents,
        userData: userData
      }

      setMessages(prev => [...prev, assistantMessage])
      
      // Update or create conversation
      const conversationTitle = inputValue.length > 50 ? inputValue.substring(0, 50) + '...' : inputValue
      const conversationId = currentConversationId || Date.now().toString()
      
      const newConversation: Conversation = {
        id: conversationId,
        title: conversationTitle,
        lastMessage: response,
        timestamp: new Date(),
        messageCount: messages.length + 2
      }

      setConversations(prev => {
        const existing = prev.find(c => c.id === conversationId)
        if (existing) {
          return prev.map(c => c.id === conversationId ? newConversation : c)
        } else {
          return [newConversation, ...prev]
        }
      })
      
      setCurrentConversationId(conversationId)
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: AI_CONFIG.errorMessages.generic,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const startNewConversation = () => {
    setMessages([])
    setCurrentConversationId(null)
  }

  const loadConversation = (conversationId: string) => {
    // In a real app, you'd load the conversation from your backend
    // For now, we'll just set the current conversation ID
    setCurrentConversationId(conversationId)
  }

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId))
    if (currentConversationId === conversationId) {
      setMessages([])
      setCurrentConversationId(null)
    }
  }

  const renderMessage = (message: Message) => {
    const isUser = message.role === 'user'
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`flex gap-4 p-6 ${isUser ? 'bg-gray-50' : 'bg-white'} group hover:bg-opacity-80 transition-colors`}
      >
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {user?.first_name?.charAt(0) || 'U'}
            </div>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              M
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">
              {isUser ? (user?.first_name || 'You') : AI_CONFIG.assistant.name}
            </span>
            <span className="text-xs text-gray-500">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap text-gray-900 leading-relaxed">
              {message.content}
            </p>
          </div>

          {/* Suggested Actions */}
          {message.suggestedComponents && message.suggestedComponents.length > 0 && (
            <div className="mt-4">
              <div className="text-xs font-medium text-gray-600 mb-3">💡 Suggested Actions:</div>
              <div className="flex flex-wrap gap-2">
                {message.suggestedComponents.map((component, index) => (
                  <button
                    key={index}
                    onClick={() => handleModalTrigger(component)}
                    className="px-3 py-1.5 text-xs font-medium bg-lime-50 text-lime-700 border border-lime-200 rounded-lg hover:bg-lime-100 transition-colors"
                  >
                    {component.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message Actions */}
          <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsUp className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ThumbsDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset className="relative h-screen">
          {/* Header - Standalone container, aligned to center content only */}
          <header className="absolute top-0 left-0 right-80 z-20 h-14 bg-white border-b flex items-center gap-1 px-4">
            <SidebarTrigger className="!size-8 hover:bg-lime-100 [&_svg]:!w-6 [&_svg]:!h-6" />
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold">Chat with Maya</h1>
              <Badge variant="secondary" className="text-xs">
                AI Assistant
              </Badge>
            </div>
          </header>

          {/* Input Area - Standalone container, aligned to center content only */}
          <div className="absolute bottom-16 left-0 right-80 z-20 bg-white border-t p-4">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Message Maya..."
                    className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-lime-500 focus:ring-1 focus:ring-lime-500 focus:outline-none min-h-[44px] shadow-sm"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSubmit(e)
                      }
                    }}
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-lime-600 text-white rounded-lg hover:bg-lime-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors z-10"
                  >
                    <Send size={14} />
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Sidebar Panel - Fixed position, won't move when scrolled */}
          <div className="fixed top-0 right-0 z-10 w-80 h-full bg-gray-50 border-l pt-14 pb-32">
            <div className="p-4 h-full flex flex-col justify-center space-y-4">
              {/* Card 1 */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-[45%] w-full">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Component 1</h3>
                <div className="text-sm text-gray-600">
                  This is where we'll display the first component.
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm h-[45%] w-full">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Component 2</h3>
                <div className="text-sm text-gray-600">
                  This is where we'll display the second component.
                </div>
              </div>
            </div>
          </div>

          {/* Messages - Only this scrolls, like ChatGPT */}
          <div className="absolute top-14 bottom-32 left-0 right-80 overflow-y-auto bg-gray-50">
            <div className="max-w-4xl mx-auto px-4">
              <AnimatePresence>
                {messages.map(renderMessage)}
              </AnimatePresence>
            {isLoading && (
              <div className="flex gap-4 p-6 bg-white">
                <div className="w-8 h-8 bg-gradient-to-r from-lime-500 to-lime-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  M
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">{AI_CONFIG.assistant.name}</span>
                    <span className="text-xs text-gray-500">typing...</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-lime-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
            </div>
          </div>
        </SidebarInset>

        {/* Existing Modals */}
        <PricingCalculatorModal 
          isOpen={showPricingModal} 
          onClose={() => setShowPricingModal(false)} 
        />
        
        <InterviewRequestModal 
          isOpen={showInterviewModal} 
          onClose={() => setShowInterviewModal(false)}
          candidateName="Selected Candidate"
          candidatePosition="Position"
          onSubmit={async (data) => {
            console.log('Interview request submitted:', data)
            setShowInterviewModal(false)
          }}
        />
        
        <AnonymousUserModal 
          isOpen={showAnonymousModal} 
          onClose={() => setShowAnonymousModal(false)} 
        />
      </SidebarProvider>
    </UserGuard>
  )
}
