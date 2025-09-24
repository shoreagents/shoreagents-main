-- Fix the analytics function issue

-- 1. Check if the analytics function exists
SELECT 'Checking if analytics function exists...' as step;
SELECT 
    routine_name, 
    routine_type,
    data_type,
    specific_name
FROM information_schema.routines 
WHERE routine_name = 'candidate_tracking_get_analytics'
AND routine_schema = 'public';

-- 2. Test the function with a simple query first
SELECT 'Testing analytics function...' as step;

-- First, let's see what data we have
SELECT 'Current candidate_views data:' as step;
SELECT COUNT(*) as total_records FROM candidate_views;
SELECT user_id, candidate_id, candidate_name, interaction_type, created_at 
FROM candidate_views 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Test the function with existing data
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
        
        -- Test the function
        SELECT COUNT(*) INTO result_count
        FROM candidate_tracking_get_analytics(test_candidate_id);
        
        RAISE NOTICE 'Function returned % rows', result_count;
        
        -- Show the actual result
        PERFORM * FROM candidate_tracking_get_analytics(test_candidate_id);
    ELSE
        RAISE NOTICE 'No candidate_views data found to test with';
    END IF;
END $$;

-- 4. If no data exists, create some test data
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    interaction_type,
    page_views,
    view_duration
) VALUES 
    ('device_f8l5ya', 'test_candidate_analytics', 'Test Candidate for Analytics', 'view', 1, 30),
    ('device_f8l5ya', 'test_candidate_analytics', 'Test Candidate for Analytics', 'favorite', 1, NULL),
    ('crypto_47bzt5', 'test_candidate_analytics', 'Test Candidate for Analytics', 'view', 1, 45),
    ('crypto_47bzt5', 'test_candidate_analytics', 'Test Candidate for Analytics', 'ai_analysis_view', 1, NULL)
ON CONFLICT DO NOTHING;

-- 5. Test the function with our test data
SELECT 'Testing analytics function with test data...' as step;
SELECT * FROM candidate_tracking_get_analytics('test_candidate_analytics'::VARCHAR(255));

-- 6. Test with a candidate that has no data (should return empty result)
SELECT 'Testing analytics function with no data...' as step;
SELECT * FROM candidate_tracking_get_analytics('candidate_with_no_data_999'::VARCHAR(255));

-- 7. Test the raw query that the function uses
SELECT 'Testing raw query from function...' as step;
SELECT 
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
WHERE cv.candidate_id = 'test_candidate_analytics'
GROUP BY cv.candidate_id;

-- 8. Clean up test data
DELETE FROM candidate_views WHERE candidate_id = 'test_candidate_analytics';

SELECT '✅ Analytics function test complete!' as status;
