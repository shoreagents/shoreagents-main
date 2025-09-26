-- STEP 1: Check Current State of candidate_views Table (FINAL VERSION)
-- Run this first to see what we're working with

-- 1.1 Check current triggers on candidate_views
SELECT 
    'Current triggers on candidate_views:' as info,
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'candidate_views'
AND event_object_schema = 'public';

-- 1.2 Check current constraints (FIXED - removed ambiguous column reference)
SELECT 
    'Current constraints:' as info,
    tc.constraint_name,
    tc.constraint_type,
    ccu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'candidate_views' 
    AND tc.table_schema = 'public';

-- 1.3 Check what columns actually exist in candidate_views
SELECT 
    'Current columns in candidate_views:' as info,
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 1.4 Check for duplicate records (using only existing columns)
SELECT 
    'Duplicate records check:' as info,
    user_id,
    candidate_id,
    COUNT(*) as duplicate_count
FROM candidate_views
GROUP BY user_id, candidate_id
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC
LIMIT 10;

-- 1.5 Show total record count
SELECT 
    'Total records in candidate_views:' as info,
    COUNT(*) as total_records
FROM candidate_views;
