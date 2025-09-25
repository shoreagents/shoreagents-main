-- Fix the foreign key constraint issue in content_views table
-- The issue is that we're using device_id as user_id, but the foreign key
-- constraint requires user_id to exist in the users table

-- Option 1: Remove the foreign key constraint entirely
-- This allows device_id values to be used as user_id without requiring them to exist in users table
ALTER TABLE public.content_views DROP CONSTRAINT IF EXISTS content_views_user_id_fkey;

-- Option 2: Make the foreign key constraint deferrable (if you want to keep it)
-- This allows the constraint to be checked at the end of the transaction
-- ALTER TABLE public.content_views DROP CONSTRAINT IF EXISTS content_views_user_id_fkey;
-- ALTER TABLE public.content_views ADD CONSTRAINT content_views_user_id_fkey 
--     FOREIGN KEY (user_id) REFERENCES public.users(user_id) 
--     ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

-- Option 3: Change the constraint to allow NULL values and only enforce when user_id is not NULL
-- This is more complex and requires recreating the constraint

-- For now, let's go with Option 1 (remove the constraint) since we're using device_id as user_id
-- and device_id values don't need to exist in the users table

-- Verify the constraint is removed
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
    AND tc.table_name='content_views'
    AND kcu.column_name = 'user_id';
