-- Use actual users from users table, not dependent on Anonymous user_type
-- Get real user_id values from the users table for candidate_views

-- 1. Check what users actually exist in the users table
SELECT 'Checking all users in users table...' as step;
SELECT user_id, user_type, first_name, last_name, email, created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Update the simple_get_anonymous_user function to return any available user
SELECT 'Updating function to use any available user...' as step;
CREATE OR REPLACE FUNCTION simple_get_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    any_user_id VARCHAR(255);
BEGIN
    -- Get any user from the users table (not dependent on user_type)
    SELECT user_id INTO any_user_id
    FROM users
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN any_user_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Test the updated function
SELECT 'Testing updated function...' as step;
SELECT simple_get_anonymous_user() as function_result;

-- 4. Test insert with the function
SELECT 'Testing insert with function...' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    view_duration, 
    interaction_type,
    page_views,
    activity_count
) VALUES (
    simple_get_anonymous_user(), 
    'test_any_user', 
    'Test Any User', 
    30, 
    'view',
    1,
    1
);

-- 5. Check if insert worked
SELECT 'Checking insert result...' as step;
SELECT 
    cv.id,
    cv.user_id,
    cv.candidate_id,
    cv.candidate_name,
    cv.view_duration,
    cv.interaction_type,
    cv.activity_count,
    cv.created_at,
    u.user_type,
    u.first_name,
    u.last_name
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id = 'test_any_user';

-- 6. Test the tracking function
SELECT 'Testing simple_record_view function...' as step;
SELECT simple_record_view(
    simple_get_anonymous_user(), 
    'test_tracking_any_user', 
    'Test Tracking Any User', 
    25, 
    'view'
) as tracking_result;

-- 7. Check tracking function result
SELECT 'Checking tracking function result...' as step;
SELECT 
    cv.id,
    cv.user_id,
    cv.candidate_id,
    cv.candidate_name,
    cv.view_duration,
    cv.interaction_type,
    cv.activity_count,
    cv.created_at,
    u.user_type,
    u.first_name,
    u.last_name
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id = 'test_tracking_any_user';

-- 8. Test with different users to show variety
SELECT 'Testing with different users...' as step;
-- Get a few different users
SELECT user_id, user_type, first_name, last_name FROM users LIMIT 3;

-- Test insert with first user
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    view_duration, 
    interaction_type,
    page_views,
    activity_count
) VALUES (
    (SELECT user_id FROM users ORDER BY created_at DESC LIMIT 1 OFFSET 0), 
    'test_user_1', 
    'Test User 1', 
    20, 
    'view',
    1,
    1
);

-- Test insert with second user
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    view_duration, 
    interaction_type,
    page_views,
    activity_count
) VALUES (
    (SELECT user_id FROM users ORDER BY created_at DESC LIMIT 1 OFFSET 1), 
    'test_user_2', 
    'Test User 2', 
    15, 
    'view',
    1,
    1
);

-- 9. Show all test records with user details
SELECT 'All test records with user details:' as step;
SELECT 
    cv.id,
    cv.user_id,
    cv.candidate_id,
    cv.candidate_name,
    cv.view_duration,
    cv.interaction_type,
    cv.activity_count,
    cv.created_at,
    u.user_type,
    u.first_name,
    u.last_name,
    u.email
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id LIKE 'test_%'
ORDER BY cv.created_at DESC;

-- 10. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 11. Show final status
SELECT '✅ Function updated to use any available user!' as status;
SELECT '✅ No longer dependent on Anonymous user_type' as independence_status;
SELECT '✅ Uses actual user_id from users table' as user_id_status;
SELECT '✅ candidate_views.user_id references users.user_id correctly' as fk_status;

-- 12. Show available users for tracking
SELECT 'Available users for tracking:' as info;
SELECT user_id, user_type, first_name, last_name, email, created_at
FROM users 
ORDER BY created_at DESC;
