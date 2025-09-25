-- Debug the content tracking flow to understand why user_id is not being set correctly

-- 1. Check the most recent content_views records with full details
SELECT 
    id,
    user_id,
    session_id,
    device_id,
    content_type,
    content_id,
    content_title,
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

-- 2. Check if there are any users in the users table
SELECT 
    COUNT(*) as total_users,
    COUNT(auth_user_id) as users_with_auth_id,
    COUNT(CASE WHEN auth_user_id IS NOT NULL THEN 1 END) as authenticated_users
FROM users;

-- 3. Check the structure of users table
SELECT 
    user_id,
    auth_user_id,
    email,
    user_type,
    created_at
FROM users 
ORDER BY created_at DESC
LIMIT 5;

-- 4. Check if there are any recent content_views with device_id format
SELECT 
    user_id,
    device_id,
    CASE 
        WHEN user_id = device_id THEN 'Device ID Used as User ID'
        WHEN user_id IS NULL THEN 'NULL User ID'
        ELSE 'Different User ID'
    END as tracking_method,
    COUNT(*) as count
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
GROUP BY user_id, device_id, 
    CASE 
        WHEN user_id = device_id THEN 'Device ID Used as User ID'
        WHEN user_id IS NULL THEN 'NULL User ID'
        ELSE 'Different User ID'
    END;

-- 5. Check for any content_views that might have been created with the old logic
SELECT 
    'Recent Records' as period,
    COUNT(*) as total,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_user_id,
    COUNT(CASE WHEN user_id = device_id THEN 1 END) as device_id_as_user_id,
    COUNT(CASE WHEN user_id IN (SELECT user_id FROM users) THEN 1 END) as valid_user_id
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'

UNION ALL

SELECT 
    'Last 24 Hours' as period,
    COUNT(*) as total,
    COUNT(CASE WHEN user_id IS NULL THEN 1 END) as null_user_id,
    COUNT(CASE WHEN user_id = device_id THEN 1 END) as device_id_as_user_id,
    COUNT(CASE WHEN user_id IN (SELECT user_id FROM users) THEN 1 END) as valid_user_id
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '24 hours';
