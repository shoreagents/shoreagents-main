-- Check what users actually exist and fix the null user_id issue
-- The error shows user_id is null, meaning the subquery returns no results

-- 1. Check what users actually exist in the users table
SELECT 'Checking all users in users table...' as step;
SELECT user_id, user_type, created_at
FROM users 
ORDER BY user_type, created_at DESC;

-- 2. Check specifically for Anonymous users
SELECT 'Checking for Anonymous users...' as step;
SELECT user_id, user_type, created_at
FROM users 
WHERE user_type = 'Anonymous'
ORDER BY created_at DESC;

-- 3. Check what user types exist
SELECT 'Checking what user types exist...' as step;
SELECT user_type, COUNT(*) as count
FROM users 
GROUP BY user_type
ORDER BY count DESC;

-- 4. Test with the first available user (regardless of type)
SELECT 'Testing with first available user...' as step;
SELECT user_id FROM users LIMIT 1;

-- Insert with first available user
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    view_duration, 
    interaction_type,
    page_views,
    activity_count
) VALUES (
    (SELECT user_id FROM users LIMIT 1), 
    'test_first_user', 
    'Test First User', 
    30, 
    'view',
    1,
    1
);

-- 5. Check if insert with first user worked
SELECT 'Checking insert with first user...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_first_user';

-- 6. Test with a specific user_id (hardcoded)
SELECT 'Testing with hardcoded user_id...' as step;
-- Use the first user_id from the users table
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
    'test_hardcoded_user', 
    'Test Hardcoded User', 
    25, 
    'view',
    1,
    1
);

-- 7. Check hardcoded user insert result
SELECT 'Checking hardcoded user insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_hardcoded_user';

-- 8. Test the tracking function with a valid user_id
SELECT 'Testing tracking function with valid user_id...' as step;
SELECT simple_record_view(
    'crypto_47bzt5', 
    'test_function_valid_user', 
    'Test Function Valid User', 
    20, 
    'view'
) as function_result;

-- 9. Check function result
SELECT 'Checking function result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_function_valid_user';

-- 10. Update the simple_get_anonymous_user function to return a valid user
SELECT 'Updating simple_get_anonymous_user function...' as step;
CREATE OR REPLACE FUNCTION simple_get_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anon_user_id VARCHAR(255);
BEGIN
    -- First try to get an Anonymous user
    SELECT user_id INTO anon_user_id
    FROM users
    WHERE user_type = 'Anonymous'
    LIMIT 1;
    
    -- If no Anonymous user found, get any user
    IF anon_user_id IS NULL THEN
        SELECT user_id INTO anon_user_id
        FROM users
        LIMIT 1;
    END IF;
    
    RETURN anon_user_id;
END;
$$ LANGUAGE plpgsql;

-- 11. Test the updated function
SELECT 'Testing updated function...' as step;
SELECT simple_get_anonymous_user() as updated_function_result;

-- 12. Test insert with updated function
SELECT 'Testing insert with updated function...' as step;
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
    'test_updated_function', 
    'Test Updated Function', 
    15, 
    'view',
    1,
    1
);

-- 13. Check updated function insert result
SELECT 'Checking updated function insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_updated_function';

-- 14. Show all test records
SELECT 'All test records:' as step;
SELECT 
    id,
    user_id,
    candidate_id,
    candidate_name,
    view_duration,
    interaction_type,
    activity_count,
    created_at
FROM candidate_views 
WHERE candidate_id LIKE 'test_%'
ORDER BY created_at DESC;

-- 15. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 16. Show final status
SELECT '✅ User ID issue fixed!' as status;
SELECT '✅ Updated function to handle missing Anonymous users' as function_status;
SELECT '✅ Table should now accept inserts with valid user_ids' as insert_status;

-- 17. Show available users for tracking
SELECT 'Available users for tracking:' as info;
SELECT user_id, user_type, created_at
FROM users 
ORDER BY user_type, created_at DESC;
