-- Debug content tracking after dropping columns

-- 1. Test basic insert to verify table structure works
INSERT INTO public.content_views (
    user_id,
    session_id,
    device_id,
    content_type,
    content_id,
    content_title,
    page_section,
    interaction_type,
    activity_count,
    scroll_depth,
    view_duration,
    referrer_type
) VALUES (
    'test_user_123',
    'test_session_456',
    'test_device_789',
    'test_page',
    'test-after-drop',
    'Test After Drop',
    'main',
    'view',
    1,
    50,
    10,
    'direct'
);

-- 2. Check if the insert worked
SELECT 
    'Test Insert After Drop' as test_type,
    id,
    user_id,
    content_type,
    content_id,
    interaction_type,
    activity_count,
    scroll_depth,
    view_duration,
    viewed_at
FROM public.content_views 
WHERE content_id = 'test-after-drop'
ORDER BY viewed_at DESC
LIMIT 1;

-- 3. Check recent content_views to see if any data is being saved
SELECT 
    'Recent Content Views' as info,
    id,
    user_id,
    content_type,
    content_id,
    interaction_type,
    activity_count,
    scroll_depth,
    view_duration,
    viewed_at
FROM public.content_views 
ORDER BY viewed_at DESC
LIMIT 10;

-- 4. Check if there are any recent errors in the logs
-- (This would require checking application logs)

-- 5. Verify table permissions are still intact
SELECT 
    'Permission Check' as info,
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename = 'content_views';

-- 6. Check RLS status
SELECT 
    'RLS Status' as info,
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'content_views';

-- 7. Clean up test data
DELETE FROM public.content_views WHERE content_id = 'test-after-drop';

SELECT '✅ Debug queries completed!' as status;
