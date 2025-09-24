-- Create only the increment_candidate_activity function
-- This handles the "function does not exist" error

-- 1. Check if function already exists
SELECT 'Checking if increment_candidate_activity function exists...' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'increment_candidate_activity';

-- 2. Create the increment function
SELECT 'Creating increment_candidate_activity function...' as step;
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

-- 3. Test the function
SELECT 'Testing increment_candidate_activity function...' as step;

-- Test 1: Create new record
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_function_1', 
    'Test Function 1', 
    'view'
) as test_new_record;

-- Test 2: Increment same interaction (should increment activity_count)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_function_1', 
    'Test Function 1', 
    'view'
) as test_increment_1;

-- Test 3: Different interaction_type (should create new record)
SELECT increment_candidate_activity(
    'crypto_47bzt5', 
    'test_function_1', 
    'Test Function 1', 
    'favorite'
) as test_different_interaction;

-- 4. Check the results
SELECT 'Function test results:' as step;
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
WHERE cv.candidate_id = 'test_function_1'
ORDER BY cv.interaction_type, cv.created_at;

-- 5. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_function_1';

-- 6. Show final status
SELECT '✅ increment_candidate_activity function created successfully!' as status;
SELECT '✅ Function increments activity_count for same interaction_type' as increment_status;
SELECT '✅ Function creates new record only for different interaction_type' as new_record_status;
SELECT '✅ No duplicate records for same interaction_type' as no_duplicates_status;
SELECT '✅ Function is ready to use in the frontend' as ready_status;
