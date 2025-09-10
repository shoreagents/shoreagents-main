'use client';

import { useState, useEffect, useCallback } from 'react';
import { EmployeeCard } from '@/components/ui/employee-card';
import { ResumeModal } from '@/components/ui/resume-modal';
import { EmployeeDetailsModal } from '@/components/ui/employee-details-modal';
import { SideNav } from '@/components/layout/SideNav';
import { EmployeeCardData, ResumeGenerated } from '@/types/api';
import { getEmployeeCardData } from '@/lib/api';
import { Button } from '@/components/ui/button';
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

    setFilteredEmployees(filtered);
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
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
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

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg stat-card-hover">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg stat-card-hover">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Applied</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.withApplications}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg stat-card-hover">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Qualified</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.qualified}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg stat-card-hover">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Resume</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{stats.withResume}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg stat-card-hover">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">AI Analyzed</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{stats.aiAnalyzed}</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg stat-card-hover">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-900">Work Status</span>
              </div>
              <p className="text-2xl font-bold text-indigo-900">{stats.withWorkStatus}</p>
            </div>
            <div className="bg-emerald-50 p-4 rounded-lg stat-card-hover">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-900">Employed</span>
              </div>
              <p className="text-2xl font-bold text-emerald-900">{stats.employed}</p>
            </div>
            <div className="bg-rose-50 p-4 rounded-lg stat-card-hover">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-rose-600" />
                <span className="text-sm font-medium text-rose-900">Available</span>
              </div>
              <p className="text-2xl font-bold text-rose-900">{stats.available}</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, position, or location..."
                value={searchTerm}
                onChange={(e) => {
                  recordInteraction('search-employees');
                  setSearchTerm(e.target.value);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent input-hover-effect"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => {
                  recordInteraction('filter-employees');
                  setSelectedFilter(e.target.value);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent select-hover-effect cursor-pointer"
              >
                <option value="all">All Candidates</option>
                <option value="with-applications">With Applications</option>
                <option value="qualified">Qualified</option>
                <option value="with-resume">With Resume</option>
                <option value="ai-analyzed">AI Analyzed</option>
                <option value="with-work-status">With Work Status</option>
                <option value="employed">Currently Employed</option>
                <option value="available">Available for Work</option>
              </select>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployees.map((employee) => (
              <EmployeeCard
                key={employee.user.id}
                data={employee}
                onViewDetails={handleViewDetails}
                onViewResume={handleViewResume}
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
