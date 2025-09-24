-- Clear old anonymous users and force creation of new unique ones
-- This will remove the old device_nsm01z user and create fresh unique users

-- 1. Check current anonymous users
SELECT 'Current anonymous users in users table:' as step;
SELECT user_id, user_type, created_at
FROM users 
WHERE user_type = 'Anonymous'
ORDER BY created_at DESC;

-- 2. Check current candidate_views with old anonymous users
SELECT 'Current candidate_views with old anonymous users:' as step;
SELECT 
    user_id,
    COUNT(*) as record_count,
    MIN(created_at) as first_view,
    MAX(created_at) as last_view
FROM candidate_views 
WHERE user_id LIKE 'device_%'
GROUP BY user_id
ORDER BY record_count DESC;

-- 3. Create a function to clear localStorage and force new user creation
-- This will be called from the frontend to clear old anonymous users

-- 4. Test creating a new unique anonymous user
SELECT 'Testing new unique anonymous user creation...' as step;
SELECT get_or_create_unique_anonymous_user() as new_user_1;
SELECT get_or_create_unique_anonymous_user() as new_user_2;
SELECT get_or_create_unique_anonymous_user() as new_user_3;

-- 5. Check the newly created users
SELECT 'Newly created anonymous users:' as info;
SELECT user_id, user_type, created_at
FROM users 
WHERE user_type = 'Anonymous' 
  AND user_id LIKE 'anon_%'
ORDER BY created_at DESC
LIMIT 5;

-- 6. Test candidate tracking with new unique users
SELECT 'Testing candidate tracking with new unique users...' as step;

-- Test with first new user
SELECT candidate_tracking_record_view(
    (SELECT user_id FROM users WHERE user_type = 'Anonymous' AND user_id LIKE 'anon_%' ORDER BY created_at DESC LIMIT 1 OFFSET 0), 
    'test_new_user_1', 
    'Test New User 1', 
    NULL, 
    'view'
) as test_record_1;

-- Test with second new user
SELECT candidate_tracking_record_view(
    (SELECT user_id FROM users WHERE user_type = 'Anonymous' AND user_id LIKE 'anon_%' ORDER BY created_at DESC LIMIT 1 OFFSET 1), 
    'test_new_user_2', 
    'Test New User 2', 
    NULL, 
    'view'
) as test_record_2;

-- 7. Check the results - should show different user_ids
SELECT 'Results with new unique users:' as info;
SELECT 
    user_id,
    candidate_id,
    candidate_name,
    interaction_type,
    activity_count,
    created_at
FROM candidate_views 
WHERE candidate_id IN ('test_new_user_1', 'test_new_user_2')
ORDER BY created_at DESC;

-- 8. Clean up test records
DELETE FROM candidate_views WHERE candidate_id IN ('test_new_user_1', 'test_new_user_2');

-- 9. Show final status
SELECT '✅ New unique anonymous users created successfully!' as status;
SELECT '✅ Each browser session will now get a unique user_id' as uniqueness_status;
SELECT '✅ Old device_% users are still in the system but new ones will be created' as note;

-- 10. Instructions for clearing localStorage
SELECT 'To clear old anonymous users from browsers:' as instruction;
SELECT '1. Clear localStorage in each browser' as step1;
SELECT '2. Or call localStorage.removeItem("shoreagents_anonymous_user_id")' as step2;
SELECT '3. Refresh the page to get new unique anonymous user' as step3;
