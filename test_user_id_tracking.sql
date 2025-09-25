-- Test Queries for User ID Tracking in Content Views

-- 1. Check recent content views with user_id information
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
    viewed_at,
    created_at,
    updated_at
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
ORDER BY viewed_at DESC;

-- 2. Check user_id distribution (authenticated vs anonymous)
SELECT 
    CASE 
        WHEN user_id IS NULL THEN 'Anonymous'
        ELSE 'Authenticated'
    END as user_type,
    COUNT(*) as view_count,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(view_duration) as avg_duration,
    AVG(scroll_depth) as avg_scroll_depth
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
GROUP BY 
    CASE 
        WHEN user_id IS NULL THEN 'Anonymous'
        ELSE 'Authenticated'
    END;

-- 3. Check specific user activity (replace 'your-user-id' with actual user_id)
SELECT 
    id,
    user_id,
    content_type,
    content_id,
    content_title,
    view_duration,
    scroll_depth,
    interactions_count,
    form_submissions,
    is_bounce,
    viewed_at
FROM content_views 
WHERE user_id = 'your-user-id' -- Replace with actual user_id
ORDER BY viewed_at DESC;

-- 4. Check session tracking with user_id
SELECT 
    session_id,
    user_id,
    COUNT(*) as pages_viewed,
    COUNT(DISTINCT content_id) as unique_content,
    SUM(interactions_count) as total_interactions,
    SUM(form_submissions) as total_form_submissions,
    AVG(view_duration) as avg_duration,
    MIN(viewed_at) as session_start,
    MAX(viewed_at) as session_end
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
GROUP BY session_id, user_id
ORDER BY pages_viewed DESC;

-- 5. Check device tracking with user_id
SELECT 
    device_id,
    user_id,
    COUNT(*) as views_from_device,
    COUNT(DISTINCT session_id) as sessions_from_device,
    COUNT(DISTINCT content_id) as unique_content,
    AVG(view_duration) as avg_duration
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
GROUP BY device_id, user_id
ORDER BY views_from_device DESC;

-- 6. Check return visit tracking
SELECT 
    user_id,
    COUNT(*) as total_views,
    COUNT(CASE WHEN is_return_visit = TRUE THEN 1 END) as return_visits,
    ROUND(
        (COUNT(CASE WHEN is_return_visit = TRUE THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as return_visitor_percent
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
    AND user_id IS NOT NULL
GROUP BY user_id
ORDER BY return_visitor_percent DESC;

-- 7. Check engagement by user type
SELECT 
    CASE 
        WHEN user_id IS NULL THEN 'Anonymous'
        ELSE 'Authenticated'
    END as user_type,
    AVG(interactions_count) as avg_interactions,
    AVG(form_submissions) as avg_form_submissions,
    AVG(view_duration) as avg_duration,
    AVG(scroll_depth) as avg_scroll_depth,
    COUNT(CASE WHEN is_bounce = TRUE THEN 1 END) as bounce_count,
    COUNT(*) as total_views,
    ROUND(
        (COUNT(CASE WHEN is_bounce = TRUE THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as bounce_rate_percent
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '1 hour'
GROUP BY 
    CASE 
        WHEN user_id IS NULL THEN 'Anonymous'
        ELSE 'Authenticated'
    END;
