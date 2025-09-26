-- Test view duration tracking functionality
-- This script helps verify that view_duration is being properly tracked

-- 1. Check current view_duration data
SELECT 
  'Current View Duration Data' as test_name,
  COUNT(*) as total_records,
  COUNT(CASE WHEN view_duration IS NOT NULL THEN 1 END) as records_with_duration,
  COUNT(CASE WHEN view_duration > 0 THEN 1 END) as records_with_positive_duration,
  AVG(view_duration) as avg_duration,
  MAX(view_duration) as max_duration
FROM candidate_views;

-- 2. Show recent records with view duration
SELECT 
  'Recent Records with Duration' as test_name,
  user_id,
  candidate_id,
  candidate_name,
  view_duration,
  interaction_type,
  created_at,
  updated_at
FROM candidate_views 
WHERE view_duration IS NOT NULL 
  AND view_duration > 0
ORDER BY created_at DESC 
LIMIT 10;

-- 3. Check for records with 0 duration (should be updated)
SELECT 
  'Records with 0 Duration (Need Update)' as test_name,
  user_id,
  candidate_id,
  candidate_name,
  view_duration,
  interaction_type,
  created_at
FROM candidate_views 
WHERE view_duration = 0 
  AND interaction_type = 'view'
ORDER BY created_at DESC 
LIMIT 10;

-- 4. Test manual duration update (replace with actual user_id and candidate_id)
-- UPDATE candidate_views 
-- SET view_duration = 45, updated_at = NOW()
-- WHERE user_id = 'your_user_id_here' 
--   AND candidate_id = 'your_candidate_id_here'
--   AND interaction_type = 'view'
-- ORDER BY created_at DESC 
-- LIMIT 1;

-- 5. Check most viewed candidates by duration
SELECT 
  'Most Viewed Candidates by Duration' as test_name,
  user_id,
  candidate_id,
  candidate_name,
  MAX(view_duration) as max_duration,
  COUNT(*) as total_views,
  AVG(view_duration) as avg_duration
FROM candidate_views 
WHERE view_duration IS NOT NULL 
  AND view_duration > 0
GROUP BY user_id, candidate_id, candidate_name
ORDER BY max_duration DESC 
LIMIT 10;
