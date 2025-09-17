-- Check current user status for admin access
-- Run this query to see what's preventing admin access

-- 1. Check all users and their types
SELECT 
    user_id,
    auth_user_id,
    user_type,
    email,
    first_name,
    last_name,
    created_at
FROM users 
ORDER BY created_at DESC;

-- 2. Check specifically for admin users
SELECT 
    user_id,
    auth_user_id,
    user_type,
    email,
    first_name,
    last_name
FROM users 
WHERE user_type = 'Admin';

-- 3. Check anonymous users (your current status)
SELECT 
    user_id,
    auth_user_id,
    user_type,
    email,
    first_name,
    last_name
FROM users 
WHERE user_type = 'Anonymous';

-- 4. Check if any users have auth_user_id (logged in users)
SELECT 
    user_id,
    auth_user_id,
    user_type,
    email,
    first_name,
    last_name
FROM users 
WHERE auth_user_id IS NOT NULL;


