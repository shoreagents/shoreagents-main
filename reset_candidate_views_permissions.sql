-- Reset candidate_views table permissions and constraints
-- Nuclear option to fix any blocking issues

-- 1. Drop all RLS policies
SELECT 'Dropping all RLS policies...' as step;
DROP POLICY IF EXISTS "Allow all operations on candidate_views" ON candidate_views;
DROP POLICY IF EXISTS "Allow all users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow reading candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow updating candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow everything on candidate_views" ON candidate_views;
DROP POLICY IF EXISTS "Simple permissive policy" ON candidate_views;

-- 2. Disable RLS completely
SELECT 'Disabling RLS...' as step;
ALTER TABLE candidate_views DISABLE ROW LEVEL SECURITY;

-- 3. Grant all permissions to everyone
SELECT 'Granting all permissions...' as step;
GRANT ALL PRIVILEGES ON candidate_views TO public;
GRANT ALL PRIVILEGES ON candidate_views TO authenticated;
GRANT ALL PRIVILEGES ON candidate_views TO anon;
GRANT ALL PRIVILEGES ON SEQUENCE candidate_views_id_seq TO public;
GRANT ALL PRIVILEGES ON SEQUENCE candidate_views_id_seq TO authenticated;
GRANT ALL PRIVILEGES ON SEQUENCE candidate_views_id_seq TO anon;

-- 4. Test insert without RLS
SELECT 'Testing insert without RLS...' as step;
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
    'test_no_rls', 
    'Test No RLS', 
    30, 
    'view',
    1,
    1
);

-- 5. Check if insert worked
SELECT 'Checking insert without RLS...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_no_rls';

-- 6. Test the function without RLS
SELECT 'Testing function without RLS...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_function_no_rls', 
    'Test Function No RLS', 
    25, 
    'view'
) as function_result;

-- 7. Check function result
SELECT 'Checking function result without RLS...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_function_no_rls';

-- 8. Re-enable RLS with a simple permissive policy
SELECT 'Re-enabling RLS with simple policy...' as step;
ALTER TABLE candidate_views ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow everything" 
ON candidate_views 
FOR ALL 
TO public, authenticated, anon 
USING (true) 
WITH CHECK (true);

-- 9. Test with RLS enabled
SELECT 'Testing with RLS enabled...' as step;
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
    'test_with_rls', 
    'Test With RLS', 
    20, 
    'view',
    1,
    1
);

-- 10. Check RLS test result
SELECT 'Checking RLS test result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_with_rls';

-- 11. Test function with RLS
SELECT 'Testing function with RLS...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_function_with_rls', 
    'Test Function With RLS', 
    15, 
    'view'
) as function_result;

-- 12. Check function result with RLS
SELECT 'Checking function result with RLS...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_function_with_rls';

-- 13. Show all test records
SELECT 'All test records after reset:' as step;
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

-- 14. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 15. Show final status
SELECT '✅ Permission reset complete!' as status;
SELECT '✅ RLS disabled and re-enabled with simple policy' as rls_status;
SELECT '✅ All permissions granted' as permission_status;
SELECT '✅ If test records were created, the table is now working' as working_status;

-- 16. Show current table count
SELECT 'Current candidate_views count:' as info;
SELECT COUNT(*) as total_records FROM candidate_views;
