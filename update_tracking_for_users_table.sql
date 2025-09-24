-- Update candidate tracking to use users.user_id instead of anonymous IDs

-- 1. First, let's add a foreign key constraint to link candidate_views to users table
ALTER TABLE candidate_views DROP CONSTRAINT IF EXISTS candidate_views_user_id_fkey;

ALTER TABLE candidate_views ADD CONSTRAINT candidate_views_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE;

-- 2. Update RLS policies to work with the users table
DROP POLICY IF EXISTS "Allow authenticated users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow anonymous users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow reading candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow updating candidate views" ON candidate_views;

-- Policy for authenticated users (must exist in users table)
CREATE POLICY "Allow authenticated users to insert candidate views" 
ON candidate_views FOR INSERT 
TO authenticated 
WITH CHECK (user_id IN (SELECT user_id FROM users));

-- Policy for anonymous users (must exist in users table with user_type = 'Anonymous')
CREATE POLICY "Allow anonymous users to insert candidate views" 
ON candidate_views FOR INSERT 
TO anon 
WITH CHECK (user_id IN (SELECT user_id FROM users WHERE user_type = 'Anonymous'));

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

-- 3. Create a function to get or create anonymous user
CREATE OR REPLACE FUNCTION get_or_create_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anonymous_user_id VARCHAR(255);
BEGIN
    -- Try to get an existing anonymous user
    SELECT user_id INTO anonymous_user_id
    FROM users 
    WHERE user_type = 'Anonymous' 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    -- If no anonymous user exists, create one
    IF anonymous_user_id IS NULL THEN
        anonymous_user_id := 'anon_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 8);
        
        INSERT INTO users (
            user_id,
            first_name,
            last_name,
            email,
            user_type,
            created_at,
            updated_at
        ) VALUES (
            anonymous_user_id,
            'Anonymous',
            'User',
            anonymous_user_id || '@anonymous.shoreagents.com',
            'Anonymous',
            now(),
            now()
        );
    END IF;
    
    RETURN anonymous_user_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Create a function to get or create authenticated user
CREATE OR REPLACE FUNCTION get_or_create_authenticated_user(
    p_auth_user_id UUID,
    p_email VARCHAR(255) DEFAULT NULL,
    p_first_name VARCHAR(100) DEFAULT NULL,
    p_last_name VARCHAR(100) DEFAULT NULL
)
RETURNS VARCHAR(255) AS $$
DECLARE
    existing_user_id VARCHAR(255);
    new_user_id VARCHAR(255);
BEGIN
    -- Try to find existing user by auth_user_id
    SELECT user_id INTO existing_user_id
    FROM users 
    WHERE auth_user_id = p_auth_user_id;
    
    -- If user exists, return their user_id
    IF existing_user_id IS NOT NULL THEN
        RETURN existing_user_id;
    END IF;
    
    -- Create new user_id
    new_user_id := 'user_' || extract(epoch from now())::bigint || '_' || substr(md5(random()::text), 1, 8);
    
    -- Insert new user
    INSERT INTO users (
        user_id,
        auth_user_id,
        email,
        first_name,
        last_name,
        user_type,
        created_at,
        updated_at
    ) VALUES (
        new_user_id,
        p_auth_user_id,
        p_email,
        p_first_name,
        p_last_name,
        'Authenticated',
        now(),
        now()
    );
    
    RETURN new_user_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Update the record function to work with users table
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
COMMENT ON FUNCTION get_or_create_anonymous_user IS 'Gets existing anonymous user or creates new one';
COMMENT ON FUNCTION get_or_create_authenticated_user IS 'Gets existing authenticated user or creates new one';
COMMENT ON FUNCTION candidate_tracking_record_view IS 'Records candidate view with user validation';

-- 7. Test the setup
SELECT 'Testing user-based tracking...' as step;

-- Test anonymous user creation
SELECT get_or_create_anonymous_user() as anonymous_user_id;

-- Test authenticated user creation
SELECT get_or_create_authenticated_user(
    gen_random_uuid(),
    'test@example.com',
    'Test',
    'User'
) as authenticated_user_id;

-- Test recording a view with valid user
DO $$
DECLARE
    test_user_id VARCHAR(255);
    view_id INTEGER;
BEGIN
    test_user_id := get_or_create_anonymous_user();
    
    SELECT candidate_tracking_record_view(
        test_user_id,
        'test_candidate_user_based',
        'Test Candidate for User-Based Tracking',
        30,
        'view'
    ) INTO view_id;
    
    RAISE NOTICE 'Successfully recorded view with ID: % for user: %', view_id, test_user_id;
END $$;

-- 8. Verify the data
SELECT 'Verifying user-based tracking data...' as step;
SELECT 
    cv.user_id,
    u.user_type,
    u.email,
    cv.candidate_id,
    cv.candidate_name,
    cv.interaction_type
FROM candidate_views cv
JOIN users u ON cv.user_id = u.user_id
WHERE cv.candidate_id = 'test_candidate_user_based';

-- 9. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_candidate_user_based';
DELETE FROM users WHERE user_id LIKE 'anon_%' OR user_id LIKE 'user_%' AND email LIKE '%@example.com';

SELECT '✅ User-based tracking setup complete!' as status;
