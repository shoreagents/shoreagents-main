-- Fix permissions for pricing_quotes tables
-- Run this script in your Supabase SQL editor to fix the permission issues

-- Grant necessary permissions to allow access to tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.pricing_quotes TO anon, authenticated;
GRANT ALL ON public.pricing_quote_roles TO anon, authenticated;

-- Disable Row Level Security to prevent permission issues
ALTER TABLE public.pricing_quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_quote_roles DISABLE ROW LEVEL SECURITY;

-- Verify permissions
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    hasrls
FROM pg_tables 
WHERE tablename IN ('pricing_quotes', 'pricing_quote_roles')
AND schemaname = 'public';
