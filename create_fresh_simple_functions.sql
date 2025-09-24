-- Create fresh, simple tracking functions with unique names
-- No conflicts, clean slate approach

-- 1. Create simple function to get existing anonymous user
CREATE OR REPLACE FUNCTION simple_get_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anon_user_id VARCHAR(255);
BEGIN
    SELECT user_id INTO anon_user_id
    FROM users
    WHERE user_type = 'Anonymous'
    ORDER BY created_at DESC
    LIMIT 1;
    
    RETURN anon_user_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Create simple function to get existing authenticated user
CREATE OR REPLACE FUNCTION simple_get_authenticated_user(p_auth_user_id UUID)
RETURNS VARCHAR(255) AS $$
DECLARE
    auth_user_id_str VARCHAR(255);
BEGIN
    SELECT user_id INTO auth_user_id_str
    FROM users
    WHERE auth_user_id = p_auth_user_id
    LIMIT 1;
    
    RETURN auth_user_id_str;
END;
$$ LANGUAGE plpgsql;

-- 3. Create simple function to record candidate view
CREATE OR REPLACE FUNCTION simple_record_view(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
BEGIN
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
END;
$$ LANGUAGE plpgsql;

-- 4. Create simple analytics function
CREATE OR REPLACE FUNCTION simple_get_analytics(p_candidate_id VARCHAR(255))
RETURNS TABLE(
    candidate_id VARCHAR(255),
    candidate_name VARCHAR(255),
    total_views BIGINT,
    unique_users BIGINT,
    total_favorites BIGINT,
    total_clicks BIGINT,
    total_ai_views BIGINT,
    avg_view_duration NUMERIC,
    hotness_score INTEGER,
    last_viewed TIMESTAMPTZ,
    first_viewed TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
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
    WHERE cv.candidate_id = p_candidate_id
    GROUP BY cv.candidate_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Test the fresh functions
SELECT 'Testing fresh simple functions...' as step;

-- Test getting anonymous user
SELECT simple_get_anonymous_user() as anonymous_user;

-- Test getting authenticated user
SELECT simple_get_authenticated_user('a28bd469-9733-4436-b40e-f80f43b8a58d'::UUID) as authenticated_user;

-- Test recording a view
SELECT simple_record_view('crypto_47bzt5', 'test_fresh_candidate', 'Test Fresh Candidate', NULL, 'view') as test_record;

-- Test analytics
SELECT * FROM simple_get_analytics('test_fresh_candidate');

-- 6. Clean up test record
DELETE FROM candidate_views WHERE candidate_id = 'test_fresh_candidate';

-- 7. Show final status
SELECT '✅ Fresh simple functions created successfully!' as status;
SELECT '✅ No function conflicts' as conflict_status;
SELECT '✅ Ready to use in tracking service' as ready_status;

-- 8. Show available functions
SELECT 'Available functions:' as info;
SELECT routine_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE 'simple_%'
ORDER BY routine_name;
