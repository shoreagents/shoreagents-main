-- Update users table to work with Supabase Auth
-- This script modifies the existing users table to integrate with Supabase authentication

-- First, let's check if we need to add any missing columns
-- Add user_id column if it doesn't exist (it should already exist)
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS user_id VARCHAR(255) UNIQUE NOT NULL;

-- Update the users table to use Supabase auth user IDs
-- The user_id will now reference auth.users.id from Supabase

-- Create a function to handle user creation after auth signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert user record into our custom users table
  INSERT INTO public.users (
    user_id,
    first_name,
    last_name,
    email,
    phone_number,
    company,
    country,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone_number',
    NEW.raw_user_meta_data->>'company',
    NEW.raw_user_meta_data->>'country',
    NOW(),
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user record when auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a function to handle user updates
CREATE OR REPLACE FUNCTION handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Update user record in our custom users table
  UPDATE public.users
  SET
    first_name = NEW.raw_user_meta_data->>'first_name',
    last_name = NEW.raw_user_meta_data->>'last_name',
    email = NEW.email,
    phone_number = NEW.raw_user_meta_data->>'phone_number',
    company = NEW.raw_user_meta_data->>'company',
    country = NEW.raw_user_meta_data->>'country',
    updated_at = NOW()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update user record when auth user is updated
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_update();

-- Create a function to handle user deletion
CREATE OR REPLACE FUNCTION handle_user_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete user record from our custom users table
  DELETE FROM public.users WHERE user_id = OLD.id;
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically delete user record when auth user is deleted
DROP TRIGGER IF EXISTS on_auth_user_deleted ON auth.users;
CREATE TRIGGER on_auth_user_deleted
  AFTER DELETE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_user_delete();

-- Update the user_analytics view to work with the new structure
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
  u.user_id,
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
GROUP BY u.user_id, u.first_name, u.last_name, u.company, u.email, u.phone_number, u.country, u.created_at;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.user_page_visits TO anon, authenticated;
GRANT SELECT ON public.user_analytics TO anon, authenticated;

-- Disable Row Level Security (RLS) for users table
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Disable RLS for user_page_visits table
ALTER TABLE public.user_page_visits DISABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.users IS 'User profiles linked to Supabase auth.users';
COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates user profile when auth user is created';
COMMENT ON FUNCTION handle_user_update() IS 'Automatically updates user profile when auth user is updated';
COMMENT ON FUNCTION handle_user_delete() IS 'Automatically deletes user profile when auth user is deleted';
