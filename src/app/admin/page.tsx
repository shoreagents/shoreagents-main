'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Database,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  CheckCircle,
  LogOut,
  Table as TableIcon
} from 'lucide-react'
import { ChartAreaInteractive } from '@/components/chart-area-interactive'
// Database functions are used in the component
import { supabase, UserPageVisit } from '@/lib/supabase'

interface PerformanceMetrics {
  pageViews: number
  uniqueVisitors: number
  avgLoadTime: number
  bounceRate: number
  conversionRate: number
  serverUptime: number
  apiResponseTime: number
  errorRate: number
}

interface DeviceStats {
  desktop: number
  mobile: number
  tablet: number
}

interface PagePerformance {
  path: string
  views: number
  avgLoadTime: number
  bounceRate: number
}

interface UserVisitData {
  ipAddress: string
  visits: Array<{
    pageName: string
    visitCount: number
    timeSpent: number
    lastVisit: string
  }>
}

export default function AdminDashboard() {
  const router = useRouter()
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    pageViews: 0,
    uniqueVisitors: 0,
    avgLoadTime: 0,
    bounceRate: 0,
    conversionRate: 0,
    serverUptime: 0,
    apiResponseTime: 0,
    errorRate: 0
  })

  const [realMetrics, setRealMetrics] = useState({
    totalPageViews: 0,
    uniqueIPs: 0,
    totalVisitors: 0
  })

  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    desktop: 0,
    mobile: 0,
    tablet: 0
  })

  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([])
  const [userVisitData, setUserVisitData] = useState<UserVisitData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  // Fetch real metrics from database
  const fetchRealMetrics = async () => {
    try {
      if (!supabase) {
        console.warn('Supabase not available for real metrics')
        return
      }

      // Fetch all user page visits
      const { data: visits, error } = await supabase
        .from('user_page_visits')
        .select('*')

      if (error) {
        console.error('Error fetching real metrics:', error)
        return
      }

      if (visits && visits.length > 0) {
        // Calculate total page views (sum of all visit counts)
        const totalPageViews = visits.reduce((sum, visit) => sum + visit.visit_count, 0)
        
        // Calculate unique IP addresses
        const uniqueIPs = new Set(visits.map(visit => visit.ip_address).filter(Boolean)).size
        
        // Calculate total visitors (sum of all unique user sessions)
        const totalVisitors = visits.length

        setRealMetrics({
          totalPageViews,
          uniqueIPs,
          totalVisitors
        })
      }
    } catch (error) {
      console.error('Error processing real metrics:', error)
    }
  }

  // Fetch user visit data from database
  const fetchUserVisitData = async () => {
    try {
      if (!supabase) {
        console.warn('Supabase not available for user visit data')
        return
      }

      // Fetch all user page visits
      const { data: visits, error } = await supabase
        .from('user_page_visits')
        .select('*')
        .order('user_id', { ascending: true })
        .order('page_path', { ascending: true })

      if (error) {
        console.error('Error fetching user visit data:', error)
        return
      }

      // Group visits by IP address
      const groupedData = new Map<string, UserVisitData>()
      
      visits?.forEach((visit: UserPageVisit) => {
        const ipAddress = visit.ip_address || 'Unknown'
        
        if (!groupedData.has(ipAddress)) {
          groupedData.set(ipAddress, {
            ipAddress: ipAddress,
            visits: []
          })
        }
        
        // Check if this page already exists for this IP
        const existingVisit = groupedData.get(ipAddress)?.visits.find(
          v => v.pageName === visit.page_path
        )
        
        if (existingVisit) {
          // Merge the data - add visit count and time spent
          existingVisit.visitCount += visit.visit_count
          existingVisit.timeSpent += visit.time_spent_seconds
          // Keep the most recent last visit
          if (new Date(visit.last_visit_timestamp) > new Date(existingVisit.lastVisit)) {
            existingVisit.lastVisit = visit.last_visit_timestamp
          }
        } else {
          // Add new page visit
          groupedData.get(ipAddress)?.visits.push({
            pageName: visit.page_path,
            visitCount: visit.visit_count,
            timeSpent: visit.time_spent_seconds,
            lastVisit: visit.last_visit_timestamp
          })
        }
      })

      // Convert to array and sort by IP address
      const userVisitArray = Array.from(groupedData.values())
        .sort((a, b) => a.ipAddress.localeCompare(b.ipAddress))
        .slice(0, 50) // Limit to 50 IP addresses for performance

      setUserVisitData(userVisitArray)
    } catch (error) {
      console.error('Error processing user visit data:', error)
    }
  }

  // Simulate fetching performance data
  useEffect(() => {
    const fetchMetrics = () => {
      // Simulate API call delay
      setTimeout(() => {
        setMetrics({
          pageViews: Math.floor(Math.random() * 10000) + 5000,
          uniqueVisitors: Math.floor(Math.random() * 3000) + 2000,
          avgLoadTime: Math.random() * 2 + 0.5,
          bounceRate: Math.random() * 30 + 20,
          conversionRate: Math.random() * 5 + 2,
          serverUptime: 99.9,
          apiResponseTime: Math.random() * 200 + 50,
          errorRate: Math.random() * 2
        })

        setDeviceStats({
          desktop: Math.floor(Math.random() * 60) + 30,
          mobile: Math.floor(Math.random() * 40) + 20,
          tablet: Math.floor(Math.random() * 20) + 5
        })

        setPagePerformance([
          { path: '/', views: 2500, avgLoadTime: 1.2, bounceRate: 25 },
          { path: '/about', views: 1200, avgLoadTime: 1.5, bounceRate: 30 },
          { path: '/services', views: 800, avgLoadTime: 1.8, bounceRate: 35 },
          { path: '/contact', views: 600, avgLoadTime: 1.1, bounceRate: 20 },
          { path: '/employees', views: 400, avgLoadTime: 2.1, bounceRate: 40 }
        ])

        setLastUpdated(new Date())
        setIsLoading(false)
      }, 1000)
    }

    fetchMetrics()
    fetchRealMetrics()
    fetchUserVisitData()
    
    // Refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchMetrics()
      fetchRealMetrics()
      fetchUserVisitData()
    }, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    // Trigger refresh
    setLastUpdated(new Date())
    fetchRealMetrics()
    fetchUserVisitData()
    setTimeout(() => setIsLoading(false), 1000)
  }

  const handleLogout = () => {
    // Clear auth cookie
    document.cookie = 'adminAuth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/admin/login')
  }

  const getStatusColor = (value: number, type: 'uptime' | 'error' | 'performance') => {
    if (type === 'uptime') {
      return value >= 99.5 ? 'text-green-600' : value >= 95 ? 'text-yellow-600' : 'text-red-600'
    }
    if (type === 'error') {
      return value <= 1 ? 'text-green-600' : value <= 3 ? 'text-yellow-600' : 'text-red-600'
    }
    if (type === 'performance') {
      return value <= 1 ? 'text-green-600' : value <= 2 ? 'text-yellow-600' : 'text-red-600'
    }
    return 'text-gray-600'
  }


  const formatTimeSpent = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
    } else {
      const hours = Math.floor(seconds / 3600)
      const minutes = Math.floor((seconds % 3600) / 60)
      return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
    }
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor your website performance and analytics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
            <Button 
              onClick={refreshData} 
              disabled={isLoading}
              className="bg-lime-600 hover:bg-lime-700 text-white"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-lime-200 text-lime-700 hover:bg-lime-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>


         {/* Chart and Metrics Layout */}
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
           {/* Chart - Takes 4/5 of the width */}
           <div className="lg:col-span-4">
             <ChartAreaInteractive 
               totalVisitors={realMetrics.totalVisitors}
               uniqueVisitors={realMetrics.uniqueIPs}
             />
           </div>
           
           {/* Metrics - Takes 1/5 of the width */}
           <div className="space-y-4">
             <Card className="border-l-4 border-l-lime-500 bg-gradient-to-t from-lime-50/50 to-white shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Page Views</CardTitle>
                 <Eye className="h-4 w-4 text-lime-600" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-lime-600 tabular-nums">
                   {isLoading ? '...' : realMetrics.totalPageViews.toLocaleString()}
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                   <Badge variant="outline" className="text-lime-600 border-lime-200">
                     <Database className="w-3 h-3 mr-1" />
                     Live Data
                   </Badge>
                 </div>
                 <p className="text-xs text-muted-foreground mt-2">
                   Total from database
                 </p>
               </CardContent>
             </Card>

             <Card className="border-l-4 border-l-lime-500 bg-gradient-to-t from-lime-50/50 to-white shadow-sm">
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                 <Users className="h-4 w-4 text-lime-600" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold text-lime-600 tabular-nums">
                   {isLoading ? '...' : realMetrics.uniqueIPs.toLocaleString()}
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                   <Badge variant="outline" className="text-lime-600 border-lime-200">
                     <Globe className="w-3 h-3 mr-1" />
                     Anonymous IPs
                   </Badge>
                 </div>
                 <p className="text-xs text-muted-foreground mt-2">
                   Unique IP addresses
                 </p>
               </CardContent>
             </Card>
           </div>
         </div>

         {/* Detailed Analytics */}
         <Tabs defaultValue="users" className="space-y-6">
           <TabsList className="grid w-full grid-cols-5">
             <TabsTrigger value="users">User Visits</TabsTrigger>
             <TabsTrigger value="overview" disabled>Overview</TabsTrigger>
             <TabsTrigger value="performance" disabled>Performance</TabsTrigger>
             <TabsTrigger value="devices" disabled>Devices</TabsTrigger>
             <TabsTrigger value="pages" disabled>Pages</TabsTrigger>
           </TabsList>

          <TabsContent value="users" className="space-y-6">
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TableIcon className="w-5 h-5 text-lime-600" />
                  User Visit Analytics
                </CardTitle>
                <CardDescription>
                  Real-time user visit data from your database - grouped by user ID
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-6 h-6 border-2 border-lime-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Loading user visit data...
                  </div>
                ) : userVisitData.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No user visit data available</p>
                    <p className="text-sm">Make sure your database is connected and has visit data</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {userVisitData.map((userData) => {
                      // Calculate performance score based on visit count and time spent
                      const visitsWithScore = userData.visits.map(visit => {
                        // Normalize visit count (0-100 scale)
                        const maxVisits = Math.max(...userData.visits.map(v => v.visitCount))
                        const normalizedVisits = (visit.visitCount / maxVisits) * 100
                        
                        // Normalize time spent (0-100 scale) - cap at 1 hour for normalization
                        const maxTime = Math.max(...userData.visits.map(v => Math.min(v.timeSpent, 3600)))
                        const normalizedTime = (Math.min(visit.timeSpent, 3600) / maxTime) * 100
                        
                        // Combined score: 60% visit count, 40% time spent
                        const performanceScore = (normalizedVisits * 0.6) + (normalizedTime * 0.4)
                        
                        return {
                          ...visit,
                          performanceScore
                        }
                      })
                      
                      // Sort by performance score and get top 2
                      const sortedVisits = visitsWithScore.sort((a, b) => b.performanceScore - a.performanceScore)
                      const topPages = sortedVisits.slice(0, 2)
                      
                      // Find the page with highest time spent
                      const topTimePage = userData.visits.reduce((max, visit) => 
                        visit.timeSpent > max.timeSpent ? visit : max
                      )
                      
                      // Only highlight if there's a clear top performer (score > 80) or if top 2 are close
                      const shouldHighlight = topPages.length > 0 && (
                        topPages[0].performanceScore > 80 || 
                        (topPages.length > 1 && topPages[0].performanceScore - topPages[1].performanceScore < 20)
                      )
                      
                      // Always highlight the top time spent page if it's different from top performers
                      const shouldHighlightTime = topTimePage.timeSpent > 0
                      
                      return (
                        <div key={userData.ipAddress} className="border rounded-lg overflow-hidden">
                          {/* IP Address Header */}
                          <div className="bg-lime-50 px-4 py-3 border-b">
                            <div className="flex items-center gap-3">
                              <Users className="w-5 h-5 text-lime-600" />
                              <h3 className="font-semibold text-gray-900">
                                IP Address: {userData.ipAddress}
                              </h3>
                            </div>
                          </div>

                          {/* User Visits Table */}
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[200px]">Page Name</TableHead>
                                <TableHead className="w-[120px]">Visit Count</TableHead>
                                <TableHead className="w-[120px]">Time Spent</TableHead>
                                <TableHead className="w-[150px]">Last Visit</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {userData.visits.map((visit, visitIndex) => {
                                const isTopPage = shouldHighlight && topPages.some(top => top.pageName === visit.pageName)
                                const isFirstTop = shouldHighlight && topPages[0]?.pageName === visit.pageName
                                const isSecondTop = shouldHighlight && topPages[1]?.pageName === visit.pageName
                                const isTopTime = shouldHighlightTime && topTimePage.pageName === visit.pageName
                                const isHighlighted = isTopPage || isTopTime
                                
                                return (
                                  <TableRow 
                                    key={`${userData.ipAddress}-${visitIndex}`}
                                    className={isHighlighted ? "bg-lime-50/50 border-l-4 border-l-lime-500" : ""}
                                  >
                                    <TableCell className="font-medium">
                                      <div className="flex items-center gap-2">
                                        <Globe className="w-4 h-4 text-gray-400" />
                                        {visit.pageName}
                                        {isFirstTop && (
                                          <Badge className="ml-2 bg-lime-100 text-lime-800 border-lime-300">
                                            Top Performer
                                          </Badge>
                                        )}
                                        {isSecondTop && (
                                          <Badge className="ml-2 bg-lime-50 text-lime-700 border-lime-200">
                                            High Performer
                                          </Badge>
                                        )}
                                        {isTopTime && !isTopPage && (
                                          <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-300">
                                            Most Time Spent
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <Badge 
                                        variant={isHighlighted ? "default" : "outline"} 
                                        className={isHighlighted ? "bg-lime-600 text-white" : "text-lime-600 border-lime-200"}
                                      >
                                        {visit.visitCount}
                                      </Badge>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm">
                                          {formatTimeSpent(visit.timeSpent)}
                                        </span>
                                        {isTopTime && (
                                          <Badge className="ml-2 bg-orange-100 text-orange-800 border-orange-300 text-xs">
                                            Top Time
                                          </Badge>
                                        )}
                                      </div>
                                    </TableCell>
                                    <TableCell>
                                      <span className="text-sm text-gray-600">
                                        {new Date(visit.lastVisit).toLocaleDateString()} {new Date(visit.lastVisit).toLocaleTimeString()}
                                      </span>
                                    </TableCell>
                                  </TableRow>
                                )
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      )
                    })}
                    
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-lime-600" />
                    Conversion Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Bounce Rate</span>
                    <Badge variant="outline" className="text-lime-600 border-lime-200">
                      {isLoading ? '...' : `${metrics.bounceRate.toFixed(1)}%`}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Conversion Rate</span>
                    <Badge variant="outline" className="text-lime-600 border-lime-200">
                      {isLoading ? '...' : `${metrics.conversionRate.toFixed(1)}%`}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Response Time</span>
                    <Badge variant="outline" className="text-lime-600 border-lime-200">
                      {isLoading ? '...' : `${metrics.apiResponseTime.toFixed(0)}ms`}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Error Rate</span>
                    <Badge 
                      variant="outline" 
                      className={`${getStatusColor(metrics.errorRate, 'error')} border-current`}
                    >
                      {isLoading ? '...' : `${metrics.errorRate.toFixed(2)}%`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-lime-600" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Database Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">API Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Operational
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">CDN Status</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">SSL Certificate</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>
                  Real-time performance monitoring and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-lime-600">
                      {isLoading ? '...' : `${metrics.avgLoadTime.toFixed(2)}s`}
                    </div>
                    <div className="text-sm text-gray-600">Average Load Time</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-lime-600">
                      {isLoading ? '...' : `${metrics.apiResponseTime.toFixed(0)}ms`}
                    </div>
                    <div className="text-sm text-gray-600">API Response Time</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-lime-600">
                      {isLoading ? '...' : `${metrics.serverUptime}%`}
                    </div>
                    <div className="text-sm text-gray-600">Server Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Analytics</CardTitle>
                <CardDescription>
                  Traffic breakdown by device type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Monitor className="w-5 h-5 text-lime-600" />
                      <span>Desktop</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{deviceStats.desktop}%</div>
                      <div className="text-sm text-gray-600">Most popular</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-lime-600" />
                      <span>Mobile</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{deviceStats.mobile}%</div>
                      <div className="text-sm text-gray-600">Growing</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-lime-600" />
                      <span>Tablet</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{deviceStats.tablet}%</div>
                      <div className="text-sm text-gray-600">Stable</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pages" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Performance</CardTitle>
                <CardDescription>
                  Performance metrics for each page
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pagePerformance.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <div className="font-medium">{page.path}</div>
                        <div className="text-sm text-gray-600">{page.views} views</div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-sm">
                          <span className="font-medium">{page.avgLoadTime.toFixed(2)}s</span>
                          <span className="text-gray-600 ml-2">load time</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{page.bounceRate}%</span>
                          <span className="text-gray-600 ml-2">bounce rate</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
