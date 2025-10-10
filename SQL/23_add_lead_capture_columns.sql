-- Add lead capture tracking columns to users table
ALTER TABLE public.users 
ADD COLUMN first_lead_capture BOOLEAN DEFAULT FALSE,
ADD COLUMN second_lead_capture BOOLEAN DEFAULT FALSE;

-- Add indexes for better performance
CREATE INDEX idx_users_first_lead_capture ON public.users USING btree (first_lead_capture);
CREATE INDEX idx_users_second_lead_capture ON public.users USING btree (second_lead_capture);
  