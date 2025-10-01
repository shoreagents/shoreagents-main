-- Candidate Views Functions
-- ==========================

-- DROP FUNCTION public.increment_activity_count();

CREATE OR REPLACE FUNCTION public.increment_activity_count()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if there's an existing record with the same user_id, candidate_id, and interaction_type
    -- If yes, increment the activity_count; if no, keep it as 1 (default)
    IF EXISTS (
        SELECT 1 FROM candidate_views 
        WHERE user_id = NEW.user_id 
          AND candidate_id = NEW.candidate_id 
          AND interaction_type = NEW.interaction_type
          AND id != COALESCE(NEW.id, 0)  -- Exclude current record if updating
    ) THEN
        -- Get the maximum activity_count for this combination and increment it
        SELECT COALESCE(MAX(activity_count), 0) + 1 
        INTO NEW.activity_count
        FROM candidate_views 
        WHERE user_id = NEW.user_id 
          AND candidate_id = NEW.candidate_id 
          AND interaction_type = NEW.interaction_type
          AND id != COALESCE(NEW.id, 0);
    ELSE
        -- First time this interaction type for this user-candidate combination
        NEW.activity_count := 1;
    END IF;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.increment_candidate_activity(varchar, varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.increment_candidate_activity(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    existing_record RECORD;
BEGIN
    -- Look for existing record with same user_id, candidate_id, and interaction_type
    SELECT id, activity_count INTO existing_record
    FROM candidate_views
    WHERE user_id = p_user_id 
      AND candidate_id = p_candidate_id 
      AND interaction_type = p_interaction_type
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record: increment activity_count only
        UPDATE candidate_views
        SET 
            activity_count = existing_record.activity_count + 1,
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Incremented activity_count: id=%, new_count=%', 
            view_id, existing_record.activity_count + 1;
    ELSE
        -- Insert new record only if no existing record found
        INSERT INTO candidate_views (
            user_id, 
            candidate_id, 
            candidate_name, 
            interaction_type,
            page_views,
            activity_count
        ) VALUES (
            p_user_id, 
            p_candidate_id, 
            p_candidate_name, 
            p_interaction_type,
            1,
            1
        ) RETURNING id INTO view_id;
        
        RAISE NOTICE 'Created new record: id=%, activity_count=1', 
            view_id;
    END IF;
    
    RETURN view_id;
END;
$function$
;

-- DROP FUNCTION public.record_candidate_interaction(varchar, varchar, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.record_candidate_interaction(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    valid_user_id VARCHAR(255);
BEGIN
    -- Check if the provided user_id exists in users table
    SELECT user_id INTO valid_user_id
    FROM users
    WHERE user_id = p_user_id
    LIMIT 1;
    
    -- If user_id doesn't exist, get any available user
    IF valid_user_id IS NULL THEN
        SELECT user_id INTO valid_user_id
        FROM users
        ORDER BY created_at DESC
        LIMIT 1;
    END IF;
    
    -- Insert the record with the valid user_id
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        valid_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- DROP FUNCTION public.record_candidate_view(varchar, varchar, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.record_candidate_view(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
BEGIN
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        p_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- DROP FUNCTION public.record_candidate_view_fixed(varchar, varchar, varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.record_candidate_view_fixed(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    existing_record RECORD;
    safe_user_id VARCHAR(255);
    final_view_duration INTEGER;
    final_scroll_percentage INTEGER;
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Look for existing record with same user_id and candidate_id
    SELECT id, view_duration, scroll_percentage, page_views
    INTO existing_record
    FROM candidate_views
    WHERE user_id = safe_user_id 
      AND candidate_id = p_candidate_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record with better values
        final_view_duration := GREATEST(
            COALESCE(existing_record.view_duration, 0), 
            COALESCE(p_view_duration, 0)
        );
        
        final_scroll_percentage := GREATEST(
            COALESCE(existing_record.scroll_percentage, 0), 
            COALESCE(p_scroll_percentage, 0)
        );
        
        UPDATE candidate_views SET
            view_duration = final_view_duration,
            scroll_percentage = final_scroll_percentage,
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            page_views = existing_record.page_views + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Updated existing record: id=%, view_duration=%, scroll_percentage=%', 
            view_id, final_view_duration, final_scroll_percentage;
    ELSE
        -- Insert new record only if no existing record found
        INSERT INTO candidate_views (
            user_id, 
            candidate_id, 
            candidate_name, 
            view_duration, 
            page_views,
            scroll_percentage
        ) VALUES (
            safe_user_id, 
            p_candidate_id, 
            p_candidate_name, 
            COALESCE(p_view_duration, 0), 
            1,
            COALESCE(p_scroll_percentage, 0)
        ) RETURNING id INTO view_id;
        
        RAISE NOTICE 'Created new record: id=%, view_duration=%, scroll_percentage=%', 
            view_id, COALESCE(p_view_duration, 0), COALESCE(p_scroll_percentage, 0);
    END IF;
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.record_candidate_view_fixed(varchar, varchar, varchar, int4, int4) IS 'Fixed function to record candidate views without duplicates, properly handling view_duration and scroll_percentage';

-- DROP FUNCTION public.record_candidate_view_safe(varchar, varchar, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.record_candidate_view_safe(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_interaction_type character varying DEFAULT 'view'::character varying)
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
$function$
;

-- DROP FUNCTION public.record_candidate_view_simple(varchar, varchar, varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.record_candidate_view_simple(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    existing_record RECORD;
    safe_user_id VARCHAR(255);
    final_view_duration INTEGER;
    final_scroll_percentage INTEGER;
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Look for existing record with same user_id and candidate_id
    SELECT id, view_duration, scroll_percentage, page_views
    INTO existing_record
    FROM candidate_views
    WHERE user_id = safe_user_id 
      AND candidate_id = p_candidate_id
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record with accumulated values
        final_view_duration := COALESCE(existing_record.view_duration, 0) + COALESCE(p_view_duration, 0);
        
        final_scroll_percentage := GREATEST(
            COALESCE(existing_record.scroll_percentage, 0), 
            COALESCE(p_scroll_percentage, 0)
        );
        
        UPDATE candidate_views SET
            view_duration = final_view_duration,
            scroll_percentage = final_scroll_percentage,
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            page_views = existing_record.page_views + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Updated existing record: id=%, accumulated_duration=%, max_scroll=%', 
            view_id, final_view_duration, final_scroll_percentage;
    ELSE
        -- Insert new record only if no existing record found
        INSERT INTO candidate_views (
            user_id, 
            candidate_id, 
            candidate_name, 
            view_duration, 
            page_views,
            scroll_percentage
        ) VALUES (
            safe_user_id, 
            p_candidate_id, 
            p_candidate_name, 
            COALESCE(p_view_duration, 0), 
            1,
            COALESCE(p_scroll_percentage, 0)
        ) RETURNING id INTO view_id;
        
        RAISE NOTICE 'Created new record: id=%, initial_duration=%, scroll=%', 
            view_id, COALESCE(p_view_duration, 0), COALESCE(p_scroll_percentage, 0);
    END IF;
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.record_candidate_view_simple(varchar, varchar, varchar, int4, int4) IS 'Corrected function to accumulate view durations with proper COALESCE syntax';

-- DROP FUNCTION public.record_candidate_view_upsert(varchar, varchar, varchar, int4, int4);

CREATE OR REPLACE FUNCTION public.record_candidate_view_upsert(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    safe_user_id VARCHAR(255);
    final_view_duration INTEGER;
    final_scroll_percentage INTEGER;
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Use UPSERT to insert or update
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        page_views,
        scroll_percentage
    ) VALUES (
        safe_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        COALESCE(p_view_duration, 0), 
        1,
        COALESCE(p_scroll_percentage, 0)
    )
    ON CONFLICT (user_id, candidate_id) 
    DO UPDATE SET
        view_duration = GREATEST(
            candidate_views.view_duration, 
            COALESCE(EXCLUDED.view_duration, 0)
        ),
        scroll_percentage = GREATEST(
            candidate_views.scroll_percentage, 
            COALESCE(EXCLUDED.scroll_percentage, 0)
        ),
        candidate_name = COALESCE(EXCLUDED.candidate_name, candidate_views.candidate_name),
        page_views = candidate_views.page_views + 1,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO view_id;
    
    RAISE NOTICE 'UPSERT completed: id=%, view_duration=%, scroll_percentage=%', 
        view_id, 
        COALESCE(p_view_duration, 0), 
        COALESCE(p_scroll_percentage, 0);
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.record_candidate_view_upsert(varchar, varchar, varchar, int4, int4) IS 'UPSERT function to record candidate views without duplicates, using database-level constraints';

-- DROP FUNCTION public.simple_record_view(varchar, varchar, varchar, int4, varchar);

CREATE OR REPLACE FUNCTION public.simple_record_view(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_view_duration integer DEFAULT NULL::integer, p_interaction_type character varying DEFAULT 'view'::character varying)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    valid_user_id VARCHAR(255);
BEGIN
    -- Get a valid user_id (either the provided one or any available one)
    SELECT simple_get_anonymous_user(p_user_id) INTO valid_user_id;
    
    -- Insert the record with the valid user_id
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count
    ) VALUES (
        valid_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- DROP FUNCTION public.track_view_duration_with_timestamps(varchar, varchar, varchar, timestamptz, timestamptz, int4);

CREATE OR REPLACE FUNCTION public.track_view_duration_with_timestamps(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_start_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    calculated_duration INTEGER;
    safe_user_id VARCHAR(255);
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Calculate duration if both start and end times are provided
    IF p_start_time IS NOT NULL AND p_end_time IS NOT NULL THEN
        calculated_duration := EXTRACT(EPOCH FROM (p_end_time - p_start_time))::INTEGER;
    ELSE
        calculated_duration := 0;
    END IF;
    
    -- Use the updated function to record the view with duration accumulation
    SELECT record_candidate_view_simple(
        safe_user_id,
        p_candidate_id,
        p_candidate_name,
        calculated_duration,
        p_scroll_percentage
    ) INTO view_id;
    
    RETURN view_id;
END;
$function$
;

-- DROP FUNCTION public.track_view_with_duration(varchar, varchar, varchar, timestamptz, timestamptz, int4);

CREATE OR REPLACE FUNCTION public.track_view_with_duration(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_start_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    calculated_duration INTEGER;
    safe_user_id VARCHAR(255);
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Calculate duration if both start and end times are provided
    IF p_start_time IS NOT NULL AND p_end_time IS NOT NULL THEN
        calculated_duration := EXTRACT(EPOCH FROM (p_end_time - p_start_time))::INTEGER;
    ELSE
        calculated_duration := 0;
    END IF;
    
    -- Use the fixed function to record the view
    SELECT record_candidate_view_fixed(
        safe_user_id,
        p_candidate_id,
        p_candidate_name,
        calculated_duration,
        p_scroll_percentage
    ) INTO view_id;
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.track_view_with_duration(varchar, varchar, varchar, timestamptz, timestamptz, int4) IS 'Function to track candidate view duration with proper time calculation using start and end timestamps';

-- DROP FUNCTION public.track_view_with_duration_upsert(varchar, varchar, varchar, timestamptz, timestamptz, int4);

CREATE OR REPLACE FUNCTION public.track_view_with_duration_upsert(p_user_id character varying, p_candidate_id character varying, p_candidate_name character varying DEFAULT NULL::character varying, p_start_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_end_time timestamp with time zone DEFAULT NULL::timestamp with time zone, p_scroll_percentage integer DEFAULT 0)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    view_id INTEGER;
    calculated_duration INTEGER;
    safe_user_id VARCHAR(255);
BEGIN
    -- Ensure user exists
    SELECT ensure_user_exists(p_user_id) INTO safe_user_id;
    
    -- Calculate duration if both start and end times are provided
    IF p_start_time IS NOT NULL AND p_end_time IS NOT NULL THEN
        calculated_duration := EXTRACT(EPOCH FROM (p_end_time - p_start_time))::INTEGER;
    ELSE
        calculated_duration := 0;
    END IF;
    
    -- Use the UPSERT function to record the view
    SELECT record_candidate_view_upsert(
        safe_user_id,
        p_candidate_id,
        p_candidate_name,
        calculated_duration,
        p_scroll_percentage
    ) INTO view_id;
    
    RETURN view_id;
END;
$function$
;

COMMENT ON FUNCTION public.track_view_with_duration_upsert(varchar, varchar, varchar, timestamptz, timestamptz, int4) IS 'Function to track candidate view duration with proper time calculation using UPSERT';
