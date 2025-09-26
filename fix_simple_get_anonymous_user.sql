-- Fix the simple_get_anonymous_user function to properly handle anonymous user creation
-- The current function just returns any existing user instead of creating new ones

-- Drop and recreate the function with proper anonymous user creation
DROP FUNCTION IF EXISTS public.simple_get_anonymous_user(varchar);

CREATE OR REPLACE FUNCTION public.simple_get_anonymous_user(p_user_id character varying DEFAULT NULL::character varying)
RETURNS character varying
LANGUAGE plpgsql
AS $function$
DECLARE
    any_user_id VARCHAR(255);
    new_user_id VARCHAR(255);
BEGIN
    -- If a user_id is provided, check if it exists in users table
    IF p_user_id IS NOT NULL THEN
        SELECT user_id INTO any_user_id
        FROM users
        WHERE user_id = p_user_id
        LIMIT 1;
        
        -- If the provided user_id exists, return it
        IF any_user_id IS NOT NULL THEN
            RETURN any_user_id;
        END IF;
    END IF;
    
    -- If no user_id provided or it doesn't exist, create a new anonymous user
    -- Generate a unique user_id for anonymous user
    new_user_id := 'anon_' || extract(epoch from now())::bigint || '_' || floor(random() * 10000)::int;
    
    -- Insert new anonymous user
    INSERT INTO users (
        user_id,
        user_type,
        created_at
    ) VALUES (
        new_user_id,
        'Anonymous',
        NOW()
    );
    
    RETURN new_user_id;
END;
$function$;

-- Test the function
SELECT 'Testing simple_get_anonymous_user function:' as test_step;
SELECT simple_get_anonymous_user() as new_anonymous_user_id;

-- Check if the user was created
SELECT 'Checking if anonymous user was created:' as test_step;
SELECT user_id, user_type, created_at 
FROM users 
WHERE user_id LIKE 'anon_%' 
ORDER BY created_at DESC 
LIMIT 5;
