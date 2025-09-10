'use client';

import { useState, useEffect, useCallback } from 'react';
import { TalentCard } from '@/components/ui/talent-card';
import { ResumeModal } from '@/components/ui/resume-modal';
import { EmployeeDetailsModal } from '@/components/ui/employee-details-modal';
import { SideNav } from '@/components/layout/SideNav';
import { EmployeeCardData, ResumeGenerated } from '@/types/api';
import { getEmployeeCardData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/lib/toast-context';
import { useEngagementTracking } from '@/lib/useEngagementTracking';
import {
  Search,
  Users,
  Briefcase,
  RefreshCw,
  Loader2
} from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeCardData[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedResume, setSelectedResume] = useState<ResumeGenerated | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeCardData | null>(null);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isEmployeeDetailsModalOpen, setIsEmployeeDetailsModalOpen] = useState(false);
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

    // Apply category filter
    switch (selectedFilter) {
      case 'with-applications':
        filtered = filtered.filter(employee => employee.applications.length > 0);
        break;
      case 'qualified':
        filtered = filtered.filter(employee => 
          employee.applications.some(app => app.status.toLowerCase() === 'qualified')
        );
        break;
      case 'with-resume':
        filtered = filtered.filter(employee => employee.resume);
        break;
      case 'ai-analyzed':
        filtered = filtered.filter(employee => employee.aiAnalysis);
        break;
      case 'employed':
        filtered = filtered.filter(employee => employee.workStatus?.workStatus === 'employed');
        break;
      case 'available':
        filtered = filtered.filter(employee => employee.workStatus?.workStatus === 'available');
        break;
      case 'with-work-status':
        filtered = filtered.filter(employee => employee.workStatus);
        break;
      default:
        break;
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
  }, [employees, searchTerm, selectedFilter]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    filterEmployees();
  }, [filterEmployees]);

  const handleViewDetails = (employee: EmployeeCardData) => {
    recordInteraction('view-details');
    setSelectedEmployee(employee);
    setIsEmployeeDetailsModalOpen(true);
  };

  const handleViewResume = (resume: ResumeGenerated) => {
    recordInteraction('view-resume');
    setSelectedResume(resume);
    setIsResumeModalOpen(true);
  };

  const handleViewResumeFromDetails = (resume: ResumeGenerated) => {
    recordInteraction('view-resume-from-details');
    setSelectedResume(resume);
    setIsResumeModalOpen(true);
    setIsEmployeeDetailsModalOpen(false); // Close details modal when opening resume
  };

  const getFilterStats = () => {
    const total = employees.length;
    const withApplications = employees.filter(e => e.applications.length > 0).length;
    const qualified = employees.filter(e => 
      e.applications.some(app => app.status.toLowerCase() === 'qualified')
    ).length;
    const withResume = employees.filter(e => e.resume).length;
    const aiAnalyzed = employees.filter(e => e.aiAnalysis).length;
    const withWorkStatus = employees.filter(e => e.workStatus).length;
    const employed = employees.filter(e => e.workStatus?.workStatus === 'employed').length;
    const available = employees.filter(e => e.workStatus?.workStatus === 'available').length;

    return { total, withApplications, qualified, withResume, aiAnalyzed, withWorkStatus, employed, available };
  };

  const stats = getFilterStats();

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
              <p className="text-sm text-lime-600 mt-1">
                📊 Sorted by AI analysis score (highest to lowest)
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-lime-50 p-4 rounded-lg stat-card-hover shadow-sm border border-lime-200">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-lime-600" />
                <span className="text-sm font-medium text-lime-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-lime-900">{stats.total}</p>
            </div>
            <div className="bg-lime-100 p-4 rounded-lg stat-card-hover shadow-sm border border-lime-200">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-lime-600" />
                <span className="text-sm font-medium text-lime-900">Applied</span>
              </div>
              <p className="text-2xl font-bold text-lime-900">{stats.withApplications}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg stat-card-hover shadow-sm border border-blue-200">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Qualified</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.qualified}</p>
            </div>
            <div className="bg-lime-50 p-4 rounded-lg stat-card-hover shadow-sm border border-lime-200">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-lime-600" />
                <span className="text-sm font-medium text-lime-900">Resume</span>
              </div>
              <p className="text-2xl font-bold text-lime-900">{stats.withResume}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg stat-card-hover shadow-sm border border-orange-200">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">AI Analyzed</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{stats.aiAnalyzed}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg stat-card-hover shadow-sm border border-blue-200">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Work Status</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.withWorkStatus}</p>
            </div>
            <div className="bg-lime-100 p-4 rounded-lg stat-card-hover shadow-sm border border-lime-200">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-lime-600" />
                <span className="text-sm font-medium text-lime-900">Employed</span>
              </div>
              <p className="text-2xl font-bold text-lime-900">{stats.employed}</p>
            </div>
            <div className="bg-orange-100 p-4 rounded-lg stat-card-hover shadow-sm border border-orange-200">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">Available</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{stats.available}</p>
            </div>
          </div>

          {/* Search and Filters */}
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
              <Select
                value={selectedFilter}
                onValueChange={(value) => {
                  recordInteraction('filter-employees');
                  setSelectedFilter(value);
                }}
              >
                <SelectTrigger className="w-[200px] focus:ring-2 focus:ring-lime-500 focus:border-lime-500">
                  <SelectValue placeholder="Filter candidates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Candidates</SelectItem>
                  <SelectItem value="with-applications">With Applications</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="with-resume">With Resume</SelectItem>
                  <SelectItem value="ai-analyzed">AI Analyzed</SelectItem>
                  <SelectItem value="with-work-status">With Work Status</SelectItem>
                  <SelectItem value="employed">Currently Employed</SelectItem>
                  <SelectItem value="available">Available for Work</SelectItem>
                </SelectContent>
              </Select>
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
                onViewDetails={handleViewDetails}
                onViewResume={handleViewResume}
                rank={index + 1}
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

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        employee={selectedEmployee}
        isOpen={isEmployeeDetailsModalOpen}
        onClose={() => {
          setIsEmployeeDetailsModalOpen(false);
          setSelectedEmployee(null);
        }}
        onViewResume={handleViewResumeFromDetails}
      />
    </div>
  );
}
