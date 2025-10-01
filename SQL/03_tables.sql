-- Tables
-- ======

-- public.bpoc_employees definition

-- Drop table
-- DROP TABLE public.bpoc_employees;

CREATE TABLE public.bpoc_employees (
	id serial4 NOT NULL,
	user_id varchar(255) NOT NULL,
	full_name varchar(255) NOT NULL,
	first_name varchar(100) NOT NULL,
	last_name varchar(100) NOT NULL,
	current_position varchar(255) NULL,
	"position" varchar(255) NULL,
	"location" varchar(255) NULL,
	avatar_url text NULL,
	bio text NULL,
	overall_score int4 DEFAULT 0 NULL,
	skills_snapshot jsonb DEFAULT '[]'::jsonb NULL,
	experience_snapshot jsonb NULL,
	expected_salary numeric(10, 2) NULL,
	work_status varchar(100) NULL,
	user_created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	key_strengths jsonb DEFAULT '[]'::jsonb NULL,
	improvements jsonb DEFAULT '[]'::jsonb NULL,
	recommendations jsonb DEFAULT '[]'::jsonb NULL,
	improved_summary text NULL,
	strengths_analysis jsonb NULL,
	work_status_completed bool DEFAULT false NULL,
	CONSTRAINT bpoc_employees_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100))),
	CONSTRAINT bpoc_employees_pkey PRIMARY KEY (id),
	CONSTRAINT bpoc_employees_user_id_key UNIQUE (user_id)
);

CREATE INDEX idx_bpoc_employees_created_at ON public.bpoc_employees USING btree (created_at);
CREATE INDEX idx_bpoc_employees_full_name ON public.bpoc_employees USING btree (full_name);
CREATE INDEX idx_bpoc_employees_location ON public.bpoc_employees USING btree (location);
CREATE INDEX idx_bpoc_employees_overall_score ON public.bpoc_employees USING btree (overall_score);
CREATE INDEX idx_bpoc_employees_position ON public.bpoc_employees USING btree ("position");
CREATE INDEX idx_bpoc_employees_user_id ON public.bpoc_employees USING btree (user_id);
CREATE INDEX idx_bpoc_employees_work_status ON public.bpoc_employees USING btree (work_status);
CREATE INDEX idx_bpoc_employees_work_status_completed ON public.bpoc_employees USING btree (work_status_completed);

-- public.content_views definition

-- Drop table
-- DROP TABLE public.content_views;

CREATE TABLE public.content_views (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id varchar(255) NULL,
	"content_type" varchar(50) NOT NULL,
	content_id varchar(255) NOT NULL,
	content_title varchar(500) NULL,
	content_url text NULL,
	page_section varchar(100) NULL,
	referrer_url text NULL,
	referrer_type varchar(50) NULL,
	view_duration int4 NULL,
	scroll_depth int4 NULL,
	viewed_at timestamptz DEFAULT now() NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	interaction_type varchar(50) DEFAULT 'view'::character varying NULL,
	activity_count int4 DEFAULT 1 NULL,
	CONSTRAINT content_views_activity_count_check CHECK ((activity_count > 0)),
	CONSTRAINT content_views_interaction_type_check CHECK (((interaction_type)::text = ANY (ARRAY[('view'::character varying)::text, ('click'::character varying)::text, ('scroll'::character varying)::text, ('form_submit'::character varying)::text, ('page_exit'::character varying)::text, ('return_visit'::character varying)::text]))),
	CONSTRAINT content_views_pkey PRIMARY KEY (id)
);

CREATE INDEX idx_content_views_activity_count ON public.content_views USING btree (activity_count);
CREATE INDEX idx_content_views_content_analytics ON public.content_views USING btree (content_type, content_id, viewed_at);
CREATE INDEX idx_content_views_content_id ON public.content_views USING btree (content_id);
CREATE INDEX idx_content_views_content_type ON public.content_views USING btree (content_type);
CREATE INDEX idx_content_views_interaction_analytics ON public.content_views USING btree (content_type, content_id, interaction_type);
CREATE INDEX idx_content_views_interaction_type ON public.content_views USING btree (interaction_type);
CREATE INDEX idx_content_views_referrer_type ON public.content_views USING btree (referrer_type);
CREATE INDEX idx_content_views_user_analytics ON public.content_views USING btree (user_id, viewed_at);
CREATE INDEX idx_content_views_user_id ON public.content_views USING btree (user_id);
CREATE INDEX idx_content_views_viewed_at ON public.content_views USING btree (viewed_at);

-- public.user_page_visits definition

-- Drop table
-- DROP TABLE public.user_page_visits;

CREATE TABLE public.user_page_visits (
	id uuid DEFAULT uuid_generate_v4() NOT NULL,
	user_id text NOT NULL,
	page_path text NOT NULL,
	ip_address text NULL,
	visit_timestamp timestamptz DEFAULT now() NOT NULL,
	created_at timestamptz DEFAULT now() NULL,
	visit_count int4 DEFAULT 1 NULL,
	time_spent_seconds int4 DEFAULT 0 NULL,
	last_visit_timestamp timestamptz DEFAULT now() NULL,
	CONSTRAINT user_page_visits_pkey PRIMARY KEY (id)
);

-- public.users definition

-- Drop table
-- DROP TABLE public.users;

CREATE TABLE public.users (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id varchar(255) NOT NULL,
	first_name varchar(100) NULL,
	last_name varchar(100) NULL,
	company varchar(200) NULL,
	email varchar(255) NULL,
	phone_number varchar(20) NULL,
	country varchar(100) NULL,
	created_at timestamptz DEFAULT now() NULL,
	updated_at timestamptz DEFAULT now() NULL,
	auth_user_id uuid NULL,
	user_type public."user_type_enum" DEFAULT 'Anonymous'::user_type_enum NOT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_user_id_key UNIQUE (user_id)
);

CREATE INDEX idx_users_company ON public.users USING btree (company);
CREATE INDEX idx_users_country ON public.users USING btree (country);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_user_id ON public.users USING btree (user_id);

-- public.ai_analysis definition

-- Drop table
-- DROP TABLE public.ai_analysis;

CREATE TABLE public.ai_analysis (
	id serial4 NOT NULL,
	user_id varchar(255) NOT NULL,
	analysis_id varchar(255) NULL,
	session_id varchar(255) NULL,
	overall_score int4 NULL,
	ats_compatibility_score int4 NULL,
	content_quality_score int4 NULL,
	professional_presentation_score int4 NULL,
	skills_alignment_score int4 NULL,
	key_strengths jsonb DEFAULT '[]'::jsonb NULL,
	improvements jsonb DEFAULT '[]'::jsonb NULL,
	recommendations jsonb DEFAULT '[]'::jsonb NULL,
	improved_summary text NULL,
	strengths_analysis jsonb NULL,
	salary_analysis jsonb NULL,
	career_path jsonb NULL,
	section_analysis jsonb NULL,
	candidate_profile jsonb NULL,
	skills_snapshot jsonb DEFAULT '[]'::jsonb NULL,
	experience_snapshot jsonb NULL,
	education_snapshot jsonb NULL,
	portfolio_links jsonb DEFAULT '[]'::jsonb NULL,
	analysis_created_at timestamptz NULL,
	analysis_updated_at timestamptz NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT ai_analysis_analysis_id_key UNIQUE (analysis_id),
	CONSTRAINT ai_analysis_ats_compatibility_score_check CHECK (((ats_compatibility_score >= 0) AND (ats_compatibility_score <= 100))),
	CONSTRAINT ai_analysis_content_quality_score_check CHECK (((content_quality_score >= 0) AND (content_quality_score <= 100))),
	CONSTRAINT ai_analysis_overall_score_check CHECK (((overall_score >= 0) AND (overall_score <= 100))),
	CONSTRAINT ai_analysis_pkey PRIMARY KEY (id),
	CONSTRAINT ai_analysis_professional_presentation_score_check CHECK (((professional_presentation_score >= 0) AND (professional_presentation_score <= 100))),
	CONSTRAINT ai_analysis_skills_alignment_score_check CHECK (((skills_alignment_score >= 0) AND (skills_alignment_score <= 100))),
	CONSTRAINT ai_analysis_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.bpoc_employees(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_ai_analysis_analysis_id ON public.ai_analysis USING btree (analysis_id);
CREATE INDEX idx_ai_analysis_created_at ON public.ai_analysis USING btree (created_at);
CREATE INDEX idx_ai_analysis_overall_score ON public.ai_analysis USING btree (overall_score);
CREATE INDEX idx_ai_analysis_updated_at ON public.ai_analysis USING btree (updated_at);
CREATE INDEX idx_ai_analysis_user_id ON public.ai_analysis USING btree (user_id);

-- public.candidate_views definition

-- Drop table
-- DROP TABLE public.candidate_views;

CREATE TABLE public.candidate_views (
	id serial4 NOT NULL,
	user_id varchar(255) NOT NULL,
	candidate_id varchar(255) NOT NULL,
	candidate_name varchar(255) NULL,
	view_duration int4 NULL,
	page_views int4 DEFAULT 1 NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	scroll_percentage int4 DEFAULT 0 NULL,
	CONSTRAINT candidate_views_candidate_id_check CHECK (((candidate_id IS NOT NULL) AND ((candidate_id)::text <> ''::text))),
	CONSTRAINT candidate_views_page_views_check CHECK ((page_views > 0)),
	CONSTRAINT candidate_views_pkey PRIMARY KEY (id),
	CONSTRAINT candidate_views_scroll_percentage_check CHECK (((scroll_percentage >= 0) AND (scroll_percentage <= 100))),
	CONSTRAINT candidate_views_user_id_check CHECK (((user_id IS NOT NULL) AND ((user_id)::text <> ''::text))),
	CONSTRAINT candidate_views_user_id_format_check CHECK (((user_id IS NOT NULL) AND ((user_id)::text <> ''::text) AND (length((user_id)::text) >= 3))),
	CONSTRAINT candidate_views_view_duration_check CHECK ((view_duration >= 0)),
	CONSTRAINT unique_user_candidate UNIQUE (user_id, candidate_id),
	CONSTRAINT candidate_views_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX idx_candidate_views_candidate_created ON public.candidate_views USING btree (candidate_id, created_at);
CREATE INDEX idx_candidate_views_candidate_id ON public.candidate_views USING btree (candidate_id);
CREATE INDEX idx_candidate_views_candidate_name ON public.candidate_views USING btree (candidate_name);
CREATE INDEX idx_candidate_views_created_at ON public.candidate_views USING btree (created_at);
CREATE INDEX idx_candidate_views_scroll_percentage ON public.candidate_views USING btree (scroll_percentage);
CREATE INDEX idx_candidate_views_user_created ON public.candidate_views USING btree (user_id, created_at);
CREATE INDEX idx_candidate_views_user_id ON public.candidate_views USING btree (user_id);

-- public.pricing_quotes definition

-- Drop table
-- DROP TABLE public.pricing_quotes;

CREATE TABLE public.pricing_quotes (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id text NOT NULL,
	session_id text NULL,
	quote_timestamp timestamptz DEFAULT now() NOT NULL,
	member_count int4 NOT NULL,
	industry text NOT NULL,
	total_monthly_cost numeric(10, 2) NOT NULL,
	currency_code varchar(3) DEFAULT 'PHP'::character varying NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	quote_number int4 DEFAULT 1 NOT NULL,
	candidate_recommendations jsonb DEFAULT '[]'::jsonb NULL, -- JSON array of recommended candidates for this quote
	CONSTRAINT pricing_quotes_pkey PRIMARY KEY (id),
	CONSTRAINT fk_pricing_quotes_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_pricing_quotes_candidate_recommendations ON public.pricing_quotes USING gin (candidate_recommendations);
CREATE INDEX idx_pricing_quotes_industry ON public.pricing_quotes USING btree (industry);
CREATE INDEX idx_pricing_quotes_quote_number ON public.pricing_quotes USING btree (user_id, quote_number);
CREATE INDEX idx_pricing_quotes_user_id ON public.pricing_quotes USING btree (user_id);

-- Column comments
COMMENT ON COLUMN public.pricing_quotes.candidate_recommendations IS 'JSON array of recommended candidates for this quote';

-- public.pricing_quote_roles definition

-- Drop table
-- DROP TABLE public.pricing_quote_roles;

CREATE TABLE public.pricing_quote_roles (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	quote_id uuid NOT NULL,
	role_title text NOT NULL,
	role_description text NULL,
	experience_level text NOT NULL,
	workspace_type text NOT NULL,
	base_salary_php numeric(10, 2) NOT NULL,
	multiplier numeric(3, 2) NOT NULL,
	monthly_cost numeric(10, 2) NOT NULL,
	workspace_cost numeric(10, 2) NOT NULL,
	total_cost numeric(10, 2) NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT pricing_quote_roles_pkey PRIMARY KEY (id),
	CONSTRAINT fk_pricing_quote_roles_quote_id FOREIGN KEY (quote_id) REFERENCES public.pricing_quotes(id) ON DELETE CASCADE
);

CREATE INDEX idx_pricing_quote_roles_quote_id ON public.pricing_quote_roles USING btree (quote_id);
