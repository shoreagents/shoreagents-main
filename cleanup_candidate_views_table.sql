-- Clean up candidate_views table: remove duration and scroll_percentage columns
-- Fix interaction_type duplicates by using only the increment function

-- 1. Check current table structure
SELECT 'Current candidate_views table structure:' as step;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check for duplicate interaction_types
SELECT 'Duplicate interaction_types for same user/candidate:' as step;
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    COUNT(*) as duplicate_count,
    SUM(activity_count) as total_activity_count
FROM candidate_views
GROUP BY user_id, candidate_id, interaction_type
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;

-- 3. Remove view_duration column
SELECT 'Removing view_duration column...' as step;
ALTER TABLE candidate_views DROP COLUMN IF EXISTS view_duration;

-- 4. Remove scroll_percentage column
SELECT 'Removing scroll_percentage column...' as step;
ALTER TABLE candidate_views DROP COLUMN IF EXISTS scroll_percentage;

-- 5. Drop the old record_candidate_interaction function that creates duplicates
SELECT 'Dropping old record_candidate_interaction function...' as step;
DROP FUNCTION IF EXISTS record_candidate_interaction(VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER, VARCHAR(50)) CASCADE;

-- 6. Update the increment function to remove duration and scroll parameters
SELECT 'Updating increment function to remove duration and scroll parameters...' as step;
CREATE OR REPLACE FUNCTION increment_candidate_activity(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
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
$$ LANGUAGE plpgsql;

-- 7. Test the updated function
SELECT 'Testing updated increment function...' as step;

-- Test 1: Create new record
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_clean_1', 
    'Test Clean 1', 
    'view'
) as test_new_record;

-- Test 2: Increment same interaction (should increment activity_count)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_clean_1', 
    'Test Clean 1', 
    'view'
) as test_increment_1;

-- Test 3: Increment again (should increment activity_count again)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_clean_1', 
    'Test Clean 1', 
    'view'
) as test_increment_2;

-- Test 4: Different interaction_type (should create new record)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_clean_1', 
    'Test Clean 1', 
    'favorite'
) as test_different_interaction;

-- 8. Check the results
SELECT 'Clean function test results:' as step;
SELECT 
    cv.id,
    cv.user_id,
    cv.candidate_id,
    cv.candidate_name,
    cv.interaction_type,
    cv.activity_count,
    cv.created_at,
    cv.updated_at
FROM candidate_views cv
WHERE cv.candidate_id = 'test_clean_1'
ORDER BY cv.interaction_type, cv.created_at;

-- 9. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_clean_1';

-- 10. Show final table structure
SELECT 'Final candidate_views table structure:' as step;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 11. Show available functions
SELECT 'Available functions:' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE '%candidate%'
ORDER BY routine_name;

-- 12. Show final status
SELECT '✅ Table cleanup completed!' as status;
SELECT '✅ Removed view_duration and scroll_percentage columns' as column_removal_status;
SELECT '✅ Dropped old function that created duplicates' as function_cleanup_status;
SELECT '✅ Updated increment function to prevent duplicates' as duplicate_prevention_status;
SELECT '✅ Only increment_candidate_activity function remains' as function_status;
