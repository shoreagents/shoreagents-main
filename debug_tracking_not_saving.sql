-- Debug why candidate_views is still not saving data
-- Comprehensive check of all possible issues

-- 1. Check if the table is accessible and has data
SELECT 'Checking table accessibility...' as step;
SELECT COUNT(*) as current_records FROM candidate_views;
SELECT 'Table exists and is accessible' as status;

-- 2. Check if functions exist and are working
SELECT 'Checking function existence...' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE 'simple_%'
ORDER BY routine_name;

-- 3. Test the simple_get_anonymous_user function
SELECT 'Testing simple_get_anonymous_user function...' as step;
SELECT simple_get_anonymous_user() as anonymous_user_result;

-- 4. Test the simple_record_view function with a known user
SELECT 'Testing simple_record_view function...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'debug_test_candidate', 
    'Debug Test Candidate', 
    30, 
    'view'
) as record_view_result;

-- 5. Check if the function insert worked
SELECT 'Checking if function insert worked...' as step;
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
WHERE candidate_id = 'debug_test_candidate';

-- 6. Test direct insert to confirm table works
SELECT 'Testing direct insert...' as step;
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
    'debug_direct_insert', 
    'Debug Direct Insert', 
    25, 
    'view',
    1,
    1
);

-- 7. Check if direct insert worked
SELECT 'Checking if direct insert worked...' as step;
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
WHERE candidate_id = 'debug_direct_insert';

-- 8. Check RLS policies
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

-- 9. Check table permissions
SELECT 'Checking table permissions...' as step;
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public';

-- 10. Check if there are any triggers that might be blocking
SELECT 'Checking triggers...' as step;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'candidate_views';

-- 11. Check foreign key constraint
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

-- 12. Test with a user that definitely exists in users table
SELECT 'Testing with existing user from users table...' as step;
SELECT user_id, user_type FROM users LIMIT 5;

-- Test insert with existing user
SELECT simple_record_view(
    (SELECT user_id FROM users LIMIT 1), 
    'debug_existing_user_test', 
    'Debug Existing User Test', 
    20, 
    'view'
) as existing_user_result;

-- 13. Check if existing user test worked
SELECT 'Checking existing user test result...' as step;
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
WHERE candidate_id = 'debug_existing_user_test';

-- 14. Show all debug test records
SELECT 'All debug test records:' as step;
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
WHERE candidate_id LIKE 'debug_%'
ORDER BY created_at DESC;

-- 15. Clean up debug test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'debug_%';

-- 16. Show final debug summary
SELECT '✅ Debug complete!' as status;
SELECT 'Check the results above to identify the issue' as note;
SELECT 'If no records were inserted, there is still a blocking issue' as warning;
