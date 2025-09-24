-- Test if the tracking service is actually calling the database functions
-- This will help identify if the issue is in the frontend or database

-- 1. Create a simple test function that logs when it's called
CREATE OR REPLACE FUNCTION test_tracking_call(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL
)
RETURNS TEXT AS $$
BEGIN
    -- Insert a test record to prove the function was called
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        p_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        999, 
        'test_call',
        1,
        1
    );
    
    RETURN 'Function called successfully at ' || CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- 2. Test the function directly
SELECT 'Testing tracking call function...' as step;
SELECT test_tracking_call('crypto_47bzt5', 'test_tracking_call', 'Test Tracking Call') as result;

-- 3. Check if the test record was created
SELECT 'Checking if test record was created...' as step;
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
WHERE candidate_id = 'test_tracking_call';

-- 4. Test the actual simple_record_view function
SELECT 'Testing simple_record_view function...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_simple_record_view', 
    'Test Simple Record View', 
    30, 
    'view'
) as simple_record_result;

-- 5. Check if simple_record_view worked
SELECT 'Checking simple_record_view result...' as step;
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
WHERE candidate_id = 'test_simple_record_view';

-- 6. Show all test records
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

-- 7. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 8. Drop the test function
DROP FUNCTION IF EXISTS test_tracking_call(VARCHAR(255), VARCHAR(255), VARCHAR(255));

-- 9. Show final status
SELECT '✅ Tracking service test complete!' as status;
SELECT 'If you see test records above, the database functions are working' as db_status;
SELECT 'If no records, the issue is in the database layer' as db_issue;
SELECT 'If records exist but frontend not working, issue is in the frontend' as frontend_issue;
