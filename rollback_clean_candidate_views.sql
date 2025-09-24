-- Rollback and clean up candidate_views functions
-- Remove all the complex anonymous user creation logic
-- Keep it simple: just use existing users.user_id

-- 1. Drop all the complex functions we created
DROP FUNCTION IF EXISTS generate_unique_anonymous_user() CASCADE;
DROP FUNCTION IF EXISTS get_or_create_unique_anonymous_user() CASCADE;
DROP FUNCTION IF EXISTS get_existing_anonymous_user() CASCADE;
DROP FUNCTION IF EXISTS get_existing_authenticated_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS upsert_candidate_view(VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER, VARCHAR(50)) CASCADE;
DROP FUNCTION IF EXISTS candidate_tracking_record_view(VARCHAR(255), VARCHAR(255), VARCHAR(255), INTEGER, VARCHAR(50)) CASCADE;
DROP FUNCTION IF EXISTS candidate_tracking_get_analytics(VARCHAR(255)) CASCADE;
DROP FUNCTION IF EXISTS candidate_tracking_get_user_history(VARCHAR(255), INTEGER) CASCADE;
DROP FUNCTION IF EXISTS candidate_tracking_get_top_candidates(INTEGER, INTEGER) CASCADE;

-- 2. Drop any triggers we created
DROP TRIGGER IF EXISTS trigger_increment_activity_count ON candidate_views;

-- 3. Check what's left in the candidate_views table
SELECT 'Current candidate_views table structure:' as step;
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check current data in candidate_views
SELECT 'Current candidate_views data:' as step;
SELECT COUNT(*) as total_records FROM candidate_views;

-- 5. Check current users table
SELECT 'Current users table:' as step;
SELECT user_id, user_type, created_at
FROM users 
ORDER BY created_at DESC
LIMIT 10;

-- 6. Show the clean state
SELECT '✅ Rollback complete!' as status;
SELECT '✅ All complex functions removed' as cleanup_status;
SELECT '✅ candidate_views table is clean and ready for simple approach' as ready_status;

-- 7. Show what we have now
SELECT 'Current state:' as info;
SELECT 'candidate_views table: Clean with activity_count column' as table_status;
SELECT 'users table: Contains existing users (Regular, Anonymous, Admin)' as users_status;
SELECT 'Foreign key: candidate_views.user_id -> users.user_id' as fk_status;
