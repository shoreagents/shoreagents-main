-- Comprehensive debug script for analytics function issues

-- 1. Check if candidate_views table has any data
SELECT 'Step 1: Check candidate_views data' as step;
SELECT COUNT(*) as total_records FROM candidate_views;
SELECT user_id, candidate_id, candidate_name, interaction_type, created_at 
FROM candidate_views 
ORDER BY created_at DESC 
LIMIT 5;

-- 2. Check if the function exists and its signature
SELECT 'Step 2: Check function signature' as step;
SELECT 
    routine_name,
    routine_type,
    data_type,
    specific_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'get_candidate_analytics'
AND routine_schema = 'public';

-- 3. Test the function with a candidate that has data
SELECT 'Step 3: Test function with existing data' as step;
DO $$
DECLARE
    test_candidate_id VARCHAR(255);
    result_count INTEGER;
BEGIN
    -- Get a candidate_id that has data
    SELECT candidate_id INTO test_candidate_id 
    FROM candidate_views 
    LIMIT 1;
    
    IF test_candidate_id IS NOT NULL THEN
        RAISE NOTICE 'Testing with candidate_id: %', test_candidate_id;
        
        -- Test the function and count results
        SELECT COUNT(*) INTO result_count
        FROM get_candidate_analytics(test_candidate_id);
        
        RAISE NOTICE 'Function returned % rows', result_count;
        
        -- Show the actual result
        PERFORM * FROM get_candidate_analytics(test_candidate_id);
    ELSE
        RAISE NOTICE 'No candidate_views data found to test with';
    END IF;
END $$;

-- 4. Test the function with a candidate that has NO data
SELECT 'Step 4: Test function with non-existent candidate' as step;
SELECT 'Testing with non-existent candidate_id...' as test;
SELECT COUNT(*) as result_count FROM get_candidate_analytics('non_existent_candidate_12345');

-- 5. Test the raw query that the function uses
SELECT 'Step 5: Test raw query from function' as step;
DO $$
DECLARE
    test_candidate_id VARCHAR(255);
BEGIN
    -- Get a candidate_id that has data
    SELECT candidate_id INTO test_candidate_id 
    FROM candidate_views 
    LIMIT 1;
    
    IF test_candidate_id IS NOT NULL THEN
        RAISE NOTICE 'Testing raw query with candidate_id: %', test_candidate_id;
        
        -- This is the exact query from the function
        PERFORM 
            cv.candidate_id::VARCHAR(255),
            MAX(cv.candidate_name)::VARCHAR(255),
            COUNT(*)::BIGINT,
            COUNT(DISTINCT cv.user_id)::BIGINT,
            COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END)::BIGINT,
            COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END)::BIGINT,
            COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END)::BIGINT,
            ROUND(AVG(cv.view_duration)::NUMERIC, 2),
            LEAST(100, GREATEST(0, 
                (COUNT(*) * 2) + 
                (COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) * 5) + 
                (COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 3) + 
                (COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) * 4) + 
                (CASE WHEN AVG(cv.view_duration) > 30 THEN 10 ELSE 0 END)
            ))::INTEGER,
            MAX(cv.created_at)::TIMESTAMPTZ,
            MIN(cv.created_at)::TIMESTAMPTZ
        FROM candidate_views cv
        WHERE cv.candidate_id = test_candidate_id
        GROUP BY cv.candidate_id;
        
        RAISE NOTICE 'Raw query executed successfully';
    ELSE
        RAISE NOTICE 'No data to test raw query with';
    END IF;
END $$;

-- 6. Create some test data if none exists
SELECT 'Step 6: Create test data if needed' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    interaction_type,
    page_views,
    view_duration
) VALUES 
    ('debug_user_1', 'debug_candidate_123', 'Debug Test Candidate', 'view', 1, 30),
    ('debug_user_1', 'debug_candidate_123', 'Debug Test Candidate', 'favorite', 1, NULL),
    ('debug_user_2', 'debug_candidate_123', 'Debug Test Candidate', 'view', 1, 45),
    ('debug_user_2', 'debug_candidate_123', 'Debug Test Candidate', 'click', 1, NULL)
ON CONFLICT DO NOTHING;

-- 7. Test the function with our test data
SELECT 'Step 7: Test function with test data' as step;
SELECT * FROM get_candidate_analytics('debug_candidate_123'::VARCHAR(255));

-- 8. Test with a candidate that has no data (should return empty result)
SELECT 'Step 8: Test function with no data' as step;
SELECT 'Testing with candidate that has no data...' as test;
SELECT * FROM get_candidate_analytics('candidate_with_no_data_999'::VARCHAR(255));

-- 9. Clean up test data
DELETE FROM candidate_views WHERE user_id IN ('debug_user_1', 'debug_user_2');

SELECT 'Debug analysis complete' as status;
