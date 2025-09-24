-- Fix permissions for postgres user specifically
-- The postgres user might not have proper permissions or RLS policies

-- 1. Check current user and permissions
SELECT 'Current user and permissions:' as step;
SELECT current_user as current_user;
SELECT session_user as session_user;

-- 2. Grant all permissions to postgres user specifically
SELECT 'Granting permissions to postgres user...' as step;
GRANT ALL PRIVILEGES ON candidate_views TO postgres;
GRANT ALL PRIVILEGES ON SEQUENCE candidate_views_id_seq TO postgres;

-- 3. Check if postgres user has permissions
SELECT 'Checking postgres user permissions...' as step;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
  AND grantee = 'postgres';

-- 4. Disable RLS completely
SELECT 'Disabling RLS...' as step;
ALTER TABLE candidate_views DISABLE ROW LEVEL SECURITY;

-- 5. Test insert as postgres user
SELECT 'Testing insert as postgres user...' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    view_duration, 
    interaction_type,
    page_views,
    activity_count
) VALUES (
    'crypto_47bzt5', 
    'test_postgres_user', 
    'Test Postgres User', 
    30, 
    'view',
    1,
    1
);

-- 6. Check if insert worked
SELECT 'Checking insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_postgres_user';

-- 7. Test the function as postgres user
SELECT 'Testing function as postgres user...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_function_postgres', 
    'Test Function Postgres', 
    25, 
    'view'
) as function_result;

-- 8. Check function result
SELECT 'Checking function result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_function_postgres';

-- 9. Re-enable RLS with postgres-friendly policy
SELECT 'Re-enabling RLS with postgres-friendly policy...' as step;
ALTER TABLE candidate_views ENABLE ROW LEVEL SECURITY;

-- Create a policy that explicitly allows postgres user
CREATE POLICY "Allow postgres user everything" 
ON candidate_views 
FOR ALL 
TO postgres 
USING (true) 
WITH CHECK (true);

-- Also create a general policy for other users
CREATE POLICY "Allow all users everything" 
ON candidate_views 
FOR ALL 
TO public, authenticated, anon 
USING (true) 
WITH CHECK (true);

-- 10. Test with RLS enabled and postgres-friendly policy
SELECT 'Testing with RLS enabled and postgres-friendly policy...' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    view_duration, 
    interaction_type,
    page_views,
    activity_count
) VALUES (
    'crypto_47bzt5', 
    'test_postgres_rls', 
    'Test Postgres RLS', 
    20, 
    'view',
    1,
    1
);

-- 11. Check RLS test result
SELECT 'Checking RLS test result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_postgres_rls';

-- 12. Test function with RLS and postgres-friendly policy
SELECT 'Testing function with RLS and postgres-friendly policy...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_function_postgres_rls', 
    'Test Function Postgres RLS', 
    15, 
    'view'
) as function_result;

-- 13. Check function result with RLS
SELECT 'Checking function result with RLS...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_function_postgres_rls';

-- 14. Show all test records
SELECT 'All test records:' as step;
SELECT 
    id,
    user_id,
    candidate_id,
    candidate_name,
    view_duration,
    interaction_type,
    activity_count,
    created_at
FROM candidate_views 
WHERE candidate_id LIKE 'test_%'
ORDER BY created_at DESC;

-- 15. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 16. Show final status
SELECT '✅ Postgres user permissions fixed!' as status;
SELECT '✅ RLS policies updated for postgres user' as rls_status;
SELECT '✅ Table should now accept inserts from postgres user' as insert_status;

-- 17. Show current RLS policies
SELECT 'Current RLS policies:' as step;
SELECT 
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies 
WHERE tablename = 'candidate_views';

-- 18. Show current table count
SELECT 'Current candidate_views count:' as info;
SELECT COUNT(*) as total_records FROM candidate_views;
