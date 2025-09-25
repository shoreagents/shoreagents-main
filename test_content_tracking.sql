-- Test queries to verify content tracking is working

-- 1. Check recent content views
SELECT 
    id,
    user_id,
    session_id,
    device_id,
    content_type,
    content_id,
    content_title,
    view_duration,
    scroll_depth,
    interactions_count,
    form_submissions,
    is_bounce,
    is_return_visit,
    viewed_at
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
ORDER BY viewed_at DESC
LIMIT 10;

-- 2. Check content views by type
SELECT 
    content_type,
    COUNT(*) as total_views,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT device_id) as unique_devices,
    AVG(view_duration) as avg_duration,
    AVG(scroll_depth) as avg_scroll_depth,
    AVG(interactions_count) as avg_interactions
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 day'
GROUP BY content_type
ORDER BY total_views DESC;

-- 3. Check session tracking
SELECT 
    session_id,
    device_id,
    COUNT(*) as pages_viewed,
    MIN(viewed_at) as first_view,
    MAX(viewed_at) as last_view,
    SUM(interactions_count) as total_interactions
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 day'
GROUP BY session_id, device_id
ORDER BY pages_viewed DESC
LIMIT 10;

-- 4. Check referrer analysis
SELECT 
    referrer_type,
    COUNT(*) as view_count,
    COUNT(DISTINCT session_id) as unique_sessions
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 day'
GROUP BY referrer_type
ORDER BY view_count DESC;

-- 5. Check bounce rate
SELECT 
    content_type,
    COUNT(*) as total_views,
    COUNT(CASE WHEN is_bounce = true THEN 1 END) as bounce_count,
    ROUND(
        (COUNT(CASE WHEN is_bounce = true THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as bounce_rate_percent
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 day'
GROUP BY content_type
ORDER BY bounce_rate_percent DESC;
