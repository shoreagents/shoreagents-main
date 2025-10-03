"use client"

import { useUserAuth } from '@/lib/user-auth-context'
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
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

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

interface UserDashboardSidebarProps {
  onChatOpen?: () => void;
}

export function UserDashboardSidebar({ onChatOpen }: UserDashboardSidebarProps) {
  const { user, signOut } = useUserAuth()
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  const handleChatWithMaya = () => {
    if (onChatOpen) {
      onChatOpen()
    }
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
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleChatWithMaya}
                className="w-full bg-lime-600 hover:bg-lime-700 text-white transition-colors text-base"
                tooltip="Chat with Maya"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-base font-medium">Chat with Maya</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

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
