"use client"

import { UserGuard } from '@/components/auth/UserGuard'
import { UserDashboardSidebar } from '@/components/layout/UserDashboardSidebar'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { useUserAuth } from '@/lib/user-auth-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Search, 
  Filter,
  Star,
  Heart,
  MessageCircle,
  Eye,
  Download,
  MapPin,
  Calendar,
  Briefcase
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { getEmployeeCardData } from '@/lib/api'
import { EmployeeCardData } from '@/types/api'

export default function CandidatesPage() {
  const { user } = useUserAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [candidates, setCandidates] = useState<EmployeeCardData[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch real candidates from BPOC API
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        console.log('🔄 Fetching candidates from BPOC API...')
        setLoading(true)
        const data = await getEmployeeCardData()
        console.log('✅ Fetched candidates:', data.length)
        setCandidates(data)
      } catch (error) {
        console.error('❌ Error fetching candidates:', error)
        setCandidates([])
      } finally {
        setLoading(false)
      }
    }

    fetchCandidates()
  }, [])

  const handleFavorite = (candidateId: string) => {
    setFavorites(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    )
  }

  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         candidate.user.position.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'available' && candidate.user.work_status === 'Available') ||
                         (selectedFilter === 'favorites' && favorites.includes(candidate.user.id))
    return matchesSearch && matchesFilter
  })

  return (
    <UserGuard>
      <SidebarProvider>
        <UserDashboardSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Candidates</h1>
              <Badge variant="secondary" className="text-xs">
                {filteredCandidates.length} candidates found
              </Badge>
            </div>
          </header>
          
          <div className="flex flex-1 flex-col gap-4 p-4">
            {/* Header */}
            <div className="grid gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Browse Candidates</h2>
                <p className="text-muted-foreground">
                  Find the perfect talent for your business needs
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search candidates by name or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('all')}
                  className={selectedFilter === 'all' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  All
                </Button>
                <Button
                  variant={selectedFilter === 'available' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('available')}
                  className={selectedFilter === 'available' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  Available
                </Button>
                <Button
                  variant={selectedFilter === 'favorites' ? 'default' : 'outline'}
                  onClick={() => setSelectedFilter('favorites')}
                  className={selectedFilter === 'favorites' ? 'bg-lime-600 hover:bg-lime-700' : ''}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full border-2 border-lime-600 border-t-transparent w-8 h-8" />
                <span className="ml-3 text-gray-600">Loading candidates...</span>
              </div>
            )}

            {/* Candidates Grid */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCandidates.map((candidate) => (
                  <Card key={candidate.user.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center">
                            {candidate.user.avatar ? (
                              <img 
                                src={candidate.user.avatar} 
                                alt={candidate.user.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <Users className="w-6 h-6 text-lime-600" />
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{candidate.user.name}</CardTitle>
                            <p className="text-sm text-muted-foreground">{candidate.user.position}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFavorite(candidate.user.id)}
                          className="p-1"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              favorites.includes(candidate.user.id) 
                                ? 'text-red-500 fill-current' 
                                : 'text-gray-400'
                            }`} 
                          />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* AI Analysis Score */}
                      {candidate.aiAnalysis && (
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{candidate.aiAnalysis.overall_score.toFixed(1)}</span>
                          <span className="text-sm text-muted-foreground">(AI Score)</span>
                        </div>
                      )}

                      {/* Location */}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-muted-foreground">{candidate.user.location}</span>
                      </div>

                      {/* Work Status */}
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          candidate.user.work_status === 'Available' ? 'bg-green-500' : 
                          candidate.user.work_status === 'Busy' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`} />
                        <span className="text-sm text-muted-foreground">
                          {candidate.user.work_status || 'Unknown'}
                        </span>
                      </div>

                      {/* Skills from AI Analysis */}
                      {candidate.aiAnalysis?.key_strengths && candidate.aiAnalysis.key_strengths.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {candidate.aiAnalysis.key_strengths.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {candidate.aiAnalysis.key_strengths.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{candidate.aiAnalysis.key_strengths.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Bio Preview */}
                      {candidate.user.bio && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {candidate.user.bio}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-lime-600 hover:bg-lime-700"
                          onClick={() => window.open(`/employee/${candidate.user.id}`, '_blank')}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && filteredCandidates.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No candidates found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search terms or filters
                </p>
                <Button 
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedFilter('all')
                  }}
                  className="bg-lime-600 hover:bg-lime-700"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </UserGuard>
  )
}
