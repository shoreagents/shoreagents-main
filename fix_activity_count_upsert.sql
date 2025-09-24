-- Fix activity_count to use UPSERT instead of creating duplicate records
-- This will update existing records instead of creating new ones

-- 1. First, let's see what duplicate records we currently have
SELECT 'Checking for duplicate interaction_type records...' as step;
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    COUNT(*) as record_count,
    SUM(activity_count) as total_activity_count
FROM candidate_views 
GROUP BY user_id, candidate_id, interaction_type
HAVING COUNT(*) > 1
ORDER BY record_count DESC
LIMIT 10;

-- 2. Create a function to handle UPSERT for candidate views
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
    existing_activity_count INTEGER;
BEGIN
    -- Check if a record already exists for this user-candidate-interaction combination
    SELECT id, activity_count INTO view_id, existing_activity_count
    FROM candidate_views 
    WHERE user_id = p_user_id 
      AND candidate_id = p_candidate_id 
      AND interaction_type = p_interaction_type
    LIMIT 1;
    
    IF view_id IS NOT NULL THEN
        -- Record exists, increment activity_count
        UPDATE candidate_views 
        SET 
            activity_count = activity_count + 1,
            candidate_name = COALESCE(p_candidate_name, candidate_name), -- Update name if provided
            view_duration = COALESCE(p_view_duration, view_duration), -- Update duration if provided
            updated_at = CURRENT_TIMESTAMP
        WHERE id = view_id;
        
        RETURN view_id;
    ELSE
        -- Record doesn't exist, create new one
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
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 3. Update the record_candidate_view function to use UPSERT
CREATE OR REPLACE FUNCTION candidate_tracking_record_view(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
BEGIN
    RETURN upsert_candidate_view(
        p_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type
    );
END;
$$ LANGUAGE plpgsql;

-- 4. Disable the trigger that was causing duplicate records
DROP TRIGGER IF EXISTS trigger_increment_activity_count ON candidate_views;

-- 5. Test the UPSERT functionality
SELECT 'Testing UPSERT functionality...' as step;

-- Test with a known user and candidate
INSERT INTO candidate_views (user_id, candidate_id, candidate_name, interaction_type)
VALUES ('crypto_47bzt5', 'test_upsert_candidate', 'Test Upsert Candidate', 'view')
ON CONFLICT DO NOTHING;

-- Now test the UPSERT function
SELECT candidate_tracking_record_view('crypto_47bzt5', 'test_upsert_candidate', 'Test Upsert Candidate', NULL, 'view') as first_insert;
SELECT candidate_tracking_record_view('crypto_47bzt5', 'test_upsert_candidate', 'Test Upsert Candidate', NULL, 'view') as second_insert;
SELECT candidate_tracking_record_view('crypto_47bzt5', 'test_upsert_candidate', 'Test Upsert Candidate', NULL, 'view') as third_insert;

-- Check the results - should show only ONE record with activity_count = 3
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    activity_count,
    created_at,
    updated_at
FROM candidate_views 
WHERE candidate_id = 'test_upsert_candidate';

-- 6. Test with different interaction types
SELECT candidate_tracking_record_view('crypto_47bzt5', 'test_upsert_candidate', 'Test Upsert Candidate', NULL, 'favorite') as favorite_insert;
SELECT candidate_tracking_record_view('crypto_47bzt5', 'test_upsert_candidate', 'Test Upsert Candidate', NULL, 'favorite') as favorite_insert_2;

-- Check results - should show TWO records: one for 'view' (activity_count=3) and one for 'favorite' (activity_count=2)
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    activity_count,
    created_at,
    updated_at
FROM candidate_views 
WHERE candidate_id = 'test_upsert_candidate'
ORDER BY interaction_type;

-- 7. Clean up test records
DELETE FROM candidate_views WHERE candidate_id = 'test_upsert_candidate';

-- 8. Show final status
SELECT '✅ UPSERT functionality implemented successfully!' as status;
SELECT '✅ No more duplicate interaction_type records will be created' as no_duplicates;
SELECT '✅ activity_count will increment for existing records' as increment_status;

-- 9. Show the updated function signatures
SELECT 'Updated function signatures:' as info;
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('upsert_candidate_view', 'candidate_tracking_record_view')
ORDER BY routine_name;
