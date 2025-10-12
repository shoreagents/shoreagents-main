-- Add third_lead_capture column to users table
-- This tracks when a user creates their account (signs up)

ALTER TABLE public.users 
ADD COLUMN third_lead_capture BOOLEAN DEFAULT FALSE;

-- Add index for third_lead_capture for better query performance
CREATE INDEX idx_users_third_lead_capture ON public.users USING btree (third_lead_capture);


