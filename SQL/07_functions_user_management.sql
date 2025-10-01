-- User Management Functions
-- ==========================

-- DROP FUNCTION public.create_user_on_page_visit();

CREATE OR REPLACE FUNCTION public.create_user_on_page_visit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if user exists, if not create one
    INSERT INTO public.users (id, user_id, user_type, created_at)
    VALUES (
        gen_random_uuid(),
        NEW.user_id,
        'Anonymous',
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.ensure_user_exists(varchar);

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
$function$
;

-- DROP FUNCTION public.get_existing_anonymous_user();

CREATE OR REPLACE FUNCTION public.get_existing_anonymous_user()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    anon_user_id VARCHAR(255);
BEGIN
    SELECT user_id INTO anon_user_id
    FROM users
    WHERE user_type = 'Anonymous'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN anon_user_id;
END;
$function$
;

-- DROP FUNCTION public.get_existing_authenticated_user(uuid);

CREATE OR REPLACE FUNCTION public.get_existing_authenticated_user(p_auth_user_id uuid)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    auth_user_id_str VARCHAR(255);
BEGIN
    SELECT user_id INTO auth_user_id_str
    FROM users
    WHERE auth_user_id = p_auth_user_id
    LIMIT 1;
    
    RETURN auth_user_id_str;
END;
$function$
;

-- DROP FUNCTION public.get_most_recent_anonymous_user();

CREATE OR REPLACE FUNCTION public.get_most_recent_anonymous_user()
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    most_recent_user_id VARCHAR(255);
BEGIN
    -- Get the most recent anonymous user ID from candidate_views
    SELECT user_id INTO most_recent_user_id
    FROM candidate_views 
    WHERE user_id LIKE 'device_%' OR user_id LIKE 'anon_%'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN most_recent_user_id;
END;
$function$
;

-- DROP FUNCTION public.simple_get_anonymous_user(varchar);

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
$function$
;

-- DROP FUNCTION public.simple_get_authenticated_user(varchar);

CREATE OR REPLACE FUNCTION public.simple_get_authenticated_user(p_auth_user_id character varying)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    user_id_result VARCHAR(255);
    uuid_value UUID;
BEGIN
    -- First, try to find by user_id (in case the passed value is already a user_id)
    SELECT user_id INTO user_id_result
    FROM users
    WHERE user_id = p_auth_user_id
    LIMIT 1;
    
    -- If not found by user_id, try to find by auth_user_id (cast VARCHAR to UUID)
    IF user_id_result IS NULL THEN
        BEGIN
            -- Try to cast to UUID, handle potential errors
            uuid_value := p_auth_user_id::uuid;
            
            SELECT user_id INTO user_id_result
            FROM users
            WHERE auth_user_id = uuid_value
            LIMIT 1;
            
        EXCEPTION
            WHEN invalid_text_representation THEN
                -- If UUID casting fails, continue to fallback
                user_id_result := NULL;
        END;
    END IF;
    
    -- If still not found, get any available user
    IF user_id_result IS NULL THEN
        SELECT user_id INTO user_id_result
        FROM users
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;
    
    RETURN user_id_result;
END;
$function$
;

-- DROP FUNCTION public.simple_get_authenticated_user(uuid);

CREATE OR REPLACE FUNCTION public.simple_get_authenticated_user(p_auth_user_id uuid)
 RETURNS character varying
 LANGUAGE plpgsql
AS $function$
DECLARE
    auth_user_id_str VARCHAR(255);
BEGIN
    SELECT user_id INTO auth_user_id_str
    FROM users
    WHERE auth_user_id = p_auth_user_id
    LIMIT 1;
    
    RETURN auth_user_id_str;
END;
$function$
;
