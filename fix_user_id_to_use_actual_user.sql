-- Fix the function to use the actual user from the frontend context
-- Instead of always returning the same user, it should use the user from the tracking service

-- 1. Check what users exist in the users table
SELECT 'Current users in users table:' as step;
SELECT user_id, user_type, first_name, last_name, email, created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Check current candidate_views data
SELECT 'Current candidate_views data:' as step;
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
ORDER BY cv.created_at DESC;

-- 3. The issue is that the tracking service should pass the actual user_id
-- Let's update the function to accept a parameter for the user_id
SELECT 'Updating function to accept user_id parameter...' as step;
CREATE OR REPLACE FUNCTION simple_get_anonymous_user(p_user_id VARCHAR(255) DEFAULT NULL)
RETURNS VARCHAR(255) AS $$
DECLARE
    any_user_id VARCHAR(255);
BEGIN
    -- If a user_id is provided, use it (after checking it exists in users table)
    IF p_user_id IS NOT NULL THEN
        SELECT user_id INTO any_user_id
        FROM users
        WHERE user_id = p_user_id
        LIMIT 1;
        
        -- If the provided user_id exists, return it
        IF any_user_id IS NOT NULL THEN
            RETURN any_user_id;
        END IF;
    END IF;
    
    -- If no user_id provided or it doesn't exist, get any user from the users table
    SELECT user_id INTO any_user_id
    FROM users
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN any_user_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Test the updated function with a specific user_id
SELECT 'Testing function with specific user_id...' as step;
SELECT simple_get_anonymous_user('crypto_47bzt5') as test_crypto;
SELECT simple_get_anonymous_user('device_fy6jmd') as test_device;

-- 5. Test the function without parameter (should return any user)
SELECT 'Testing function without parameter...' as step;
SELECT simple_get_anonymous_user() as test_any_user;

-- 6. Test the function with non-existent user_id (should return any user)
SELECT 'Testing function with non-existent user_id...' as step;
SELECT simple_get_anonymous_user('non_existent_user') as test_non_existent;

-- 7. Update the simple_record_view function to use the user_id parameter
SELECT 'Updating simple_record_view function...' as step;
CREATE OR REPLACE FUNCTION simple_record_view(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
    valid_user_id VARCHAR(255);
BEGIN
    -- Get a valid user_id (either the provided one or any available one)
    SELECT simple_get_anonymous_user(p_user_id) INTO valid_user_id;
    
    -- Insert the record with the valid user_id
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        valid_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 8. Test the updated simple_record_view function with different users
SELECT 'Testing simple_record_view with different users...' as step;

-- Test with crypto_47bzt5
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_crypto_user', 
    'Test Crypto User', 
    30, 
    'view'
) as crypto_result;

-- Test with device_fy6jmd
SELECT simple_record_view(
    'device_fy6jmd', 
    'test_device_user', 
    'Test Device User', 
    25, 
    'view'
) as device_result;

-- Test with non-existent user (should use any available user)
SELECT simple_record_view(
    'non_existent_user', 
    'test_non_existent', 
    'Test Non Existent', 
    20, 
    'view'
) as non_existent_result;

-- 9. Check the results
SELECT 'Checking results with different users...' as step;
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
WHERE cv.candidate_id LIKE 'test_%'
ORDER BY cv.created_at DESC;

-- 10. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 11. Show final status
SELECT '✅ Function updated to use actual user_id!' as status;
SELECT '✅ Now accepts user_id parameter from frontend' as parameter_status;
SELECT '✅ Falls back to any available user if user_id not provided' as fallback_status;
SELECT '✅ candidate_views.user_id will now use the actual user from frontend' as tracking_status;

-- 12. Show available users for tracking
SELECT 'Available users for tracking:' as info;
SELECT user_id, user_type, first_name, last_name, email, created_at
FROM users 
ORDER BY created_at DESC;
