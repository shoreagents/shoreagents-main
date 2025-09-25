-- Test if the user lookup functions exist and work

-- 1. Check if the functions exist
SELECT 
    'Function Check' as test_type,
    routine_name as function_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('simple_get_authenticated_user', 'simple_get_anonymous_user')
ORDER BY routine_name;

-- 2. Test simple_get_anonymous_user function
SELECT 'Testing simple_get_anonymous_user()' as test_step;
SELECT simple_get_anonymous_user() as anonymous_user_result;

-- 3. Test simple_get_authenticated_user function with a dummy UUID
SELECT 'Testing simple_get_authenticated_user()' as test_step;
SELECT simple_get_authenticated_user('00000000-0000-0000-0000-000000000000'::UUID) as authenticated_user_result;

-- 4. Check if there are any users in the users table
SELECT 
    'Users Table Check' as test_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_type = 'Anonymous' THEN 1 END) as anonymous_users,
    COUNT(CASE WHEN auth_user_id IS NOT NULL THEN 1 END) as authenticated_users
FROM users;

-- 5. Show sample users
SELECT 
    'Sample Users' as test_type,
    user_id,
    auth_user_id,
    user_type,
    email,
    created_at
FROM users 
ORDER BY created_at DESC
LIMIT 5;

SELECT '✅ User lookup functions test completed!' as status;
