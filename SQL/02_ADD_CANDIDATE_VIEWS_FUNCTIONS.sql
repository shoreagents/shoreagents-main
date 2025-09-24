-- Add foreign key constraint and functions to existing candidate_views table
-- This script assumes the candidate_views table already exists

-- Check for orphaned records first
SELECT 
    cv.user_id,
    COUNT(*) as orphaned_records
FROM candidate_views cv
LEFT JOIN users u ON cv.user_id = u.user_id
WHERE u.user_id IS NULL
GROUP BY cv.user_id;

-- Add foreign key constraint (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'candidate_views_user_id_fkey'
        AND table_name = 'candidate_views'
    ) THEN
        ALTER TABLE public.candidate_views 
        ADD CONSTRAINT candidate_views_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES public.users(user_id) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE;
        
        RAISE NOTICE 'Foreign key constraint added successfully';
    ELSE
        RAISE NOTICE 'Foreign key constraint already exists';
    END IF;
END $$;

-- Add comment to document the relationship
COMMENT ON CONSTRAINT candidate_views_user_id_fkey ON public.candidate_views 
IS 'Foreign key constraint linking candidate_views.user_id to users.user_id';

-- Function to get user details with candidate views
CREATE OR REPLACE FUNCTION get_user_candidate_analytics(
    p_user_id VARCHAR(255),
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    user_id VARCHAR(255),
    user_name VARCHAR(255),
    user_company VARCHAR(200),
    total_views BIGINT,
    unique_candidates_viewed BIGINT,
    total_favorites BIGINT,
    total_clicks BIGINT,
    avg_view_duration NUMERIC,
    most_viewed_candidate VARCHAR(255),
    most_viewed_candidate_name VARCHAR(255),
    last_activity TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            cv.user_id,
            CONCAT(u.first_name, ' ', u.last_name) as user_name,
            u.company as user_company,
            COUNT(*) as total_views,
            COUNT(DISTINCT cv.candidate_id) as unique_candidates_viewed,
            COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
            COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) as total_clicks,
            AVG(cv.view_duration) as avg_view_duration,
            MAX(cv.created_at) as last_activity
        FROM candidate_views cv
        JOIN users u ON cv.user_id = u.user_id
        WHERE cv.user_id = p_user_id
          AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.user_id, u.first_name, u.last_name, u.company
    ),
    most_viewed AS (
        SELECT 
            cv.user_id,
            cv.candidate_id,
            cv.candidate_name,
            COUNT(*) as view_count
        FROM candidate_views cv
        WHERE cv.user_id = p_user_id
          AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.user_id, cv.candidate_id, cv.candidate_name
        ORDER BY view_count DESC
        LIMIT 1
    )
    SELECT 
        us.user_id,
        us.user_name,
        us.user_company,
        us.total_views,
        us.unique_candidates_viewed,
        us.total_favorites,
        us.total_clicks,
        ROUND(us.avg_view_duration::NUMERIC, 2) as avg_view_duration,
        mv.candidate_id as most_viewed_candidate,
        mv.candidate_name as most_viewed_candidate_name,
        us.last_activity
    FROM user_stats us
    LEFT JOIN most_viewed mv ON us.user_id = mv.user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get all users with their candidate viewing activity
CREATE OR REPLACE FUNCTION get_all_users_activity(
    p_days_back INTEGER DEFAULT 30,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
    user_id VARCHAR(255),
    user_name VARCHAR(255),
    user_company VARCHAR(200),
    user_email VARCHAR(255),
    total_views BIGINT,
    unique_candidates_viewed BIGINT,
    total_favorites BIGINT,
    last_activity TIMESTAMPTZ,
    activity_level VARCHAR(20)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.user_id,
        CONCAT(u.first_name, ' ', u.last_name) as user_name,
        u.company as user_company,
        u.email as user_email,
        COALESCE(COUNT(cv.id), 0) as total_views,
        COALESCE(COUNT(DISTINCT cv.candidate_id), 0) as unique_candidates_viewed,
        COALESCE(COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END), 0) as total_favorites,
        MAX(cv.created_at) as last_activity,
        CASE 
            WHEN COUNT(cv.id) >= 20 THEN 'High'
            WHEN COUNT(cv.id) >= 10 THEN 'Medium'
            WHEN COUNT(cv.id) >= 1 THEN 'Low'
            ELSE 'None'
        END as activity_level
    FROM users u
    LEFT JOIN candidate_views cv ON u.user_id = cv.user_id 
        AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    GROUP BY u.user_id, u.first_name, u.last_name, u.company, u.email
    ORDER BY total_views DESC, last_activity DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Add comments for the new functions
COMMENT ON FUNCTION get_user_candidate_analytics IS 'Returns detailed analytics for a specific user including their candidate viewing behavior';
COMMENT ON FUNCTION get_all_users_activity IS 'Returns activity summary for all users with their candidate viewing statistics';

-- Create a view for user-candidate relationships
CREATE OR REPLACE VIEW user_candidate_relationships AS
SELECT 
    u.user_id,
    CONCAT(u.first_name, ' ', u.last_name) as user_name,
    u.company as user_company,
    u.email as user_email,
    cv.candidate_id,
    cv.candidate_name,
    COUNT(*) as total_interactions,
    COUNT(CASE WHEN cv.interaction_type = 'view' THEN 1 END) as total_views,
    COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
    COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) as ai_analysis_views,
    MAX(cv.created_at) as last_interaction,
    MIN(cv.created_at) as first_interaction,
    AVG(cv.view_duration) as avg_view_duration
FROM users u
JOIN candidate_views cv ON u.user_id = cv.user_id
GROUP BY u.user_id, u.first_name, u.last_name, u.company, u.email, cv.candidate_id, cv.candidate_name
ORDER BY total_interactions DESC;

COMMENT ON VIEW user_candidate_relationships IS 'Shows relationships between users and candidates with interaction statistics';

-- Test the functions (optional - remove if not needed)
-- SELECT 'Functions created successfully' as status;
