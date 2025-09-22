-- Add missing permissions to fix signup and pricing quote issues
-- Run this after your main DDL

-- Grant necessary permissions to allow access to tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.user_page_visits TO anon, authenticated;
GRANT ALL ON public.pricing_quotes TO anon, authenticated;
GRANT ALL ON public.pricing_quote_roles TO anon, authenticated;

-- Disable Row Level Security to prevent permission issues
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_page_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_quotes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_quote_roles DISABLE ROW LEVEL SECURITY;
