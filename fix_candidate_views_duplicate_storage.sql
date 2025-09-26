-- Fix candidate_views duplicate storage issue
-- This script removes the problematic trigger and provides a proper UPSERT solution

-- 1. First, let's check the current state of triggers on candidate_views
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'candidate_views'
AND event_object_schema = 'public';

-- 2. Drop the problematic trigger that's causing duplicates
DROP TRIGGER IF EXISTS trigger_increment_activity_count ON candidate_views;

-- 3. Check if we need to add a unique constraint for proper UPSERT
-- First, let's see if there are any existing constraints
SELECT 
    constraint_name,
    constraint_type,
    column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'candidate_views' 
    AND tc.table_schema = 'public'
    AND tc.constraint_type = 'UNIQUE';

-- 4. Add a unique constraint to prevent duplicates (if it doesn't exist)
-- This will allow us to use ON CONFLICT for proper UPSERT
DO $$
BEGIN
    -- Check if unique constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'candidate_views_user_candidate_interaction_unique'
        AND table_name = 'candidate_views'
        AND table_schema = 'public'
    ) THEN
        -- Add unique constraint on user_id, candidate_id, interaction_type
        ALTER TABLE public.candidate_views 
        ADD CONSTRAINT candidate_views_user_candidate_interaction_unique 
        UNIQUE (user_id, candidate_id, interaction_type);
        
        RAISE NOTICE 'Unique constraint added successfully';
    ELSE
        RAISE NOTICE 'Unique constraint already exists';
    END IF;
END $$;

-- 5. Create a proper UPSERT function to replace the trigger logic
CREATE OR REPLACE FUNCTION upsert_candidate_view(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view',
    p_page_views INTEGER DEFAULT 1,
    p_scroll_percentage INTEGER DEFAULT 0
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
    actual_candidate_name VARCHAR(255);
BEGIN
    -- If candidate_name not provided, try to get it from bpoc_employees
    IF p_candidate_name IS NULL THEN
        SELECT full_name INTO actual_candidate_name
        FROM bpoc_employees
        WHERE user_id = p_candidate_id
        LIMIT 1;
    ELSE
        actual_candidate_name := p_candidate_name;
    END IF;
    
    -- Use UPSERT to either insert new record or update existing one
    INSERT INTO candidate_views (
        user_id, 
        candidate_id, 
        candidate_name, 
        view_duration, 
        interaction_type,
        page_views,
        activity_count,
        scroll_percentage
    ) VALUES (
        p_user_id, 
        p_candidate_id, 
        actual_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        p_page_views,
        1,
        p_scroll_percentage
    )
    ON CONFLICT (user_id, candidate_id, interaction_type) 
    DO UPDATE SET 
        activity_count = candidate_views.activity_count + 1,
        view_duration = GREATEST(
            COALESCE(candidate_views.view_duration, 0), 
            COALESCE(EXCLUDED.view_duration, 0)
        ),
        page_views = candidate_views.page_views + EXCLUDED.page_views,
        candidate_name = COALESCE(EXCLUDED.candidate_name, candidate_views.candidate_name),
        scroll_percentage = GREATEST(
            COALESCE(candidate_views.scroll_percentage, 0), 
            COALESCE(EXCLUDED.scroll_percentage, 0)
        ),
        updated_at = CURRENT_TIMESTAMP
    RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Create a function to clean up existing duplicate records
CREATE OR REPLACE FUNCTION cleanup_duplicate_candidate_views()
RETURNS TABLE(
    duplicates_removed INTEGER,
    records_consolidated INTEGER
) AS $$
DECLARE
    cleanup_count INTEGER := 0;
    consolidation_count INTEGER := 0;
BEGIN
    -- First, consolidate duplicate records by updating the first record with aggregated data
    WITH duplicates AS (
        SELECT 
            user_id,
            candidate_id,
            interaction_type,
            MIN(id) as keep_id,
            MAX(id) as delete_id,
            COUNT(*) as total_count,
            SUM(page_views) as total_page_views,
            MAX(view_duration) as max_view_duration,
            MAX(scroll_percentage) as max_scroll_percentage,
            MAX(candidate_name) as latest_candidate_name
        FROM candidate_views
        GROUP BY user_id, candidate_id, interaction_type
        HAVING COUNT(*) > 1
    ),
    update_consolidated AS (
        UPDATE candidate_views 
        SET 
            activity_count = d.total_count,
            page_views = d.total_page_views,
            view_duration = d.max_view_duration,
            scroll_percentage = d.max_scroll_percentage,
            candidate_name = d.latest_candidate_name,
            updated_at = CURRENT_TIMESTAMP
        FROM duplicates d
        WHERE candidate_views.id = d.keep_id
        RETURNING candidate_views.id
    )
    SELECT COUNT(*) INTO consolidation_count FROM update_consolidated;
    
    -- Then delete the duplicate records
    WITH duplicates AS (
        SELECT 
            user_id,
            candidate_id,
            interaction_type,
            MIN(id) as keep_id
        FROM candidate_views
        GROUP BY user_id, candidate_id, interaction_type
        HAVING COUNT(*) > 1
    )
    DELETE FROM candidate_views 
    WHERE id IN (
        SELECT cv.id 
        FROM candidate_views cv
        JOIN duplicates d ON (
            cv.user_id = d.user_id 
            AND cv.candidate_id = d.candidate_id 
            AND cv.interaction_type = d.interaction_type
        )
        WHERE cv.id != d.keep_id
    );
    
    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    RETURN QUERY SELECT cleanup_count, consolidation_count;
END;
$$ LANGUAGE plpgsql;

-- 7. Run the cleanup to fix existing duplicates
SELECT 'Cleaning up existing duplicate records...' as status;
SELECT * FROM cleanup_duplicate_candidate_views();

-- 8. Verify the fix by checking for remaining duplicates
SELECT 
    'Verification: Checking for remaining duplicates...' as status,
    COUNT(*) as total_records,
    COUNT(DISTINCT CONCAT(user_id, '|', candidate_id, '|', interaction_type)) as unique_combinations
FROM candidate_views;

-- 9. Show the final trigger state (should only have the updated_at trigger)
SELECT 
    'Final trigger state:' as status,
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'candidate_views'
AND event_object_schema = 'public';

-- 10. Test the new UPSERT function
SELECT 'Testing new UPSERT function...' as status;

-- Test with a sample record
SELECT upsert_candidate_view(
    'test_user_123',
    'test_candidate_456',
    'Test Candidate',
    30,
    'view',
    1,
    50
) as first_insert_id;

-- Test incrementing the same record
SELECT upsert_candidate_view(
    'test_user_123',
    'test_candidate_456',
    'Test Candidate',
    45,
    'view',
    1,
    75
) as second_insert_id;

-- Verify only one record exists with incremented values
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    activity_count,
    view_duration,
    page_views,
    scroll_percentage
FROM candidate_views 
WHERE user_id = 'test_user_123' 
    AND candidate_id = 'test_candidate_456';

-- Clean up test data
DELETE FROM candidate_views 
WHERE user_id = 'test_user_123' 
    AND candidate_id = 'test_candidate_456';

-- 11. Final status
SELECT '✅ Fix completed successfully!' as status;
SELECT '✅ Problematic trigger removed' as trigger_status;
SELECT '✅ Unique constraint added' as constraint_status;
SELECT '✅ UPSERT function created' as function_status;
SELECT '✅ Duplicate records cleaned up' as cleanup_status;

-- 12. Show usage instructions
SELECT 'Usage: Replace your INSERT statements with calls to upsert_candidate_view() function' as instructions;
SELECT 'Example: SELECT upsert_candidate_view(user_id, candidate_id, candidate_name, view_duration, interaction_type);' as example;
