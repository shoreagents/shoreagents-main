-- Debug script to check candidate tracking setup

-- 1. Check if candidate_views table exists and has data
SELECT 'Checking candidate_views table...' as step;
SELECT COUNT(*) as total_records FROM candidate_views;
SELECT * FROM candidate_views LIMIT 5;

-- 2. Check if the functions exist
SELECT 'Checking if functions exist...' as step;
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name IN ('get_candidate_analytics', 'get_user_viewing_history', 'get_top_viewed_candidates', 'record_candidate_view')
AND routine_schema = 'public';

-- 3. Test the get_candidate_analytics function with a sample candidate
SELECT 'Testing get_candidate_analytics function...' as step;
-- First, let's see what candidate_ids exist
SELECT DISTINCT candidate_id FROM candidate_views LIMIT 3;

-- Test the function with the first candidate_id found
DO $$
DECLARE
    test_candidate_id VARCHAR(255);
    result_count INTEGER;
BEGIN
    -- Get a candidate_id that exists
    SELECT candidate_id INTO test_candidate_id 
    FROM candidate_views 
    LIMIT 1;
    
    IF test_candidate_id IS NOT NULL THEN
        RAISE NOTICE 'Testing with candidate_id: %', test_candidate_id;
        
        -- Test the function
        SELECT COUNT(*) INTO result_count
        FROM get_candidate_analytics(test_candidate_id);
        
        RAISE NOTICE 'Function returned % rows', result_count;
        
        -- Show the actual result
        PERFORM * FROM get_candidate_analytics(test_candidate_id);
    ELSE
        RAISE NOTICE 'No candidate_views data found to test with';
    END IF;
END $$;

-- 4. Check if there are any errors in the function definition
SELECT 'Checking function definitions...' as step;
SELECT 
    routine_name,
    data_type,
    routine_definition
FROM information_schema.routines 
WHERE routine_name = 'get_candidate_analytics'
AND routine_schema = 'public';

-- 5. Test inserting a record manually
SELECT 'Testing manual insert...' as step;
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    interaction_type
) VALUES (
    'test_user_123',
    'test_candidate_456', 
    'Test Candidate',
    'view'
) ON CONFLICT DO NOTHING;

-- Check if the insert worked
SELECT COUNT(*) as records_after_insert FROM candidate_views WHERE user_id = 'test_user_123';

-- 6. Test the function with our test data
SELECT 'Testing function with test data...' as step;
SELECT * FROM get_candidate_analytics('test_candidate_456');

-- Clean up test data
DELETE FROM candidate_views WHERE user_id = 'test_user_123';
