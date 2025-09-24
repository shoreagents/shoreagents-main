-- Comprehensive test to identify why candidate_views is not storing data
-- Test every possible blocking issue

-- 1. Check if we can read from the table
SELECT 'Testing basic table access...' as step;
SELECT COUNT(*) as current_records FROM candidate_views;
SELECT 'Table is accessible' as status;

-- 2. Check current user and permissions
SELECT 'Checking current user...' as step;
SELECT current_user as current_user;
SELECT session_user as session_user;

-- 3. Check RLS status
SELECT 'Checking RLS status...' as step;
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'candidate_views';

-- 4. Check RLS policies
SELECT 'Checking RLS policies...' as step;
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'candidate_views';

-- 5. Check table permissions
SELECT 'Checking table permissions...' as step;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public';

-- 6. Check if functions exist
SELECT 'Checking if functions exist...' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE 'simple_%'
ORDER BY routine_name;

-- 7. Test the simple_get_anonymous_user function
SELECT 'Testing simple_get_anonymous_user function...' as step;
SELECT simple_get_anonymous_user() as function_result;

-- 8. Test direct insert with a known user_id
SELECT 'Testing direct insert with known user_id...' as step;
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
    'test_direct_insert', 
    'Test Direct Insert', 
    30, 
    'view',
    1,
    1
);

-- 9. Check if direct insert worked
SELECT 'Checking direct insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_direct_insert';

-- 10. Test the simple_record_view function
SELECT 'Testing simple_record_view function...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_function_insert', 
    'Test Function Insert', 
    25, 
    'view'
) as function_result;

-- 11. Check if function insert worked
SELECT 'Checking function insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_function_insert';

-- 12. Test with different user_id
SELECT 'Testing with different user_id...' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    view_duration, 
    interaction_type,
    page_views,
    activity_count
) VALUES (
    'device_fy6jmd', 
    'test_device_user', 
    'Test Device User', 
    20, 
    'view',
    1,
    1
);

-- 13. Check different user insert result
SELECT 'Checking different user insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_device_user';

-- 14. Test with minimal data
SELECT 'Testing with minimal data...' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    interaction_type
) VALUES (
    'crypto_47bzt5', 
    'test_minimal', 
    'view'
);

-- 15. Check minimal insert result
SELECT 'Checking minimal insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_minimal';

-- 16. Check all test records
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

-- 17. Check if there are any triggers
SELECT 'Checking triggers...' as step;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'candidate_views';

-- 18. Check foreign key constraint
SELECT 'Checking foreign key constraint...' as step;
SELECT 
    tc.constraint_name,
    tc.constraint_type,
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
  AND tc.constraint_type = 'FOREIGN KEY';

-- 19. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 20. Show final diagnosis
SELECT '✅ Comprehensive test complete!' as status;
SELECT 'Check the results above to identify the blocking issue' as diagnosis;
SELECT 'If no records were inserted, there is a fundamental blocking issue' as warning;
