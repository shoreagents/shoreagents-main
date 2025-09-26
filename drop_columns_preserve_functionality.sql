-- Drop interaction_type and activity_count columns while preserving view_duration functionality

-- Step 1: First, let's see what the current views look like
SELECT 'Current view definitions:' as status;

-- Show candidate_view_summary view
SELECT 
  'candidate_view_summary' as view_name,
  definition
FROM pg_views 
WHERE viewname = 'candidate_view_summary'
  AND (schemaname = 'public' OR schemaname IS NULL);

-- Show user_candidate_relationships view
SELECT 
  'user_candidate_relationships' as view_name,
  definition
FROM pg_views 
WHERE viewname = 'user_candidate_relationships'
  AND (schemaname = 'public' OR schemaname IS NULL);

-- Step 2: Drop the dependent views first
DROP VIEW IF EXISTS public.candidate_view_summary CASCADE;
DROP VIEW IF EXISTS public.user_candidate_relationships CASCADE;

-- Step 3: Drop the columns
ALTER TABLE public.candidate_views DROP COLUMN IF EXISTS interaction_type;
ALTER TABLE public.candidate_views DROP COLUMN IF EXISTS activity_count;

-- Step 4: Drop related constraints
ALTER TABLE public.candidate_views DROP CONSTRAINT IF EXISTS candidate_views_interaction_type_check;
ALTER TABLE public.candidate_views DROP CONSTRAINT IF EXISTS candidate_views_activity_count_check;

-- Step 5: Drop related indexes
DROP INDEX IF EXISTS idx_candidate_views_interaction_type;
DROP INDEX IF EXISTS idx_candidate_views_activity_count;

-- Step 6: Recreate the views with simplified logic (focusing on view_duration and scroll_percentage)
CREATE VIEW public.candidate_view_summary AS
SELECT 
  candidate_id,
  candidate_name,
  COUNT(*) as total_views,
  SUM(view_duration) as total_duration,
  AVG(view_duration) as avg_duration,
  MAX(view_duration) as max_duration,
  AVG(scroll_percentage) as avg_scroll_percentage,
  MAX(scroll_percentage) as max_scroll_percentage,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(created_at) as first_viewed,
  MAX(created_at) as last_viewed
FROM public.candidate_views
GROUP BY candidate_id, candidate_name;

CREATE VIEW public.user_candidate_relationships AS
SELECT 
  user_id,
  candidate_id,
  candidate_name,
  COUNT(*) as total_views,
  SUM(view_duration) as total_duration,
  AVG(view_duration) as avg_duration,
  MAX(view_duration) as max_duration,
  AVG(scroll_percentage) as avg_scroll_percentage,
  MAX(scroll_percentage) as max_scroll_percentage,
  MIN(created_at) as first_viewed,
  MAX(created_at) as last_viewed
FROM public.candidate_views
GROUP BY user_id, candidate_id, candidate_name;

-- Step 7: Verify the new table structure
SELECT 'New table structure:' as status;

SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Step 8: Verify the views were recreated
SELECT 'Recreated views:' as status;

SELECT 
  viewname as view_name,
  schemaname,
  'View recreated successfully' as status
FROM pg_views 
WHERE viewname IN ('candidate_view_summary', 'user_candidate_relationships')
  AND (schemaname = 'public' OR schemaname IS NULL);

-- Step 9: Test that view_duration functionality still works
SELECT 'Testing view_duration functionality:' as status;

-- This should work without errors
SELECT 
  candidate_id,
  candidate_name,
  total_duration,
  avg_duration,
  max_duration,
  unique_users
FROM public.candidate_view_summary
LIMIT 5;
