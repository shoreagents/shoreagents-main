-- Drop columns from content_views table
-- Remove is_bounce, is_return_visit, and form_submissions columns

-- 1. Drop the is_bounce column
ALTER TABLE public.content_views DROP COLUMN IF EXISTS is_bounce;

-- 2. Drop the is_return_visit column
ALTER TABLE public.content_views DROP COLUMN IF EXISTS is_return_visit;

-- 3. Drop the form_submissions column
ALTER TABLE public.content_views DROP COLUMN IF EXISTS form_submissions;

-- 4. Verify the columns have been dropped
SELECT 
    'Column Check' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'content_views' 
  AND table_schema = 'public'
  AND column_name IN ('is_bounce', 'is_return_visit', 'form_submissions')
ORDER BY column_name;

-- 5. Show the updated table structure
SELECT 
    'Updated Table Structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'content_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Test insert with new structure (without dropped columns)
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
    'test-dropped-columns',
    'Test Dropped Columns',
    'main',
    'view',
    1,
    50,
    10,
    'direct'
);

-- 7. Verify the test insert worked
SELECT 
    'Test Insert Verification' as info,
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
WHERE content_id = 'test-dropped-columns'
ORDER BY viewed_at DESC
LIMIT 1;

-- 8. Clean up test data
DELETE FROM public.content_views WHERE content_id = 'test-dropped-columns';

-- 9. Show final table structure
SELECT 
    'Final Table Structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'content_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

SELECT '✅ Columns dropped successfully!' as status;
SELECT '✅ content_views table updated!' as info;
