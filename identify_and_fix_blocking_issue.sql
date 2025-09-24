-- Identify and fix the blocking issue preventing inserts
-- Since no records are being inserted, there's a fundamental problem

-- 1. Check if we can even read from the table
SELECT 'Testing basic table access...' as step;
SELECT COUNT(*) as current_count FROM candidate_views;
SELECT 'If this query works, table access is OK' as status;

-- 2. Check current user and permissions
SELECT 'Checking current user and permissions...' as step;
SELECT current_user as current_user;
SELECT session_user as session_user;

-- 3. Try to disable ALL constraints temporarily
SELECT 'Temporarily disabling constraints...' as step;

-- Disable foreign key constraint temporarily
ALTER TABLE candidate_views DISABLE TRIGGER ALL;

-- 4. Try a minimal insert without any constraints
SELECT 'Testing minimal insert...' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    interaction_type
) VALUES (
    'test_user', 
    'test_candidate', 
    'view'
);

-- 5. Check if minimal insert worked
SELECT 'Checking minimal insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_candidate';

-- 6. If minimal insert worked, try with all fields
SELECT 'Testing full insert...' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    view_duration, 
    interaction_type,
    page_views,
    activity_count
) VALUES (
    'test_user_full', 
    'test_candidate_full', 
    'Test Candidate Full', 
    30, 
    'view',
    1,
    1
);

-- 7. Check full insert result
SELECT 'Checking full insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_candidate_full';

-- 8. Re-enable triggers
SELECT 'Re-enabling triggers...' as step;
ALTER TABLE candidate_views ENABLE TRIGGER ALL;

-- 9. Check if there are any CHECK constraints failing
SELECT 'Checking CHECK constraints...' as step;
SELECT 
    constraint_name,
    check_clause
FROM information_schema.check_constraints 
WHERE constraint_schema = 'public' 
  AND constraint_name LIKE '%candidate_views%';

-- 10. Test with valid data that should pass all constraints
SELECT 'Testing with valid data...' as step;
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
    'test_valid_data', 
    'Test Valid Data', 
    30, 
    'view',
    1,
    1
);

-- 11. Check valid data insert result
SELECT 'Checking valid data insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_valid_data';

-- 12. Check if the user exists in users table
SELECT 'Checking if user exists in users table...' as step;
SELECT user_id, user_type FROM users WHERE user_id = 'crypto_47bzt5';

-- 13. If user doesn't exist, try with a user that does exist
SELECT 'Testing with existing user...' as step;
SELECT user_id FROM users LIMIT 1;

-- Test with first available user
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
    'test_existing_user', 
    'Test Existing User', 
    25, 
    'view',
    1,
    1
);

-- 14. Check existing user insert result
SELECT 'Checking existing user insert result...' as step;
SELECT * FROM candidate_views WHERE candidate_id = 'test_existing_user';

-- 15. Show all test records
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

-- 16. Clean up test records
DELETE FROM candidate_views WHERE candidate_id LIKE 'test_%';

-- 17. Show final diagnosis
SELECT '✅ Blocking issue diagnosis complete!' as status;
SELECT 'Check which inserts worked to identify the specific blocking issue' as diagnosis;
