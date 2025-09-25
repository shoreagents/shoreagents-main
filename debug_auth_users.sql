-- Debug queries to check user authentication and data
-- NOTE: Content tracking now uses users.user_id from the users table

-- 1. Check if there are any users in the users table
SELECT 
    user_id,
    auth_user_id,
    first_name,
    last_name,
    email,
    user_type,
    created_at
FROM users 
ORDER BY created_at DESC
LIMIT 10;

-- 2. Check recent content_views to see what user_id values are being stored
-- user_id should now be from the users table
SELECT 
    id,
    user_id,
    session_id,
    device_id,
    CASE 
        WHEN user_id IS NULL THEN '❌ NULL'
        WHEN user_id IN (SELECT user_id FROM users) THEN '✅ Valid User ID'
        ELSE '⚠️ Invalid User ID'
    END as user_id_status,
    content_type,
    content_id,
    page_section,
    viewed_at
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
ORDER BY viewed_at DESC
LIMIT 10;

-- 3. Check if there are any users with auth_user_id populated
SELECT 
    COUNT(*) as total_users,
    COUNT(auth_user_id) as users_with_auth_id,
    COUNT(CASE WHEN auth_user_id IS NOT NULL THEN 1 END) as auth_users_count
FROM users;

-- 4. Check the structure of auth_user_id values
SELECT 
    auth_user_id,
    user_id,
    email,
    user_type
FROM users 
WHERE auth_user_id IS NOT NULL
LIMIT 5;

-- 5. Check if there are any Supabase auth users that don't have corresponding records in users table
-- (This would require checking the auth.users table, which might not be accessible)

-- 6. Check recent content_views with user_id analysis
-- user_id should now be from the users table
SELECT 
    CASE 
        WHEN user_id IS NULL THEN 'NULL'
        WHEN user_id IN (SELECT user_id FROM users) THEN 'Valid User ID'
        ELSE 'Invalid User ID'
    END as user_id_status,
    COUNT(*) as count,
    COUNT(DISTINCT user_id) as unique_users
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
GROUP BY 
    CASE 
        WHEN user_id IS NULL THEN 'NULL'
        WHEN user_id IN (SELECT user_id FROM users) THEN 'Valid User ID'
        ELSE 'Invalid User ID'
    END;

-- 7. Verify user_id validity in content_views
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN user_id IN (SELECT user_id FROM users) THEN 1 END) as valid_user_ids,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_user_id,
    COUNT(CASE WHEN user_id NOT IN (SELECT user_id FROM users) AND user_id IS NOT NULL THEN 1 END) as invalid_user_ids
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour';
