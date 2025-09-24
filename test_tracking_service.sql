-- Test the tracking service functions

-- 1. Test getting existing anonymous user
SELECT 'Testing get_existing_anonymous_user...' as step;
SELECT get_existing_anonymous_user() as anonymous_user_id;

-- 2. Test getting existing authenticated user
SELECT 'Testing get_existing_authenticated_user...' as step;
SELECT get_existing_authenticated_user('a28bd469-9733-4436-b40e-f80f43b8a58d'::UUID) as authenticated_user_id;

-- 3. Test recording a view
SELECT 'Testing candidate_tracking_record_view...' as step;
DO $$
DECLARE
    test_user_id VARCHAR(255);
    view_id INTEGER;
BEGIN
    -- Use an existing anonymous user
    test_user_id := get_existing_anonymous_user();
    
    IF test_user_id IS NOT NULL THEN
        SELECT candidate_tracking_record_view(
            test_user_id,
            'test_candidate_service',
            'Test Candidate for Service',
            30,
            'view'
        ) INTO view_id;
        
        RAISE NOTICE 'Successfully recorded view with ID: % for user: %', view_id, test_user_id;
    ELSE
        RAISE NOTICE 'No anonymous users found';
    END IF;
END $$;

-- 4. Test analytics function
SELECT 'Testing candidate_tracking_get_analytics...' as step;
SELECT * FROM candidate_tracking_get_analytics('test_candidate_service'::VARCHAR(255));

-- 5. Test user viewing history
SELECT 'Testing candidate_tracking_get_user_history...' as step;
DO $$
DECLARE
    test_user_id VARCHAR(255);
BEGIN
    test_user_id := get_existing_anonymous_user();
    
    IF test_user_id IS NOT NULL THEN
        PERFORM * FROM candidate_tracking_get_user_history(test_user_id, 30);
        RAISE NOTICE 'User viewing history test completed for user: %', test_user_id;
    ELSE
        RAISE NOTICE 'No anonymous users found for history test';
    END IF;
END $$;

-- 6. Test top viewed candidates
SELECT 'Testing candidate_tracking_get_top_candidates...' as step;
SELECT * FROM candidate_tracking_get_top_candidates(5, 30);

-- 7. Show all tracking data
SELECT 'All tracking data:' as step;
SELECT 
    cv.user_id,
    u.user_type,
    u.email,
    cv.candidate_id,
    cv.candidate_name,
    cv.interaction_type,
    cv.view_duration,
    cv.created_at
FROM candidate_views cv
LEFT JOIN users u ON cv.user_id = u.user_id
ORDER BY cv.created_at DESC;

-- 8. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_candidate_service';

SELECT '✅ Tracking service test complete!' as status;
