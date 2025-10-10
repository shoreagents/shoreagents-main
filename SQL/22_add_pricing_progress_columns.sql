-- Add pricing progress columns to users table
ALTER TABLE public.users 
ADD COLUMN pricing_progress jsonb DEFAULT '{}'::jsonb NULL,
ADD COLUMN current_pricing_step integer DEFAULT 0 NULL,
ADD COLUMN pricing_data jsonb DEFAULT '{}'::jsonb NULL,
ADD COLUMN pricing_completed_at timestamptz NULL;

-- Add indexes for better performance
CREATE INDEX idx_users_pricing_progress ON public.users USING gin (pricing_progress);
CREATE INDEX idx_users_current_pricing_step ON public.users USING btree (current_pricing_step);
CREATE INDEX idx_users_pricing_data ON public.users USING gin (pricing_data);
CREATE INDEX idx_users_pricing_completed_at ON public.users USING btree (pricing_completed_at);

-- Add comments for documentation
COMMENT ON COLUMN public.users.pricing_progress IS 'JSON object storing the current state of pricing calculator progress';
COMMENT ON COLUMN public.users.current_pricing_step IS 'Current step number in the pricing calculator (0-5)';
COMMENT ON COLUMN public.users.pricing_data IS 'JSON object storing all collected pricing data from all steps';
COMMENT ON COLUMN public.users.pricing_completed_at IS 'Timestamp when the pricing calculator was completed';
