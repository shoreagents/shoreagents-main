-- Fix interview_request table permissions
-- =====================================

-- Check if RLS is enabled and disable it temporarily
ALTER TABLE public.interview_request DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies that might be causing issues
DROP POLICY IF EXISTS "Allow insert interview requests" ON public.interview_request;
DROP POLICY IF EXISTS "Users can view their own interview requests" ON public.interview_request;
DROP POLICY IF EXISTS "Users can update their own interview requests" ON public.interview_request;
DROP POLICY IF EXISTS "Users can delete their own interview requests" ON public.interview_request;

-- Ensure proper permissions for anon role
GRANT ALL ON TABLE public.interview_request TO anon;
GRANT ALL ON TABLE public.interview_request TO authenticated;
GRANT ALL ON TABLE public.interview_request TO service_role;

-- Grant permissions on the sequence
GRANT ALL ON SEQUENCE public.interview_request_id_seq TO anon;
GRANT ALL ON SEQUENCE public.interview_request_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.interview_request_id_seq TO service_role;

-- Verify the table is accessible
SELECT 
    schemaname, 
    tablename, 
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'interview_request';
