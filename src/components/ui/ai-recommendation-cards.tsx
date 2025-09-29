'use client'

import React from 'react'

// Function to calculate gradual popularity score (0-100)
const calculateGradualPopularity = (rawScore: number): number => {
  if (rawScore <= 0) return 0;
  
  // Use logarithmic scaling to make it harder to reach 100%
  // This creates a more gradual progression
  const maxRawScore = 1000; // Adjust this based on your data range
  const normalizedScore = Math.min(rawScore / maxRawScore, 1);
  
  // Apply logarithmic scaling: log(1 + x) / log(2) gives us 0-1 range
  const logScore = Math.log(1 + normalizedScore * 9) / Math.log(10); // 9x multiplier for more spread
  
  // Convert to percentage and cap at 100
  return Math.min(logScore * 100, 100);
}
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ButtonLoader } from '@/components/ui/loader'
import { 
  User, 
  MessageCircle, 
  Eye, 
  FileText, 
  DollarSign, 
  Star, 
  Target, 
  Mail, 
  ArrowRight,
  BookOpen,
  TrendingUp,
  Users,
  MessageSquare,
  ChevronRight
} from 'lucide-react'
import { EmployeeCardData } from '@/types/api'
import { UserQuoteService, UserQuoteSummary } from '@/lib/userQuoteService'
import { useAuth } from '@/lib/auth-context'

interface BaseCardProps {
  number: number
  title: string
  subtitle: string
  headerTitle: string
  headerIcon: React.ReactNode
  onClick?: () => void
  className?: string
}

interface CandidateCardProps {
  number: number
  candidate: EmployeeCardData | null
  isLoading?: boolean
  onAskForInterview?: () => void
  onViewProfile?: () => void
  className?: string
}

// Base AI Recommendation Card Component
export function AIRecommendationCard({ 
  number, 
  title, 
  subtitle, 
  headerTitle,
  headerIcon,
  onClick, 
  className = '' 
}: BaseCardProps) {
  return (
    <div 
      className={`bg-white border-2 rounded-lg overflow-hidden flex flex-col h-40 hover:shadow-md transition-all duration-200 cursor-pointer ${className}`}
      style={{ borderColor: 'rgb(101, 163, 13)' }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="px-3 py-1.5 flex items-center justify-center" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
        <div className="flex items-center gap-2">
          {headerIcon}
          <span className="text-lime-50 text-xs font-medium">{headerTitle}</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="text-gray-800 text-center">
          <div className="text-sm font-semibold">{title}</div>
          <div className="text-xs text-gray-600">{subtitle}</div>
        </div>
      </div>
    </div>
  )
}

// Specialized Candidate Card Component
export function CandidateCard({ 
  number, 
  candidate, 
  isLoading = false, 
  onAskForInterview, 
  onViewProfile, 
  className = '' 
}: CandidateCardProps) {
  if (isLoading) {
    return (
      <div className={`bg-white border-2 rounded-lg overflow-hidden flex flex-col h-40 ${className}`} style={{ borderColor: 'rgb(101, 163, 13)' }}>
        {/* Header */}
        <div className="px-3 py-1.5 flex items-center justify-center" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 text-lime-50" />
            <span className="text-lime-50 text-xs font-medium">Most Viewed Candidate</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-3">
          <div className="flex items-center space-x-2">
            <ButtonLoader size={20} />
            <span className="text-sm text-gray-600">Loading candidate...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!candidate) {
    return (
      <div className={`bg-white border-2 rounded-lg overflow-hidden flex flex-col h-40 ${className}`} style={{ borderColor: 'rgb(101, 163, 13)' }}>
        {/* Header */}
        <div className="px-3 py-1.5 flex items-center justify-center" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 text-lime-50" />
            <span className="text-lime-50 text-xs font-medium">Most Viewed Candidate</span>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-3">
          <div className="text-gray-800 text-center">
            <div className="text-sm font-semibold">No Candidates</div>
            <div className="text-xs text-gray-600">Available</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white border-2 rounded-lg overflow-hidden flex flex-col h-40 ${className}`} style={{ borderColor: 'rgb(101, 163, 13)' }}>
      {/* Header */}
      <div className="px-3 py-1.5 flex items-center justify-center" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
        <div className="flex items-center gap-2">
          <Star className="w-3 h-3 text-lime-50" />
          <span className="text-lime-50 text-xs font-medium">Most Viewed Candidate</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-between p-2">
        {/* Candidate info with avatar */}
        <div className="flex items-center gap-2 w-full">
          <Avatar className="w-6 h-6">
            <AvatarImage src={candidate.user.avatar || ''} alt={candidate.user.name} />
            <AvatarFallback className="bg-lime-100 text-lime-700 text-xs">
              {candidate.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-gray-800 truncate" title={candidate.user.name}>
              {candidate.user.name}
            </div>
            <div className="text-xs text-gray-600 truncate" title={candidate.user.position || 'No position'}>
              {candidate.user.position || 'No position'}
            </div>
          </div>
        </div>

        {/* Popularity Bar */}
        <div className="w-full mb-1">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Popularity</span>
            <span>{Math.min(Math.round(calculateGradualPopularity(candidate.hotnessScore || 0)), 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="h-1.5 rounded-full transition-all duration-500 ease-out" 
              style={{ 
                width: `${Math.min(calculateGradualPopularity(candidate.hotnessScore || 0), 100)}%`,
                backgroundColor: 'rgb(101, 163, 13)'
              }}
            ></div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-1 w-full">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-6 text-xs px-1 text-white hover:brightness-110"
            style={{ 
              borderColor: 'rgb(101, 163, 13)', 
              backgroundColor: 'rgb(101, 163, 13)' 
            }}
            onClick={(e) => {
              e.stopPropagation()
              onAskForInterview?.()
            }}
          >
            <MessageCircle className="w-3 h-3 mr-1" />
            Interview
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 h-6 text-xs px-1 text-white hover:brightness-110"
            style={{ 
              borderColor: 'rgb(101, 163, 13)', 
              backgroundColor: 'rgb(101, 163, 13)' 
            }}
            onClick={(e) => {
              e.stopPropagation()
              onViewProfile?.()
            }}
          >
            <Eye className="w-3 h-3 mr-1" />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  )
}

// Pre-configured card components for easy reuse
export const ContentBlogCard = ({ onClick }: { onClick?: () => void }) => (
  <AIRecommendationCard
    number={1}
    title="Content Blog"
    subtitle="or Pillar"
    headerTitle="Content"
    headerIcon={<FileText className="w-3 h-3 text-lime-50" />}
    onClick={onClick}
  />
)

export const ContentCaseStudyCard = ({ onClick }: { onClick?: () => void }) => (
  <AIRecommendationCard
    number={2}
    title="Content Case"
    subtitle="Study"
    headerTitle="Case Study"
    headerIcon={<BookOpen className="w-3 h-3 text-lime-50" />}
    onClick={onClick}
  />
)


export const TopViewedCandidateCard = ({ 
  candidate, 
  isLoading, 
  onAskForInterview, 
  onViewProfile 
}: { 
  candidate: EmployeeCardData | null
  isLoading?: boolean
  onAskForInterview?: () => void
  onViewProfile?: () => void
}) => (
  <CandidateCard
    number={0}
    candidate={candidate}
    isLoading={isLoading}
    onAskForInterview={onAskForInterview}
    onViewProfile={onViewProfile}
  />
)

export const BestMatchCandidateCard = ({ onClick }: { onClick?: () => void }) => (
  <AIRecommendationCard
    number={5}
    title="Best Match"
    subtitle="Candidate"
    headerTitle="Best Match"
    headerIcon={<Target className="w-3 h-3 text-lime-50" />}
    onClick={onClick}
  />
)

export const PersonalisedMessageCard = ({ onClick }: { onClick?: () => void }) => (
  <AIRecommendationCard
    number={6}
    title="Personalised"
    subtitle="Message"
    headerTitle="Message"
    headerIcon={<Mail className="w-3 h-3 text-lime-50" />}
    onClick={onClick}
  />
)

export const NextStepCard = ({ onClick }: { onClick?: () => void }) => (
  <AIRecommendationCard
    number={7}
    title="Next Step"
    subtitle="CTA"
    headerTitle="Next Step"
    headerIcon={<ChevronRight className="w-3 h-3 text-lime-50" />}
    onClick={onClick}
  />
)

export const MayaChatCard = ({ onClick }: { onClick?: () => void }) => (
  <AIRecommendationCard
    number={8}
    title="Maya Chat"
    subtitle="Independent Model"
    headerTitle="Maya Chat"
    headerIcon={<MessageSquare className="w-3 h-3 text-lime-50" />}
    onClick={onClick}
  />
)

// Pricing Card Component with Quote Data
interface PricingCardProps {
  onClick?: () => void
}

export const PricingCard = ({ onClick }: PricingCardProps) => {
  const { appUser } = useAuth()
  const [quote, setQuote] = React.useState<UserQuoteSummary | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchQuote = async () => {
      if (!appUser?.user_id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const result = await UserQuoteService.getMostRecentQuote(appUser.user_id)
        
        if (result.success) {
          setQuote(result.data || null)
          setError(null)
        } else {
          setError(result.error || 'Failed to fetch quote')
        }
      } catch (err) {
        setError('An unexpected error occurred')
        console.error('Error fetching quote:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuote()
  }, [appUser?.user_id])

  if (isLoading) {
    return (
      <div 
        className="bg-white border-2 rounded-lg overflow-hidden flex flex-col h-40 hover:shadow-md transition-all duration-200 cursor-pointer"
        style={{ borderColor: 'rgb(101, 163, 13)' }}
      >
        {/* Header */}
        <div className="px-3 py-1.5 flex items-center justify-center" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-lime-50" />
            <span className="text-lime-50 text-xs font-medium">Pricing</span>
          </div>
        </div>
        
        {/* Loading Content */}
        <div className="flex-1 flex items-center justify-center p-3">
          <div className="flex items-center space-x-2">
            <ButtonLoader size={24} />
            <span className="text-sm text-gray-600">Loading quote...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error || !quote) {
    return (
      <div 
        className="bg-white border-2 rounded-lg overflow-hidden flex flex-col h-40 hover:shadow-md transition-all duration-200 cursor-pointer"
        style={{ borderColor: 'rgb(101, 163, 13)' }}
        onClick={onClick}
      >
        {/* Header */}
        <div className="px-3 py-1.5 flex items-center justify-center" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
          <div className="flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-lime-50" />
            <span className="text-lime-50 text-xs font-medium">Pricing</span>
          </div>
        </div>
        
        {/* No Quote Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-3">
          <div className="text-gray-800 text-center">
            <div className="text-sm font-semibold">No recent quotes</div>
            {!appUser ? (
              <Button 
                size="sm" 
                className="text-xs px-3 py-1 h-6 mt-2"
                style={{ backgroundColor: 'rgb(101, 163, 13)', color: 'white' }}
                onClick={(e) => {
                  e.stopPropagation()
                  // Dispatch custom event to open pricing modal on main page
                  window.dispatchEvent(new CustomEvent('openPricingModal'))
                  // Dispatch custom event to close AI recommendations drawer
                  window.dispatchEvent(new CustomEvent('closeAIDrawer'))
                  // Don't call onClick() to prevent navigation to /pricing page
                }}
              >
                Create your first quote
              </Button>
            ) : (
              <div className="text-xs text-gray-600">Create your first quote</div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div 
      className="bg-white border-2 rounded-lg overflow-hidden flex flex-col h-40 hover:shadow-md transition-all duration-200 cursor-pointer"
      style={{ borderColor: 'rgb(101, 163, 13)' }}
      onClick={onClick}
    >
      {/* Header */}
      <div className="px-3 py-1.5 flex items-center justify-center" style={{ backgroundColor: 'rgb(101, 163, 13)' }}>
        <div className="flex items-center gap-2">
          <DollarSign className="w-3 h-3 text-lime-50" />
          <span className="text-lime-50 text-xs font-medium">Pricing</span>
        </div>
      </div>
      
      {/* Quote Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-3">
        <div className="text-gray-800 text-center space-y-1">
          <div className="text-sm font-semibold">
            {UserQuoteService.formatCurrency(quote.total_monthly_cost, quote.currency_code)}
          </div>
          <div className="text-xs text-gray-600">
            {quote.member_count} member{quote.member_count > 1 ? 's' : ''} • {quote.industry}
          </div>
          <div className="text-xs text-gray-500">
            {UserQuoteService.getQuoteAge(quote.created_at)}
          </div>
        </div>
      </div>
    </div>
  )
}
