-- Create the essential tracking functions

-- 1. Create the analytics function
CREATE OR REPLACE FUNCTION candidate_tracking_get_analytics(
    p_candidate_id VARCHAR(255)
)
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

-- 2. Create the record view function
CREATE OR REPLACE FUNCTION candidate_tracking_record_view(
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
        page_views
    ) VALUES (
        p_user_id, 
        p_candidate_id, 
        p_candidate_name, 
        p_view_duration, 
        p_interaction_type,
        1
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Create the get existing anonymous user function
CREATE OR REPLACE FUNCTION get_existing_anonymous_user()
RETURNS VARCHAR(255) AS $$
DECLARE
    anonymous_user_id VARCHAR(255);
BEGIN
    SELECT user_id INTO anonymous_user_id
    FROM users 
    WHERE user_type = 'Anonymous' 
    ORDER BY created_at DESC 
    LIMIT 1;
    
    RETURN anonymous_user_id;
END;
$$ LANGUAGE plpgsql;

-- 4. Create the get existing authenticated user function
CREATE OR REPLACE FUNCTION get_existing_authenticated_user(
    p_auth_user_id UUID
)
RETURNS VARCHAR(255) AS $$
DECLARE
    existing_user_id VARCHAR(255);
BEGIN
    SELECT user_id INTO existing_user_id
    FROM users 
    WHERE auth_user_id = p_auth_user_id;
    
    RETURN existing_user_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Create the user viewing history function
CREATE OR REPLACE FUNCTION candidate_tracking_get_user_history(
    p_user_id VARCHAR(255),
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    candidate_id VARCHAR(255),
    candidate_name VARCHAR(255),
    total_views BIGINT,
    total_favorites BIGINT,
    total_clicks BIGINT,
    total_ai_views BIGINT,
    avg_view_duration NUMERIC,
    last_viewed TIMESTAMPTZ,
    first_viewed TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cv.candidate_id::VARCHAR(255),
        MAX(cv.candidate_name)::VARCHAR(255),
        COUNT(*)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END)::BIGINT,
        COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END)::BIGINT,
        ROUND(AVG(cv.view_duration)::NUMERIC, 2),
        MAX(cv.created_at)::TIMESTAMPTZ,
        MIN(cv.created_at)::TIMESTAMPTZ
    FROM candidate_views cv
    WHERE cv.user_id = p_user_id
      AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    GROUP BY cv.candidate_id
    ORDER BY total_views DESC;
END;
$$ LANGUAGE plpgsql;

-- 6. Create the top viewed candidates function
CREATE OR REPLACE FUNCTION candidate_tracking_get_top_candidates(
    p_limit INTEGER DEFAULT 10,
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    candidate_id VARCHAR(255),
    candidate_name VARCHAR(255),
    total_views BIGINT,
    unique_users BIGINT,
    total_favorites BIGINT,
    total_clicks BIGINT,
    total_ai_views BIGINT,
    hotness_score INTEGER,
    last_viewed TIMESTAMPTZ
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
        LEAST(100, GREATEST(0, 
            (COUNT(*) * 2) + 
            (COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) * 5) + 
            (COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 3) + 
            (COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) * 4) + 
            (CASE WHEN AVG(cv.view_duration) > 30 THEN 10 ELSE 0 END)
        ))::INTEGER,
        MAX(cv.created_at)::TIMESTAMPTZ
    FROM candidate_views cv
    WHERE cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    GROUP BY cv.candidate_id
    ORDER BY hotness_score DESC, total_views DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- 7. Set up RLS policies
DROP POLICY IF EXISTS "Allow all users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow reading candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow updating candidate views" ON candidate_views;

CREATE POLICY "Allow all users to insert candidate views" 
ON candidate_views FOR INSERT 
TO authenticated, anon 
WITH CHECK (true);

CREATE POLICY "Allow reading candidate views" 
ON candidate_views FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Allow updating candidate views" 
ON candidate_views FOR UPDATE 
TO authenticated, anon 
USING (true);

-- 8. Enable RLS
ALTER TABLE candidate_views ENABLE ROW LEVEL SECURITY;

-- 9. Add comments
COMMENT ON FUNCTION candidate_tracking_get_analytics IS 'Returns detailed analytics for a specific candidate including hotness score';
COMMENT ON FUNCTION candidate_tracking_record_view IS 'Records a candidate view or interaction';
COMMENT ON FUNCTION get_existing_anonymous_user IS 'Gets an existing anonymous user from users table';
COMMENT ON FUNCTION get_existing_authenticated_user IS 'Gets existing authenticated user by auth_user_id';
COMMENT ON FUNCTION candidate_tracking_get_user_history IS 'Returns viewing history for a specific user';
COMMENT ON FUNCTION candidate_tracking_get_top_candidates IS 'Returns top viewed candidates with hotness scores';

-- 10. Test the functions
SELECT 'Testing essential functions...' as step;

-- Test analytics function with a non-existent candidate (should return empty)
SELECT * FROM candidate_tracking_get_analytics('non_existent_candidate'::VARCHAR(255));

-- Test getting anonymous user
SELECT get_existing_anonymous_user() as anonymous_user_id;

-- Test getting authenticated user
SELECT get_existing_authenticated_user('a28bd469-9733-4436-b40e-f80f43b8a58d'::UUID) as authenticated_user_id;

SELECT '✅ Essential tracking functions created successfully!' as status;
