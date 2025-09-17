'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { 
  Users, 
  Building, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Calendar,
  Settings,
  Bell,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Star,
  MessageSquare,
  FileText,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

interface DashboardStats {
  totalTeamMembers: number
  activeTeamMembers: number
  totalServices: number
  monthlyCost: number
  totalCost: number
  completedTasks: number
  pendingRequests: number
  responseTime: number
}

interface RecentActivity {
  id: string
  type: 'team_member' | 'service_request' | 'task_completion' | 'communication'
  title: string
  description: string
  timestamp: string
  status: 'completed' | 'pending' | 'in_progress'
}

interface TeamMember {
  id: string
  name: string
  role: string
  status: 'active' | 'busy' | 'available'
  avatar: string
  skills: string[]
  experience: string
  timezone: string
  lastActive: string
  performance: number
}

interface ServiceRequest {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  assignedTo: string
  createdAt: string
  estimatedCompletion: string
}

export default function UserDashboard() {
  const { user, appUser, loading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalTeamMembers: 0,
    activeTeamMembers: 0,
    totalServices: 0,
    monthlyCost: 0,
    totalCost: 0,
    completedTasks: 0,
    pendingRequests: 0,
    responseTime: 0
  })

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([])

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [loading, user, router])

  // Load dashboard data
  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      setStats({
        totalTeamMembers: 8,
        activeTeamMembers: 6,
        totalServices: 5,
        monthlyCost: 12500,
        totalCost: 45000,
        completedTasks: 45,
        pendingRequests: 3,
        responseTime: 2.5
      })

      setRecentActivity([
        {
          id: '1',
          type: 'task_completion',
          title: 'Website Content Update',
          description: 'Sarah completed the homepage content revision',
          timestamp: '2 hours ago',
          status: 'completed'
        },
        {
          id: '2',
          type: 'service_request',
          title: 'New Service Request',
          description: 'Request for social media management setup',
          timestamp: '4 hours ago',
          status: 'pending'
        },
        {
          id: '3',
          type: 'team_member',
          title: 'New Team Member Added',
          description: 'Mike Rodriguez joined as Customer Support Specialist',
          timestamp: '1 day ago',
          status: 'completed'
        },
        {
          id: '4',
          type: 'communication',
          title: 'Weekly Report Sent',
          description: 'Monthly performance report delivered',
          timestamp: '2 days ago',
          status: 'completed'
        },
        {
          id: '5',
          type: 'task_completion',
          title: 'SEO Optimization',
          description: 'Working on keyword research and implementation',
          timestamp: '3 days ago',
          status: 'in_progress'
        }
      ])

      setTeamMembers([
        {
          id: '1',
          name: 'Sarah Johnson',
          role: 'Content Writer',
          status: 'active',
          avatar: '/team/sarah.jpg',
          skills: ['Content Writing', 'SEO', 'Social Media'],
          experience: '3 years',
          timezone: 'PST',
          lastActive: '2 hours ago',
          performance: 95
        },
        {
          id: '2',
          name: 'Mike Rodriguez',
          role: 'Customer Support',
          status: 'available',
          avatar: '/team/mike.jpg',
          skills: ['Customer Service', 'CRM', 'Communication'],
          experience: '2 years',
          timezone: 'EST',
          lastActive: '30 minutes ago',
          performance: 88
        },
        {
          id: '3',
          name: 'Emily Chen',
          role: 'Graphic Designer',
          status: 'busy',
          avatar: '/team/emily.jpg',
          skills: ['Adobe Creative Suite', 'UI/UX', 'Branding'],
          experience: '4 years',
          timezone: 'PST',
          lastActive: '1 hour ago',
          performance: 92
        },
        {
          id: '4',
          name: 'David Kim',
          role: 'Web Developer',
          status: 'active',
          avatar: '/team/david.jpg',
          skills: ['React', 'Node.js', 'Database'],
          experience: '5 years',
          timezone: 'EST',
          lastActive: '15 minutes ago',
          performance: 96
        }
      ])

      setServiceRequests([
        {
          id: '1',
          title: 'Social Media Setup',
          description: 'Set up Instagram and LinkedIn business accounts',
          status: 'pending',
          priority: 'medium',
          assignedTo: 'Sarah Johnson',
          createdAt: '2024-01-15',
          estimatedCompletion: '2024-01-20'
        },
        {
          id: '2',
          title: 'Website Performance Audit',
          description: 'Analyze and optimize website loading speed',
          status: 'in_progress',
          priority: 'high',
          assignedTo: 'David Kim',
          createdAt: '2024-01-14',
          estimatedCompletion: '2024-01-18'
        },
        {
          id: '3',
          title: 'Brand Guidelines Update',
          description: 'Update brand colors and typography guidelines',
          status: 'completed',
          priority: 'low',
          assignedTo: 'Emily Chen',
          createdAt: '2024-01-10',
          estimatedCompletion: '2024-01-12'
        }
      ])
    }, 1000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'active':
        return 'bg-lime-100 text-lime-800 border-lime-200'
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'busy':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'team_member':
        return <Users className="w-4 h-4" />
      case 'service_request':
        return <FileText className="w-4 h-4" />
      case 'task_completion':
        return <CheckCircle className="w-4 h-4" />
      case 'communication':
        return <MessageSquare className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-lime-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back, {user.email} - Manage your team and services</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Avatar>
                <AvatarImage src={user.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-lime-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Team Members</CardTitle>
              <Users className="h-4 w-4 text-lime-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lime-600">{stats.totalTeamMembers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeTeamMembers} currently active
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Services</CardTitle>
              <Activity className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.totalServices}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingRequests} pending requests
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${stats.monthlyCost.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Avg response time: {stats.responseTime}h
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="team">My Team</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5 text-lime-600" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest updates from your projects and team
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className="flex-shrink-0 w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                        </div>
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-lime-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="w-4 h-4 mr-2" />
                    Request New Service
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Users className="w-4 h-4 mr-2" />
                    Add Team Member
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Report
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Team</h2>
                <p className="text-gray-600">Meet your dedicated team members</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Team Member
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamMembers.map((member) => (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <CardDescription>{member.role}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Performance</span>
                        <span>{member.performance}%</span>
                      </div>
                      <Progress value={member.performance} className="h-2" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-gray-600">Experience:</span>
                        <span className="font-medium ml-2">{member.experience}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Timezone:</span>
                        <span className="font-medium ml-2">{member.timezone}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Last Active:</span>
                        <span className="font-medium ml-2">{member.lastActive}</span>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {member.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-2" />
                        View Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Service Requests</h2>
                <p className="text-gray-600">Track and manage your service requests</p>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Request
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {serviceRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request.title}</h3>
                        <p className="text-gray-600 mt-1">{request.description}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority} priority
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {request.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Assigned to:</span>
                        <span className="font-medium ml-2">{request.assignedTo}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium ml-2">{new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Est. Completion:</span>
                        <span className="font-medium ml-2">{new Date(request.estimatedCompletion).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Message Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-lime-600" />
                    Team Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Team performance analytics will be displayed here</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-lime-600" />
                    Service Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Service usage analytics will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
