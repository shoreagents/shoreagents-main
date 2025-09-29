-- Analysis of what data the "most viewed candidate" functionality uses
-- This script shows all the different ways "most viewed" is calculated

-- 1. CANDIDATE_VIEW_SUMMARY VIEW
-- This is the main view that aggregates candidate data
SELECT 
    'candidate_view_summary view data' as analysis_type,
    'This view aggregates all candidate_views data' as description,
    'Uses: candidate_id, candidate_name, view_duration, scroll_percentage, user_id, created_at' as data_sources
UNION ALL
SELECT 
    'Key metrics calculated' as analysis_type,
    'total_views, total_duration, avg_duration, unique_users' as description,
    'Based on COUNT(*), SUM(view_duration), AVG(view_duration), COUNT(DISTINCT user_id)' as data_sources;

-- 2. Show the actual candidate_view_summary data
SELECT 
    'Current most viewed candidates (by total views)' as ranking_type,
    candidate_id,
    candidate_name,
    total_views,
    total_duration,
    avg_duration,
    unique_users,
    first_viewed,
    last_viewed
FROM candidate_view_summary 
ORDER BY total_views DESC 
LIMIT 10;

-- 3. Show most viewed by unique users
SELECT 
    'Most viewed candidates (by unique users)' as ranking_type,
    candidate_id,
    candidate_name,
    total_views,
    unique_users,
    total_duration,
    avg_duration
FROM candidate_view_summary 
ORDER BY unique_users DESC, total_views DESC 
LIMIT 10;

-- 4. Show most viewed by total duration
SELECT 
    'Most viewed candidates (by total duration)' as ranking_type,
    candidate_id,
    candidate_name,
    total_views,
    total_duration,
    avg_duration,
    unique_users
FROM candidate_view_summary 
ORDER BY total_duration DESC 
LIMIT 10;

-- 5. Show most viewed by average duration
SELECT 
    'Most viewed candidates (by average duration)' as ranking_type,
    candidate_id,
    candidate_name,
    total_views,
    total_duration,
    avg_duration,
    unique_users
FROM candidate_view_summary 
ORDER BY avg_duration DESC 
LIMIT 10;

-- 6. Show hotness score calculation (from get_candidate_analytics)
SELECT 
    'Hotness score calculation' as analysis_type,
    'Formula: (total_views * 0.3) + (unique_viewers * 0.4) + (favorites * 2.0) + (clicks * 0.5) + (ai_views * 1.5) + (avg_duration * 0.1)' as formula,
    'Uses: total_views, unique_users, favorites, clicks, ai_views, avg_duration' as data_sources;

-- 7. Show user-specific most viewed (from get_user_candidate_analytics)
SELECT 
    'User-specific most viewed calculation' as analysis_type,
    'Method: COUNT(*) as view_count per user-candidate combination, ORDER BY view_count DESC, LIMIT 1' as method,
    'Uses: user_id, candidate_id, candidate_name, created_at (filtered by date range)' as data_sources;

-- 8. Show the actual data structure used
SELECT 
    'candidate_views table structure' as analysis_type,
    'Columns used for most viewed calculations:' as description,
    'id, user_id, candidate_id, candidate_name, view_duration, scroll_percentage, page_views, created_at, updated_at' as columns_used;

-- 9. Show recent activity (last 7 days)
SELECT 
    'Recent most viewed candidates (last 7 days)' as ranking_type,
    candidate_id,
    candidate_name,
    COUNT(*) as recent_views,
    COUNT(DISTINCT user_id) as recent_unique_users,
    SUM(view_duration) as recent_total_duration,
    AVG(view_duration) as recent_avg_duration
FROM candidate_views 
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'
GROUP BY candidate_id, candidate_name
ORDER BY recent_views DESC 
LIMIT 10;

-- 10. Show the different ranking methods available
SELECT 
    'Available ranking methods' as analysis_type,
    '1. By total views (COUNT(*))' as method_1,
    '2. By unique users (COUNT(DISTINCT user_id))' as method_2,
    '3. By total duration (SUM(view_duration))' as method_3,
    '4. By average duration (AVG(view_duration))' as method_4,
    '5. By hotness score (weighted formula)' as method_5,
    '6. By recent activity (date-filtered)' as method_6;
