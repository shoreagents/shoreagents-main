-- Check if there's data in candidate_views table
SELECT 
    COUNT(*) as total_records,
    COUNT(CASE WHEN view_duration IS NOT NULL THEN 1 END) as records_with_duration,
    COUNT(CASE WHEN view_duration > 0 THEN 1 END) as records_with_positive_duration,
    AVG(view_duration) as avg_duration,
    MAX(view_duration) as max_duration,
    MIN(view_duration) as min_duration
FROM candidate_views;

-- Show sample data
SELECT 
    user_id,
    candidate_id,
    candidate_name,
    view_duration,
    page_views,
    interaction_type,
    created_at
FROM candidate_views 
ORDER BY created_at DESC 
LIMIT 10;

-- Check for the specific device ID
SELECT 
    user_id,
    candidate_id,
    candidate_name,
    view_duration,
    page_views,
    interaction_type,
    created_at
FROM candidate_views 
WHERE user_id = 'device_1758768582481_rke8ch83y'
ORDER BY created_at DESC;
