-- Optimize content_views table by removing redundant columns
-- Remove device_id and session_id since they're not needed

-- 1. Drop the device_id column (redundant with user_id)
ALTER TABLE public.content_views DROP COLUMN IF EXISTS device_id;

-- 2. Drop the session_id column (not used for analytics)
ALTER TABLE public.content_views DROP COLUMN IF EXISTS session_id;

-- 3. Drop related indexes
DROP INDEX IF EXISTS idx_content_views_session_analytics;
DROP INDEX IF EXISTS idx_content_views_session_id;

-- 4. Verify the optimized table structure
SELECT 
    'Optimized Table Structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'content_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Test insert with optimized structure
INSERT INTO public.content_views (
    user_id,
    content_type,
    content_id,
    content_title,
    content_url,
    page_section,
    referrer_url,
    referrer_type,
    interaction_type,
    activity_count,
    view_duration,
    scroll_depth
) VALUES (
    'device_1234567890_optimized',
    'test_page',
    'test-optimized-structure',
    'Test Optimized Structure',
    'http://localhost:3000/test-optimized',
    'main',
    'http://localhost:3000/',
    'internal',
    'view',
    1,
    10,
    50
);

-- 6. Verify the test insert worked
SELECT 
    'Test Insert Verification' as info,
    id,
    user_id,
    content_type,
    content_id,
    interaction_type,
    activity_count,
    view_duration,
    scroll_depth,
    viewed_at
FROM public.content_views 
WHERE content_id = 'test-optimized-structure'
ORDER BY viewed_at DESC
LIMIT 1;

-- 7. Clean up test data
DELETE FROM public.content_views WHERE content_id = 'test-optimized-structure';

-- 8. Show final optimized structure
SELECT 
    'Final Optimized Structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'content_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '✅ Content views table optimized!' as status;
SELECT '✅ Removed device_id and session_id columns' as info;
SELECT '✅ Table is now streamlined for content analytics' as result;
