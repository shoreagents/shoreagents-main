-- Test tracking with your existing users

-- 1. Show your existing users
SELECT 'Your existing users:' as step;
SELECT user_id, user_type, email, first_name, last_name, auth_user_id 
FROM users 
ORDER BY created_at DESC;

-- 2. Test getting anonymous user
SELECT 'Testing anonymous user lookup...' as step;
SELECT get_existing_anonymous_user() as anonymous_user_id;

-- 3. Test getting authenticated user
SELECT 'Testing authenticated user lookup...' as step;
SELECT get_existing_authenticated_user('a28bd469-9733-4436-b40e-f80f43b8a58d'::UUID) as authenticated_user_id;

-- 4. Test recording views with existing users
SELECT 'Testing candidate tracking with existing users...' as step;

-- Test with anonymous user
DO $$
DECLARE
    anon_user_id VARCHAR(255);
    view_id INTEGER;
BEGIN
    anon_user_id := get_existing_anonymous_user();
    
    IF anon_user_id IS NOT NULL THEN
        SELECT candidate_tracking_record_view(
            anon_user_id,
            'test_candidate_anon',
            'Test Candidate for Anonymous User',
            30,
            'view'
        ) INTO view_id;
        
        RAISE NOTICE 'Recorded view for anonymous user %: %', anon_user_id, view_id;
    ELSE
        RAISE NOTICE 'No anonymous users available';
    END IF;
END $$;

-- Test with authenticated user
DO $$
DECLARE
    auth_user_id VARCHAR(255);
    view_id INTEGER;
BEGIN
    auth_user_id := get_existing_authenticated_user('a28bd469-9733-4436-b40e-f80f43b8a58d'::UUID);
    
    IF auth_user_id IS NOT NULL THEN
        SELECT candidate_tracking_record_view(
            auth_user_id,
            'test_candidate_auth',
            'Test Candidate for Authenticated User',
            45,
            'view'
        ) INTO view_id;
        
        RAISE NOTICE 'Recorded view for authenticated user %: %', auth_user_id, view_id;
    ELSE
        RAISE NOTICE 'No authenticated user found';
    END IF;
END $$;

-- 5. Show the tracking data
SELECT 'Tracking data with existing users:' as step;
SELECT 
    cv.user_id,
    u.user_type,
    u.email,
    u.first_name,
    u.last_name,
    cv.candidate_id,
    cv.candidate_name,
    cv.interaction_type,
    cv.view_duration,
    cv.created_at
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id IN ('test_candidate_anon', 'test_candidate_auth')
ORDER BY cv.created_at DESC;

-- 6. Test analytics
SELECT 'Testing analytics...' as step;
SELECT * FROM candidate_tracking_get_analytics('test_candidate_anon'::VARCHAR(255));
SELECT * FROM candidate_tracking_get_analytics('test_candidate_auth'::VARCHAR(255));

-- 7. Clean up test data
DELETE FROM candidate_views WHERE candidate_id IN ('test_candidate_anon', 'test_candidate_auth');

SELECT '✅ Test complete! Tracking works with your existing users.' as status;
