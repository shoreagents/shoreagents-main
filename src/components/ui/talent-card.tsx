'use client';

import { useRouter } from 'next/navigation';
import { EmployeeCardData } from '@/types/api';
import Image from 'next/image';
import { Button } from './button';
import { Card, CardContent } from './card';
import { Badge } from './badge';
import { 
  User, 
  Mail, 
  Eye,
  Trophy,
  Heart
} from 'lucide-react';

interface TalentCardProps {
  data: EmployeeCardData;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function TalentCard({ data, isFavorite = false, onToggleFavorite }: TalentCardProps) {
  const router = useRouter();
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
  


  return (
    <Card className="w-full max-w-sm mx-auto bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative h-full flex flex-col">
      {/* Score badge in top right */}
      <div className="absolute -top-2 -right-2 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-full px-3 py-1 flex items-center justify-center text-sm font-bold shadow-lg">
        <Trophy className="w-3 h-3 mr-1" />
        {score}
      </div>
      <CardContent className="p-6 flex flex-col h-full">
        {/* Profile Section */}
        <div className="flex flex-col items-center space-y-4 mb-6">
          {/* Avatar */}
          <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full flex items-center justify-center relative overflow-hidden">
            {data.user.avatar ? (
              <Image
                src={data.user.avatar}
                alt={data.user.name}
                className="w-full h-full object-cover"
                width={80}
                height={80}
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
              {(() => {
                const position = hasWorkStatus && data.workStatus ? data.workStatus.currentPosition : (data.user.position || 'Position not specified');
                // If position contains commas, take only the first role
                return position.split(',')[0].trim();
              })()}
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


        {/* Spacer to push button to bottom */}
        <div className="flex-1"></div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Button
              onClick={() => {
                // Navigate to employee profile page
                router.push(`/employee/${data.user.id}`);
              }}
              className="flex-1 bg-gradient-to-r from-lime-600 to-lime-700 hover:from-lime-700 hover:to-lime-800 text-white flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>View Profile</span>
            </Button>
            <Button
              onClick={onToggleFavorite}
              variant="outline"
              size="icon"
              className={`flex-shrink-0 transition-all duration-200 ${
                isFavorite 
                  ? 'bg-lime-50 border-lime-300 text-lime-600 hover:bg-lime-100 shadow-sm' 
                  : 'hover:bg-lime-50 hover:border-lime-200 hover:text-lime-600'
              }`}
            >
              <Heart className={`w-4 h-4 transition-all duration-200 ${isFavorite ? 'fill-current scale-110' : 'hover:scale-105 hover:text-lime-600'}`} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
