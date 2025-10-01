-- Add industry_name column to users table
-- =========================================

-- Add industry_name column to users table
ALTER TABLE public.users 
ADD COLUMN industry_name varchar(200) NULL;

-- Add index for industry_name for better query performance
CREATE INDEX idx_users_industry_name ON public.users USING btree (industry_name);

-- Add comment for the new column
COMMENT ON COLUMN public.users.industry_name IS 'Industry name from anonymous user inquiry form';
