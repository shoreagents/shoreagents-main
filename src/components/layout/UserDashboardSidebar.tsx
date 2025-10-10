"use client"

import { useAuth } from '@/lib/auth-context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useSidebar } from '@/components/ui/sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import {
  LayoutDashboard,
  User,
  Users,
  Briefcase,
  Settings,
  LogOut,
  Quote,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Clock,
  Trash2,
  Plus,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

const userNavItems = [
  {
    title: "Dashboard",
    url: "/user-dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Profile",
    url: "/user-dashboard/profile",
    icon: User,
  },
  {
    title: "Candidates",
    url: "/user-dashboard/candidates",
    icon: Users,
  },
  {
    title: "Jobs",
    url: "/user-dashboard/jobs",
    icon: Briefcase,
  },
  {
    title: "Quotation",
    url: "/user-dashboard/quotation",
    icon: Quote,
  },
  {
    title: "Settings",
    url: "/user-dashboard/settings",
    icon: Settings,
  },
]

interface Conversation {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

interface UserDashboardSidebarProps {
  onChatOpen?: () => void;
}

export function UserDashboardSidebar({ onChatOpen }: UserDashboardSidebarProps) {
  const { user, signOut } = useAuth()
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showDropdown, setShowDropdown] = useState(false)

  const handleSignOut = async () => {
    try {
      console.log('🔍 UserDashboardSidebar - Starting sign out...')
      await signOut()
      console.log('✅ UserDashboardSidebar - Sign out completed')
    } catch (error) {
      console.error('❌ UserDashboardSidebar - Sign out error:', error)
    }
  }

  const handleChatWithMaya = () => {
    if (onChatOpen) {
      onChatOpen()
    }
  }

  // Load conversations from localStorage
  useEffect(() => {
    const savedConversations = localStorage.getItem('chat-conversations')
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations)
        // Convert timestamp strings back to Date objects
        const conversationsWithDates = parsed.map((conv: { timestamp: string; id: string; title: string; messages: any[] }) => ({
          ...conv,
          timestamp: new Date(conv.timestamp)
        }))
        setConversations(conversationsWithDates)
      } catch (error) {
        console.error('Error parsing conversations:', error)
      }
    }
  }, [])

  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId))
    const updated = conversations.filter(c => c.id !== conversationId)
    localStorage.setItem('chat-conversations', JSON.stringify(updated))
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className='pb-0'>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-600 text-white">
            <span className="text-lg font-bold">SA</span>
          </div>
          <div className="grid flex-1 text-left text-base leading-tight [&_p]:hidden [&_p]:data-[collapsible=icon]:block">
            <span className="truncate font-semibold text-lg">ShoreAgents</span>
            <span className="truncate text-sm text-muted-foreground">
              User Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-0">
        <SidebarGroup className='pt-0'>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0">
              {userNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={`${pathname === item.url ? '!bg-lime-600 !text-white hover:!bg-lime-700 h-10 data-[active=true]:!bg-lime-600 data-[active=true]:!text-white' : 'hover:!bg-lime-100 hover:!text-lime-800'} text-base h-10 w-full data-[collapsible=icon]:!w-10 data-[collapsible=icon]:!h-10 data-[collapsible=icon]:!p-2`}
                  >
                    <Link href={item.url}>
                      <item.icon className="w-5 h-5 data-[collapsible=icon]:!w-6 data-[collapsible=icon]:!h-6" />
                      <span className="text-base font-medium data-[collapsible=icon]:!hidden">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              
              {/* Separator and Chat with Maya button */}
              <div className="mt-4 mb-2">
                <div className="h-px bg-gray-200 mx-3"></div>
              </div>
              
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      className="w-full bg-lime-600 hover:bg-lime-700 text-white transition-colors text-base"
                      tooltip="Chat with Maya"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-base font-medium">Chat with Maya</span>
                      <ChevronDown className="w-4 h-4 ml-auto" />
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-80">
                    <DropdownMenuItem asChild>
                      <Link href="/user-dashboard/chat" className="flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        New Chat
                      </Link>
                    </DropdownMenuItem>
                    {conversations.length > 0 && (
                      <>
                        <DropdownMenuSeparator />
                        <div className="px-2 py-1.5 text-xs font-semibold text-gray-500">
                          Recent Conversations
                        </div>
                        {conversations.slice(0, 5).map((conversation) => (
                          <DropdownMenuItem key={conversation.id} asChild>
                            <Link 
                              href={`/user-dashboard/chat?conversation=${conversation.id}`}
                              className="flex items-center justify-between w-full"
                            >
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium truncate">
                                  {conversation.title}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {conversation.lastMessage}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs text-gray-400">
                                    {conversation.timestamp.toLocaleDateString()}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    {conversation.messageCount} messages
                                  </span>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  deleteConversation(conversation.id)
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>


      <SidebarFooter>
        <div className="flex items-center gap-3 px-3 py-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={user?.first_name} />
            <AvatarFallback className="bg-lime-600 text-white text-sm font-semibold">
              {getInitials(`${user?.first_name || ''} ${user?.last_name || ''}`)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-base leading-tight [&_p]:hidden [&_p]:data-[collapsible=icon]:block">
            <span className="truncate font-semibold text-base">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="truncate text-sm text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
