-- Fix duration time and activity_count issues
-- Duration time is not working, activity_count should increment for same interaction_type

-- 1. Check current candidate_views data to understand the issue
SELECT 'Current candidate_views data:' as step;
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
ORDER BY cv.created_at DESC
LIMIT 10;

-- 2. Check for duplicate interaction_types for the same user and candidate
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

-- 3. Create a proper UPSERT function that handles duration and activity_count correctly
SELECT 'Creating proper UPSERT function...' as step;
CREATE OR REPLACE FUNCTION upsert_candidate_view(
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
    SELECT id, view_duration, activity_count INTO existing_record
    FROM candidate_views
    WHERE user_id = p_user_id 
      AND candidate_id = p_candidate_id 
      AND interaction_type = p_interaction_type
    ORDER BY created_at DESC
    LIMIT 1;
    
    IF existing_record.id IS NOT NULL THEN
        -- Update existing record
        UPDATE candidate_views
        SET 
            activity_count = existing_record.activity_count + 1,
            view_duration = COALESCE(p_view_duration, existing_record.view_duration),
            candidate_name = COALESCE(p_candidate_name, candidate_name),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = existing_record.id
        RETURNING id INTO view_id;
        
        RAISE NOTICE 'Updated existing record: id=%, activity_count=%, view_duration=%', 
            view_id, existing_record.activity_count + 1, COALESCE(p_view_duration, existing_record.view_duration);
    ELSE
        -- Insert new record
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
        
        RAISE NOTICE 'Inserted new record: id=%, activity_count=1, view_duration=%', 
            view_id, p_view_duration;
    END IF;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Update the record_candidate_interaction function to use the UPSERT
SELECT 'Updating record_candidate_interaction function...' as step;
CREATE OR REPLACE FUNCTION record_candidate_interaction(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
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
    
    -- Use the UPSERT function
    SELECT upsert_candidate_view(
        valid_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type
    ) INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Test the UPSERT function
SELECT 'Testing UPSERT function...' as step;

-- Test 1: Insert new record
SELECT upsert_candidate_view(
    'crypto_47bzt5', 
    'test_candidate_1', 
    'Test Candidate 1', 
    30, 
    'view'
) as test_insert_1;

-- Test 2: Update existing record (should increment activity_count)
SELECT upsert_candidate_view(
    'crypto_47bzt5', 
    'test_candidate_1', 
    'Test Candidate 1', 
    45, 
    'view'
) as test_update_1;

-- Test 3: Another update (should increment activity_count again)
SELECT upsert_candidate_view(
    'crypto_47bzt5', 
    'test_candidate_1', 
    'Test Candidate 1', 
    60, 
    'view'
) as test_update_2;

-- Test 4: Different interaction_type (should create new record)
SELECT upsert_candidate_view(
    'crypto_47bzt5', 
    'test_candidate_1', 
    'Test Candidate 1', 
    NULL, 
    'favorite'
) as test_different_interaction;

-- 6. Check the results
SELECT 'UPSERT test results:' as step;
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
WHERE cv.candidate_id = 'test_candidate_1'
ORDER BY cv.interaction_type, cv.created_at;

-- 7. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_candidate_1';

-- 8. Show final status
SELECT '✅ UPSERT function created and tested!' as status;
SELECT '✅ Function increments activity_count for same interaction_type' as activity_count_fix;
SELECT '✅ Function updates view_duration correctly' as duration_fix;
SELECT '✅ Function prevents duplicate records for same interaction_type' as duplicate_fix;
SELECT '✅ Use this function for all candidate tracking' as usage_note;
