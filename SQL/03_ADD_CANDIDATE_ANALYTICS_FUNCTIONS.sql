-- Add the missing analytics functions for candidate tracking
-- These functions are needed by the candidateTrackingService

-- Function to get candidate analytics
CREATE OR REPLACE FUNCTION get_candidate_analytics(
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
        cv.candidate_id,
        MAX(cv.candidate_name) as candidate_name,
        COUNT(*) as total_views,
        COUNT(DISTINCT cv.user_id) as unique_users,
        COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
        COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) as total_clicks,
        COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) as total_ai_views,
        ROUND(AVG(cv.view_duration)::NUMERIC, 2) as avg_view_duration,
        -- Calculate hotness score (0-100)
        LEAST(100, GREATEST(0, 
            (COUNT(*) * 2) + -- Base views (2 points each)
            (COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) * 5) + -- Favorites (5 points each)
            (COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 3) + -- Clicks (3 points each)
            (COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) * 4) + -- AI views (4 points each)
            (CASE WHEN AVG(cv.view_duration) > 30 THEN 10 ELSE 0 END) -- Bonus for long views
        ))::INTEGER as hotness_score,
        MAX(cv.created_at) as last_viewed,
        MIN(cv.created_at) as first_viewed
    FROM candidate_views cv
    WHERE cv.candidate_id = p_candidate_id
    GROUP BY cv.candidate_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user viewing history
CREATE OR REPLACE FUNCTION get_user_viewing_history(
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
        cv.candidate_id,
        MAX(cv.candidate_name) as candidate_name,
        COUNT(*) as total_views,
        COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
        COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) as total_clicks,
        COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) as total_ai_views,
        ROUND(AVG(cv.view_duration)::NUMERIC, 2) as avg_view_duration,
        MAX(cv.created_at) as last_viewed,
        MIN(cv.created_at) as first_viewed
    FROM candidate_views cv
    WHERE cv.user_id = p_user_id
      AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    GROUP BY cv.candidate_id
    ORDER BY total_views DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get top viewed candidates
CREATE OR REPLACE FUNCTION get_top_viewed_candidates(
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
        cv.candidate_id,
        MAX(cv.candidate_name) as candidate_name,
        COUNT(*) as total_views,
        COUNT(DISTINCT cv.user_id) as unique_users,
        COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
        COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) as total_clicks,
        COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) as total_ai_views,
        -- Calculate hotness score (0-100)
        LEAST(100, GREATEST(0, 
            (COUNT(*) * 2) + -- Base views (2 points each)
            (COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) * 5) + -- Favorites (5 points each)
            (COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 3) + -- Clicks (3 points each)
            (COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) * 4) + -- AI views (4 points each)
            (CASE WHEN AVG(cv.view_duration) > 30 THEN 10 ELSE 0 END) -- Bonus for long views
        ))::INTEGER as hotness_score,
        MAX(cv.created_at) as last_viewed
    FROM candidate_views cv
    WHERE cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    GROUP BY cv.candidate_id
    ORDER BY hotness_score DESC, total_views DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to record a candidate view (simplified version)
CREATE OR REPLACE FUNCTION record_candidate_view(
    p_user_id VARCHAR(255),
    p_candidate_id VARCHAR(255),
    p_candidate_name VARCHAR(255) DEFAULT NULL,
    p_view_duration INTEGER DEFAULT NULL,
    p_interaction_type VARCHAR(50) DEFAULT 'view'
)
RETURNS INTEGER AS $$
DECLARE
    view_id INTEGER;
    actual_candidate_name VARCHAR(255);
BEGIN
    -- If candidate_name not provided, try to get it from bpoc_employees
    IF p_candidate_name IS NULL THEN
        SELECT full_name INTO actual_candidate_name
        FROM bpoc_employees
        WHERE user_id = p_candidate_id
        LIMIT 1;
    ELSE
        actual_candidate_name := p_candidate_name;
    END IF;
    
    -- Insert new view record
    INSERT INTO candidate_views (
        user_id, candidate_id, candidate_name, view_duration, interaction_type
    ) VALUES (
        p_user_id, p_candidate_id, actual_candidate_name, p_view_duration, p_interaction_type
    ) RETURNING id INTO view_id;
    
    RETURN view_id;
END;
$$ LANGUAGE plpgsql;

-- Add comments for the functions
COMMENT ON FUNCTION get_candidate_analytics IS 'Returns detailed analytics for a specific candidate including hotness score';
COMMENT ON FUNCTION get_user_viewing_history IS 'Returns viewing history for a specific user';
COMMENT ON FUNCTION get_top_viewed_candidates IS 'Returns top viewed candidates with hotness scores';
COMMENT ON FUNCTION record_candidate_view IS 'Records a candidate view or interaction';

-- Test the functions (optional - remove if not needed)
-- SELECT 'Analytics functions created successfully' as status;
