-- Check what objects depend on the interaction_type column in candidate_views table

-- 1. Check for views that depend on interaction_type
SELECT 
  'VIEW' as object_type,
  schemaname,
  viewname as object_name,
  definition
FROM pg_views 
WHERE definition ILIKE '%interaction_type%'
  AND (schemaname = 'public' OR schemaname IS NULL);

-- 2. Check for materialized views that depend on interaction_type
SELECT 
  'MATERIALIZED VIEW' as object_type,
  schemaname,
  matviewname as object_name,
  definition
FROM pg_matviews 
WHERE definition ILIKE '%interaction_type%'
  AND (schemaname = 'public' OR schemaname IS NULL);

-- 3. Check for functions that depend on interaction_type
SELECT 
  'FUNCTION' as object_type,
  n.nspname as schema_name,
  p.proname as function_name,
  pg_get_functiondef(p.oid) as definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE pg_get_functiondef(p.oid) ILIKE '%interaction_type%'
  AND n.nspname = 'public';

-- 4. Check for triggers that depend on interaction_type
SELECT 
  'TRIGGER' as object_type,
  n.nspname as schema_name,
  t.tgname as trigger_name,
  c.relname as table_name,
  pg_get_triggerdef(t.oid) as definition
FROM pg_trigger t
JOIN pg_class c ON t.tgrelid = c.oid
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE pg_get_triggerdef(t.oid) ILIKE '%interaction_type%'
  AND n.nspname = 'public';

-- 5. Check for indexes that depend on interaction_type
SELECT 
  'INDEX' as object_type,
  n.nspname as schema_name,
  i.relname as index_name,
  t.relname as table_name,
  pg_get_indexdef(i.oid) as definition
FROM pg_class i
JOIN pg_index ix ON i.oid = ix.indexrelid
JOIN pg_class t ON ix.indrelid = t.oid
JOIN pg_namespace n ON i.relnamespace = n.oid
WHERE pg_get_indexdef(i.oid) ILIKE '%interaction_type%'
  AND n.nspname = 'public';

-- 6. Check for constraints that depend on interaction_type
SELECT 
  'CONSTRAINT' as object_type,
  n.nspname as schema_name,
  conname as constraint_name,
  t.relname as table_name,
  pg_get_constraintdef(c.oid) as definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE pg_get_constraintdef(c.oid) ILIKE '%interaction_type%'
  AND n.nspname = 'public';

-- 7. Check for foreign key constraints that reference interaction_type
SELECT 
  'FOREIGN KEY' as object_type,
  n.nspname as schema_name,
  conname as constraint_name,
  t.relname as table_name,
  pg_get_constraintdef(c.oid) as definition
FROM pg_constraint c
JOIN pg_class t ON c.conrelid = t.oid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE c.contype = 'f'
  AND pg_get_constraintdef(c.oid) ILIKE '%interaction_type%'
  AND n.nspname = 'public';

-- 8. Get detailed information about the specific views mentioned in the error
SELECT 
  'SPECIFIC VIEW' as object_type,
  schemaname,
  viewname as object_name,
  definition
FROM pg_views 
WHERE viewname IN ('candidate_view_summary', 'user_candidate_relationships')
  AND (schemaname = 'public' OR schemaname IS NULL);

-- 9. Check if there are any other tables that reference interaction_type
SELECT 
  'TABLE COLUMN' as object_type,
  n.nspname as schema_name,
  t.relname as table_name,
  a.attname as column_name,
  a.atttypid::regtype as data_type
FROM pg_class t
JOIN pg_attribute a ON t.oid = a.attrelid
JOIN pg_namespace n ON t.relnamespace = n.oid
WHERE a.attname = 'interaction_type'
  AND n.nspname = 'public'
  AND t.relname != 'candidate_views';
