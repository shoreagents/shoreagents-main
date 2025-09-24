-- Check candidate_views table permissions and RLS policies
-- Debug why data is not being saved

-- 1. Check if RLS is enabled on candidate_views
SELECT 'Checking RLS status...' as step;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'candidate_views';

-- 2. Check RLS policies on candidate_views
SELECT 'Checking RLS policies...' as step;
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'candidate_views';

-- 3. Check table permissions
SELECT 'Checking table permissions...' as step;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public';

-- 4. Check if there are any constraints blocking inserts
SELECT 'Checking constraints...' as step;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.table_name = 'candidate_views'
  AND tc.table_schema = 'public';

-- 5. Check if the functions exist and are accessible
SELECT 'Checking function existence...' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE 'simple_%'
ORDER BY routine_name;

-- 6. Test basic table access
SELECT 'Testing basic table access...' as step;
SELECT COUNT(*) as total_records FROM candidate_views;

-- 7. Show current user and permissions
SELECT 'Current user and permissions...' as step;
SELECT current_user as current_user;
SELECT session_user as session_user;

-- 8. Show final status
SELECT '✅ Permission check complete!' as status;
SELECT 'Check the results above for any blocking policies or permission issues' as note;
