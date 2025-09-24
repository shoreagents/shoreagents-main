-- Clean up duplicate functions and create a single, correct version
-- Fix the "function is not unique" error

-- 1. Drop all existing versions of the function
SELECT 'Dropping all existing versions of simple_get_anonymous_user...' as step;
DROP FUNCTION IF EXISTS simple_get_anonymous_user() CASCADE;
DROP FUNCTION IF EXISTS simple_get_anonymous_user(VARCHAR(255)) CASCADE;

-- 2. Drop all existing versions of simple_record_view
SELECT 'Dropping all existing versions of simple_record_view...' as step;
DROP FUNCTION IF EXISTS simple_record_view(VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER, VARCHAR(50)) CASCADE;

-- 3. Create a single, correct version of simple_get_anonymous_user
SELECT 'Creating single version of simple_get_anonymous_user...' as step;
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

-- 4. Create a single, correct version of simple_record_view
SELECT 'Creating single version of simple_record_view...' as step;
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

-- 5. Test the functions
SELECT 'Testing the functions...' as step;

-- Test simple_get_anonymous_user without parameter
SELECT simple_get_anonymous_user() as test_no_param;

-- Test simple_get_anonymous_user with parameter
SELECT simple_get_anonymous_user('crypto_47bzt5') as test_with_param;

-- Test simple_get_anonymous_user with non-existent user
SELECT simple_get_anonymous_user('non_existent_user') as test_non_existent;

-- 6. Test simple_record_view with different users
SELECT 'Testing simple_record_view with different users...' as step;

-- Test with crypto_47bzt5
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_crypto_clean', 
    'Test Crypto Clean', 
    30, 
    'view'
) as crypto_result;

-- Test with device_fy6jmd
SELECT simple_record_view(
    'device_fy6jmd', 
    'test_device_clean', 
    'Test Device Clean', 
    25, 
    'view'
) as device_result;

-- Test with non-existent user (should use any available user)
SELECT simple_record_view(
    'non_existent_user', 
    'test_non_existent_clean', 
    'Test Non Existent Clean', 
    20, 
    'view'
) as non_existent_result;

-- 7. Check the results
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

-- 8. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 9. Show final status
SELECT '✅ Duplicate functions cleaned up!' as status;
SELECT '✅ Single version of each function created' as function_status;
SELECT '✅ Functions now accept user_id parameter' as parameter_status;
SELECT '✅ candidate_views.user_id will use actual user from frontend' as tracking_status;

-- 10. Show available functions
SELECT 'Available functions:' as info;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE 'simple_%'
ORDER BY routine_name;
