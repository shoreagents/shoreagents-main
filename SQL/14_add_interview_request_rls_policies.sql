-- Add proper RLS policies for interview_request table
-- =====================================================

-- Enable RLS on interview_request table
ALTER TABLE public.interview_request ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anyone to insert interview requests (for anonymous and authenticated users)
CREATE POLICY "Allow insert interview requests" ON public.interview_request
    FOR INSERT 
    WITH CHECK (true);

-- Policy 2: Allow users to view their own interview requests
CREATE POLICY "Users can view their own interview requests" ON public.interview_request
    FOR SELECT 
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'user_id' 
           OR user_id = current_setting('request.jwt.claims', true)::json->>'sub'
           OR user_id = current_setting('request.jwt.claims', true)::json->>'device_id');

-- Policy 3: Allow users to update their own interview requests
CREATE POLICY "Users can update their own interview requests" ON public.interview_request
    FOR UPDATE 
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'user_id' 
           OR user_id = current_setting('request.jwt.claims', true)::json->>'sub'
           OR user_id = current_setting('request.jwt.claims', true)::json->>'device_id')
    WITH CHECK (user_id = current_setting('request.jwt.claims', true)::json->>'user_id' 
                OR user_id = current_setting('request.jwt.claims', true)::json->>'sub'
                OR user_id = current_setting('request.jwt.claims', true)::json->>'device_id');

-- Policy 4: Allow users to delete their own interview requests
CREATE POLICY "Users can delete their own interview requests" ON public.interview_request
    FOR DELETE 
    USING (user_id = current_setting('request.jwt.claims', true)::json->>'user_id' 
           OR user_id = current_setting('request.jwt.claims', true)::json->>'sub'
           OR user_id = current_setting('request.jwt.claims', true)::json->>'device_id');

-- Add comments for documentation
COMMENT ON POLICY "Allow insert interview requests" ON public.interview_request IS 'Allow anyone to insert interview requests for tracking purposes';
COMMENT ON POLICY "Users can view their own interview requests" ON public.interview_request IS 'Users can view their own interview requests by user_id';
COMMENT ON POLICY "Users can update their own interview requests" ON public.interview_request IS 'Users can update their own interview requests';
COMMENT ON POLICY "Users can delete their own interview requests" ON public.interview_request IS 'Users can delete their own interview requests';
