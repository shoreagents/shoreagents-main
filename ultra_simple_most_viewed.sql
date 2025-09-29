-- Ultra simple function to get most viewed candidate
-- This avoids all the complex joins and type casting issues

CREATE OR REPLACE FUNCTION public.get_most_viewed_candidate_simple(p_user_id character varying, p_days_back integer DEFAULT 30)
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
    RETURN QUERY
    SELECT 
        cv.candidate_id,
        cv.candidate_name,
        COUNT(*) as total_views,
        SUM(cv.view_duration) as total_duration,
        ROUND(AVG(cv.view_duration)::NUMERIC, 2) as avg_duration,
        MAX(cv.created_at) as last_viewed
    FROM candidate_views cv
    WHERE cv.user_id = p_user_id
      AND cv.created_at >= CURRENT_DATE - INTERVAL '1 day' * p_days_back
    GROUP BY cv.candidate_id, cv.candidate_name
    ORDER BY COUNT(*) DESC, SUM(cv.view_duration) DESC
    LIMIT 1;
END;
$function$;

-- Test the ultra simple function
SELECT 
    'Testing ultra simple function' as status,
    candidate_id,
    candidate_name,
    total_views,
    total_duration,
    avg_duration,
    last_viewed
FROM get_most_viewed_candidate_simple('device_fy6jmd', 30);

-- Add comment for the ultra simple function
COMMENT ON FUNCTION public.get_most_viewed_candidate_simple IS 'Ultra simple function to get most viewed candidate without complex joins';
