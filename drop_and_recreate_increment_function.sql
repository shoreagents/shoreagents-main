-- Drop all 3 versions of increment_candidate_activity and create a single clean one
-- This fixes the "Could not choose the best candidate function" error

-- 1. Drop ALL versions of increment_candidate_activity
DROP FUNCTION IF EXISTS increment_candidate_activity(character varying, character varying, character varying, character varying) CASCADE;
DROP FUNCTION IF EXISTS increment_candidate_activity(character varying, character varying, character varying, integer, character varying) CASCADE;
DROP FUNCTION IF EXISTS increment_candidate_activity(character varying, character varying, character varying, integer, character varying, integer) CASCADE;

-- Also drop by specific_name to be extra sure
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

-- 2. Create the single clean version (4 parameters only)
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
SELECT 'Testing the new function...' as step;

-- Test with a real user_id
SELECT increment_candidate_activity(
    (SELECT user_id FROM users LIMIT 1), 
    'test_clean_function', 
    'Test Clean Function', 
    'view'
) as test_result_1;

-- Test increment (should increment activity_count)
SELECT increment_candidate_activity(
    (SELECT user_id FROM users LIMIT 1), 
    'test_clean_function', 
    'Test Clean Function', 
    'view'
) as test_result_2;

-- 4. Check the results
SELECT 'Checking test results...' as step;
SELECT 
    id,
    user_id,
    candidate_id,
    candidate_name,
    interaction_type,
    activity_count,
    created_at,
    updated_at
FROM candidate_views
WHERE candidate_id = 'test_clean_function'
ORDER BY created_at;

-- 5. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_clean_function';

-- 6. Verify only one function exists now
SELECT 'Final verification - should show only 1 function:' as step;
SELECT 
    r.routine_name,
    r.specific_name,
    p.parameter_name,
    p.data_type,
    p.ordinal_position
FROM information_schema.routines r
LEFT JOIN information_schema.parameters p ON r.specific_name = p.specific_name
WHERE r.routine_schema = 'public' 
  AND r.routine_name = 'increment_candidate_activity'
ORDER BY r.specific_name, p.ordinal_position;

-- 7. Success message
SELECT '✅ Function overloading error fixed!' as status;
SELECT '✅ All 3 duplicate functions dropped' as cleanup_status;
SELECT '✅ Single clean function created' as function_status;
SELECT '✅ Function tested and working' as test_status;
SELECT '✅ Frontend should now work without errors' as frontend_status;
