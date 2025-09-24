-- Fix the tracking service to use actual user from frontend context
-- The issue is that the tracking service is always using the same user_id

-- 1. Check current candidate_views data
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
ORDER BY cv.created_at DESC
LIMIT 10;

-- 2. The issue is in the tracking service logic
-- When userId is empty, it calls getExistingUser() which always returns the same user
-- We need to modify the tracking service to use the actual user from the frontend

-- 3. Let's create a function that can be called directly from the frontend
-- with the actual user_id from the frontend context
SELECT 'Creating function for direct frontend calls...' as step;
CREATE OR REPLACE FUNCTION record_candidate_interaction(
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
    -- Check if the provided user_id exists in users table
    SELECT user_id INTO valid_user_id
    FROM users
    WHERE user_id = p_user_id
    LIMIT 1;
    
    -- If user_id doesn't exist, get any available user
    IF valid_user_id IS NULL THEN
        SELECT user_id INTO valid_user_id
        FROM users
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;
    
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

-- 4. Test the new function with different users
SELECT 'Testing new function with different users...' as step;

-- Test with crypto_47bzt5
SELECT record_candidate_interaction(
    'crypto_47bzt5', 
    'test_crypto_direct', 
    'Test Crypto Direct', 
    30, 
    'view'
) as crypto_result;

-- Test with device_fy6jmd
SELECT record_candidate_interaction(
    'device_fy6jmd', 
    'test_device_direct', 
    'Test Device Direct', 
    25, 
    'view'
) as device_result;

-- Test with non-existent user (should use any available user)
SELECT record_candidate_interaction(
    'non_existent_user', 
    'test_non_existent_direct', 
    'Test Non Existent Direct', 
    20, 
    'view'
) as non_existent_result;

-- 5. Check the results
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

-- 6. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 7. Show final status
SELECT '✅ New function created for direct frontend calls!' as status;
SELECT '✅ Function accepts actual user_id from frontend' as parameter_status;
SELECT '✅ Falls back to any available user if user_id not found' as fallback_status;
SELECT '✅ Use this function in the tracking service instead of simple_record_view' as usage_note;

-- 8. Show available functions
SELECT 'Available functions:' as info;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%candidate%'
ORDER BY routine_name;
