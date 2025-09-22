-- Alternative approach: Enable RLS with proper policies for pricing_quotes tables
-- This is more secure than disabling RLS completely

-- Enable Row Level Security
ALTER TABLE public.pricing_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_quote_roles ENABLE ROW LEVEL SECURITY;

-- Grant basic permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.pricing_quotes TO anon, authenticated;
GRANT ALL ON public.pricing_quote_roles TO anon, authenticated;

-- Create RLS policies for pricing_quotes
CREATE POLICY "Users can insert their own pricing quotes" ON public.pricing_quotes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can view their own pricing quotes" ON public.pricing_quotes
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own pricing quotes" ON public.pricing_quotes
    FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own pricing quotes" ON public.pricing_quotes
    FOR DELETE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for pricing_quote_roles
CREATE POLICY "Users can insert roles for their quotes" ON public.pricing_quote_roles
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.pricing_quotes 
            WHERE id = quote_id 
            AND auth.uid()::text = user_id::text
        )
    );

CREATE POLICY "Users can view roles for their quotes" ON public.pricing_quote_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.pricing_quotes 
            WHERE id = quote_id 
            AND auth.uid()::text = user_id::text
        )
    );

CREATE POLICY "Users can update roles for their quotes" ON public.pricing_quote_roles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.pricing_quotes 
            WHERE id = quote_id 
            AND auth.uid()::text = user_id::text
        )
    );

CREATE POLICY "Users can delete roles for their quotes" ON public.pricing_quote_roles
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.pricing_quotes 
            WHERE id = quote_id 
            AND auth.uid()::text = user_id::text
        )
    );

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename IN ('pricing_quotes', 'pricing_quote_roles')
AND schemaname = 'public';
