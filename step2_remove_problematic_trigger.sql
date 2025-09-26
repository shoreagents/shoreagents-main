-- STEP 2: Remove the Problematic Trigger
-- This will stop the duplicate storage issue

-- 2.1 Drop the trigger that's causing duplicates
DROP TRIGGER IF EXISTS trigger_increment_activity_count ON candidate_views;

-- 2.2 Verify the trigger was removed
SELECT 
    'Remaining triggers after cleanup:' as info,
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'candidate_views'
AND event_object_schema = 'public';

-- 2.3 Show success message
SELECT '✅ Problematic trigger removed successfully!' as status;
