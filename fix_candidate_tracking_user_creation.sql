-- Fix candidate tracking by ensuring users are created before inserting into candidate_views
-- This approach uses the existing user creation mechanism

-- Create a new function that ensures a user exists before tracking
CREATE OR REPLACE FUNCTION public.ensure_user_exists(p_user_id character varying)
RETURNS character varying
LANGUAGE plpgsql
AS $function$
DECLARE
    existing_user_id VARCHAR(255);
BEGIN
    -- Check if user already exists
    SELECT user_id INTO existing_user_id
    FROM users
    WHERE user_id = p_user_id
    LIMIT 1;
    
    -- If user exists, return it
    IF existing_user_id IS NOT NULL THEN
        RETURN existing_user_id;
    END IF;
    
    -- If user doesn't exist, create it
    INSERT INTO users (
        user_id,
        user_type,
        created_at
    ) VALUES (
        p_user_id,
        'Anonymous',
        NOW()
    );
    
    RETURN p_user_id;
END;
$function$;

-- Create a new function for recording candidate views that ensures user exists
CREATE OR REPLACE FUNCTION public.record_candidate_view_safe(
    p_user_id character varying,
    p_candidate_id character varying,
    p_candidate_name character varying DEFAULT NULL::character varying,
    p_view_duration integer DEFAULT NULL::integer,
    p_interaction_type character varying DEFAULT 'view'::character varying
)
RETURNS integer
LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    safe_user_id VARCHAR(255);
BEGIN
    -- Ensure user exists before inserting
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Insert the candidate view record
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        safe_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$function$;

-- Test the new function
SELECT 'Testing ensure_user_exists function:' as test_step;
SELECT ensure_user_exists('test_user_123') as created_user_id;

-- Check if user was created
SELECT 'Checking if test user was created:' as test_step;
SELECT user_id, user_type, created_at 
FROM users 
WHERE user_id = 'test_user_123';

-- Test the safe candidate view recording
SELECT 'Testing record_candidate_view_safe function:' as test_step;
SELECT record_candidate_view_safe(
    'test_user_123',
    'test_candidate_456',
    'Test Candidate',
    30,
    'view'
) as view_id;

-- Check if candidate view was recorded
SELECT 'Checking if candidate view was recorded:' as test_step;
SELECT id, user_id, candidate_id, candidate_name, interaction_type, created_at
FROM candidate_views 
WHERE user_id = 'test_user_123';

-- Clean up test data
DELETE FROM candidate_views WHERE user_id = 'test_user_123';
DELETE FROM users WHERE user_id = 'test_user_123';
