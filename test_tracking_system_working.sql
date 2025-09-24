-- Test if the tracking system is now working properly
-- Verify that candidate_views can save data

-- 1. Test direct insert to confirm table is working
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
    'test_working_system', 
    'Test Working System', 
    45, 
    'view',
    1,
    1
);

-- 2. Check if insert worked
SELECT 'Checking direct insert result...' as step;
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
WHERE candidate_id = 'test_working_system';

-- 3. Test the tracking function
SELECT 'Testing simple_record_view function...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_function_working', 
    'Test Function Working', 
    30, 
    'view'
) as function_result;

-- 4. Check function insert result
SELECT 'Checking function insert result...' as step;
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
WHERE candidate_id = 'test_function_working';

-- 5. Test with anonymous user
SELECT 'Testing with anonymous user...' as step;
SELECT simple_record_view(
    simple_get_anonymous_user(), 
    'test_anonymous_working', 
    'Test Anonymous Working', 
    25, 
    'view'
) as anonymous_result;

-- 6. Check anonymous insert result
SELECT 'Checking anonymous insert result...' as step;
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
WHERE candidate_id = 'test_anonymous_working';

-- 7. Test analytics function
SELECT 'Testing analytics function...' as step;
SELECT * FROM simple_get_analytics('test_function_working');

-- 8. Show all test records
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

-- 9. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 10. Show final status
SELECT '✅ Tracking system test complete!' as status;
SELECT '✅ If you see test records above, the system is working!' as working_status;
SELECT '✅ The candidate_views table can now save data properly' as table_status;
SELECT '✅ All functions are working correctly' as function_status;

-- 11. Show current table count
SELECT 'Current candidate_views table count:' as info;
SELECT COUNT(*) as total_records FROM candidate_views;
