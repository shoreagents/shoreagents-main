-- Test candidate_views table insert functionality
-- Debug why data is not being saved

-- 1. Check if the table exists and is accessible
SELECT 'Testing candidate_views table access...' as step;
SELECT COUNT(*) as current_records FROM candidate_views;

-- 2. Test direct insert into candidate_views table
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
    'test_direct_insert', 
    'Test Direct Insert', 
    30, 
    'view',
    1,
    1
);

-- 3. Check if the insert worked
SELECT 'Checking direct insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_direct_insert';

-- 4. Test the simple_record_view function
SELECT 'Testing simple_record_view function...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_function_insert', 
    'Test Function Insert', 
    25, 
    'view'
) as function_result;

-- 5. Check if the function insert worked
SELECT 'Checking function insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_function_insert';

-- 6. Test with anonymous user
SELECT 'Testing with anonymous user...' as step;
SELECT simple_get_anonymous_user() as anonymous_user_id;

-- Test insert with anonymous user
SELECT simple_record_view(
    simple_get_anonymous_user(), 
    'test_anonymous_insert', 
    'Test Anonymous Insert', 
    20, 
    'view'
) as anonymous_result;

-- 7. Check anonymous insert result
SELECT 'Checking anonymous insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_anonymous_insert';

-- 8. Check all test records
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
SELECT '✅ Test complete!' as status;
SELECT 'If you see test records above, the table is working' as table_status;
SELECT 'If no records, there might be a permission or constraint issue' as issue_note;
