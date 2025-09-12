-- Promote a user to admin
-- Replace 'your-email@example.com' with the actual email of the user you want to make admin

-- Example: Promote user by email
UPDATE users 
SET user_type = 'Admin' 
WHERE email = 'your-email@example.com';

-- Example: Promote user by user_id (device fingerprint)
-- UPDATE users 
-- SET user_type = 'Admin' 
-- WHERE user_id = 'device_abc123xyz';

-- Check the result
SELECT user_id, auth_user_id, user_type, email, first_name, last_name 
FROM users 
WHERE user_type = 'Admin';
