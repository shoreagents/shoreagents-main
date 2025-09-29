-- Check if the function exists and create it if it doesn't
-- This script ensures the function is available for the frontend

-- Step 1: Check if the function exists
SELECT 
    'Checking if record_candidate_view_simple function exists' as status,
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name = 'record_candidate_view_simple'
  AND routine_schema = 'public';

-- Step 2: Create the function if it doesn't exist
CREATE OR REPLACE FUNCTION public.record_candidate_view_simple(
    p_user_id character varying, 
    p_candidate_id character varying, 
    p_candidate_name character varying DEFAULT NULL::character varying, 
    p_view_duration integer DEFAULT NULL::integer, 
    p_scroll_percentage integer DEFAULT 0
)
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
$function$;

-- Step 3: Test the function
SELECT 
    'Testing the function' as status,
    record_candidate_view_simple(
        'test_user_123',
        'test_candidate_456',
        'Test Candidate',
        10,
        50
    ) as test_result;

-- Step 4: Verify the function works
SELECT 
    'Function test completed' as status,
    COUNT(*) as records_created
FROM candidate_views 
WHERE user_id = 'test_user_123';

-- Step 5: Clean up test data
DELETE FROM candidate_views WHERE user_id = 'test_user_123';

-- Add comment for the function
COMMENT ON FUNCTION public.record_candidate_view_simple IS 'Function to record candidate views without duplicates, with fallback support';
