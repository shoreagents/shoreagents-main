'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  Heart
} from 'lucide-react';
import { useFavorites } from '@/lib/favorites-context';

interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  position: string;
  location: string;
  avatar: string | null;
  bio: string | null;
  score: number;
  skills: string[];
  experience: string;
  expectedSalary: number;
  workStatus: string;
  joinedDate: string;
  tier: 'GOLD' | 'SILVER' | 'BRONZE';
  // AI Analysis data
  keyStrengths: string[];
  improvements: string[];
  recommendations: string[];
  improvedSummary: string | null;
  strengthsAnalysis: Record<string, unknown> | null;
}

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [employee, setEmployee] = useState<EmployeeProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

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
          avatar: foundEmployee.avatar_url || null,
          bio: foundEmployee.bio || `Professional ${foundEmployee.current_position || foundEmployee.position || 'candidate'} with expertise in various technologies.`,
          score: foundEmployee.overall_score || 0,
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
          tier: (foundEmployee.overall_score || 0) >= 80 ? 'GOLD' : 
                (foundEmployee.overall_score || 0) >= 60 ? 'SILVER' : 'BRONZE',
          // AI Analysis data
          keyStrengths: foundEmployee.key_strengths || [],
          improvements: foundEmployee.improvements || [],
          recommendations: foundEmployee.recommendations || [],
          improvedSummary: foundEmployee.improved_summary || null,
          strengthsAnalysis: foundEmployee.strengths_analysis || null
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

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 60) return 'bg-gray-100 text-gray-800 border-gray-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
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
          <div className="py-6">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Profile</h1>
              <p className="text-gray-600">Detailed candidate information</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Overview */}
          <div className="lg:col-span-1">
            <Card className="relative">
              <CardHeader className="text-center">
                {/* Favorite Button - Upper Right */}
                <Button
                  onClick={() => toggleFavorite(employee.id)}
                  variant="outline"
                  size="icon"
                  className={`absolute top-4 right-4 transition-all duration-200 ${
                    isFavorite(employee.id) 
                      ? 'bg-lime-50 border-lime-300 text-lime-600 hover:bg-lime-100 shadow-sm' 
                      : 'hover:bg-lime-50 hover:border-lime-200 hover:text-lime-600'
                  }`}
                >
                  <Heart className={`w-4 h-4 transition-all duration-200 ${isFavorite(employee.id) ? 'fill-current scale-110' : 'hover:scale-105 hover:text-lime-600'}`} />
                </Button>
                
                <div className="flex justify-center mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={employee.avatar || ''} />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-lime-400 to-lime-600 text-white">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{employee.name.split(' ')[0]}</CardTitle>
                <CardDescription className="text-base">{employee.position.split(',')[0].trim()}</CardDescription>
                <div className="flex justify-center mt-2">
                  <Badge className={`${getScoreColor(employee.score)} flex items-center space-x-1`}>
                    <Trophy className="w-3 h-3" />
                    <span>Score {employee.score}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />


                {/* Quick Stats */}
                <div className="text-center">
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
            <Tabs defaultValue="overview" className="space-y-6 mt-0">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="ai-analysis">AI Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-lime-600" />
                      Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {employee.bio || 'No Bio to show.'}
                    </p>
                  </CardContent>
                </Card>


                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-lime-600" />
                      Work Experience
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="w-5 h-5 text-lime-600" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-4">
                        <div className="w-3 h-3 bg-lime-500 rounded-full mt-2"></div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Education Information</h4>
                          <p className="text-sm text-gray-600">Education details not available</p>
                          <p className="text-sm text-gray-500">Contact candidate for details</p>
                        </div>
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
                    <div className="flex flex-wrap gap-2 max-w-full overflow-hidden">
                      {employee.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-sm break-words max-w-full">
                          <span className="truncate block max-w-full">{skill}</span>
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>


              <TabsContent value="ai-analysis" className="space-y-6">
                {/* AI-Enhanced Summary */}
                {employee.improvedSummary && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-lime-600" />
                        AI-Enhanced Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {employee.improvedSummary}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* AI Analysis Grid */}
                {employee.keyStrengths.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Top Strengths */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-lime-600" />
                          Top Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {employee.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                              <p className="text-sm text-gray-700">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Key Strengths */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-lime-600" />
                          Key Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {employee.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                              <p className="text-sm text-gray-700">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Core Strengths */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-lime-600" />
                          Core Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {employee.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                              <p className="text-sm text-gray-700">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Technical Strengths */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-lime-600" />
                          Technical Strengths
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {employee.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                              <p className="text-sm text-gray-700">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Notable Achievements */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-lime-600" />
                          Notable Achievements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {employee.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                              <p className="text-sm text-gray-700">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Market Advantages */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-lime-600" />
                          Market Advantages
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {employee.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                              <p className="text-sm text-gray-700">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Unique Value Proposition */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-lime-600" />
                          Unique Value Proposition
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {employee.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                              <p className="text-sm text-gray-700">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Areas to Highlight */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-lime-600" />
                          Areas to Highlight
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {employee.keyStrengths.map((strength, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-lime-500 rounded-full mt-2"></div>
                              <p className="text-sm text-gray-700">{strength}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </TabsContent>

            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
