'use client';

import { useState } from 'react';
import { EmployeeCardData, ResumeGenerated } from '@/types/api';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { fetchUserResume } from '@/lib/api';
import { 
  User, 
  MapPin, 
  Mail, 
  Calendar, 
  FileText, 
  Eye,
  Trophy,
  Loader2
} from 'lucide-react';

interface TalentCardProps {
  data: EmployeeCardData;
  onViewDetails?: (data: EmployeeCardData) => void;
  onViewResume?: (resume: ResumeGenerated) => void;
  rank?: number; // Optional rank position
}

export function TalentCard({ data, onViewDetails, onViewResume, rank }: TalentCardProps) {
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const hasWorkStatus = data.workStatus;
  const hasResume = data.resume;
  
  // Calculate score based on various factors
  const calculateScore = () => {
    let score = 0;
    if (hasResume) score += 20;
    if (data.aiAnalysis) score += 15;
    if (hasWorkStatus) score += 25;
    if (data.applications.length > 0) score += 10;
    if (data.user.position) score += 10;
    if (data.user.location) score += 10;
    if (data.user.avatar) score += 10;
    
    // Use AI analysis score if available
    if (data.aiAnalysis?.overall_score) {
      return data.aiAnalysis.overall_score;
    }
    
    return Math.min(score, 100);
  };

  const score = calculateScore();
  
  // Determine tier based on score
  const getTier = (score: number) => {
    if (score >= 80) return { name: 'GOLD', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
    if (score >= 60) return { name: 'SILVER', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    return { name: 'BRONZE', color: 'bg-orange-100 text-orange-800 border-orange-200' };
  };

  const tier = getTier(score);

  const handleViewResume = async () => {
    console.log('🔍 View Resume clicked for:', data.user.name, 'ID:', data.user.id);
    
    if (hasResume && onViewResume) {
      // If we already have resume data, use it
      console.log('📄 Using existing resume data');
      onViewResume(data.resume!);
      return;
    }

    // Check if user has AI analysis data (which can be used to generate a resume)
    const hasAnalysisData = data.aiAnalysis && data.aiAnalysis.overall_score;
    
    if (!hasAnalysisData) {
      console.warn('⚠️ No resume or analysis data available for user:', data.user.name);
      return; // Don't proceed if no data available
    }

    // Otherwise, fetch resume from API
    console.log('🔄 Fetching resume from API...');
    setIsLoadingResume(true);
    try {
      const resume = await fetchUserResume(data.user.id);
      if (resume && onViewResume) {
        console.log('✅ Resume fetched successfully:', resume);
        onViewResume(resume);
      } else {
        console.warn('⚠️ No resume data available for user:', data.user.name);
      }
    } catch (error) {
      console.error('❌ Error fetching resume:', error);
    } finally {
      setIsLoadingResume(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative">
      {/* Rank indicator */}
      {rank && (
        <div className="absolute -top-2 -right-2 bg-lime-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
          #{rank}
        </div>
      )}
      <CardContent className="p-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center relative overflow-hidden">
            {data.user.avatar ? (
              <img
                src={data.user.avatar}
                alt={data.user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          
          {/* Name and Position */}
          <div className="text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              {data.user.name}
            </h3>
            <p className="text-sm text-gray-600">
              {hasWorkStatus && data.workStatus ? data.workStatus.currentPosition : (data.user.position || 'Position not specified')}
            </p>
          </div>

          {/* Email */}
          {data.user.email && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Mail className="w-4 h-4" />
              <span className="truncate max-w-48">{data.user.email}</span>
            </div>
          )}
        </div>

        {/* Status and Details */}
        <div className="space-y-3 mb-6">
          {/* Score and Tier */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                Score: {score}
              </Badge>
            </div>
            <Badge variant="outline" className={tier.color}>
              {tier.name}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{data.user.location || 'Location not specified'}</span>
          </div>

          {/* Joined Date */}
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Joined {new Date(data.user.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="space-y-3 mb-6">
          {/* Resume Status */}
          <div className="flex justify-center">
            <Badge 
              variant={hasResume ? "default" : "secondary"} 
              className={hasResume ? "bg-lime-100 text-lime-800 border-lime-200" : "bg-orange-100 text-orange-800 border-orange-200"}
            >
              {hasResume ? 'Resume Available' : 'Resume Not Available'}
            </Badge>
          </div>

          {/* Profile Completion */}
          <div className="flex justify-center">
            <Badge 
              variant={score >= 70 ? "default" : "secondary"} 
              className={score >= 70 ? "bg-lime-100 text-lime-800 border-lime-200" : "bg-orange-100 text-orange-800 border-orange-200"}
            >
              {score >= 70 ? 'Profile Complete' : 'Profile Not Complete'}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            onClick={() => onViewDetails?.(data)}
            className="w-full bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-700 hover:to-lime-800 text-white flex items-center justify-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>View Profile</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewResume}
            disabled={isLoadingResume || (!hasResume && !data.aiAnalysis?.overall_score)}
            className="w-full flex items-center justify-center space-x-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoadingResume ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4" />
            )}
            <span>
              {isLoadingResume 
                ? 'Loading...' 
                : (!hasResume && !data.aiAnalysis?.overall_score) 
                  ? 'No Resume' 
                  : 'View Resume'
              }
            </span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
