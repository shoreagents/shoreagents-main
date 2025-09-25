-- Simple test to verify direct insert works

-- 1. Test basic insert
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
    'device_1234567890_test',
    'session_1234567890_test',
    'device_1234567890_test',
    'test_page',
    'test-direct-insert-simple',
    'Test Direct Insert Simple',
    'main',
    'view',
    1,
    0,
    5,
    'direct'
);

-- 2. Check if it worked
SELECT 
    'Direct Insert Test' as test_type,
    id,
    user_id,
    session_id,
    device_id,
    content_type,
    content_id,
    interaction_type,
    activity_count,
    viewed_at
FROM public.content_views 
WHERE content_id = 'test-direct-insert-simple'
ORDER BY viewed_at DESC
LIMIT 1;

-- 3. Clean up
DELETE FROM public.content_views WHERE content_id = 'test-direct-insert-simple';

SELECT '✅ Direct insert test completed!' as status;
