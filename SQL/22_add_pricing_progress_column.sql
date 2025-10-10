-- Add progress_data column to pricing_quotes table to store step-by-step progress
ALTER TABLE public.pricing_quotes 
ADD COLUMN progress_data jsonb DEFAULT '{}'::jsonb NULL,
ADD COLUMN current_step integer DEFAULT 0 NULL;

-- Add index for better performance
CREATE INDEX idx_pricing_quotes_progress_data ON public.pricing_quotes USING gin (progress_data);
CREATE INDEX idx_pricing_quotes_current_step ON public.pricing_quotes USING btree (current_step);

-- Add comments for documentation
COMMENT ON COLUMN public.pricing_quotes.progress_data IS 'JSON object storing step-by-step progress data from the pricing calculator';
COMMENT ON COLUMN public.pricing_quotes.current_step IS 'Current step number in the pricing calculator (0-5)';
