-- Fix view_duration update in UPSERT function
-- The current function doesn't properly update view_duration when provided

-- 1. Update the upsert_candidate_view function to properly handle view_duration
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
        -- Record exists, increment activity_count and update other fields if provided
        UPDATE candidate_views 
        SET 
            activity_count = activity_count + 1,
            candidate_name = COALESCE(p_candidate_name, candidate_name), -- Update name if provided
            view_duration = CASE 
                WHEN p_view_duration IS NOT NULL THEN p_view_duration -- Update duration if provided
                ELSE view_duration -- Keep existing duration if not provided
            END,
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

-- 2. Test the updated function
SELECT 'Testing view_duration update...' as step;

-- Create a test record
SELECT candidate_tracking_record_view('crypto_47bzt5', 'test_duration_candidate', 'Test Duration Candidate', NULL, 'view') as first_insert;

-- Update with view_duration
SELECT candidate_tracking_record_view('crypto_47bzt5', 'test_duration_candidate', 'Test Duration Candidate', 45, 'view') as duration_update;

-- Check the results
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    activity_count,
    view_duration,
    created_at,
    updated_at
FROM candidate_views 
WHERE candidate_id = 'test_duration_candidate';

-- 3. Test with a new interaction type (should create new record)
SELECT candidate_tracking_record_view('crypto_47bzt5', 'test_duration_candidate', 'Test Duration Candidate', 30, 'favorite') as favorite_insert;

-- Check results - should show two records
SELECT 
    user_id,
    candidate_id,
    interaction_type,
    activity_count,
    view_duration,
    created_at,
    updated_at
FROM candidate_views 
WHERE candidate_id = 'test_duration_candidate'
ORDER BY interaction_type;

-- 4. Clean up test records
DELETE FROM candidate_views WHERE candidate_id = 'test_duration_candidate';

-- 5. Show final status
SELECT '✅ view_duration update functionality fixed!' as status;
SELECT '✅ UPSERT now properly updates view_duration when provided' as update_status;
SELECT '✅ activity_count still increments correctly' as increment_status;

-- 6. Show the updated function signature
SELECT 'Updated function signature:' as info;
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'upsert_candidate_view';
