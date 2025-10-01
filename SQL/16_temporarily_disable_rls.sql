-- Temporarily disable RLS on interview_request table
-- ==================================================

-- Disable RLS to allow inserts
ALTER TABLE public.interview_request DISABLE ROW LEVEL SECURITY;

-- This is a temporary fix to test if RLS is the issue
-- We'll re-enable it with proper policies once we confirm it works
