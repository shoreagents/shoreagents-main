-- Alter candidate_views table to remove interaction_type and activity_count columns
-- Since we're now focusing on just view_duration and scroll_percentage tracking

-- Drop the columns
ALTER TABLE public.candidate_views DROP COLUMN IF EXISTS interaction_type;
ALTER TABLE public.candidate_views DROP COLUMN IF EXISTS activity_count;

-- Drop related constraints
ALTER TABLE public.candidate_views DROP CONSTRAINT IF EXISTS candidate_views_interaction_type_check;
ALTER TABLE public.candidate_views DROP CONSTRAINT IF EXISTS candidate_views_activity_count_check;

-- Drop related indexes
DROP INDEX IF EXISTS idx_candidate_views_interaction_type;
DROP INDEX IF EXISTS idx_candidate_views_activity_count;

-- Update the table comment
COMMENT ON TABLE public.candidate_views IS 'Tracks candidate views with duration and scroll percentage only';

-- Verify the new table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
