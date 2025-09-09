'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Activity, 
  Users, 
  Eye, 
  Clock, 
  TrendingUp, 
  Server, 
  Database,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  LogOut
} from 'lucide-react'

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

  const [deviceStats, setDeviceStats] = useState<DeviceStats>({
    desktop: 0,
    mobile: 0,
    tablet: 0
  })

  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

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
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchMetrics, 30000)
    
    return () => clearInterval(interval)
  }, [])

  const refreshData = () => {
    setIsLoading(true)
    // Trigger refresh
    setLastUpdated(new Date())
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

  const getStatusIcon = (value: number, type: 'uptime' | 'error' | 'performance') => {
    if (type === 'uptime') {
      return value >= 99.5 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />
    }
    if (type === 'error') {
      return value <= 1 ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
    }
    if (type === 'performance') {
      return value <= 1 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />
    }
    return <Activity className="w-4 h-4" />
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

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-lime-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-lime-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lime-600">
                {isLoading ? '...' : metrics.pageViews.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-lime-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-lime-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-lime-600">
                {isLoading ? '...' : metrics.uniqueVisitors.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-lime-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Load Time</CardTitle>
              <Clock className="h-4 w-4 text-lime-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(metrics.avgLoadTime, 'performance')}`}>
                {isLoading ? '...' : `${metrics.avgLoadTime.toFixed(2)}s`}
              </div>
              <p className="text-xs text-muted-foreground">
                {getStatusIcon(metrics.avgLoadTime, 'performance')}
                <span className="ml-1">Good performance</span>
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-lime-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Server Uptime</CardTitle>
              <Server className="h-4 w-4 text-lime-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getStatusColor(metrics.serverUptime, 'uptime')}`}>
                {isLoading ? '...' : `${metrics.serverUptime}%`}
              </div>
              <p className="text-xs text-muted-foreground">
                {getStatusIcon(metrics.serverUptime, 'uptime')}
                <span className="ml-1">Excellent uptime</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="pages">Pages</TabsTrigger>
          </TabsList>

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
