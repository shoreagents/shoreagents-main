-- Test content tracking step by step

-- 1. Check if the required functions exist
SELECT 
    'Function Check' as test_type,
    routine_name as function_name,
    CASE 
        WHEN routine_name IS NOT NULL THEN 'EXISTS'
        ELSE 'MISSING'
    END as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('simple_get_authenticated_user', 'simple_get_anonymous_user')

UNION ALL

SELECT 
    'Function Check' as test_type,
    'simple_get_authenticated_user' as function_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = 'simple_get_authenticated_user'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END as status

UNION ALL

SELECT 
    'Function Check' as test_type,
    'simple_get_anonymous_user' as function_name,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.routines 
            WHERE routine_schema = 'public' 
            AND routine_name = 'simple_get_anonymous_user'
        ) THEN 'EXISTS'
        ELSE 'MISSING'
    END as status;

-- 2. Test the functions if they exist
SELECT 'Testing simple_get_anonymous_user()' as test_step;
SELECT simple_get_anonymous_user() as result;

-- 3. Check users table structure
SELECT 
    'Users Table Check' as test_type,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_type = 'Anonymous' THEN 1 END) as anonymous_users,
    COUNT(CASE WHEN auth_user_id IS NOT NULL THEN 1 END) as authenticated_users
FROM users;

-- 4. Check if there are any recent content_views
SELECT 
    'Content Views Check' as test_type,
    COUNT(*) as total_views,
    COUNT(CASE WHEN viewed_at >= NOW() - INTERVAL '1 hour' THEN 1 END) as recent_views,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_user_ids,
    COUNT(CASE WHEN user_id IN (SELECT user_id FROM users) THEN 1 END) as valid_user_ids
FROM content_views;

-- 5. Show recent content_views for debugging
SELECT 
    'Recent Content Views' as test_type,
    id,
    user_id,
    content_type,
    content_id,
    page_section,
    viewed_at
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
ORDER BY viewed_at DESC
LIMIT 5;
