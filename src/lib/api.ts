import { 
  User, 
  Application, 
  Job, 
  AIAnalysisResult, 
  ResumeGenerated, 
  ApiResponse,
  EmployeeCardData 
} from '@/types/api';

const API_BASE_URL = 'https://www.bpoc.io/api/public';

export async function fetchUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const data: ApiResponse<User> = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

export async function fetchApplications(): Promise<Application[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/applications`);
    const data: ApiResponse<Application> = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching applications:', error);
    return [];
  }
}

export async function fetchJobs(): Promise<Job[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/jobs`);
    const data: ApiResponse<Job> = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }
}

export async function fetchAIAnalysisResults(): Promise<AIAnalysisResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai-analysis-results`);
    const data: ApiResponse<AIAnalysisResult> = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching AI analysis results:', error);
    return [];
  }
}

export async function fetchResumesGenerated(): Promise<ResumeGenerated[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/resumes-generated`);
    const data: ApiResponse<ResumeGenerated> = await response.json();
    return data.items;
  } catch (error) {
    console.error('Error fetching resumes:', error);
    return [];
  }
}

export async function getEmployeeCardData(): Promise<EmployeeCardData[]> {
  try {
    const [users, applications, jobs, aiAnalysisResults, resumes] = await Promise.all([
      fetchUsers(),
      fetchApplications(),
      fetchJobs(),
      fetchAIAnalysisResults(),
      fetchResumesGenerated()
    ]);

    return users.map(user => {
      const userApplications = applications.filter(app => app.user_id === user.id);
      const appliedJobs = jobs.filter(job => 
        userApplications.some(app => app.job_id === job.id.toString())
      );
      const aiAnalysis = aiAnalysisResults.find(analysis => analysis.user_id === user.id);
      const resume = resumes.find(res => res.user_id === user.id);

      return {
        user,
        applications: userApplications,
        appliedJobs,
        aiAnalysis,
        resume
      };
    });
  } catch (error) {
    console.error('Error fetching employee card data:', error);
    return [];
  }
}
