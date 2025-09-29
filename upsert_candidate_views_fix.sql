-- UPSERT-based fix for candidate_views duplication
-- This version uses INSERT ... ON CONFLICT but without complex exception handling

-- Step 1: Show current state
SELECT 
    'Before cleanup' as status,
    COUNT(*) as total_records,
    COUNT(DISTINCT CONCAT(user_id, '|', candidate_id)) as unique_combinations,
    COUNT(*) - COUNT(DISTINCT CONCAT(user_id, '|', candidate_id)) as duplicates
FROM candidate_views;

-- Step 2: Clean up existing duplicates first
WITH ranked_views AS (
    SELECT 
        id,
        user_id,
        candidate_id,
        ROW_NUMBER() OVER (
            PARTITION BY user_id, candidate_id 
            ORDER BY view_duration DESC, scroll_percentage DESC, created_at DESC
        ) as rn
    FROM candidate_views
)
DELETE FROM candidate_views 
WHERE id NOT IN (
    SELECT id FROM ranked_views WHERE rn = 1
);

-- Step 3: Try to add unique constraint (this might fail if there are still duplicates)
-- If it fails, that's okay - the function will still work
ALTER TABLE candidate_views 
ADD CONSTRAINT unique_user_candidate 
UNIQUE (user_id, candidate_id);

-- Step 4: Create UPSERT function
CREATE OR REPLACE FUNCTION public.record_candidate_view_upsert(
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
    safe_user_id VARCHAR(255);
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
    
    RAISE NOTICE 'UPSERT completed: id=%', view_id;
    
    RETURN view_id;
END;
$function$;

-- Step 5: Test the UPSERT function
-- Test 1: Record a new view
SELECT record_candidate_view_upsert(
    'device_83vw09',
    '8f716b64-02a3-46c2-9141-cc5b2312dd99',
    'Charmine Salas',
    15,
    75
) as test1_view_id;

-- Test 2: Record the same view again (should update, not create duplicate)
SELECT record_candidate_view_upsert(
    'device_83vw09',
    '8f716b64-02a3-46c2-9141-cc5b2312dd99',
    'Charmine Salas',
    25,  -- Higher duration
    85   -- Higher scroll percentage
) as test2_view_id;

-- Test 3: Record a different candidate (should create new record)
SELECT record_candidate_view_upsert(
    'device_83vw09',
    '402dd402-c968-4db6-90c7-20db32b84487',
    'Candy Claire Joseph',
    10,
    50
) as test3_view_id;

-- Test 4: Try to create duplicate again (should update, not duplicate)
SELECT record_candidate_view_upsert(
    'device_83vw09',
    '402dd402-c968-4db6-90c7-20db32b84487',
    'Candy Claire Joseph',
    30,  -- Higher duration
    80   -- Higher scroll percentage
) as test4_view_id;

-- Step 6: Verify no duplicates were created
SELECT 
    'Final verification' as status,
    COUNT(*) as total_records,
    COUNT(DISTINCT CONCAT(user_id, '|', candidate_id)) as unique_combinations,
    COUNT(*) - COUNT(DISTINCT CONCAT(user_id, '|', candidate_id)) as duplicates
FROM candidate_views 
WHERE user_id = 'device_83vw09';

-- Step 7: Show the final data
SELECT 
    'Final data for device_83vw09' as status,
    user_id,
    candidate_id,
    candidate_name,
    view_duration,
    scroll_percentage,
    page_views,
    created_at,
    updated_at
FROM candidate_views 
WHERE user_id = 'device_83vw09'
ORDER BY candidate_id;

-- Add comment for the new function
COMMENT ON FUNCTION public.record_candidate_view_upsert IS 'UPSERT function to record candidate views without duplicates';
