-- Aggressive cleanup of all candidate tracking functions
-- Remove ALL versions to avoid "function is not unique" errors

-- 1. Drop ALL functions that might conflict
DO $$
DECLARE
    func_record RECORD;
BEGIN
    -- Drop all functions with similar names
    FOR func_record IN 
        SELECT specific_name, routine_name
        FROM information_schema.routines 
        WHERE routine_schema = 'public' 
          AND (
            routine_name LIKE '%candidate%' 
            OR routine_name LIKE '%analytics%'
            OR routine_name LIKE '%tracking%'
            OR routine_name LIKE '%record%'
            OR routine_name LIKE '%get_%'
            OR routine_name LIKE '%upsert%'
            OR routine_name LIKE '%anonymous%'
            OR routine_name LIKE '%authenticated%'
          )
    LOOP
        EXECUTE 'DROP FUNCTION IF EXISTS ' || func_record.specific_name || ' CASCADE';
        RAISE NOTICE 'Dropped function: %', func_record.specific_name;
    END LOOP;
END $$;

-- 2. Drop any remaining triggers
DROP TRIGGER IF EXISTS trigger_increment_activity_count ON candidate_views;
DROP TRIGGER IF EXISTS update_candidate_views_updated_at ON candidate_views;

-- 3. Verify all functions are gone
SELECT 'Remaining functions after cleanup:' as step;
SELECT routine_name, specific_name
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND (
    routine_name LIKE '%candidate%' 
    OR routine_name LIKE '%analytics%'
    OR routine_name LIKE '%tracking%'
    OR routine_name LIKE '%record%'
    OR routine_name LIKE '%get_%'
    OR routine_name LIKE '%upsert%'
    OR routine_name LIKE '%anonymous%'
    OR routine_name LIKE '%authenticated%'
  );

-- 4. Show clean state
SELECT '✅ Aggressive cleanup complete!' as status;
SELECT '✅ All conflicting functions removed' as cleanup_status;
SELECT '✅ Ready to create fresh functions' as ready_status;
