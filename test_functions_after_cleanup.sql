-- Test the functions after cleanup to ensure they work correctly

-- 1. Test inserting some sample data
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    interaction_type,
    page_views,
    view_duration
) VALUES 
    ('test_user_1', 'candidate_123', 'John Doe', 'view', 1, 30),
    ('test_user_1', 'candidate_123', 'John Doe', 'favorite', 1, NULL),
    ('test_user_2', 'candidate_123', 'John Doe', 'view', 1, 45),
    ('test_user_2', 'candidate_123', 'John Doe', 'click', 1, NULL),
    ('test_user_1', 'candidate_456', 'Jane Smith', 'view', 1, 60),
    ('test_user_1', 'candidate_456', 'Jane Smith', 'ai_analysis_view', 1, NULL)
ON CONFLICT DO NOTHING;

-- 2. Test get_candidate_analytics function
SELECT 'Testing get_candidate_analytics...' as test;
SELECT * FROM get_candidate_analytics('candidate_123'::VARCHAR(255));

-- 3. Test get_user_viewing_history function
SELECT 'Testing get_user_viewing_history...' as test;
SELECT * FROM get_user_viewing_history('test_user_1'::VARCHAR(255), 30::INTEGER);

-- 4. Test get_top_viewed_candidates function
SELECT 'Testing get_top_viewed_candidates...' as test;
SELECT * FROM get_top_viewed_candidates(5::INTEGER, 30::INTEGER);

-- 5. Test record_candidate_view function
SELECT 'Testing record_candidate_view...' as test;
SELECT record_candidate_view(
    'test_user_3'::VARCHAR(255),
    'candidate_789'::VARCHAR(255),
    'Test Candidate'::VARCHAR(255),
    25::INTEGER,
    'view'::VARCHAR(50)
);

-- 6. Verify the record was inserted
SELECT 'Verifying record_candidate_view insert...' as test;
SELECT * FROM candidate_views WHERE user_id = 'test_user_3' AND candidate_id = 'candidate_789';

-- 7. Test analytics for the new candidate
SELECT 'Testing analytics for new candidate...' as test;
SELECT * FROM get_candidate_analytics('candidate_789'::VARCHAR(255));

-- 8. Clean up test data
DELETE FROM candidate_views WHERE user_id IN ('test_user_1', 'test_user_2', 'test_user_3');

SELECT 'All function tests completed successfully!' as status;
