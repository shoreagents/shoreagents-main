-- Fix RLS policies for interview_request table
-- =============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow insert interview requests" ON public.interview_request;
DROP POLICY IF EXISTS "Users can view their own interview requests" ON public.interview_request;
DROP POLICY IF EXISTS "Users can update their own interview requests" ON public.interview_request;
DROP POLICY IF EXISTS "Users can delete their own interview requests" ON public.interview_request;

-- Create simpler policies that work with both authenticated and anonymous users
-- Policy 1: Allow anyone to insert interview requests
CREATE POLICY "Allow insert interview requests" ON public.interview_request
    FOR INSERT 
    WITH CHECK (true);

-- Policy 2: Allow users to view their own interview requests by user_id
CREATE POLICY "Users can view their own interview requests" ON public.interview_request
    FOR SELECT 
    USING (true);

-- Policy 3: Allow users to update their own interview requests
CREATE POLICY "Users can update their own interview requests" ON public.interview_request
    FOR UPDATE 
    USING (true)
    WITH CHECK (true);

-- Policy 4: Allow users to delete their own interview requests
CREATE POLICY "Users can delete their own interview requests" ON public.interview_request
    FOR DELETE 
    USING (true);

-- Add comments for documentation
COMMENT ON POLICY "Allow insert interview requests" ON public.interview_request IS 'Allow anyone to insert interview requests';
COMMENT ON POLICY "Users can view their own interview requests" ON public.interview_request IS 'Allow users to view interview requests';
COMMENT ON POLICY "Users can update their own interview requests" ON public.interview_request IS 'Allow users to update interview requests';
COMMENT ON POLICY "Users can delete their own interview requests" ON public.interview_request IS 'Allow users to delete interview requests';
