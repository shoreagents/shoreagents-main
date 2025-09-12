-- Simple update to users table for device fingerprint tracking
-- This script adds the auth_user_id column and updates the view

-- Add auth_user_id column to store Supabase auth UUID separately
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- Create index on auth_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Update the user_analytics view to work with the new structure
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
  u.user_id, -- This is the device fingerprint ID
  u.auth_user_id, -- This is the Supabase auth UUID (null for anonymous users)
  u.first_name,
  u.last_name,
  u.company,
  u.email,
  u.phone_number,
  u.country,
  u.created_at,
  COUNT(upv.id) as unique_pages_visited,
  SUM(upv.visit_count) as total_page_views,
  SUM(upv.time_spent_seconds) as total_time_spent_seconds,
  MIN(upv.visit_timestamp) as first_visit_timestamp,
  MAX(upv.last_visit_timestamp) as last_visit_timestamp
FROM users u
LEFT JOIN user_page_visits upv ON u.user_id = upv.user_id
GROUP BY u.user_id, u.auth_user_id, u.first_name, u.last_name, u.company, u.email, u.phone_number, u.country, u.created_at;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.user_page_visits TO anon, authenticated;
GRANT SELECT ON public.user_analytics TO anon, authenticated;

COMMENT ON COLUMN public.users.user_id IS 'Device fingerprint ID - used for tracking across anonymous and authenticated sessions';
COMMENT ON COLUMN public.users.auth_user_id IS 'Supabase auth UUID - null for anonymous users, populated when user signs up';
