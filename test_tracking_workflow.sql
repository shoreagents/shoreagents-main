-- Test the complete tracking workflow

-- 1. Insert some test tracking data
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    interaction_type,
    page_views,
    view_duration
) VALUES 
    ('anon_1234567890_abcdef123', 'candidate_001', 'John Doe', 'view', 1, 30),
    ('anon_1234567890_abcdef123', 'candidate_001', 'John Doe', 'favorite', 1, NULL),
    ('anon_1234567890_abcdef123', 'candidate_001', 'John Doe', 'click', 1, NULL),
    ('user_authenticated_456', 'candidate_001', 'John Doe', 'view', 1, 45),
    ('user_authenticated_456', 'candidate_001', 'John Doe', 'ai_analysis_view', 1, NULL),
    ('anon_1234567890_abcdef123', 'candidate_002', 'Jane Smith', 'view', 1, 60),
    ('user_authenticated_456', 'candidate_002', 'Jane Smith', 'view', 1, 25)
ON CONFLICT DO NOTHING;

-- 2. Test analytics for candidate_001 (should have data)
SELECT 'Testing analytics for candidate_001 (has data)' as test;
SELECT * FROM get_candidate_analytics('candidate_001'::VARCHAR(255));

-- 3. Test analytics for candidate_002 (should have data)
SELECT 'Testing analytics for candidate_002 (has data)' as test;
SELECT * FROM get_candidate_analytics('candidate_002'::VARCHAR(255));

-- 4. Test analytics for candidate_003 (should have no data)
SELECT 'Testing analytics for candidate_003 (no data)' as test;
SELECT * FROM get_candidate_analytics('candidate_003'::VARCHAR(255));

-- 5. Test top viewed candidates
SELECT 'Testing top viewed candidates' as test;
SELECT * FROM get_top_viewed_candidates(5::INTEGER, 30::INTEGER);

-- 6. Test user viewing history
SELECT 'Testing user viewing history for anonymous user' as test;
SELECT * FROM get_user_viewing_history('anon_1234567890_abcdef123'::VARCHAR(255), 30::INTEGER);

-- 7. Test user viewing history for authenticated user
SELECT 'Testing user viewing history for authenticated user' as test;
SELECT * FROM get_user_viewing_history('user_authenticated_456'::VARCHAR(255), 30::INTEGER);

-- 8. Show all candidate_views data
SELECT 'All candidate_views data' as test;
SELECT user_id, candidate_id, candidate_name, interaction_type, view_duration, created_at 
FROM candidate_views 
ORDER BY created_at DESC;

-- 9. Clean up test data
DELETE FROM candidate_views WHERE user_id IN ('anon_1234567890_abcdef123', 'user_authenticated_456');

SELECT 'Tracking workflow test complete' as status;
