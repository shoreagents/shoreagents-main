-- Show the specific views that depend on interaction_type column

-- 1. Show candidate_view_summary view definition
SELECT 
  'candidate_view_summary' as view_name,
  definition
FROM pg_views 
WHERE viewname = 'candidate_view_summary'
  AND (schemaname = 'public' OR schemaname IS NULL);

-- 2. Show user_candidate_relationships view definition  
SELECT 
  'user_candidate_relationships' as view_name,
  definition
FROM pg_views 
WHERE viewname = 'user_candidate_relationships'
  AND (schemaname = 'public' OR schemaname IS NULL);

-- 3. Check if these views exist and show their structure
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name IN ('candidate_view_summary', 'user_candidate_relationships')
  AND table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- 4. Show all views that reference candidate_views table
SELECT 
  viewname as view_name,
  schemaname,
  definition
FROM pg_views 
WHERE definition ILIKE '%candidate_views%'
  AND (schemaname = 'public' OR schemaname IS NULL)
ORDER BY viewname;
