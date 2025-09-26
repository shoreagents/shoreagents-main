-- STEP 4: Clean Up Existing Duplicate Records
-- Run this if step 3 failed due to existing duplicates

-- 4.1 First, let's see how many duplicates we have
SELECT 
    'Duplicate records found:' as info,
    COUNT(*) as duplicate_groups,
    SUM(duplicate_count) as total_duplicate_records
FROM (
    SELECT 
        user_id,
        candidate_id,
        interaction_type,
        COUNT(*) as duplicate_count
    FROM candidate_views
    GROUP BY user_id, candidate_id, interaction_type
    HAVING COUNT(*) > 1
) duplicates;

-- 4.2 Create a function to consolidate duplicates
CREATE OR REPLACE FUNCTION consolidate_duplicate_candidate_views()
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

-- 4.3 Run the consolidation
SELECT 'Starting duplicate cleanup...' as status;
SELECT * FROM consolidate_duplicate_candidate_views();

-- 4.4 Verify duplicates are gone
SELECT 
    'Verification - remaining duplicates:' as info,
    COUNT(*) as duplicate_groups
FROM (
    SELECT 
        user_id,
        candidate_id,
        interaction_type,
        COUNT(*) as duplicate_count
    FROM candidate_views
    GROUP BY user_id, candidate_id, interaction_type
    HAVING COUNT(*) > 1
) duplicates;

-- 4.5 Show final record count
SELECT 
    'Final record count:' as info,
    COUNT(*) as total_records
FROM candidate_views;

SELECT '✅ Duplicate cleanup completed!' as status;
