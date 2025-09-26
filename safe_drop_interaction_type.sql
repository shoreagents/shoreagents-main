-- Safe way to drop interaction_type column by handling dependencies first

-- Step 1: Show what we're about to drop
SELECT 'BEFORE DROP - Current dependencies:' as status;

-- Check current views that depend on interaction_type
SELECT 
  'VIEW' as object_type,
  viewname as object_name,
  CASE 
    WHEN viewname = 'candidate_view_summary' THEN 'This view will be dropped'
    WHEN viewname = 'user_candidate_relationships' THEN 'This view will be dropped'
    ELSE 'Check if this view is needed'
  END as action_needed
FROM pg_views 
WHERE definition ILIKE '%interaction_type%'
  AND (schemaname = 'public' OR schemaname IS NULL);

-- Step 2: Drop the dependent views first
-- (You can comment out these lines if you want to keep the views)

-- DROP VIEW IF EXISTS public.candidate_view_summary CASCADE;
-- DROP VIEW IF EXISTS public.user_candidate_relationships CASCADE;

-- Step 3: Alternative - Update the views to remove interaction_type references
-- (Uncomment these if you want to keep the views but remove interaction_type)

/*
-- Update candidate_view_summary view (remove interaction_type references)
CREATE OR REPLACE VIEW public.candidate_view_summary AS
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

-- Update user_candidate_relationships view (remove interaction_type references)
CREATE OR REPLACE VIEW public.user_candidate_relationships AS
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
*/

-- Step 4: Now we can safely drop the column
-- (Uncomment when ready to proceed)

/*
ALTER TABLE public.candidate_views DROP COLUMN IF EXISTS interaction_type;
ALTER TABLE public.candidate_views DROP COLUMN IF EXISTS activity_count;

-- Drop related constraints
ALTER TABLE public.candidate_views DROP CONSTRAINT IF EXISTS candidate_views_interaction_type_check;
ALTER TABLE public.candidate_views DROP CONSTRAINT IF EXISTS candidate_views_activity_count_check;

-- Drop related indexes
DROP INDEX IF EXISTS idx_candidate_views_interaction_type;
DROP INDEX IF EXISTS idx_candidate_views_activity_count;
*/

-- Step 5: Verify the changes
SELECT 'AFTER DROP - New table structure:' as status;

SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
