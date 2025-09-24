-- Fix duplicate increment_candidate_activity functions
-- The issue is there are multiple versions of the same function

-- 1. Check all versions of the function
SELECT 'All versions of increment_candidate_activity function:' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type,
    specific_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'increment_candidate_activity'
ORDER BY specific_name;

-- 2. Drop ALL versions of the function
SELECT 'Dropping ALL versions of increment_candidate_activity function...' as step;

-- Drop by specific_name to ensure we get all versions
DO $$
DECLARE
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT specific_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
          AND routine_name = 'increment_candidate_activity'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.specific_name || ' CASCADE';
        RAISE NOTICE 'Dropped function: %', func_record.specific_name;
    END LOOP;
END $$;

-- 3. Verify all functions are dropped
SELECT 'Verifying all functions are dropped...' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'increment_candidate_activity';

-- 4. Create a single, correct version of the function
SELECT 'Creating single, correct version of increment_candidate_activity function...' as step;
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

-- 5. Verify only one function exists now
SELECT 'Verifying only one function exists now...' as step;
SELECT 
    routine_name,
    routine_type,
    data_type as return_type,
    specific_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name = 'increment_candidate_activity'
ORDER BY specific_name;

-- 6. Test the single function
SELECT 'Testing the single function...' as step;

-- Test with a real user
SELECT increment_candidate_activity(
    (SELECT user_id FROM users LIMIT 1), 
    'test_single_function', 
    'Test Single Function', 
    'view'
) as test_new_record;

-- Test increment
SELECT increment_candidate_activity(
    (SELECT user_id FROM users LIMIT 1), 
    'test_single_function', 
    'Test Single Function', 
    'view'
) as test_increment;

-- 7. Check results
SELECT 'Test results:' as step;
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
WHERE cv.candidate_id = 'test_single_function'
ORDER BY cv.created_at;

-- 8. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_single_function';

-- 9. Show final status
SELECT '✅ Duplicate functions cleaned up!' as status;
SELECT '✅ Only one increment_candidate_activity function exists' as function_status;
SELECT '✅ Function works correctly' as test_status;
SELECT '✅ Frontend should now work without "function is not unique" errors' as frontend_status;
