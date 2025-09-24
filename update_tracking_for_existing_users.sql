-- Update tracking to work with existing users table structure

-- 1. Remove the foreign key constraint temporarily to allow flexibility
ALTER TABLE candidate_views DROP CONSTRAINT IF EXISTS candidate_views_user_id_fkey;

-- 2. Update RLS policies to work with existing users
DROP POLICY IF EXISTS "Allow authenticated users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow anonymous users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow reading candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow updating candidate views" ON candidate_views;

-- Policy for all users (both Regular and Anonymous)
CREATE POLICY "Allow all users to insert candidate views" 
ON candidate_views FOR INSERT 
TO authenticated, anon 
WITH CHECK (user_id IN (SELECT user_id FROM users));

-- Policy for reading candidate views
CREATE POLICY "Allow reading candidate views" 
ON candidate_views FOR SELECT 
TO authenticated, anon 
USING (user_id IN (SELECT user_id FROM users));

-- Policy for updating candidate views
CREATE POLICY "Allow updating candidate views" 
ON candidate_views FOR UPDATE 
TO authenticated, anon 
USING (user_id IN (SELECT user_id FROM users));

-- 3. Create a function to get an existing anonymous user
CREATE OR REPLACE FUNCTION get_existing_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anonymous_user_id VARCHAR(255);
BEGIN
    -- Get an existing anonymous user
    SELECT user_id INTO anonymous_user_id
    FROM users 
    WHERE user_type = 'Anonymous' 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- If no anonymous user exists, return null (don't create new ones)
    RETURN anonymous_user_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Create a function to get existing authenticated user by auth_user_id
CREATE OR REPLACE FUNCTION get_existing_authenticated_user(
    p_auth_user_id UUID
)
RETURNS VARCHAR(255) AS $$
DECLARE
    existing_user_id VARCHAR(255);
BEGIN
    -- Find existing user by auth_user_id
    SELECT user_id INTO existing_user_id
    FROM users 
    WHERE auth_user_id = p_auth_user_id;
    
    RETURN existing_user_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Update the record function to validate user exists
DROP FUNCTION IF EXISTS candidate_tracking_record_view(VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER, VARCHAR(50));

CREATE OR REPLACE FUNCTION candidate_tracking_record_view(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
BEGIN
    -- Verify user exists in users table
    IF NOT EXISTS (SELECT 1 FROM users WHERE user_id = p_user_id) THEN
        RAISE EXCEPTION 'User % does not exist in users table', p_user_id;
    END IF;
    
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views
    ) VALUES (
        p_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Add comments
COMMENT ON FUNCTION get_existing_anonymous_user IS 'Gets an existing anonymous user from users table';
COMMENT ON FUNCTION get_existing_authenticated_user IS 'Gets existing authenticated user by auth_user_id';
COMMENT ON FUNCTION candidate_tracking_record_view IS 'Records candidate view with user validation';

-- 7. Test the setup with your existing users
SELECT 'Testing with existing users...' as step;

-- Test getting existing anonymous user
SELECT get_existing_anonymous_user() as anonymous_user_id;

-- Test getting existing authenticated user
SELECT get_existing_authenticated_user('a28bd469-9733-4436-b40e-f80f43b8a58d'::UUID) as authenticated_user_id;

-- Test recording a view with existing user
DO $$
DECLARE
    test_user_id VARCHAR(255);
    view_id INTEGER;
BEGIN
    -- Use an existing anonymous user
    test_user_id := get_existing_anonymous_user();
    
    IF test_user_id IS NOT NULL THEN
        SELECT candidate_tracking_record_view(
            test_user_id,
            'test_candidate_existing_user',
            'Test Candidate for Existing User',
            30,
            'view'
        ) INTO view_id;
        
        RAISE NOTICE 'Successfully recorded view with ID: % for existing user: %', view_id, test_user_id;
    ELSE
        RAISE NOTICE 'No anonymous users found in users table';
    END IF;
END $$;

-- 8. Verify the data
SELECT 'Verifying tracking data with existing users...' as step;
SELECT 
    cv.user_id,
    u.user_type,
    u.email,
    u.first_name,
    u.last_name,
    cv.candidate_id,
    cv.candidate_name,
    cv.interaction_type
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id = 'test_candidate_existing_user';

-- 9. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_candidate_existing_user';

SELECT '✅ Tracking updated to work with existing users!' as status;
