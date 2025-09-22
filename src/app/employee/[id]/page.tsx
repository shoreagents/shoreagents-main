'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Download,
  Share2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  TrendingUp
} from 'lucide-react';

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  position: string;
  location: string;
  avatar: string | null;
  bio: string | null;
  overallScore: number;
  matchScore: number;
  skills: string[];
  experience: string;
  expectedSalary: number;
  workStatus: string;
  joinedDate: string;
  applications: number;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
}

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        console.log(`🔍 Fetching employee data for ID: ${params.id}`);
        
        // Import BPOC service dynamically to avoid SSR issues
        const { fetchBPOCEmployeeData } = await import('@/lib/bpocApiService');
        
        // Fetch all BPOC employees
        const bpocEmployees = await fetchBPOCEmployeeData();
        console.log(`📊 Total BPOC employees found: ${bpocEmployees.length}`);
        
        // Find the specific employee by ID
        const foundEmployee = bpocEmployees.find(emp => emp.user_id === params.id);
        
        if (!foundEmployee) {
          console.log(`❌ Employee with ID ${params.id} not found in BPOC data`);
          setEmployee(null);
          setLoading(false);
          return;
        }
        
        console.log(`✅ Found employee: ${foundEmployee.full_name}`, foundEmployee);
        
        // Convert BPOC data to EmployeeProfile format
        const employeeProfile: EmployeeProfile = {
          id: foundEmployee.user_id,
          name: foundEmployee.full_name,
          email: `${foundEmployee.first_name.toLowerCase()}.${foundEmployee.last_name.toLowerCase()}@example.com`,
          position: foundEmployee.current_position || foundEmployee.position || 'Position not specified',
          location: foundEmployee.location || 'Location not specified',
          avatar: null, // BPOC doesn't have avatar data
          bio: foundEmployee.bio || `Professional ${foundEmployee.current_position || foundEmployee.position || 'candidate'} with expertise in various technologies.`,
          overallScore: foundEmployee.overall_score || 0,
          matchScore: foundEmployee.overall_score || 0, // Using overall_score as match score
          skills: foundEmployee.skills_snapshot || [],
          experience: foundEmployee.experience_snapshot ? 
            (Array.isArray(foundEmployee.experience_snapshot) ? 
              foundEmployee.experience_snapshot.length + ' years' : 
              'Experience available') : 
            'Experience not specified',
          expectedSalary: foundEmployee.expected_salary ? 
            parseFloat(foundEmployee.expected_salary.replace(/[^\d.]/g, '')) : 0,
          workStatus: foundEmployee.work_status || 'Status not specified',
          joinedDate: foundEmployee.user_created_at ? new Date(foundEmployee.user_created_at).toISOString().split('T')[0] : '2023-01-01',
          applications: Math.floor(Math.random() * 20) + 1, // Mock applications count
          tier: (foundEmployee.overall_score || 0) >= 80 ? 'GOLD' : 
                (foundEmployee.overall_score || 0) >= 60 ? 'SILVER' : 'BRONZE'
        };
        
        console.log(`📋 Converted employee profile:`, employeeProfile);
        setEmployee(employeeProfile);
      } catch (error) {
        console.error('Error fetching employee data:', error);
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchEmployeeData();
    }
  }, [params.id]);

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'GOLD': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'SILVER': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'BRONZE': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-orange-600';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee profile...</p>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Employee Not Found</h1>
          <p className="text-gray-600 mb-2">The employee profile with ID "{params.id}" doesn't exist.</p>
          <p className="text-sm text-gray-500 mb-6">This could be because the employee ID is invalid or the data hasn't been loaded yet.</p>
          <div className="space-x-4">
            <Button onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            <Button variant="outline" onClick={() => router.push('/')}>
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
                <p className="text-gray-600">Detailed candidate information</p>
                <p className="text-xs text-gray-500">ID: {params.id} | URL: /employee/{params.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={employee.avatar || ''} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-lime-400 to-lime-600 text-white">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{employee.name}</CardTitle>
                <CardDescription className="text-base">{employee.position}</CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge className={getTierColor(employee.tier)}>
                    {employee.tier}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">{employee.location}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">Joined {new Date(employee.joinedDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <Separator />

                {/* Scores */}
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Overall Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(employee.overallScore)}`}>
                        {employee.overallScore}%
                      </span>
                    </div>
                    <Progress value={employee.overallScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Match Score</span>
                      <span className={`text-sm font-bold ${getScoreColor(employee.matchScore)}`}>
                        {employee.matchScore}%
                      </span>
                    </div>
                    <Progress value={employee.matchScore} className="h-2" />
                  </div>
                </div>

                <Separator />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-lime-600">{employee.applications}</div>
                    <div className="text-xs text-gray-600">Applications</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-lime-600">{employee.experience}</div>
                    <div className="text-xs text-gray-600">Experience</div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-lime-600" />
                      About
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {employee.bio || 'No bio available for this candidate.'}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-lime-600" />
                      Work Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Status</label>
                        <p className="text-gray-900">{employee.workStatus}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Expected Salary</label>
                        <p className="text-gray-900">₱{employee.expectedSalary.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-lime-600" />
                      Technical Skills
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {employee.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-lime-600" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-lime-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{employee.position}</h4>
                          <p className="text-sm text-gray-600">{employee.experience} of experience</p>
                          <p className="text-sm text-gray-500">Current Position</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-lime-600" />
                      Performance Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Score Breakdown</h4>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Overall Performance</span>
                              <span>{employee.overallScore}%</span>
                            </div>
                            <Progress value={employee.overallScore} className="h-2" />
                          </div>
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Role Match</span>
                              <span>{employee.matchScore}%</span>
                            </div>
                            <Progress value={employee.matchScore} className="h-2" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Activity</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span>Total Applications</span>
                            <span className="font-semibold">{employee.applications}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Profile Views</span>
                            <span className="font-semibold">--</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Last Active</span>
                            <span className="font-semibold">Today</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
