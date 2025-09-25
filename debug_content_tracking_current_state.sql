-- Debug the current state of content tracking

-- 1. Check if the simple functions exist
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('simple_get_authenticated_user', 'simple_get_anonymous_user')
ORDER BY routine_name;

-- 2. Check if there are any users in the users table
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_type = 'Anonymous' THEN 1 END) as anonymous_users,
    COUNT(CASE WHEN auth_user_id IS NOT NULL THEN 1 END) as authenticated_users,
    COUNT(CASE WHEN user_type != 'Anonymous' AND auth_user_id IS NULL THEN 1 END) as other_users
FROM users;

-- 3. Check recent content_views records
SELECT 
    id,
    user_id,
    session_id,
    device_id,
    content_type,
    content_id,
    page_section,
    viewed_at,
    CASE 
        WHEN user_id IS NULL THEN 'NULL'
        WHEN user_id IN (SELECT user_id FROM users) THEN 'Valid User ID'
        ELSE 'Invalid User ID'
    END as user_id_status
FROM content_views 
ORDER BY viewed_at DESC
LIMIT 10;

-- 4. Test the simple functions directly
SELECT 'Testing simple_get_anonymous_user()' as test;
SELECT simple_get_anonymous_user() as anonymous_user_result;

-- 5. Check if there are any recent errors in the logs (if available)
-- This would require checking application logs, not database logs

-- 6. Check the structure of the users table
SELECT 
    user_id,
    auth_user_id,
    user_type,
    email,
    created_at
FROM users 
ORDER BY created_at DESC
LIMIT 5;
