-- Analytics Functions
-- ==================

-- DROP FUNCTION public.get_all_users_activity(int4, int4);

CREATE OR REPLACE FUNCTION public.get_all_users_activity(p_days_back integer DEFAULT 30, p_limit integer DEFAULT 50)
 RETURNS TABLE(user_id character varying, user_name character varying, user_company character varying, user_email character varying, total_views bigint, unique_candidates_viewed bigint, total_favorites bigint, last_activity timestamp with time zone, activity_level character varying)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

COMMENT ON FUNCTION public.get_all_users_activity(int4, int4) IS 'Returns activity summary for all users with their candidate viewing statistics';

-- DROP FUNCTION public.get_candidate_analytics(varchar);

CREATE OR REPLACE FUNCTION public.get_candidate_analytics(p_candidate_id character varying)
 RETURNS TABLE(candidate_id character varying, candidate_name character varying, total_views bigint, unique_users bigint, total_favorites bigint, total_clicks bigint, total_ai_views bigint, avg_view_duration numeric, hotness_score integer, last_viewed timestamp with time zone, first_viewed timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

COMMENT ON FUNCTION public.get_candidate_analytics(varchar) IS 'Returns detailed analytics for a specific candidate including hotness score';

-- DROP FUNCTION public.get_candidate_analytics(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_candidate_analytics(p_candidate_id character varying DEFAULT NULL::character varying, p_days_back integer DEFAULT 30)
 RETURNS TABLE(candidate_id character varying, total_views bigint, unique_viewers bigint, total_favorites bigint, total_clicks bigint, total_ai_views bigint, avg_view_duration numeric, total_page_views bigint, daily_views jsonb, hotness_score numeric)
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- DROP FUNCTION public.get_candidate_hotness_score(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_candidate_hotness_score(p_candidate_id character varying, p_days_back integer DEFAULT 30)
 RETURNS numeric
 LANGUAGE plpgsql
AS $function$
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
$function$
;

-- DROP FUNCTION public.get_most_viewed_candidate(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_most_viewed_candidate(p_user_id character varying, p_days_back integer DEFAULT 30)
 RETURNS TABLE(candidate_id character varying, candidate_name character varying, total_views bigint, total_duration bigint, avg_duration numeric, last_viewed timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Return the candidate with the highest total view duration
    -- If tied on duration, use total views as tiebreaker
    RETURN QUERY
    WITH candidate_stats AS (
        SELECT 
            cv.candidate_id,
            cv.candidate_name,
            COUNT(*) as view_count,
            SUM(cv.view_duration) as total_duration,
            AVG(cv.view_duration) as avg_duration,
            MAX(cv.created_at) as last_viewed
        FROM candidate_views cv
        WHERE cv.user_id = p_user_id
          AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
        GROUP BY cv.candidate_id, cv.candidate_name
    )
    SELECT 
        cs.candidate_id,
        cs.candidate_name,
        cs.view_count,
        cs.total_duration,
        ROUND(cs.avg_duration::NUMERIC, 2) as avg_duration,
        cs.last_viewed
    FROM candidate_stats cs
    ORDER BY 
        cs.total_duration DESC,  -- Primary: highest total duration
        cs.view_count DESC,     -- Secondary: most views if tied
        cs.last_viewed DESC     -- Tertiary: most recent if still tied
    LIMIT 1;
END;
$function$
;

COMMENT ON FUNCTION public.get_most_viewed_candidate(varchar, int4) IS 'Clean, rewritten function to get most viewed candidate based on total duration';

-- DROP FUNCTION public.get_most_viewed_candidate_smart(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_most_viewed_candidate_smart(p_user_id character varying, p_days_back integer DEFAULT 30)
 RETURNS TABLE(candidate_id character varying, candidate_name character varying, total_views bigint, total_duration bigint, avg_duration numeric, last_viewed timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
DECLARE
    found_user_id VARCHAR(255);
BEGIN
    -- First, try with the provided user_id
    RETURN QUERY
    SELECT * FROM get_most_viewed_candidate(p_user_id, p_days_back);
    
    -- If we got results, we're done
    IF FOUND THEN
        RETURN;
    END IF;
    
    -- If no results, try with the most recent anonymous user
    found_user_id := get_most_recent_anonymous_user();
    IF found_user_id IS NOT NULL AND found_user_id != p_user_id THEN
        RETURN QUERY
        SELECT * FROM get_most_viewed_candidate(found_user_id, p_days_back);
        
        -- If we got results, we're done
        IF FOUND THEN
            RETURN;
        END IF;
    END IF;
    
    -- If still no results, try with any user that has views
    FOR found_user_id IN 
        SELECT user_id 
        FROM candidate_views 
        ORDER BY created_at DESC
        LIMIT 1
    LOOP
        RETURN QUERY
        SELECT * FROM get_most_viewed_candidate(found_user_id, p_days_back);
        
        -- If we got results, we're done
        IF FOUND THEN
            RETURN;
        END IF;
    END LOOP;
END;
$function$
;

COMMENT ON FUNCTION public.get_most_viewed_candidate_smart(varchar, int4) IS 'Fixed smart function that tries multiple strategies to find the most viewed candidate';

-- DROP FUNCTION public.get_user_candidate_analytics(varchar, int4);

CREATE OR REPLACE FUNCTION public.get_user_candidate_analytics(p_user_id character varying, p_days_back integer DEFAULT 30)
 RETURNS TABLE(user_id character varying, user_name character varying, user_company character varying, total_views bigint, unique_candidates_viewed bigint, total_favorites bigint, total_clicks bigint, avg_view_duration numeric, most_viewed_candidate character varying, most_viewed_candidate_name character varying, last_activity timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    WITH user_stats AS (
        SELECT 
            cv.user_id,
            CONCAT(u.first_name, ' ', u.last_name) as user_name,
            u.company as user_company,
            COUNT(*) as total_views,
            COUNT(DISTINCT cv.candidate_id) as unique_candidates_viewed,
            0 as total_favorites,  -- No interaction_type column, so set to 0
            0 as total_clicks,     -- No interaction_type column, so set to 0
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
$function$
;

COMMENT ON FUNCTION public.get_user_candidate_analytics(varchar, int4) IS 'Returns detailed analytics for a specific user including their candidate viewing behavior';

-- DROP FUNCTION public.simple_get_analytics(varchar);

CREATE OR REPLACE FUNCTION public.simple_get_analytics(p_candidate_id character varying)
 RETURNS TABLE(candidate_id character varying, candidate_name character varying, total_views bigint, unique_users bigint, total_favorites bigint, total_clicks bigint, total_ai_views bigint, avg_view_duration numeric, hotness_score integer, last_viewed timestamp with time zone, first_viewed timestamp with time zone)
 LANGUAGE plpgsql
AS $function$
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
$function$
;
