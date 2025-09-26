-- Debug candidate_views table issue with anonymous users
-- This script helps identify why anonymous users aren't saving to candidate_views

-- 1. Check current users in the users table
SELECT 'Current users in users table:' as step;
SELECT 
    user_id, 
    user_type, 
    first_name, 
    last_name, 
    email,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 10;

-- 2. Check recent candidate_views records
SELECT 'Recent candidate_views records:' as step;
SELECT 
    id,
    user_id,
    candidate_id,
    candidate_name,
    interaction_type,
    created_at
FROM candidate_views 
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Check for foreign key constraint violations
SELECT 'Checking for orphaned candidate_views (should be empty if FK is working):' as step;
SELECT 
    cv.user_id,
    cv.candidate_id,
    cv.created_at
FROM candidate_views cv
LEFT JOIN users u ON cv.user_id = u.user_id
WHERE u.user_id IS NULL;

-- 4. Check if anonymous users are being created properly
SELECT 'Anonymous users created in last 24 hours:' as step;
SELECT 
    user_id,
    user_type,
    created_at
FROM users 
WHERE user_type = 'Anonymous' 
  AND created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;

-- 5. Test the user creation trigger
SELECT 'Testing user creation on page visit...' as step;
-- This will test if the trigger works
INSERT INTO user_page_visits (user_id, page_path) 
VALUES ('test_device_123', '/test-page')
ON CONFLICT DO NOTHING;

-- 6. Check if the test user was created
SELECT 'Checking if test user was created:' as step;
SELECT 
    user_id,
    user_type,
    created_at
FROM users 
WHERE user_id = 'test_device_123';

-- 7. Test inserting into candidate_views with the test user
SELECT 'Testing candidate_views insert with test user:' as step;
INSERT INTO candidate_views (
    user_id,
    candidate_id,
    candidate_name,
    interaction_type
) VALUES (
    'test_device_123',
    'test_candidate_456',
    'Test Candidate',
    'view'
) RETURNING id, user_id, candidate_id;

-- 8. Check the result
SELECT 'Checking if candidate_views record was created:' as step;
SELECT 
    id,
    user_id,
    candidate_id,
    candidate_name,
    created_at
FROM candidate_views 
WHERE user_id = 'test_device_123';

-- 9. Clean up test data
DELETE FROM candidate_views WHERE user_id = 'test_device_123';
DELETE FROM user_page_visits WHERE user_id = 'test_device_123';
DELETE FROM users WHERE user_id = 'test_device_123';

-- 10. Check the trigger function
SELECT 'Checking create_user_on_page_visit function:' as step;
SELECT 
    routine_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'create_user_on_page_visit';

-- 11. Check if the trigger exists
SELECT 'Checking if trigger exists:' as step;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_create_user_on_page_visit';
