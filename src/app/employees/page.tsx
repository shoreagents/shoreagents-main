'use client';

import { useState, useEffect } from 'react';
import { EmployeeCard } from '@/components/ui/employee-card';
import { ResumeModal } from '@/components/ui/resume-modal';
import { SideNav } from '@/components/layout/SideNav';
import { EmployeeCardData, ResumeGenerated } from '@/types/api';
import { getEmployeeCardData } from '@/lib/api';
import { Button } from '@/components/ui/button';
import {
  Search,
  Filter,
  Users,
  Briefcase,
  MapPin,
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
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    filterEmployees();
  }, [employees, searchTerm, selectedFilter]);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEmployeeCardData();
      setEmployees(data);
    } catch (err) {
      setError('Failed to fetch employee data. Please try again.');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterEmployees = () => {
    let filtered = employees;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(employee =>
        employee.user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user.position?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.user.location.toLowerCase().includes(searchTerm.toLowerCase())
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
      default:
        break;
    }

    setFilteredEmployees(filtered);
  };

  const handleViewDetails = (employee: EmployeeCardData) => {
    // This could open a modal or navigate to a detailed view
    console.log('View details for:', employee.user.full_name);
    // You can implement a modal or navigation here
  };

  const handleViewResume = (resume: ResumeGenerated) => {
    setSelectedResume(resume);
    setIsResumeModalOpen(true);
  };

  const getFilterStats = () => {
    const total = employees.length;
    const withApplications = employees.filter(e => e.applications.length > 0).length;
    const qualified = employees.filter(e => 
      e.applications.some(app => app.status.toLowerCase() === 'qualified')
    ).length;
    const withResume = employees.filter(e => e.resume).length;
    const aiAnalyzed = employees.filter(e => e.aiAnalysis).length;

    return { total, withApplications, qualified, withResume, aiAnalyzed };
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
          <Button onClick={fetchEmployees} className="flex items-center space-x-2">
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
            <Button onClick={fetchEmployees} variant="outline" className="flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Total</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Applied</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{stats.withApplications}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Qualified</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{stats.qualified}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-900">Resume</span>
              </div>
              <p className="text-2xl font-bold text-yellow-900">{stats.withResume}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">AI Analyzed</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{stats.aiAnalyzed}</p>
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Candidates</option>
                <option value="with-applications">With Applications</option>
                <option value="qualified">Qualified</option>
                <option value="with-resume">With Resume</option>
                <option value="ai-analyzed">AI Analyzed</option>
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
     </div>
   );
 }
