-- Completely rewritten most viewed candidate function
-- Clean, simple, and robust approach

-- Drop the old function if it exists
DROP FUNCTION IF EXISTS public.get_most_viewed_candidate_simple(character varying, integer);

-- Create the new, clean function
CREATE OR REPLACE FUNCTION public.get_most_viewed_candidate(
    p_user_id character varying, 
    p_days_back integer DEFAULT 30
)
RETURNS TABLE(
    candidate_id character varying, 
    candidate_name character varying, 
    total_views bigint, 
    total_duration bigint,
    avg_duration numeric,
    last_viewed timestamp with time zone
)
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
$function$;

-- Test the new function
SELECT 
    'Testing new get_most_viewed_candidate function' as test_name,
    candidate_id,
    candidate_name,
    total_views,
    total_duration,
    avg_duration,
    last_viewed
FROM get_most_viewed_candidate('device_fy6jmd', 30);

-- Add comment for the new function
COMMENT ON FUNCTION public.get_most_viewed_candidate IS 'Clean, rewritten function to get most viewed candidate based on total duration';
