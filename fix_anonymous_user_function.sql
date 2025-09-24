-- Fix the anonymous user function based on actual users table structure
-- The users table has user_type with enum, default 'Anonymous'

-- 1. Check what users actually exist
SELECT 'Checking all users in users table...' as step;
SELECT user_id, user_type, created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Check what user_type values exist
SELECT 'Checking user_type values...' as step;
SELECT user_type, COUNT(*) as count
FROM users 
GROUP BY user_type
ORDER BY count DESC;

-- 3. Check the user_type enum values
SELECT 'Checking user_type enum values...' as step;
SELECT enumlabel 
FROM pg_enum 
WHERE enumtypid = (
    SELECT oid 
    FROM pg_type 
    WHERE typname = 'user_type_enum'
);

-- 4. Test the current function
SELECT 'Testing current simple_get_anonymous_user function...' as step;
SELECT simple_get_anonymous_user() as current_function_result;

-- 5. Update the function to handle the enum properly
SELECT 'Updating simple_get_anonymous_user function...' as step;
CREATE OR REPLACE FUNCTION simple_get_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anon_user_id VARCHAR(255);
BEGIN
    -- Try to get an Anonymous user (using the enum value)
    SELECT user_id INTO anon_user_id
    FROM users
    WHERE user_type = 'Anonymous'::user_type_enum
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

-- 6. Test the updated function
SELECT 'Testing updated function...' as step;
SELECT simple_get_anonymous_user() as updated_function_result;

-- 7. Test insert with the updated function
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
    30, 
    'view',
    1,
    1
);

-- 8. Check if insert worked
SELECT 'Checking insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_updated_function';

-- 9. Test the tracking function
SELECT 'Testing simple_record_view function...' as step;
SELECT simple_record_view(
    simple_get_anonymous_user(), 
    'test_tracking_function', 
    'Test Tracking Function', 
    25, 
    'view'
) as tracking_result;

-- 10. Check tracking function result
SELECT 'Checking tracking function result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_tracking_function';

-- 11. Test with a specific user_id to make sure the table works
SELECT 'Testing with specific user_id...' as step;
-- Get the first user_id from the table
SELECT user_id FROM users LIMIT 1;

-- Insert with specific user_id
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
    'test_specific_user', 
    'Test Specific User', 
    20, 
    'view',
    1,
    1
);

-- 12. Check specific user insert result
SELECT 'Checking specific user insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_specific_user';

-- 13. Show all test records
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

-- 14. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 15. Show final status
SELECT '✅ Function updated to handle user_type enum!' as status;
SELECT '✅ Table should now accept inserts with valid user_ids' as insert_status;
SELECT '✅ Tracking functions should now work properly' as function_status;

-- 16. Show available users for tracking
SELECT 'Available users for tracking:' as info;
SELECT user_id, user_type, created_at
FROM users 
ORDER BY user_type, created_at DESC;
