-- Update users table to use device fingerprint IDs and link with Supabase Auth
-- This allows anonymous tracking data to be preserved when users sign up

-- Add auth_user_id column to store Supabase auth UUID separately
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- Create index on auth_user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id);

-- Update the user_analytics view to work with the new structure
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
  u.user_id, -- This is now the device fingerprint ID
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

-- Create a function to link anonymous user data to authenticated user
CREATE OR REPLACE FUNCTION link_anonymous_user_to_auth(
  device_fingerprint_id VARCHAR(255),
  auth_user_uuid UUID,
  user_profile_data JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
  existing_user_id VARCHAR(255);
BEGIN
  -- Check if user already exists with this device fingerprint
  SELECT user_id INTO existing_user_id 
  FROM users 
  WHERE user_id = device_fingerprint_id;
  
  IF existing_user_id IS NOT NULL THEN
    -- Update existing anonymous user with auth data
    UPDATE users SET
      auth_user_id = auth_user_uuid,
      first_name = COALESCE(user_profile_data->>'first_name', first_name),
      last_name = COALESCE(user_profile_data->>'last_name', last_name),
      email = COALESCE(user_profile_data->>'email', email),
      phone_number = COALESCE(user_profile_data->>'phone_number', phone_number),
      company = COALESCE(user_profile_data->>'company', company),
      country = COALESCE(user_profile_data->>'country', country),
      updated_at = NOW()
    WHERE user_id = device_fingerprint_id;
    
    RETURN TRUE;
  ELSE
    -- Create new user record with device fingerprint ID
    INSERT INTO users (
      user_id,
      auth_user_id,
      first_name,
      last_name,
      email,
      phone_number,
      company,
      country,
      created_at,
      updated_at
    ) VALUES (
      device_fingerprint_id,
      auth_user_uuid,
      user_profile_data->>'first_name',
      user_profile_data->>'last_name',
      user_profile_data->>'email',
      user_profile_data->>'phone_number',
      user_profile_data->>'company',
      user_profile_data->>'country',
      NOW(),
      NOW()
    );
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.user_page_visits TO anon, authenticated;
GRANT SELECT ON public.user_analytics TO anon, authenticated;
GRANT EXECUTE ON FUNCTION link_anonymous_user_to_auth TO anon, authenticated;

-- Enable Row Level Security (RLS) for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see and modify their own data (by auth_user_id)
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Allow anonymous users to insert (for device tracking)
CREATE POLICY "Allow anonymous device tracking" ON public.users
  FOR INSERT WITH CHECK (auth_user_id IS NULL);

-- Allow authenticated users to insert their own data
CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = auth_user_id);

-- Enable RLS for user_page_visits table
ALTER TABLE public.user_page_visits ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert page visits (for tracking)
CREATE POLICY "Allow anonymous page visits" ON public.user_page_visits
  FOR INSERT WITH CHECK (true);

-- Allow users to view their own page visits (by linking through users table)
CREATE POLICY "Users can view own page visits" ON public.user_page_visits
  FOR SELECT USING (
    user_id IN (
      SELECT u.user_id FROM users u WHERE u.auth_user_id = auth.uid()
    )
  );

-- Allow users to update their own page visits
CREATE POLICY "Users can update own page visits" ON public.user_page_visits
  FOR UPDATE USING (
    user_id IN (
      SELECT u.user_id FROM users u WHERE u.auth_user_id = auth.uid()
    )
  );

COMMENT ON TABLE public.users IS 'User profiles with device fingerprint tracking and optional Supabase auth linking';
COMMENT ON FUNCTION link_anonymous_user_to_auth IS 'Links anonymous tracking data to authenticated user account';
COMMENT ON COLUMN public.users.user_id IS 'Device fingerprint ID - used for tracking across anonymous and authenticated sessions';
COMMENT ON COLUMN public.users.auth_user_id IS 'Supabase auth UUID - null for anonymous users, populated when user signs up';
