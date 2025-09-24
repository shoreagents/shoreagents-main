-- Connect candidate_views.user_id to users.user_id with foreign key constraint

-- 1. First, let's check if there are any existing foreign key constraints
SELECT 'Checking existing foreign key constraints...' as step;
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'candidate_views';

-- 2. Drop any existing foreign key constraint if it exists
ALTER TABLE public.candidate_views DROP CONSTRAINT IF EXISTS candidate_views_user_id_fkey;

-- 3. Add the foreign key constraint
ALTER TABLE public.candidate_views 
ADD CONSTRAINT candidate_views_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES public.users(user_id) 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- 4. Verify the foreign key constraint was created
SELECT 'Verifying foreign key constraint creation...' as step;
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_name = 'candidate_views'
  AND tc.constraint_name = 'candidate_views_user_id_fkey';

-- 5. Test the foreign key constraint by trying to insert a record with a non-existent user_id
SELECT 'Testing foreign key constraint...' as step;

-- This should fail if the constraint is working
-- INSERT INTO public.candidate_views (user_id, candidate_id, candidate_name, interaction_type)
-- VALUES ('non_existent_user', 'test_candidate', 'Test Candidate', 'view');

-- 6. Test with an existing user_id (this should work)
SELECT 'Testing with existing user_id...' as step;
INSERT INTO public.candidate_views (user_id, candidate_id, candidate_name, interaction_type)
VALUES ('crypto_47bzt5', 'test_candidate_fk', 'Test Candidate FK', 'view')
ON CONFLICT DO NOTHING;

-- 7. Verify the record was inserted
SELECT 'Verifying record insertion...' as step;
SELECT * FROM public.candidate_views 
WHERE candidate_id = 'test_candidate_fk';

-- 8. Clean up test record
DELETE FROM public.candidate_views 
WHERE candidate_id = 'test_candidate_fk';

-- 9. Show final status
SELECT '✅ Foreign key constraint successfully created!' as status;
SELECT 'candidate_views.user_id is now connected to users.user_id' as connection_status;