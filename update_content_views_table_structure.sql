-- Update content_views table structure to match candidate_views
-- Drop interactions_count and add interaction_type and activity_count

-- 1. Drop the interactions_count column
ALTER TABLE public.content_views DROP COLUMN IF EXISTS interactions_count;

-- 2. Add interaction_type column (similar to candidate_views)
ALTER TABLE public.content_views ADD COLUMN interaction_type varchar(50) DEFAULT 'view'::character varying NULL;

-- 3. Add activity_count column (similar to candidate_views)
ALTER TABLE public.content_views ADD COLUMN activity_count int4 DEFAULT 1 NULL;

-- 4. Add check constraint for interaction_type (similar to candidate_views)
ALTER TABLE public.content_views ADD CONSTRAINT content_views_interaction_type_check 
    CHECK (((interaction_type)::text = ANY ((ARRAY['view'::character varying, 'click'::character varying, 'scroll'::character varying, 'form_submit'::character varying, 'page_exit'::character varying, 'return_visit'::character varying])::text[])));

-- 5. Add check constraint for activity_count (similar to candidate_views)
ALTER TABLE public.content_views ADD CONSTRAINT content_views_activity_count_check 
    CHECK ((activity_count > 0));

-- 6. Create index for interaction_type (similar to candidate_views)
CREATE INDEX idx_content_views_interaction_type ON public.content_views USING btree (interaction_type);

-- 7. Create index for activity_count
CREATE INDEX idx_content_views_activity_count ON public.content_views USING btree (activity_count);

-- 8. Create composite index for interaction analytics (similar to candidate_views)
CREATE INDEX idx_content_views_interaction_analytics ON public.content_views USING btree (content_type, content_id, interaction_type);

-- 9. Verify the new table structure
SELECT 
    'Table Structure' as info,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'content_views' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 10. Verify constraints
SELECT 
    'Constraints' as info,
    constraint_name,
    constraint_type,
    check_clause
FROM information_schema.table_constraints tc
LEFT JOIN information_schema.check_constraints cc ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'content_views' 
  AND tc.table_schema = 'public';

-- 11. Verify indexes
SELECT 
    'Indexes' as info,
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'content_views' 
  AND schemaname = 'public'
ORDER BY indexname;

-- 12. Test insert with new structure
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
    form_submissions
) VALUES (
    'test_user_123',
    'test_session_456',
    'test_device_789',
    'test_page',
    'test-new-structure',
    'Test New Structure',
    'main',
    'view',
    1,
    50,
    0
);

-- 13. Verify the test insert
SELECT 
    'Test Insert' as info,
    id,
    user_id,
    content_type,
    content_id,
    interaction_type,
    activity_count,
    scroll_depth,
    form_submissions,
    viewed_at
FROM public.content_views 
WHERE content_id = 'test-new-structure';

-- 14. Clean up test data
DELETE FROM public.content_views WHERE content_id = 'test-new-structure';

SELECT '✅ Content views table structure updated successfully!' as status;
SELECT '✅ Now matches candidate_views structure with interaction_type and activity_count' as info;
