-- Simple fix for content_views permissions
-- This addresses the "permission denied for table content_views" error

-- 1. Grant basic permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_views TO authenticated;

-- 2. Grant basic permissions to anon users (for anonymous tracking)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_views TO anon;

-- 3. Grant usage on the sequence (if using serial/auto-increment)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. Disable RLS temporarily to test (you can enable it later with proper policies)
ALTER TABLE public.content_views DISABLE ROW LEVEL SECURITY;

-- 5. Verify the permissions
SELECT 
    'Permission Check' as test_type,
    schemaname,
    tablename,
    tableowner,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'content_views';

SELECT '✅ Simple content views permissions fixed!' as status;
