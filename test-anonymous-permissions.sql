-- Test script to verify anonymous user permissions
-- Run this to check if anonymous users can insert data

-- Test 1: Check if anonymous user can access the schema
SELECT has_schema_privilege('anon', 'public', 'USAGE');

-- Test 2: Check if anonymous user can insert into users table
SELECT has_table_privilege('anon', 'public.users', 'INSERT');

-- Test 3: Check if anonymous user can insert into pricing_quotes table
SELECT has_table_privilege('anon', 'public.pricing_quotes', 'INSERT');

-- Test 4: Check if anonymous user can insert into pricing_quote_roles table
SELECT has_table_privilege('anon', 'public.pricing_quote_roles', 'INSERT');

-- Test 5: Check RLS status on tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'pricing_quotes', 'pricing_quote_roles');

-- If any of the above return false or show rowsecurity = true, 
-- you need to run the permissions fix:
