-- Update analytics functions to work with activity_count column

-- 1. Update the main analytics function to use activity_count
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
        SUM(cv.activity_count)::BIGINT,  -- Use SUM of activity_count instead of COUNT
        COUNT(DISTINCT cv.user_id)::BIGINT,
        SUM(CASE WHEN cv.interaction_type = 'favorite' THEN cv.activity_count ELSE 0 END)::BIGINT,
        SUM(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN cv.activity_count ELSE 0 END)::BIGINT,
        SUM(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN cv.activity_count ELSE 0 END)::BIGINT,
        ROUND(AVG(cv.view_duration)::NUMERIC, 2),
        LEAST(100, GREATEST(0, 
            (SUM(cv.activity_count) * 2) +  -- Use SUM of activity_count
            (SUM(CASE WHEN cv.interaction_type = 'favorite' THEN cv.activity_count ELSE 0 END) * 5) + 
            (SUM(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN cv.activity_count ELSE 0 END) * 3) + 
            (SUM(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN cv.activity_count ELSE 0 END) * 4) + 
            (CASE WHEN AVG(cv.view_duration) > 30 THEN 10 ELSE 0 END)
        ))::INTEGER,
        MAX(cv.created_at)::TIMESTAMPTZ,
        MIN(cv.created_at)::TIMESTAMPTZ
    FROM candidate_views cv
    WHERE cv.candidate_id = p_candidate_id
    GROUP BY cv.candidate_id;
END;
$$ LANGUAGE plpgsql;

-- 2. Update the user viewing history function
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
        SUM(cv.activity_count)::BIGINT,  -- Use SUM of activity_count
        SUM(CASE WHEN cv.interaction_type = 'favorite' THEN cv.activity_count ELSE 0 END)::BIGINT,
        SUM(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN cv.activity_count ELSE 0 END)::BIGINT,
        SUM(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN cv.activity_count ELSE 0 END)::BIGINT,
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

-- 3. Update the top viewed candidates function
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
        SUM(cv.activity_count)::BIGINT,  -- Use SUM of activity_count
        COUNT(DISTINCT cv.user_id)::BIGINT,
        SUM(CASE WHEN cv.interaction_type = 'favorite' THEN cv.activity_count ELSE 0 END)::BIGINT,
        SUM(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN cv.activity_count ELSE 0 END)::BIGINT,
        SUM(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN cv.activity_count ELSE 0 END)::BIGINT,
        LEAST(100, GREATEST(0, 
            (SUM(cv.activity_count) * 2) +  -- Use SUM of activity_count
            (SUM(CASE WHEN cv.interaction_type = 'favorite' THEN cv.activity_count ELSE 0 END) * 5) + 
            (SUM(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN cv.activity_count ELSE 0 END) * 3) + 
            (SUM(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN cv.activity_count ELSE 0 END) * 4) + 
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

-- 4. Test the updated functions
SELECT 'Testing updated analytics functions...' as step;

-- Test with a non-existent candidate (should return empty)
SELECT * FROM candidate_tracking_get_analytics('non_existent_candidate'::VARCHAR(255));

-- Test with an existing candidate if any data exists
SELECT 'Testing with existing data...' as step;
SELECT * FROM candidate_views LIMIT 5;

-- If there's existing data, test with the first candidate_id
DO $$
DECLARE
    test_candidate_id VARCHAR(255);
BEGIN
    SELECT candidate_id INTO test_candidate_id 
    FROM candidate_views 
    LIMIT 1;
    
    IF test_candidate_id IS NOT NULL THEN
        RAISE NOTICE 'Testing analytics for candidate: %', test_candidate_id;
        PERFORM * FROM candidate_tracking_get_analytics(test_candidate_id);
    ELSE
        RAISE NOTICE 'No existing data to test with';
    END IF;
END $$;

-- 5. Show the updated function signatures
SELECT 'Updated function signatures:' as info;
SELECT routine_name, routine_definition
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name LIKE 'candidate_tracking_%'
ORDER BY routine_name;

SELECT '✅ Analytics functions updated to work with activity_count!' as status;
