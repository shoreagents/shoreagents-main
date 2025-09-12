-- Add user_type column to users table
-- This script adds user types: regular, admin, anonymous

-- First, create the enum type for user types
CREATE TYPE user_type_enum AS ENUM ('Anonymous', 'Regular', 'Admin');

-- Add the user_type column to the users table
ALTER TABLE users 
ADD COLUMN user_type user_type_enum NOT NULL DEFAULT 'Anonymous';

-- Update existing users to have appropriate types
-- Anonymous users (those with null auth_user_id) should remain anonymous
UPDATE users 
SET user_type = 'Anonymous' 
WHERE auth_user_id IS NULL;

-- All authenticated users are regular by default
-- Admin status must be set manually in the database
UPDATE users 
SET user_type = 'Regular' 
WHERE auth_user_id IS NOT NULL;

-- Note: To make a user admin, manually update their user_type to 'Admin' in the database
-- Example: UPDATE users SET user_type = 'Admin' WHERE email = 'admin@shoreagents.com';

-- Add an index for better performance on user_type queries
CREATE INDEX idx_users_user_type ON users(user_type);

-- Add a comment to document the user types
COMMENT ON COLUMN users.user_type IS 'User type: Anonymous (no auth), Regular (authenticated user), Admin (administrator)';
