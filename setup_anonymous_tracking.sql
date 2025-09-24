-- Setup anonymous tracking without requiring users table entries

-- 1. Remove the foreign key constraint that requires user_id to exist in users table
ALTER TABLE candidate_views DROP CONSTRAINT IF EXISTS candidate_views_user_id_fkey;

-- 2. Create a more flexible constraint that allows anonymous users
-- This allows any user_id format, including anonymous IDs
ALTER TABLE candidate_views ADD CONSTRAINT candidate_views_user_id_format_check 
CHECK (user_id IS NOT NULL AND user_id != '' AND length(user_id) >= 3);

-- 3. Create RLS policies for anonymous and authenticated users
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to insert candidate views" ON candidate_views;
DROP POLICY IF EXISTS "Allow anonymous users to insert candidate views" ON candidate_views;

-- Policy for authenticated users
CREATE POLICY "Allow authenticated users to insert candidate views" 
ON candidate_views FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Policy for anonymous users (allows any user_id format)
CREATE POLICY "Allow anonymous users to insert candidate views" 
ON candidate_views FOR INSERT 
TO anon 
WITH CHECK (true);

-- Policy for reading candidate views (both authenticated and anonymous)
CREATE POLICY "Allow reading candidate views" 
ON candidate_views FOR SELECT 
TO authenticated, anon 
USING (true);

-- Policy for updating candidate views (for view duration updates)
CREATE POLICY "Allow updating candidate views" 
ON candidate_views FOR UPDATE 
TO authenticated, anon 
USING (true);

-- 4. Enable RLS
ALTER TABLE candidate_views ENABLE ROW LEVEL SECURITY;

-- 5. Test inserting anonymous data
INSERT INTO candidate_views (
    user_id, 
    candidate_id, 
    candidate_name, 
    interaction_type,
    page_views
) VALUES (
    'anon_1234567890_abcdef123',
    'test_candidate_anonymous', 
    'Test Candidate for Anonymous User',
    'view',
    1
) ON CONFLICT DO NOTHING;

-- 6. Verify the insert worked
SELECT 'Anonymous tracking test' as test, COUNT(*) as records FROM candidate_views WHERE user_id = 'anon_1234567890_abcdef123';

-- 7. Test the analytics function
SELECT 'Analytics test with anonymous user' as test, * FROM get_candidate_analytics('test_candidate_anonymous');

-- 8. Test updating the record (for view duration)
UPDATE candidate_views 
SET view_duration = 45, updated_at = CURRENT_TIMESTAMP 
WHERE user_id = 'anon_1234567890_abcdef123' AND candidate_id = 'test_candidate_anonymous';

-- 9. Verify the update worked
SELECT 'Update test' as test, view_duration FROM candidate_views WHERE user_id = 'anon_1234567890_abcdef123';

-- 10. Clean up test data
DELETE FROM candidate_views WHERE user_id = 'anon_1234567890_abcdef123';

-- 11. Show the final table structure
SELECT 'Final setup complete' as status;
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'candidate_views' 
AND table_schema = 'public'
ORDER BY ordinal_position;
