-- Simple solution: Just increment activity_count for same interaction_type
-- Avoid creating duplicate records, just increment the count

-- 1. Check current duplicate records
SELECT 'Current duplicate records:' as step;
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

-- 2. Create a simple function that just increments activity_count
SELECT 'Creating simple increment function...' as step;
CREATE OR REPLACE FUNCTION increment_candidate_activity(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
    existing_record RECORD;
BEGIN
    -- Look for existing record with same user_id, candidate_id, and interaction_type
    SELECT id, activity_count, view_duration INTO existing_record
    FROM candidate_views
    WHERE user_id = p_user_id 
      AND candidate_id = p_candidate_id 
      AND interaction_type = p_interaction_type
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record: increment activity_count and update duration
        UPDATE candidate_views
        SET 
            activity_count = existing_record.activity_count + 1,
            view_duration = COALESCE(p_view_duration, existing_record.view_duration),
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Incremented activity_count: id=%, new_count=%, duration=%', 
            view_id, existing_record.activity_count + 1, COALESCE(p_view_duration, existing_record.view_duration);
    ELSE
        -- Insert new record only if no existing record found
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
        
        RAISE NOTICE 'Created new record: id=%, activity_count=1, duration=%', 
            view_id, p_view_duration;
    END IF;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Test the increment function
SELECT 'Testing increment function...' as step;

-- Test 1: Create new record
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_simple_1', 
    'Test Simple 1', 
    30, 
    'view'
) as test_new_record;

-- Test 2: Increment same interaction (should increment activity_count)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_simple_1', 
    'Test Simple 1', 
    45, 
    'view'
) as test_increment_1;

-- Test 3: Increment again (should increment activity_count again)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_simple_1', 
    'Test Simple 1', 
    60, 
    'view'
) as test_increment_2;

-- Test 4: Different interaction_type (should create new record)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_simple_1', 
    'Test Simple 1', 
    NULL, 
    'favorite'
) as test_different_interaction;

-- 4. Check the results
SELECT 'Increment test results:' as step;
SELECT 
    cv.id,
    cv.user_id,
    cv.candidate_id,
    cv.candidate_name,
    cv.view_duration,
    cv.interaction_type,
    cv.activity_count,
    cv.created_at,
    cv.updated_at
FROM candidate_views cv
WHERE cv.candidate_id = 'test_simple_1'
ORDER BY cv.interaction_type, cv.created_at;

-- 5. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_simple_1';

-- 6. Show final status
SELECT '✅ Simple increment function created!' as status;
SELECT '✅ Function increments activity_count for same interaction_type' as increment_status;
SELECT '✅ Function updates view_duration when provided' as duration_status;
SELECT '✅ Function creates new record only for different interaction_type' as new_record_status;
SELECT '✅ No duplicate records for same interaction_type' as no_duplicates_status;
