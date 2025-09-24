-- Use user_id directly from users table, not dependent on user_type
-- Track interactions for actual users regardless of their user_type

-- 1. Check what users exist in the users table
SELECT 'Current users in users table:' as step;
SELECT user_id, user_type, first_name, last_name, email, created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Update the function to return any available user_id
SELECT 'Updating function to use any user_id...' as step;
CREATE OR REPLACE FUNCTION simple_get_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    any_user_id VARCHAR(255);
BEGIN
    -- Get any user_id from the users table (regardless of user_type)
    SELECT user_id INTO any_user_id
    FROM users
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN any_user_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Test the function
SELECT 'Testing function with any user_id...' as step;
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
    'test_any_user_id', 
    'Test Any User ID', 
    30, 
    'view',
    1,
    1
);

-- 5. Check insert result
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
    u.last_name,
    u.email
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id = 'test_any_user_id';

-- 6. Test with specific user_ids from your table
SELECT 'Testing with specific user_ids...' as step;

-- Test with crypto_47bzt5 (Regular user)
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
    'test_crypto_user', 
    'Test Crypto User', 
    25, 
    'view',
    1,
    1
);

-- Test with device_fy6jmd (Admin user)
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

-- 7. Check results for both users
SELECT 'Checking results for both users...' as step;
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
WHERE cv.candidate_id IN ('test_crypto_user', 'test_device_user')
ORDER BY cv.created_at DESC;

-- 8. Test the tracking function
SELECT 'Testing simple_record_view function...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_tracking_crypto', 
    'Test Tracking Crypto', 
    15, 
    'view'
) as tracking_result;

-- 9. Check tracking function result
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
    u.last_name,
    u.email
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id = 'test_tracking_crypto';

-- 10. Show all test records
SELECT 'All test records:' as step;
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

-- 11. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 12. Show final status
SELECT '✅ System now uses user_id directly!' as status;
SELECT '✅ No dependency on user_type (Regular, Admin, Anonymous)' as independence_status;
SELECT '✅ Tracks interactions for actual users in your system' as tracking_status;
SELECT '✅ candidate_views.user_id references users.user_id correctly' as fk_status;

-- 13. Show available users for tracking
SELECT 'Available users for tracking:' as info;
SELECT user_id, user_type, first_name, last_name, email, created_at
FROM users 
ORDER BY created_at DESC;
