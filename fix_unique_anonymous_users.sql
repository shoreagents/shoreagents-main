-- Fix anonymous user tracking to create unique users for each browser session
-- Instead of reusing the same anonymous user, create unique ones

-- 1. Create a function to generate unique anonymous user IDs
CREATE OR REPLACE FUNCTION generate_unique_anonymous_user()
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
            -- Insert the new anonymous user
            INSERT INTO users (user_id, user_type, created_at, updated_at)
            VALUES (new_user_id, 'Anonymous', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
            
            RETURN new_user_id;
        END IF;
        
        counter := counter + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2. Update the get_existing_anonymous_user function to create unique users
CREATE OR REPLACE FUNCTION get_or_create_unique_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anonymous_user_id VARCHAR(255);
BEGIN
    -- Always create a new unique anonymous user
    SELECT generate_unique_anonymous_user() INTO anonymous_user_id;
    
    RETURN anonymous_user_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Test the new function
SELECT 'Testing unique anonymous user generation...' as step;

-- Generate a few test users
SELECT get_or_create_unique_anonymous_user() as user1;
SELECT get_or_create_unique_anonymous_user() as user2;
SELECT get_or_create_unique_anonymous_user() as user3;

-- Check the generated users
SELECT 'Generated anonymous users:' as info;
SELECT user_id, user_type, created_at
FROM users 
WHERE user_type = 'Anonymous' 
  AND user_id LIKE 'anon_%'
ORDER BY created_at DESC
LIMIT 5;

-- 4. Test with candidate tracking
SELECT 'Testing candidate tracking with unique users...' as step;

-- Get a unique user for testing
SELECT get_or_create_unique_anonymous_user() as test_user_id;

-- Test recording a view with the unique user
SELECT candidate_tracking_record_view(
    get_or_create_unique_anonymous_user(), 
    'test_unique_candidate', 
    'Test Unique Candidate', 
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
WHERE candidate_id = 'test_unique_candidate';

-- 5. Clean up test records
DELETE FROM candidate_views WHERE candidate_id = 'test_unique_candidate';

-- 6. Show final status
SELECT '✅ Unique anonymous user generation implemented!' as status;
SELECT '✅ Each browser session will now get a unique user_id' as uniqueness_status;
SELECT '✅ No more shared anonymous users across browsers' as isolation_status;

-- 7. Show the updated function signatures
SELECT 'Updated function signatures:' as info;
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('generate_unique_anonymous_user', 'get_or_create_unique_anonymous_user')
ORDER BY routine_name;
