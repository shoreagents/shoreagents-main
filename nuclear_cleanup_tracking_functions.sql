-- Nuclear cleanup - removes ALL functions and recreates them with unique names

-- 1. First, let's see what functions actually exist
SELECT 'Current functions in database:' as step;
SELECT 
    routine_name, 
    routine_type,
    data_type,
    specific_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%candidate%' OR routine_name LIKE '%analytics%'
AND routine_schema = 'public'
ORDER BY routine_name, specific_name;

-- 2. Drop functions by specific_name (more precise)
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Get all functions that match our pattern
    FOR func_record IN 
        SELECT specific_name, routine_name
        FROM information_schema.routines 
        WHERE routine_name IN ('get_candidate_analytics', 'get_user_viewing_history', 'get_top_viewed_candidates', 'record_candidate_view')
        AND routine_schema = 'public'
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.specific_name || ' CASCADE';
        RAISE NOTICE 'Dropped function: %', func_record.specific_name;
    END LOOP;
END $$;

-- 3. Verify all functions are dropped
SELECT 'Functions after cleanup:' as step;
SELECT 
    routine_name, 
    routine_type,
    data_type,
    specific_name
FROM information_schema.routines 
WHERE routine_name IN ('get_candidate_analytics', 'get_user_viewing_history', 'get_top_viewed_candidates', 'record_candidate_view')
AND routine_schema = 'public'
ORDER BY routine_name, specific_name;

-- 4. Create functions with unique names to avoid conflicts
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

-- 5. Set up RLS policies
DROP POLICY IF EXISTS "Allow authenticated users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow anonymous users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow reading candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow updating candidate views" ON candidate_views;

CREATE POLICY "Allow authenticated users to insert candidate views" 
ON candidate_views FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Allow anonymous users to insert candidate views" 
ON candidate_views FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow reading candidate views" 
ON candidate_views FOR SELECT 
TO authenticated, anon 
USING (true);

CREATE POLICY "Allow updating candidate views" 
ON candidate_views FOR UPDATE 
TO authenticated, anon 
USING (true);

-- 6. Enable RLS
ALTER TABLE candidate_views ENABLE ROW LEVEL SECURITY;

-- 7. Add comments
COMMENT ON FUNCTION candidate_tracking_record_view IS 'Records a candidate view or interaction with candidate name from BPOC API';
COMMENT ON FUNCTION candidate_tracking_get_analytics IS 'Returns detailed analytics for a specific candidate including hotness score';
COMMENT ON FUNCTION candidate_tracking_get_user_history IS 'Returns viewing history for a specific user';
COMMENT ON FUNCTION candidate_tracking_get_top_candidates IS 'Returns top viewed candidates with hotness scores';

-- 8. Test the new functions
SELECT 'Testing new functions...' as step;

-- Insert test data
SELECT candidate_tracking_record_view(
    'test_user_nuclear'::VARCHAR(255),
    'test_candidate_nuclear'::VARCHAR(255),
    'Nuclear Test Candidate'::VARCHAR(255),
    30::INTEGER,
    'view'::VARCHAR(50)
);

-- Test analytics
SELECT * FROM candidate_tracking_get_analytics('test_candidate_nuclear'::VARCHAR(255));

-- Test user history
SELECT * FROM candidate_tracking_get_user_history('test_user_nuclear'::VARCHAR(255), 30::INTEGER);

-- Test top candidates
SELECT * FROM candidate_tracking_get_top_candidates(5::INTEGER, 30::INTEGER);

-- 9. Clean up test data
DELETE FROM candidate_views WHERE user_id = 'test_user_nuclear';

SELECT '✅ Nuclear cleanup complete! New functions created with unique names.' as status;
