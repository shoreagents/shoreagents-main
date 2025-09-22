'use client';

import { useState, useEffect, useCallback } from 'react';
import { TalentCard } from '@/components/ui/talent-card';
import { ResumeModal } from '@/components/ui/resume-modal';
import { SideNav } from '@/components/layout/SideNav';
import { EmployeeCardData, ResumeGenerated } from '@/types/api';
import { getEmployeeCardData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/toast-context';
import { useEngagementTracking } from '@/lib/useEngagementTracking';
import { useFavorites } from '@/lib/favorites-context';
import {
  Search,
  Users,
  RefreshCw,
  Loader2,
  Heart
} from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeCardData[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [selectedResume, setSelectedResume] = useState<ResumeGenerated | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const { showToast } = useToast();
  const { recordInteraction } = useEngagementTracking();

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployeeCardData();
      setEmployees(data);
      
      // Check if we have work status data
      const employeesWithWorkStatus = data.filter(emp => emp.workStatus);
      if (employeesWithWorkStatus.length === 0) {
        showToast(`Loaded ${data.length} employees (work status data unavailable)`, 'info');
      } else {
        showToast(`Loaded ${data.length} employees successfully`, 'success');
      }
    } catch (err) {
      const errorMessage = 'Failed to fetch employee data. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const filterEmployees = useCallback(() => {
    let filtered = employees;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (employee.workStatus?.currentEmployer?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (employee.workStatus?.currentPosition?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(employee => favorites.has(employee.user.id));
    }

    // Sort employees by score (highest to lowest)
    const sortedEmployees = filtered.sort((a, b) => {
      // Calculate scores for comparison
      const getScore = (employee: EmployeeCardData) => {
        // Use AI analysis score if available
        if (employee.aiAnalysis?.overall_score) {
          return employee.aiAnalysis.overall_score;
        }
        
        // Calculate score based on various factors
        let score = 0;
        if (employee.resume) score += 20;
        if (employee.aiAnalysis) score += 15;
        if (employee.workStatus) score += 25;
        if (employee.applications.length > 0) score += 10;
        if (employee.user.position) score += 10;
        if (employee.user.location) score += 10;
        if (employee.user.avatar) score += 10;
        
        return Math.min(score, 100);
      };
      
      const scoreA = getScore(a);
      const scoreB = getScore(b);
      
      // Sort from highest to lowest
      return scoreB - scoreA;
    });

    setFilteredEmployees(sortedEmployees);
  }, [employees, searchTerm, favorites, showFavoritesOnly]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    filterEmployees();
  }, [filterEmployees]);


  const handleViewResume = (resume: ResumeGenerated) => {
    recordInteraction('view-resume');
    setSelectedResume(resume);
    setIsResumeModalOpen(true);
  };

  const toggleFavoritesView = () => {
    setShowFavoritesOnly(!showFavoritesOnly);
    recordInteraction('toggle-favorites');
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-lime-600" />
          <p className="text-gray-600">Loading employee data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => {
            recordInteraction('refresh-employees');
            fetchEmployees();
          }} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SideNav */}
      <SideNav />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Our Talent Pool</h1>
              <p className="text-gray-600 mt-2">
                Discover qualified candidates ready to join your team
              </p>

            </div>
            <Button onClick={() => {
              recordInteraction('refresh-employees');
              fetchEmployees();
            }} variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>


          {/* Search and Favorites */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder="Search by name, email, position, or location..."
                value={searchTerm}
                onChange={(e) => {
                  recordInteraction('search-employees');
                  setSearchTerm(e.target.value);
                }}
                className="pl-10 focus:ring-2 focus:ring-lime-500 focus:border-lime-500"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleFavoritesView}
                variant={showFavoritesOnly ? "default" : "outline"}
                className={`flex items-center space-x-2 ${
                  showFavoritesOnly 
                    ? 'bg-lime-600 hover:bg-lime-700 text-white' 
                    : 'hover:bg-lime-50 hover:border-lime-200 hover:text-lime-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                <span>Favorites ({favorites.size})</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEmployees.map((employee, index) => (
              <TalentCard
                key={employee.user.id}
                data={employee}
                isFavorite={isFavorite(employee.user.id)}
                onToggleFavorite={() => toggleFavorite(employee.user.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Resume Modal */}
      <ResumeModal
        resume={selectedResume}
        isOpen={isResumeModalOpen}
        onClose={() => {
          setIsResumeModalOpen(false);
          setSelectedResume(null);
        }}
      />

    </div>
  );
}
