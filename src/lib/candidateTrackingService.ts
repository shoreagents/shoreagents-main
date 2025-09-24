// Service for tracking candidate views and interactions
import { createClient } from './supabase/client';

export interface CandidateViewData {
  user_id: string;
  candidate_id: string;
  candidate_name?: string;
  interaction_type: 'view' | 'favorite' | 'unfavorite' | 'contact' | 'download' | 'share' | 'click' | 'ai_analysis_view' | 'profile_click' | 'skills_click' | 'experience_click';
}

export class CandidateTrackingService {
  private static instance: CandidateTrackingService;
  private currentCandidateId: string | null = null;
  private currentUserId: string | null = null;

  private constructor() {}

  public static getInstance(): CandidateTrackingService {
    if (!CandidateTrackingService.instance) {
      CandidateTrackingService.instance = new CandidateTrackingService();
    }
    return CandidateTrackingService.instance;
  }

  // Initialize tracking for a candidate view
  public async startTracking(userId: string, candidateId: string, candidateName?: string): Promise<void> {
    try {
      console.log('🚀 Starting candidate tracking:', {
        userId,
        candidateId,
        candidateName,
        timestamp: new Date().toISOString()
      });

      // Get existing user from users table
      let trackingUserId: string | null = null;
      if (userId) {
        // For authenticated users, find existing user by auth_user_id
        trackingUserId = await this.getExistingAuthenticatedUser(userId);
        
        // If authenticated user lookup fails, fall back to any available user
        if (!trackingUserId) {
          console.log('⚠️ Authenticated user lookup failed, falling back to any available user');
          trackingUserId = await this.getExistingUser();
        }
      } else {
        // For anonymous users, use the actual user from the frontend context
        // This should be the actual user_id from the frontend, not a random one
        trackingUserId = userId || await this.getExistingUser();
      }

      // If no user found, skip tracking
      if (!trackingUserId) {
        console.log('❌ No user found for tracking, skipping...');
        return;
      }
      
      this.currentUserId = trackingUserId;
      this.currentCandidateId = candidateId;

      // Get candidate name from BPOC API if not provided
      let finalCandidateName = candidateName;
      if (!finalCandidateName) {
        finalCandidateName = await this.getCandidateNameFromBPOC(candidateId) || undefined;
      }

      // Record initial view using the new function that accepts actual user_id
      await this.recordInteractionDirect({
        user_id: trackingUserId,
        candidate_id: candidateId,
        candidate_name: finalCandidateName,
        interaction_type: 'view'
      });

      console.log(`✅ Started tracking view for candidate: ${finalCandidateName || candidateId} (User: ${trackingUserId})`);
    } catch (error) {
      console.error('❌ Error starting candidate tracking:', error);
    }
  }

  // Get candidate name from BPOC API
  private async getCandidateNameFromBPOC(candidateId: string): Promise<string | null> {
    try {
      console.log('🔍 Fetching candidate name from BPOC API for:', candidateId);
      
      // Import BPOC service dynamically to avoid SSR issues
      const { fetchBPOCEmployeeData } = await import('@/lib/bpocApiService');
      
      // Fetch all BPOC employees
      const bpocEmployees = await fetchBPOCEmployeeData();
      
      // Find the specific employee by ID
      const foundEmployee = bpocEmployees.find(emp => emp.user_id === candidateId);
      
      if (foundEmployee) {
        console.log('✅ Found candidate name from BPOC:', foundEmployee.full_name);
        return foundEmployee.full_name;
      } else {
        console.log('❌ Candidate not found in BPOC data');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching candidate name from BPOC:', error);
      return null;
    }
  }

  // Get existing user from users table (any available user_id)
  private async getExistingUser(): Promise<string | null> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc('simple_get_anonymous_user'); // This function returns any available user_id

      if (error) {
        console.error('❌ Error getting existing user_id:', error);
        return null;
      }

      if (data) {
        console.log('✅ Got existing user_id from users table:', data);
        return data;
      } else {
        console.log('❌ No users found in users table');
        return null;
      }
    } catch (error) {
      console.error('❌ Error in getExistingUser:', error);
      return null;
    }
  }

  // Get existing authenticated user from users table
  private async getExistingAuthenticatedUser(authUserId: string): Promise<string | null> {
    try {
      console.log('🔍 Looking up authenticated user for:', authUserId);
      
      const supabase = createClient();
      
      // First try direct table query (more reliable than RPC)
      const { data: directData, error: directError } = await supabase
        .from('users')
        .select('user_id')
        .eq('user_id', authUserId)
        .single();

      if (!directError && directData) {
        console.log('✅ Found user by direct user_id lookup:', directData.user_id);
        return directData.user_id;
      }

      // If direct lookup fails, try RPC function
      const { data, error } = await supabase
        .rpc('simple_get_authenticated_user', {
          p_auth_user_id: authUserId
        });

      if (error) {
        console.error('❌ Error getting existing authenticated user:', {
          error: error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          authUserId: authUserId,
          fullError: JSON.stringify(error, null, 2)
        });
        return null;
      }

      if (data) {
        console.log('✅ Got existing authenticated user via RPC:', data);
        return data;
      } else {
        console.log('❌ No authenticated user found for auth_user_id:', authUserId);
        return null;
      }
    } catch (error) {
      console.error('❌ Exception in getExistingAuthenticatedUser:', {
        error: error,
        authUserId: authUserId
      });
      return null;
    }
  }

  // Record a specific interaction (simple approach)
  public async recordInteraction(data: CandidateViewData): Promise<void> {
    try {
      if (!this.currentUserId || !this.currentCandidateId) {
        console.warn('No active tracking session. Call startTracking first.');
        return;
      }

      console.log('🔍 Attempting to record interaction:', {
        user_id: data.user_id,
        candidate_id: data.candidate_id,
        candidate_name: data.candidate_name,
        interaction_type: data.interaction_type
      });

      const supabase = createClient();
      
      // Use the simple record function with the actual user_id
      const { data: result, error } = await supabase
        .rpc('simple_record_view', {
          p_user_id: data.user_id, // This is the actual user_id from the tracking service
          p_candidate_id: data.candidate_id,
          p_candidate_name: data.candidate_name,
          p_view_duration: data.view_duration,
          p_interaction_type: data.interaction_type
        });

      if (error) {
        console.error('❌ Error recording candidate interaction:', {
          error: error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        return;
      }

      console.log(`✅ Successfully recorded ${data.interaction_type} for candidate: ${data.candidate_name || data.candidate_id}`, result);
    } catch (error) {
      console.error('❌ Exception in recordInteraction:', error);
    }
  }

  // Record interaction directly with actual user_id from frontend
  public async recordInteractionDirect(data: CandidateViewData): Promise<void> {
    try {
      console.log('🔍 Attempting to record interaction directly:', {
        user_id: data.user_id,
        candidate_id: data.candidate_id,
        candidate_name: data.candidate_name,
        interaction_type: data.interaction_type
      });

      const supabase = createClient();
      
      // Use the increment function (no fallback to prevent duplicates)
      const { data: incrementResult, error: incrementError } = await supabase
        .rpc('increment_candidate_activity', {
          p_user_id: data.user_id,
          p_candidate_id: data.candidate_id,
          p_candidate_name: data.candidate_name,
          p_interaction_type: data.interaction_type
        });

      if (!incrementError && incrementResult) {
        console.log(`✅ Successfully recorded ${data.interaction_type} via increment for candidate: ${data.candidate_name || data.candidate_id}`, incrementResult);
        return;
      }

      // If increment function fails, log error and skip recording to prevent duplicates
      console.error('❌ Increment function failed, skipping recording to prevent duplicates:', {
        incrementError: incrementError,
        message: incrementError?.message,
        details: incrementError?.details,
        hint: incrementError?.hint,
        code: incrementError?.code,
        fullError: JSON.stringify(incrementError, null, 2)
      });
      
      // Don't fall back to old function that creates duplicates
      console.log('⚠️ Skipping recording to prevent duplicate records');
      return;
    } catch (error) {
      console.error('❌ Exception in recordInteractionDirect:', error);
    }
  }

  // Record favorite/unfavorite action
  public async recordFavoriteAction(candidateId: string, candidateName: string, isFavorite: boolean): Promise<void> {
    if (!this.currentUserId) return;

    // Get candidate name from BPOC API if not provided
    let finalCandidateName = candidateName;
    if (!finalCandidateName) {
      finalCandidateName = await this.getCandidateNameFromBPOC(candidateId) || '';
    }

    await this.recordInteractionDirect({
      user_id: this.currentUserId,
      candidate_id: candidateId,
      candidate_name: finalCandidateName,
      interaction_type: isFavorite ? 'favorite' : 'unfavorite'
    });
  }

  // Record AI analysis view
  public async recordAIAnalysisView(): Promise<void> {
    if (!this.currentUserId || !this.currentCandidateId) return;

    // Get candidate name from BPOC API
    const candidateName = await this.getCandidateNameFromBPOC(this.currentCandidateId);

    await this.recordInteractionDirect({
      user_id: this.currentUserId,
      candidate_id: this.currentCandidateId,
      candidate_name: candidateName || undefined,
      interaction_type: 'ai_analysis_view'
    });
  }

  // Record tab/section clicks
  public async recordSectionClick(section: 'profile_click' | 'skills_click' | 'experience_click'): Promise<void> {
    if (!this.currentUserId || !this.currentCandidateId) return;

    // Get candidate name from BPOC API
    const candidateName = await this.getCandidateNameFromBPOC(this.currentCandidateId);

    await this.recordInteractionDirect({
      user_id: this.currentUserId,
      candidate_id: this.currentCandidateId,
      candidate_name: candidateName || undefined,
      interaction_type: section
    });
  }

  // End tracking (simplified - no duration tracking)
  public async endTracking(): Promise<void> {
    try {
      if (!this.currentUserId || !this.currentCandidateId) {
        return;
      }

      console.log('📊 Ending tracking session');

      // Reset tracking state
      this.currentCandidateId = null;
      this.currentUserId = null;
    } catch (error) {
      console.error('Error ending candidate tracking:', error);
    }
  }

  // Get candidate analytics (using the database function)
  public async getCandidateAnalytics(candidateId: string): Promise<any> {
    try {
      console.log('🔍 Fetching analytics for candidate:', candidateId);
      
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc('simple_get_analytics', { p_candidate_id: candidateId as string });

      if (error) {
        console.error('❌ Error fetching candidate analytics:', {
          error: error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          candidateId: candidateId
        });
        return null;
      }

      console.log('📊 Analytics data received:', { data, candidateId, dataLength: data?.length });

      // Handle different response formats
      let result = null;
      
      if (data) {
        if (Array.isArray(data)) {
          // If it's an array, take the first element
          result = data.length > 0 ? data[0] : null;
        } else if (typeof data === 'object') {
          // If it's a single object, use it directly
          result = data;
        }
      }
      
      console.log('📈 Processed analytics result:', result);
      
      // If no data exists for this candidate, return a default structure
      if (!result) {
        console.log('📊 No analytics data found for candidate, returning default structure');
        return {
          candidate_id: candidateId,
          candidate_name: null,
          total_views: 0,
          unique_users: 0,
          total_favorites: 0,
          total_clicks: 0,
          total_ai_views: 0,
          avg_view_duration: 0,
          hotness_score: 0,
          last_viewed: null,
          first_viewed: null
        };
      }
      
      return result;
    } catch (error) {
      console.error('❌ Exception in getCandidateAnalytics:', error);
      return null;
    }
  }

  // Get user's viewing history
  public async getUserViewingHistory(userId: string, daysBack: number = 30): Promise<any> {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .rpc('candidate_tracking_get_user_history', { 
          p_user_id: userId as string, 
          p_days_back: daysBack as number
        });

      if (error) {
        console.error('Error fetching user viewing history:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error fetching user viewing history:', error);
      return null;
    }
  }

  // Transfer anonymous tracking data to authenticated user
  public async transferAnonymousDataToUser(anonymousUserId: string, authenticatedUserId: string): Promise<void> {
    try {
      console.log('🔄 Transferring anonymous data to authenticated user:', {
        anonymousUserId,
        authenticatedUserId
      });

      const supabase = createClient();
      
      // Update all candidate_views records from anonymous to authenticated user
      const { error } = await supabase
        .from('candidate_views')
        .update({ user_id: authenticatedUserId })
        .eq('user_id', anonymousUserId);

      if (error) {
        console.error('❌ Error transferring anonymous data:', error);
        return;
      }

      // Clear the anonymous user ID from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('shoreagents_anonymous_user_id');
      }

      // Update current tracking session
      this.currentUserId = authenticatedUserId;

      console.log('✅ Successfully transferred anonymous data to authenticated user');
    } catch (error) {
      console.error('❌ Exception in transferAnonymousDataToUser:', error);
    }
  }

  // Get anonymous user ID from localStorage
  public getAnonymousUserId(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shoreagents_anonymous_user_id');
    }
    return null;
  }
}

// Export singleton instance
export const candidateTracker = CandidateTrackingService.getInstance();
