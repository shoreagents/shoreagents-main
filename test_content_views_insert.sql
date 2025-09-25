-- Test inserting data into content_views table after removing foreign key constraint

-- Test insert with device_id as user_id (this should work now)
INSERT INTO public.content_views (
    user_id,
    session_id,
    device_id,
    content_type,
    content_id,
    content_title,
    page_section,
    referrer_type
) VALUES (
    'device_test_123',
    'session_test_456',
    'device_test_123',
    'test_page',
    'test-insert',
    'Test Insert',
    'main',
    'direct'
);

-- Check if the insert was successful
SELECT 
    id,
    user_id,
    session_id,
    device_id,
    content_type,
    content_id,
    content_title,
    page_section,
    viewed_at
FROM public.content_views 
WHERE content_id = 'test-insert'
ORDER BY viewed_at DESC;

-- Clean up test data
-- DELETE FROM public.content_views WHERE content_id = 'test-insert';
