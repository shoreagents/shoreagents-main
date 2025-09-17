-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;

-- DROP TYPE public."user_type_enum";

CREATE TYPE public."user_type_enum" AS ENUM (
	'Anonymous',
	'Regular',
	'Admin');
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

-- Table Triggers

create trigger trigger_update_users_updated_at before
update
    on
    public.users for each row execute function update_updated_at_column();


-- public.pricing_quotes definition

-- Drop table

-- DROP TABLE public.pricing_quotes;

CREATE TABLE public.pricing_quotes (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_id uuid NOT NULL,
	session_id text NULL,
	quote_timestamp timestamptz DEFAULT now() NOT NULL,
	member_count int4 NOT NULL,
	industry text NOT NULL,
	total_monthly_cost numeric(10, 2) NOT NULL,
	currency_code varchar(3) DEFAULT 'PHP'::character varying NOT NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	CONSTRAINT pricing_quotes_pkey PRIMARY KEY (id),
	CONSTRAINT fk_pricing_quotes_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

-- Table Triggers

create trigger trigger_update_pricing_quotes_updated_at before
update
    on
    public.pricing_quotes for each row execute function update_updated_at_column();


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

-- Table Triggers

create trigger trigger_update_pricing_quote_roles_updated_at before
update
    on
    public.pricing_quote_roles for each row execute function update_updated_at_column();



-- DROP FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_user_stats();

CREATE OR REPLACE FUNCTION public.update_user_stats()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Update user's last_seen and total_visits
  UPDATE users 
  SET 
    last_seen = NOW(),
    total_visits = total_visits + 1,
    total_pages_visited = (
      SELECT COUNT(DISTINCT page_path) 
      FROM page_visits 
      WHERE user_id = NEW.user_id
    ),
    average_interest_score = (
      SELECT AVG(interest_level) 
      FROM page_visits 
      WHERE user_id = NEW.user_id
    ),
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.update_user_stats_on_page_visit();

CREATE OR REPLACE FUNCTION public.update_user_stats_on_page_visit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Update user statistics
    UPDATE users SET
        last_seen = NEW.session_end_time,
        total_visits = total_visits + 1,
        total_pages_visited = (
            SELECT COUNT(DISTINCT page_path) 
            FROM page_visits 
            WHERE user_id = NEW.user_id
        ),
        total_active_time = (
            SELECT COALESCE(SUM(active_time), 0)
            FROM page_visits 
            WHERE user_id = NEW.user_id
        ),
        total_interactions = (
            SELECT COALESCE(SUM(interaction_count), 0)
            FROM page_visits 
            WHERE user_id = NEW.user_id
        ),
        average_interest_score = (
            SELECT COALESCE(AVG(interest_level), 0)
            FROM page_visits 
            WHERE user_id = NEW.user_id
        ),
        updated_at = NOW()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;