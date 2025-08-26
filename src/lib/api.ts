import { 
  User, 
  Application, 
  Job, 
  AIAnalysisResult, 
  ResumeGenerated, 
  ApiResponse,
  EmployeeCardData,
  WorkStatus,
  WorkStatusResponse
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

// Helper function to check if API is available
async function checkApiHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/user-work-status`, {
      method: 'HEAD', // Just check if endpoint exists
      headers: {
        'Accept': 'application/json',
      },
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Helper function to retry API calls
async function retryFetch<T>(
  fetchFn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fetchFn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      console.warn(`Work status API attempt ${attempt} failed, retrying in ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  throw new Error('Max retries exceeded');
}

export async function fetchWorkStatus(): Promise<WorkStatus[]> {
  try {
    // First check if API is available
    const isApiAvailable = await checkApiHealth();
    if (!isApiAvailable) {
      console.warn('Work status API is not available, skipping work status data');
      return [];
    }

    // Create the fetch function with retry logic
    const fetchWorkStatusData = async (): Promise<WorkStatus[]> => {
      const response = await fetch(`${API_BASE_URL}/user-work-status`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data: WorkStatusResponse = await response.json();
      
      if (!data || !data.results) {
        throw new Error('Invalid work status API response format');
      }
      
      return data.results;
    };

    // Retry the fetch with exponential backoff
    const results = await retryFetch(fetchWorkStatusData, 3, 1000);
    
    console.log(`Successfully fetched ${results.length} work status records`);
    return results;
  } catch (error) {
    console.error('Error fetching work status after retries:', error);
    // Return empty array instead of throwing to prevent app crashes
    return [];
  }
}

export async function getEmployeeCardData(): Promise<EmployeeCardData[]> {
  try {
    // Fetch all data in parallel, but handle work status separately to prevent failures
    const [users, applications, jobs, aiAnalysisResults, resumes] = await Promise.all([
      fetchUsers(),
      fetchApplications(),
      fetchJobs(),
      fetchAIAnalysisResults(),
      fetchResumesGenerated()
    ]);

    // Try to fetch work status separately to prevent it from breaking the entire function
    let workStatuses: WorkStatus[] = [];
    try {
      workStatuses = await fetchWorkStatus();
    } catch (workStatusError) {
      console.warn('Failed to fetch work status data, continuing without it:', workStatusError);
      workStatuses = [];
    }

    return users.map(user => {
      const userApplications = applications.filter(app => app.user_id === user.id);
      const appliedJobs = jobs.filter(job => 
        userApplications.some(app => app.job_id === job.id.toString())
      );
      const aiAnalysis = aiAnalysisResults.find(analysis => analysis.user_id === user.id);
      const resume = resumes.find(res => res.user_id === user.id);
      const workStatus = workStatuses.find(status => status.userId === user.id);

      return {
        user,
        applications: userApplications,
        appliedJobs,
        aiAnalysis,
        resume,
        workStatus
      };
    });
  } catch (error) {
    console.error('Error fetching employee card data:', error);
    return [];
  }
}

// Currency API service using Open Exchange Rates
export const currencyApi = {
  // Open Exchange Rates API with your API key
  async fetchRatesPrimary(): Promise<Record<string, number> | null> {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_OPEN_EXCHANGE_RATES_API_KEY || '6df09f6a1ad74d29a741d8a8ab06112f';
      console.log('Using API key:', API_KEY ? 'API key found' : 'No API key found');
      console.log('Making request to Open Exchange Rates API...');
      const response = await fetch(`https://openexchangerates.org/api/latest.json?app_id=${API_KEY}`, {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Open Exchange Rates API failed: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json();
      
      // Validate the response structure
      if (!data.rates || typeof data.rates !== 'object') {
        throw new Error('Invalid response format from Open Exchange Rates API');
      }
      
      console.log('Open Exchange Rates API response:', {
        timestamp: data.timestamp,
        base: data.base,
        ratesCount: Object.keys(data.rates).length,
        sampleRates: {
          USD: data.rates.USD,
          AUD: data.rates.AUD,
          CAD: data.rates.CAD,
          GBP: data.rates.GBP,
          NZD: data.rates.NZD,
          EUR: data.rates.EUR,
          PHP: data.rates.PHP
        }
      });
      
      return data.rates || null;
    } catch (error) {
      console.warn('Open Exchange Rates API failed:', error);
      return null;
    }
  },

  // Fallback API - ExchangeRate-API (free tier)
  async fetchRatesFallback(): Promise<Record<string, number> | null> {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) throw new Error('Fallback API failed');
      
      const data = await response.json();
      return data.rates || null;
    } catch (error) {
      console.warn('Fallback currency API failed:', error);
      return null;
    }
  },

  // Get rates with fallback strategy
  async getExchangeRates(): Promise<Record<string, number> | null> {
    // Try Open Exchange Rates API first
    const primaryRates = await this.fetchRatesPrimary();
    if (primaryRates) return primaryRates;

    // Try fallback API
    const fallbackRates = await this.fetchRatesFallback();
    if (fallbackRates) return fallbackRates;

    // Return null if both fail
    return null;
  }
};
