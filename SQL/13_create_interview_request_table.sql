-- Create interview_request table
-- =============================

-- Create interview_request table to track all interview requests
CREATE TABLE public.interview_request (
    id serial4 NOT NULL,
    user_id varchar(255) NOT NULL,
    candidate_id varchar(255) NOT NULL,
    candidate_name varchar(255) NOT NULL,
    candidate_position varchar(255) NULL,
    requester_first_name varchar(100) NOT NULL,
    requester_last_name varchar(100) NOT NULL,
    requester_email varchar(255) NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT interview_request_pkey PRIMARY KEY (id),
    CONSTRAINT interview_request_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_interview_request_user_id ON public.interview_request USING btree (user_id);
CREATE INDEX idx_interview_request_candidate_id ON public.interview_request USING btree (candidate_id);
CREATE INDEX idx_interview_request_created_at ON public.interview_request USING btree (created_at);

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_interview_request_updated_at 
    BEFORE UPDATE ON public.interview_request 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add column comments for documentation
COMMENT ON TABLE public.interview_request IS 'Stores all interview requests made by users for specific candidates';
COMMENT ON COLUMN public.interview_request.user_id IS 'ID of the user who made the request';
COMMENT ON COLUMN public.interview_request.candidate_id IS 'ID of the candidate being requested for interview';
COMMENT ON COLUMN public.interview_request.candidate_name IS 'Name of the candidate being requested for interview';
COMMENT ON COLUMN public.interview_request.candidate_position IS 'Position/title of the candidate';
COMMENT ON COLUMN public.interview_request.requester_first_name IS 'First name of the person requesting the interview';
COMMENT ON COLUMN public.interview_request.requester_last_name IS 'Last name of the person requesting the interview';
COMMENT ON COLUMN public.interview_request.requester_email IS 'Email address of the person requesting the interview';
