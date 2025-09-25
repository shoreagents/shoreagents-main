-- Simple test to verify content_views table insert works

-- 1. Test basic insert with minimal data
INSERT INTO public.content_views (
    content_type,
    content_id,
    interaction_type,
    activity_count
) VALUES (
    'test_page',
    'test-simple-insert',
    'view',
    1
);

-- 2. Check if the insert worked
SELECT 
    'Simple Insert Test' as test_type,
    id,
    content_type,
    content_id,
    interaction_type,
    activity_count,
    viewed_at
FROM public.content_views 
WHERE content_id = 'test-simple-insert'
ORDER BY viewed_at DESC
LIMIT 1;

-- 3. Test insert with all required fields
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
    form_submissions,
    scroll_depth,
    view_duration
) VALUES (
    'test_user_123',
    'test_session_456',
    'test_device_789',
    'test_page',
    'test-full-insert',
    'Test Full Insert',
    'main',
    'view',
    1,
    0,
    0,
    10
);

-- 4. Check if the full insert worked
SELECT 
    'Full Insert Test' as test_type,
    id,
    user_id,
    session_id,
    device_id,
    content_type,
    content_id,
    content_title,
    page_section,
    interaction_type,
    activity_count,
    form_submissions,
    scroll_depth,
    view_duration,
    viewed_at
FROM public.content_views 
WHERE content_id = 'test-full-insert'
ORDER BY viewed_at DESC
LIMIT 1;

-- 5. Clean up test data
DELETE FROM public.content_views WHERE content_id IN ('test-simple-insert', 'test-full-insert');

-- 6. Show recent content_views to see current data
SELECT 
    'Recent Content Views' as info,
    id,
    user_id,
    content_type,
    content_id,
    interaction_type,
    activity_count,
    form_submissions,
    scroll_depth,
    viewed_at
FROM public.content_views 
ORDER BY viewed_at DESC
LIMIT 5;
