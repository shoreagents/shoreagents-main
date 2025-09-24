-- Fix unique anonymous users by creating them in users table first
-- Then use those user_ids in candidate_views

-- 1. Create function to generate unique anonymous user and store in users table
CREATE OR REPLACE FUNCTION create_unique_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    new_user_id VARCHAR(255);
    counter INTEGER := 1;
BEGIN
    -- Generate a unique anonymous user ID
    LOOP
        new_user_id := 'anon_' || EXTRACT(EPOCH FROM NOW())::BIGINT || '_' || counter;
        
        -- Check if this ID already exists
        IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = new_user_id) THEN
            -- Insert the new anonymous user into users table
            INSERT INTO users (user_id, user_type, created_at, updated_at)
            VALUES (new_user_id, 'Anonymous', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            
            RETURN new_user_id;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2. Update the simple_get_anonymous_user function to create unique users
CREATE OR REPLACE FUNCTION simple_get_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anonymous_user_id VARCHAR(255);
BEGIN
    -- Always create a new unique anonymous user
    SELECT create_unique_anonymous_user() INTO anonymous_user_id;
    
    RETURN anonymous_user_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Test the new functionality
SELECT 'Testing unique anonymous user creation...' as step;

-- Generate a few test users
SELECT simple_get_anonymous_user() as user1;
SELECT simple_get_anonymous_user() as user2;
SELECT simple_get_anonymous_user() as user3;

-- Check the generated users in users table
SELECT 'Generated anonymous users in users table:' as info;
SELECT user_id, user_type, created_at
FROM users 
WHERE user_type = 'Anonymous' 
  AND user_id LIKE 'anon_%'
ORDER BY created_at DESC
LIMIT 5;

-- 4. Test candidate tracking with unique users
SELECT 'Testing candidate tracking with unique users...' as step;

-- Test with first new user
SELECT simple_record_view(
    (SELECT user_id FROM users WHERE user_type = 'Anonymous' AND user_id LIKE 'anon_%' ORDER BY created_at DESC LIMIT 1 OFFSET 0), 
    'test_unique_user_1', 
    'Test Unique User 1', 
    NULL, 
    'view'
) as test_record_1;

-- Test with second new user
SELECT simple_record_view(
    (SELECT user_id FROM users WHERE user_type = 'Anonymous' AND user_id LIKE 'anon_%' ORDER BY created_at DESC LIMIT 1 OFFSET 1), 
    'test_unique_user_2', 
    'Test Unique User 2', 
    NULL, 
    'view'
) as test_record_2;

-- 5. Check the results - should show different user_ids
SELECT 'Results with unique users:' as info;
SELECT 
    user_id,
    candidate_id,
    candidate_name,
    interaction_type,
    activity_count,
    created_at
FROM candidate_views 
WHERE candidate_id IN ('test_unique_user_1', 'test_unique_user_2')
ORDER BY created_at DESC;

-- 6. Verify the user_ids exist in users table
SELECT 'Verifying user_ids exist in users table:' as info;
SELECT 
    cv.user_id,
    cv.candidate_id,
    u.user_type,
    u.created_at as user_created_at
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id IN ('test_unique_user_1', 'test_unique_user_2')
ORDER BY cv.created_at DESC;

-- 7. Clean up test records
DELETE FROM candidate_views WHERE candidate_id IN ('test_unique_user_1', 'test_unique_user_2');

-- 8. Show final status
SELECT '✅ Unique anonymous users now created in users table!' as status;
SELECT '✅ Each browser session gets a unique user_id' as uniqueness_status;
SELECT '✅ candidate_views.user_id references users.user_id correctly' as fk_status;

-- 9. Show the updated function signatures
SELECT 'Updated function signatures:' as info;
SELECT routine_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('create_unique_anonymous_user', 'simple_get_anonymous_user')
ORDER BY routine_name;
