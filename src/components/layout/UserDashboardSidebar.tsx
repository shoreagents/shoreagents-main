"use client"

import { useUserAuth } from '@/lib/user-auth-context'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
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
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lime-600 text-white">
            <span className="text-sm font-bold">SA</span>
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">ShoreAgents</span>
            <span className="truncate text-xs text-muted-foreground">
              User Dashboard
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {userNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className={pathname === item.url ? '!bg-lime-600 !text-white hover:!bg-lime-700 data-[active=true]:!bg-lime-600 data-[active=true]:!text-white' : 'hover:!bg-lime-100 hover:!text-lime-800'}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
          <div className="px-2 py-2">
            <Button
              onClick={handleChatWithMaya}
              className="w-full bg-lime-600 hover:bg-lime-700 text-white transition-colors"
              size="sm"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Chat with Maya
            </Button>
          </div>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarFooter>
        <div className="flex items-center gap-2 px-2 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" alt={user?.first_name} />
            <AvatarFallback className="bg-lime-600 text-white text-xs">
              {getInitials(`${user?.first_name || ''} ${user?.last_name || ''}`)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {user?.email}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
