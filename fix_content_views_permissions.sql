-- Fix permissions for content_views table
-- This addresses the "permission denied for table content_views" error

-- 1. Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_views TO authenticated;

-- 2. Grant necessary permissions to anon users (for anonymous tracking)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_views TO anon;

-- 3. Grant usage on the sequence (if using serial/auto-increment)
-- Note: content_views uses UUID, so this might not be needed, but good to have
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- 4. Enable Row Level Security (RLS) if not already enabled
ALTER TABLE public.content_views ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for content_views
-- Policy for authenticated users - can insert their own data
CREATE POLICY "Users can insert their own content views" ON public.content_views
    FOR INSERT 
    TO authenticated
    WITH CHECK (true); -- Allow all inserts for authenticated users

-- Policy for anonymous users - can insert data
CREATE POLICY "Anonymous users can insert content views" ON public.content_views
    FOR INSERT 
    TO anon
    WITH CHECK (true); -- Allow all inserts for anonymous users

-- Policy for reading data - users can read their own data
CREATE POLICY "Users can read their own content views" ON public.content_views
    FOR SELECT 
    TO authenticated
    USING (true); -- Allow reading for authenticated users

-- Policy for anonymous users to read data
CREATE POLICY "Anonymous users can read content views" ON public.content_views
    FOR SELECT 
    TO anon
    USING (true); -- Allow reading for anonymous users

-- Policy for updating data
CREATE POLICY "Users can update their own content views" ON public.content_views
    FOR UPDATE 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Policy for anonymous users to update data
CREATE POLICY "Anonymous users can update content views" ON public.content_views
    FOR UPDATE 
    TO anon
    USING (true)
    WITH CHECK (true);

-- 6. Verify the permissions
SELECT 
    'Permission Check' as test_type,
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename = 'content_views';

-- 7. Check RLS status
SELECT 
    'RLS Status' as test_type,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'content_views';

-- 8. List all policies on content_views
SELECT 
    'Policy Check' as test_type,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'content_views';

-- 9. Test insert permission (this should work after running the above)
-- Uncomment the line below to test:
-- INSERT INTO public.content_views (content_type, content_id, content_title, page_section) VALUES ('test', 'permission-test', 'Permission Test', 'main');

SELECT '✅ Content views permissions fixed!' as status;
