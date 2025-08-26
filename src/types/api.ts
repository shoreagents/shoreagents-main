export interface User {
  id: string;
  full_name: string;
  email: string;
  location: string;
  position: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  resume_id: string;
  resume_slug: string;
  status: string;
  position: number;
  created_at: string;
}

export interface Job {
  id: number;
  company_id: string;
  job_title: string;
  department: string;
  work_arrangement: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  status: string;
  views: number;
  applicants: number;
  created_at: string;
}

export interface AIAnalysisResult {
  id: string;
  user_id: string;
  resume_id: string;
  analysis_data: any;
  created_at: string;
}

export interface ResumeGenerated {
  id: string;
  user_id: string;
  original_resume_id: string | null;
  template_used: string;
  generation_metadata: {
    userAgent: string;
    templateUsed: string;
    originalResumeData: {
      files?: Array<{
        data: string;
        fileName: string;
        fileType: string;
      }>;
      fileNames?: string[];
      fileTypes?: string[];
      totalFiles?: number;
      name?: string;
      email?: string;
      phone?: string;
      skills?: string[] | {
        soft?: string;
        tools?: string;
        languages?: string;
        technical?: string;
        design?: string;
      };
      summary?: string;
      education?: any[];
      experience?: any[];
      projects?: any[];
      achievements?: string[];
      bestJobTitle?: string;
      certifications?: string[];
      location?: string;
    };
    generationTimestamp: string;
  };
  created_at: string;
}

export interface WorkStatus {
  userId: string;
  currentEmployer: string;
  currentPosition: string;
  currentSalary: string;
  noticePeriod: number;
  salaryGoal: string;
  currentMood: string;
  workStatus: string;
  employmentType: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkStatusResponse {
  results: WorkStatus[];
  limit: number;
  offset: number;
}

export interface ApiResponse<T> {
  page: number;
  pageSize: number;
  total: number;
  items: T[];
}

export interface EmployeeCardData {
  user: User;
  applications: Application[];
  appliedJobs: Job[];
  aiAnalysis?: AIAnalysisResult;
  resume?: ResumeGenerated;
  workStatus?: WorkStatus;
}
