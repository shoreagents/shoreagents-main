-- Drop phone_number column from users table
-- This migration removes the phone_number column that is no longer needed

ALTER TABLE public.users 
DROP COLUMN IF EXISTS phone_number;

-- Add comment to document the change
COMMENT ON TABLE public.users IS 'Users table - phone_number column removed as it is no longer required';
