-- Use only existing users from users table
-- Do not create new users, just use existing ones

-- 1. Update the simple_get_anonymous_user function to only return existing users
CREATE OR REPLACE FUNCTION simple_get_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anon_user_id VARCHAR(255);
BEGIN
    -- Get a random existing anonymous user from users table
    SELECT user_id INTO anon_user_id
    FROM users
    WHERE user_type = 'Anonymous'
    ORDER BY RANDOM()
    LIMIT 1;
    
    RETURN anon_user_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Test the updated function
SELECT 'Testing with existing users only...' as step;

-- Show current users in users table
SELECT 'Current users in users table:' as info;
SELECT user_id, user_type, created_at
FROM users 
ORDER BY user_type, created_at DESC;

-- Test getting anonymous user (should return existing one)
SELECT simple_get_anonymous_user() as existing_anonymous_user;

-- Test getting authenticated user
SELECT simple_get_authenticated_user('a28bd469-9733-4436-b40e-f80f43b8a58d'::UUID) as existing_authenticated_user;

-- 3. Test candidate tracking with existing users
SELECT 'Testing candidate tracking with existing users...' as step;

-- Test with existing anonymous user
SELECT simple_record_view(
    simple_get_anonymous_user(), 
    'test_existing_user', 
    'Test Existing User', 
    NULL, 
    'view'
) as test_record;

-- Check the result
SELECT 
    user_id,
    candidate_id,
    candidate_name,
    interaction_type,
    activity_count,
    created_at
FROM candidate_views 
WHERE candidate_id = 'test_existing_user';

-- 4. Verify the user_id exists in users table
SELECT 'Verifying user_id exists in users table:' as info;
SELECT 
    cv.user_id,
    cv.candidate_id,
    u.user_type,
    u.created_at as user_created_at
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id = 'test_existing_user';

-- 5. Clean up test record
DELETE FROM candidate_views WHERE candidate_id = 'test_existing_user';

-- 6. Show final status
SELECT '✅ Now using only existing users from users table!' as status;
SELECT '✅ No new users will be created' as no_new_users;
SELECT '✅ candidate_views.user_id will only use existing users.user_id' as existing_only;

-- 7. Show available users for tracking
SELECT 'Available users for tracking:' as info;
SELECT user_id, user_type, created_at
FROM users 
ORDER BY user_type, created_at DESC;
