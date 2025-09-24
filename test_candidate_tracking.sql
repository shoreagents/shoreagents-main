-- Simple test script to verify candidate tracking setup

-- 1. Check if table exists and is accessible
SELECT 'Table exists check' as test, COUNT(*) as record_count FROM candidate_views;

-- 2. Test inserting a record
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    interaction_type,
    page_views
) VALUES (
    'test_user_debug',
    'test_candidate_debug', 
    'Debug Test Candidate',
    'view',
    1
) ON CONFLICT DO NOTHING;

-- 3. Verify the insert worked
SELECT 'Insert test' as test, COUNT(*) as records FROM candidate_views WHERE user_id = 'test_user_debug';

-- 4. Test the analytics function
SELECT 'Analytics function test' as test, * FROM get_candidate_analytics('test_candidate_debug');

-- 5. Clean up test data
DELETE FROM candidate_views WHERE user_id = 'test_user_debug';

-- 6. Check if functions exist
SELECT 'Function existence check' as test, routine_name 
FROM information_schema.routines 
WHERE routine_name = 'get_candidate_analytics' 
AND routine_schema = 'public';
