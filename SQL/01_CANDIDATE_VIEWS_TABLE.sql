-- Candidate Views Analytics Table
-- Tracks user interactions with employee profiles for analytics

-- Drop table if exists (for clean recreation)
DROP TABLE IF EXISTS public.candidate_views CASCADE;

-- Create the candidate_views table
CREATE TABLE public.candidate_views (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL, -- The user who viewed the candidate
    candidate_id VARCHAR(255) NOT NULL, -- The candidate/employee being viewed
    candidate_name VARCHAR(255), -- The candidate's full name (denormalized for performance)
    view_duration INTEGER, -- Time spent viewing in seconds
    page_views INTEGER DEFAULT 1, -- Number of times viewed in this session
    interaction_type VARCHAR(50) DEFAULT 'view', -- Type of interaction (view, favorite, contact, etc.)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT candidate_views_user_id_check CHECK (user_id IS NOT NULL AND user_id != ''),
    CONSTRAINT candidate_views_candidate_id_check CHECK (candidate_id IS NOT NULL AND candidate_id != ''),
    CONSTRAINT candidate_views_view_duration_check CHECK (view_duration >= 0),
    CONSTRAINT candidate_views_page_views_check CHECK (page_views > 0),
    CONSTRAINT candidate_views_interaction_type_check CHECK (interaction_type IN ('view', 'favorite', 'unfavorite', 'contact', 'download', 'share', 'click', 'ai_analysis_view', 'profile_click', 'skills_click', 'experience_click'))
);

-- Create indexes for better query performance
CREATE INDEX idx_candidate_views_candidate_id ON public.candidate_views USING btree (candidate_id);
CREATE INDEX idx_candidate_views_user_id ON public.candidate_views USING btree (user_id);
CREATE INDEX idx_candidate_views_candidate_name ON public.candidate_views USING btree (candidate_name);
CREATE INDEX idx_candidate_views_created_at ON public.candidate_views USING btree (created_at);
CREATE INDEX idx_candidate_views_interaction_type ON public.candidate_views USING btree (interaction_type);

-- Composite indexes for common queries
CREATE INDEX idx_candidate_views_candidate_created ON public.candidate_views USING btree (candidate_id, created_at);
CREATE INDEX idx_candidate_views_user_created ON public.candidate_views USING btree (user_id, created_at);
CREATE INDEX idx_candidate_views_candidate_interaction ON public.candidate_views USING btree (candidate_id, interaction_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_candidate_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_candidate_views_updated_at ON public.candidate_views;
CREATE TRIGGER update_candidate_views_updated_at
    BEFORE UPDATE ON public.candidate_views
    FOR EACH ROW
    EXECUTE FUNCTION update_candidate_views_updated_at();

-- Function to record a candidate view
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

-- Function to get candidate view analytics
CREATE OR REPLACE FUNCTION get_candidate_analytics(
    p_candidate_id VARCHAR(255) DEFAULT NULL,
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    candidate_id VARCHAR(255),
    total_views BIGINT,
    unique_viewers BIGINT,
    total_favorites BIGINT,
    total_clicks BIGINT,
    total_ai_views BIGINT,
    avg_view_duration NUMERIC,
    total_page_views BIGINT,
    daily_views JSONB,
    hotness_score NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH candidate_stats AS (
        SELECT 
            cv.candidate_id,
            MAX(cv.candidate_name) as candidate_name,
            COUNT(*) as total_views,
            COUNT(DISTINCT cv.user_id) as unique_viewers,
            COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
            COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) as total_clicks,
            COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) as total_ai_views,
            AVG(cv.view_duration) as avg_view_duration,
            SUM(cv.page_views) as total_page_views
        FROM candidate_views cv
        WHERE (p_candidate_id IS NULL OR cv.candidate_id = p_candidate_id)
          AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.candidate_id
    ),
    daily_stats AS (
        SELECT 
            cv.candidate_id,
            JSONB_OBJECT_AGG(
                DATE(cv.created_at)::TEXT, 
                daily_count
            ) as daily_views
        FROM (
            SELECT 
                candidate_id,
                DATE(created_at) as created_at,
                COUNT(*) as daily_count
            FROM candidate_views cv
            WHERE (p_candidate_id IS NULL OR cv.candidate_id = p_candidate_id)
              AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
            GROUP BY candidate_id, DATE(created_at)
            ORDER BY DATE(created_at)
        ) cv
        GROUP BY cv.candidate_id
    )
    SELECT 
        cs.candidate_id,
        cs.total_views,
        cs.unique_viewers,
        cs.total_favorites,
        cs.total_clicks,
        cs.total_ai_views,
        ROUND(cs.avg_view_duration::NUMERIC, 2) as avg_view_duration,
        cs.total_page_views,
        COALESCE(daily.daily_views, '{}'::JSONB) as daily_views,
        -- Calculate hotness score (0-100)
        ROUND(
            LEAST(100, 
                (cs.total_views * 0.3) + 
                (cs.unique_viewers * 0.4) + 
                (cs.total_favorites * 2.0) + 
                (cs.total_clicks * 0.5) + 
                (cs.total_ai_views * 1.5) +
                (COALESCE(cs.avg_view_duration, 0) * 0.1)
            )::NUMERIC, 2
        ) as hotness_score
    FROM candidate_stats cs
    LEFT JOIN daily_stats daily ON cs.candidate_id = daily.candidate_id
    ORDER BY hotness_score DESC, cs.total_views DESC;
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
    unique_viewers BIGINT,
    total_favorites BIGINT,
    total_clicks BIGINT,
    total_ai_views BIGINT,
    avg_view_duration NUMERIC,
    hotness_score NUMERIC,
    last_viewed TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    WITH candidate_stats AS (
        SELECT 
            cv.candidate_id,
            MAX(cv.candidate_name) as candidate_name,
            COUNT(*) as total_views,
            COUNT(DISTINCT cv.user_id) as unique_viewers,
            COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
            COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) as total_clicks,
            COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) as total_ai_views,
            AVG(cv.view_duration) as avg_view_duration,
            MAX(cv.created_at) as last_viewed
        FROM candidate_views cv
        WHERE cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.candidate_id
    )
    SELECT 
        cs.candidate_id,
        cs.candidate_name,
        cs.total_views,
        cs.unique_viewers,
        cs.total_favorites,
        cs.total_clicks,
        cs.total_ai_views,
        ROUND(cs.avg_view_duration::NUMERIC, 2) as avg_view_duration,
        -- Calculate hotness score (0-100)
        ROUND(
            LEAST(100, 
                (cs.total_views * 0.3) + 
                (cs.unique_viewers * 0.4) + 
                (cs.total_favorites * 2.0) + 
                (cs.total_clicks * 0.5) + 
                (cs.total_ai_views * 1.5) +
                (COALESCE(cs.avg_view_duration, 0) * 0.1)
            )::NUMERIC, 2
        ) as hotness_score,
        cs.last_viewed
    FROM candidate_stats cs
    ORDER BY hotness_score DESC, cs.total_views DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get user viewing history
CREATE OR REPLACE FUNCTION get_user_viewing_history(
    p_user_id VARCHAR(255),
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
    candidate_id VARCHAR(255),
    candidate_name VARCHAR(255),
    view_count BIGINT,
    last_viewed TIMESTAMPTZ,
    total_duration INTEGER,
    is_favorited BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cv.candidate_id,
        MAX(cv.candidate_name) as candidate_name,
        SUM(cv.page_views) as view_count,
        MAX(cv.created_at) as last_viewed,
        SUM(cv.view_duration) as total_duration,
        EXISTS(
            SELECT 1 FROM candidate_views cv2 
            WHERE cv2.user_id = p_user_id 
              AND cv2.candidate_id = cv.candidate_id 
              AND cv2.interaction_type = 'favorite'
        ) as is_favorited
    FROM candidate_views cv
    WHERE cv.user_id = p_user_id
    GROUP BY cv.candidate_id
    ORDER BY last_viewed DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to get hotness score for a specific candidate
CREATE OR REPLACE FUNCTION get_candidate_hotness_score(
    p_candidate_id VARCHAR(255),
    p_days_back INTEGER DEFAULT 30
)
RETURNS NUMERIC AS $$
DECLARE
    hotness_score NUMERIC;
BEGIN
    SELECT ROUND(
        LEAST(100, 
            (COUNT(*) * 0.3) + 
            (COUNT(DISTINCT user_id) * 0.4) + 
            (COUNT(CASE WHEN interaction_type = 'favorite' THEN 1 END) * 2.0) + 
            (COUNT(CASE WHEN interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 0.5) + 
            (COUNT(CASE WHEN interaction_type = 'ai_analysis_view' THEN 1 END) * 1.5) +
            (COALESCE(AVG(view_duration), 0) * 0.1)
        )::NUMERIC, 2
    ) INTO hotness_score
    FROM candidate_views
    WHERE candidate_id = p_candidate_id
      AND created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back;
    
    RETURN COALESCE(hotness_score, 0);
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy access to candidate view summaries
CREATE OR REPLACE VIEW candidate_view_summary AS
SELECT 
    cv.candidate_id,
    MAX(cv.candidate_name) as candidate_name,
    COUNT(*) as total_views,
    COUNT(DISTINCT cv.user_id) as unique_viewers,
    COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) as total_favorites,
    COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) as total_clicks,
    COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) as total_ai_views,
    ROUND(AVG(cv.view_duration)::NUMERIC, 2) as avg_view_duration,
    SUM(cv.page_views) as total_page_views,
    MAX(cv.created_at) as last_viewed,
    MIN(cv.created_at) as first_viewed,
    -- Calculate hotness score (0-100)
    ROUND(
        LEAST(100, 
            (COUNT(*) * 0.3) + 
            (COUNT(DISTINCT cv.user_id) * 0.4) + 
            (COUNT(CASE WHEN cv.interaction_type = 'favorite' THEN 1 END) * 2.0) + 
            (COUNT(CASE WHEN cv.interaction_type IN ('click', 'profile_click', 'skills_click', 'experience_click') THEN 1 END) * 0.5) + 
            (COUNT(CASE WHEN cv.interaction_type = 'ai_analysis_view' THEN 1 END) * 1.5) +
            (COALESCE(AVG(cv.view_duration), 0) * 0.1)
        )::NUMERIC, 2
    ) as hotness_score
FROM candidate_views cv
GROUP BY cv.candidate_id
ORDER BY hotness_score DESC, total_views DESC;

-- Add comments for documentation
COMMENT ON TABLE public.candidate_views IS 'Tracks user interactions with candidate profiles for analytics and hotness scoring';
COMMENT ON COLUMN public.candidate_views.user_id IS 'ID of the user viewing the candidate';
COMMENT ON COLUMN public.candidate_views.candidate_id IS 'ID of the candidate being viewed';
COMMENT ON COLUMN public.candidate_views.candidate_name IS 'Full name of the candidate (denormalized for performance)';
COMMENT ON COLUMN public.candidate_views.view_duration IS 'Time spent viewing in seconds';
COMMENT ON COLUMN public.candidate_views.interaction_type IS 'Type of interaction: view, favorite, unfavorite, contact, download, share, click, ai_analysis_view, profile_click, skills_click, experience_click';
COMMENT ON COLUMN public.candidate_views.page_views IS 'Number of times viewed in this session';

COMMENT ON FUNCTION record_candidate_view IS 'Records a candidate view or interaction with simplified parameters';
COMMENT ON FUNCTION get_candidate_analytics IS 'Returns comprehensive analytics for candidate views including hotness score';
COMMENT ON FUNCTION get_top_viewed_candidates IS 'Returns the most viewed candidates sorted by hotness score';
COMMENT ON FUNCTION get_user_viewing_history IS 'Returns viewing history for a specific user';
COMMENT ON FUNCTION get_candidate_hotness_score IS 'Returns hotness score (0-100) for a specific candidate based on engagement metrics';
