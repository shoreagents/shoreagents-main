-- Add scroll percentage column to candidate_views table
-- This will help track user interest level based on how much they scroll

-- 1. Check current candidate_views table structure
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

-- 2. Add scroll_percentage column
SELECT 'Adding scroll_percentage column...' as step;
ALTER TABLE candidate_views 
ADD COLUMN IF NOT EXISTS scroll_percentage INTEGER DEFAULT 0;

-- 3. Add constraint for scroll_percentage (0-100)
SELECT 'Adding constraint for scroll_percentage...' as step;
ALTER TABLE candidate_views 
ADD CONSTRAINT candidate_views_scroll_percentage_check 
CHECK (scroll_percentage >= 0 AND scroll_percentage <= 100);

-- 4. Create index for scroll_percentage
SELECT 'Creating index for scroll_percentage...' as step;
CREATE INDEX IF NOT EXISTS idx_candidate_views_scroll_percentage 
ON candidate_views (scroll_percentage);

-- 5. Update the increment function to handle scroll_percentage
SELECT 'Updating increment function to handle scroll_percentage...' as step;
CREATE OR REPLACE FUNCTION increment_candidate_activity(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view',
    p_scroll_percentage INTEGER DEFAULT NULL
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
    existing_record RECORD;
BEGIN
    -- Look for existing record with same user_id, candidate_id, and interaction_type
    SELECT id, activity_count, view_duration, scroll_percentage INTO existing_record
    FROM candidate_views
    WHERE user_id = p_user_id 
      AND candidate_id = p_candidate_id 
      AND interaction_type = p_interaction_type
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record: increment activity_count and update duration/scroll
        UPDATE candidate_views
        SET 
            activity_count = existing_record.activity_count + 1,
            view_duration = COALESCE(p_view_duration, existing_record.view_duration),
            scroll_percentage = COALESCE(p_scroll_percentage, existing_record.scroll_percentage),
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Incremented activity_count: id=%, new_count=%, duration=%, scroll=%', 
            view_id, existing_record.activity_count + 1, 
            COALESCE(p_view_duration, existing_record.view_duration),
            COALESCE(p_scroll_percentage, existing_record.scroll_percentage);
    ELSE
        -- Insert new record only if no existing record found
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
            p_candidate_name, 
            p_view_duration, 
            p_interaction_type,
            1,
            1,
            COALESCE(p_scroll_percentage, 0)
        ) RETURNING id INTO view_id;
        
        RAISE NOTICE 'Created new record: id=%, activity_count=1, duration=%, scroll=%', 
            view_id, p_view_duration, COALESCE(p_scroll_percentage, 0);
    END IF;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Test the updated function with scroll_percentage
SELECT 'Testing updated function with scroll_percentage...' as step;

-- Test 1: Create new record with scroll percentage
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_scroll_1', 
    'Test Scroll 1', 
    30, 
    'view',
    25  -- 25% scroll
) as test_new_with_scroll;

-- Test 2: Update with higher scroll percentage
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_scroll_1', 
    'Test Scroll 1', 
    45, 
    'view',
    75  -- 75% scroll
) as test_update_scroll;

-- Test 3: Update with maximum scroll percentage
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_scroll_1', 
    'Test Scroll 1', 
    60, 
    'view',
    100  -- 100% scroll
) as test_max_scroll;

-- Test 4: Different interaction_type (should create new record)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_scroll_1', 
    'Test Scroll 1', 
    NULL, 
    'favorite',
    50  -- 50% scroll
) as test_different_interaction;

-- 7. Check the results
SELECT 'Scroll percentage test results:' as step;
SELECT 
    cv.id,
    cv.user_id,
    cv.candidate_id,
    cv.candidate_name,
    cv.view_duration,
    cv.interaction_type,
    cv.activity_count,
    cv.scroll_percentage,
    cv.created_at,
    cv.updated_at
FROM candidate_views cv
WHERE cv.candidate_id = 'test_scroll_1'
ORDER BY cv.interaction_type, cv.created_at;

-- 8. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_scroll_1';

-- 9. Show final status
SELECT '✅ Scroll percentage column added successfully!' as status;
SELECT '✅ Column has constraint (0-100%)' as constraint_status;
SELECT '✅ Index created for performance' as index_status;
SELECT '✅ Function updated to handle scroll_percentage' as function_status;
SELECT '✅ Scroll percentage helps track user interest level' as tracking_status;

-- 10. Show updated table structure
SELECT 'Updated candidate_views table structure:' as step;
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
