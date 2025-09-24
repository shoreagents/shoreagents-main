-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;

-- DROP DOMAIN public.content_type;

CREATE DOMAIN public.content_type AS text
	COLLATE "default"
	CONSTRAINT content_type_check CHECK (VALUE ~ '^\S+\/\S+'::text);
-- DROP DOMAIN public.http_method;

CREATE DOMAIN public.http_method AS text
	COLLATE "default";
-- DROP TYPE public."user_type_enum";

CREATE TYPE public."user_type_enum" AS ENUM (
	'Anonymous',
	'Regular',
	'Admin');

-- DROP SEQUENCE public.ai_analysis_id_seq;

CREATE SEQUENCE public.ai_analysis_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
-- DROP SEQUENCE public.bpoc_employees_id_seq;

CREATE SEQUENCE public.bpoc_employees_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;-- public.bpoc_employees definition

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

-- Table Triggers

create trigger update_bpoc_employees_updated_at before
update
    on
    public.bpoc_employees for each row execute function update_bpoc_employees_updated_at();


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

-- Table Triggers

create trigger trigger_create_user_on_page_visit before
insert
    on
    public.user_page_visits for each row execute function create_user_on_page_visit();


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
	CONSTRAINT pricing_quotes_pkey PRIMARY KEY (id),
	CONSTRAINT fk_pricing_quotes_user_id FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE
);
CREATE INDEX idx_pricing_quotes_industry ON public.pricing_quotes USING btree (industry);
CREATE INDEX idx_pricing_quotes_quote_number ON public.pricing_quotes USING btree (user_id, quote_number);
CREATE INDEX idx_pricing_quotes_user_id ON public.pricing_quotes USING btree (user_id);

-- Table Triggers

create trigger trigger_generate_quote_number before
insert
    on
    public.pricing_quotes for each row execute function generate_quote_number();
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
CREATE INDEX idx_pricing_quote_roles_quote_id ON public.pricing_quote_roles USING btree (quote_id);

-- Table Triggers

create trigger trigger_update_pricing_quote_roles_updated_at before
update
    on
    public.pricing_quote_roles for each row execute function update_updated_at_column();



-- DROP FUNCTION public.bytea_to_text(bytea);

CREATE OR REPLACE FUNCTION public.bytea_to_text(data bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$bytea_to_text$function$
;

-- DROP FUNCTION public.create_user_on_page_visit();

CREATE OR REPLACE FUNCTION public.create_user_on_page_visit()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Check if user exists, if not create one
    INSERT INTO public.users (id, user_id, user_type, created_at)
    VALUES (
        gen_random_uuid(),
        NEW.user_id,
        'Anonymous',
        NOW()
    )
    ON CONFLICT (user_id) DO NOTHING;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.fetch_bpoc_employee_by_id(text);

CREATE OR REPLACE FUNCTION public.fetch_bpoc_employee_by_id(emp_user_id text)
 RETURNS TABLE(success boolean, message text, employee_data jsonb)
 LANGUAGE plpgsql
AS $function$
DECLARE
    api_response JSONB;
    employee_data JSONB;
    http_response TEXT;
BEGIN
    -- Make HTTP request to BPOC API
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        -- Parse the JSON response
        api_response := http_response::JSONB;
        
        -- Check if the API call was successful
        IF NOT (api_response->>'success')::BOOLEAN THEN
            RETURN QUERY SELECT FALSE, 'BPOC API returned unsuccessful response', NULL::JSONB;
            RETURN;
        END IF;
        
        -- Find the specific employee
        SELECT jsonb_array_elements(api_response->'data') INTO employee_data
        WHERE (jsonb_array_elements(api_response->'data')->>'user_id') = emp_user_id;
        
        IF employee_data IS NULL THEN
            RETURN QUERY SELECT FALSE, 'Employee not found in BPOC API', NULL::JSONB;
        ELSE
            RETURN QUERY SELECT TRUE, 'Employee found successfully', employee_data;
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT FALSE, 'Error fetching data from BPOC API: ' || SQLERRM, NULL::JSONB;
    END;
END;
$function$
;

-- DROP FUNCTION public.generate_quote_number();

CREATE OR REPLACE FUNCTION public.generate_quote_number()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Generate sequential quote number for each user
    SELECT COALESCE(MAX(quote_number), 0) + 1 
    INTO NEW.quote_number
    FROM pricing_quotes 
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.get_bpoc_employee_stats();

CREATE OR REPLACE FUNCTION public.get_bpoc_employee_stats()
 RETURNS TABLE(total_employees bigint, active_employees bigint, employed_employees bigint, available_employees bigint, employees_with_analysis bigint, average_score numeric, top_skills jsonb)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_employees,
        COUNT(*) FILTER (WHERE work_status_completed = true) as active_employees,
        COUNT(*) FILTER (WHERE work_status = 'employed') as employed_employees,
        COUNT(*) FILTER (WHERE work_status = 'available') as available_employees,
        COUNT(*) FILTER (WHERE key_strengths IS NOT NULL AND jsonb_array_length(key_strengths) > 0) as employees_with_analysis,
        ROUND(AVG(overall_score), 2) as average_score,
        (
            SELECT jsonb_agg(skill_data)
            FROM (
                SELECT skill, COUNT(*) as count
                FROM bpoc_employees,
                     jsonb_array_elements_text(skills_snapshot) as skill
                WHERE skills_snapshot IS NOT NULL
                GROUP BY skill
                ORDER BY COUNT(*) DESC
                LIMIT 10
            ) skill_data
        ) as top_skills
    FROM bpoc_employees;
END;
$function$
;

-- DROP FUNCTION public.http(http_request);

CREATE OR REPLACE FUNCTION public.http(request http_request)
 RETURNS http_response
 LANGUAGE c
AS '$libdir/http', $function$http_request$function$
;

-- DROP FUNCTION public.http_delete(varchar);

CREATE OR REPLACE FUNCTION public.http_delete(uri character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('DELETE', $1, NULL, NULL, NULL)::public.http_request) $function$
;

-- DROP FUNCTION public.http_delete(varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_delete(uri character varying, content character varying, content_type character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('DELETE', $1, NULL, $3, $2)::public.http_request) $function$
;

-- DROP FUNCTION public.http_get(varchar);

CREATE OR REPLACE FUNCTION public.http_get(uri character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('GET', $1, NULL, NULL, NULL)::public.http_request) $function$
;

-- DROP FUNCTION public.http_get(varchar, jsonb);

CREATE OR REPLACE FUNCTION public.http_get(uri character varying, data jsonb)
 RETURNS http_response
 LANGUAGE sql
AS $function$
        SELECT public.http(('GET', $1 || '?' || public.urlencode($2), NULL, NULL, NULL)::public.http_request)
    $function$
;

-- DROP FUNCTION public.http_head(varchar);

CREATE OR REPLACE FUNCTION public.http_head(uri character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('HEAD', $1, NULL, NULL, NULL)::public.http_request) $function$
;

-- DROP FUNCTION public.http_header(varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_header(field character varying, value character varying)
 RETURNS http_header
 LANGUAGE sql
AS $function$ SELECT $1, $2 $function$
;

-- DROP FUNCTION public.http_list_curlopt();

CREATE OR REPLACE FUNCTION public.http_list_curlopt()
 RETURNS TABLE(curlopt text, value text)
 LANGUAGE c
AS '$libdir/http', $function$http_list_curlopt$function$
;

-- DROP FUNCTION public.http_patch(varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_patch(uri character varying, content character varying, content_type character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('PATCH', $1, NULL, $3, $2)::public.http_request) $function$
;

-- DROP FUNCTION public.http_post(varchar, jsonb);

CREATE OR REPLACE FUNCTION public.http_post(uri character varying, data jsonb)
 RETURNS http_response
 LANGUAGE sql
AS $function$
        SELECT public.http(('POST', $1, NULL, 'application/x-www-form-urlencoded', public.urlencode($2))::public.http_request)
    $function$
;

-- DROP FUNCTION public.http_post(varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_post(uri character varying, content character varying, content_type character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('POST', $1, NULL, $3, $2)::public.http_request) $function$
;

-- DROP FUNCTION public.http_put(varchar, varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_put(uri character varying, content character varying, content_type character varying)
 RETURNS http_response
 LANGUAGE sql
AS $function$ SELECT public.http(('PUT', $1, NULL, $3, $2)::public.http_request) $function$
;

-- DROP FUNCTION public.http_reset_curlopt();

CREATE OR REPLACE FUNCTION public.http_reset_curlopt()
 RETURNS boolean
 LANGUAGE c
AS '$libdir/http', $function$http_reset_curlopt$function$
;

-- DROP FUNCTION public.http_set_curlopt(varchar, varchar);

CREATE OR REPLACE FUNCTION public.http_set_curlopt(curlopt character varying, value character varying)
 RETURNS boolean
 LANGUAGE c
AS '$libdir/http', $function$http_set_curlopt$function$
;

-- DROP FUNCTION public.sync_bpoc_employees_data();

CREATE OR REPLACE FUNCTION public.sync_bpoc_employees_data()
 RETURNS TABLE(total_fetched integer, new_employees integer, updated_employees integer, errors integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    api_response JSONB;
    employee_data JSONB;
    employee_record RECORD;
    total_count INTEGER := 0;
    new_count INTEGER := 0;
    updated_count INTEGER := 0;
    error_count INTEGER := 0;
    http_response TEXT;
BEGIN
    -- Make HTTP request to BPOC API
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        -- Parse the JSON response
        api_response := http_response::JSONB;
        
        -- Check if the API call was successful
        IF NOT (api_response->>'success')::BOOLEAN THEN
            RAISE EXCEPTION 'BPOC API returned unsuccessful response: %', api_response;
        END IF;
        
        -- Process each employee in the response
        FOR employee_data IN SELECT * FROM jsonb_array_elements(api_response->'data')
        LOOP
            total_count := total_count + 1;
            
            BEGIN
                -- Check if employee already exists
                SELECT * INTO employee_record 
                FROM bpoc_employees 
                WHERE user_id = employee_data->>'user_id';
                
                IF FOUND THEN
                    -- Update existing employee
                    UPDATE bpoc_employees SET
                        full_name = COALESCE(employee_data->>'full_name', full_name),
                        first_name = COALESCE(employee_data->>'first_name', first_name),
                        last_name = COALESCE(employee_data->>'last_name', last_name),
                        current_position = COALESCE(employee_data->>'current_position', current_position),
                        position = COALESCE(employee_data->>'position', position),
                        location = COALESCE(employee_data->>'location', location),
                        avatar_url = COALESCE(employee_data->>'avatar_url', avatar_url),
                        bio = COALESCE(employee_data->>'bio', bio),
                        overall_score = COALESCE((employee_data->>'overall_score')::INTEGER, overall_score),
                        skills_snapshot = COALESCE(employee_data->'skills_snapshot', skills_snapshot),
                        experience_snapshot = COALESCE(employee_data->'experience_snapshot', experience_snapshot),
                        expected_salary = COALESCE(
                            CASE 
                                WHEN employee_data->>'expected_salary' IS NOT NULL 
                                THEN (regexp_replace(employee_data->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                                ELSE expected_salary 
                            END, 
                            expected_salary
                        ),
                        work_status = COALESCE(employee_data->>'work_status', work_status),
                        work_status_completed = COALESCE((employee_data->>'work_status_completed')::BOOLEAN, work_status_completed),
                        user_created_at = COALESCE(
                            (employee_data->>'user_created_at')::TIMESTAMPTZ, 
                            user_created_at
                        ),
                        key_strengths = COALESCE(employee_data->'key_strengths', key_strengths),
                        improvements = COALESCE(employee_data->'improvements', improvements),
                        recommendations = COALESCE(employee_data->'recommendations', recommendations),
                        improved_summary = COALESCE(employee_data->>'improved_summary', improved_summary),
                        strengths_analysis = COALESCE(employee_data->'strengths_analysis', strengths_analysis),
                        updated_at = CURRENT_TIMESTAMP
                    WHERE user_id = employee_data->>'user_id';
                    
                    updated_count := updated_count + 1;
                ELSE
                    -- Insert new employee
                    INSERT INTO bpoc_employees (
                        user_id,
                        full_name,
                        first_name,
                        last_name,
                        current_position,
                        position,
                        location,
                        avatar_url,
                        bio,
                        overall_score,
                        skills_snapshot,
                        experience_snapshot,
                        expected_salary,
                        work_status,
                        work_status_completed,
                        user_created_at,
                        key_strengths,
                        improvements,
                        recommendations,
                        improved_summary,
                        strengths_analysis
                    ) VALUES (
                        employee_data->>'user_id',
                        employee_data->>'full_name',
                        employee_data->>'first_name',
                        employee_data->>'last_name',
                        employee_data->>'current_position',
                        employee_data->>'position',
                        employee_data->>'location',
                        employee_data->>'avatar_url',
                        employee_data->>'bio',
                        (employee_data->>'overall_score')::INTEGER,
                        COALESCE(employee_data->'skills_snapshot', '[]'::jsonb),
                        employee_data->'experience_snapshot',
                        CASE 
                            WHEN employee_data->>'expected_salary' IS NOT NULL 
                            THEN (regexp_replace(employee_data->>'expected_salary', '[^\d.]', '', 'g'))::NUMERIC(10,2)
                            ELSE NULL 
                        END,
                        employee_data->>'work_status',
                        (employee_data->>'work_status_completed')::BOOLEAN,
                        (employee_data->>'user_created_at')::TIMESTAMPTZ,
                        COALESCE(employee_data->'key_strengths', '[]'::jsonb),
                        COALESCE(employee_data->'improvements', '[]'::jsonb),
                        COALESCE(employee_data->'recommendations', '[]'::jsonb),
                        employee_data->>'improved_summary',
                        employee_data->'strengths_analysis'
                    );
                    
                    new_count := new_count + 1;
                END IF;
                
            EXCEPTION WHEN OTHERS THEN
                error_count := error_count + 1;
                RAISE WARNING 'Error processing employee %: %', employee_data->>'user_id', SQLERRM;
            END;
        END LOOP;
        
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION 'Error fetching data from BPOC API: %', SQLERRM;
    END;
    
    -- Return summary
    RETURN QUERY SELECT total_count, new_count, updated_count, error_count;
END;
$function$
;

-- DROP FUNCTION public.test_bpoc_api_connection();

CREATE OR REPLACE FUNCTION public.test_bpoc_api_connection()
 RETURNS TABLE(success boolean, message text, response_size integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
    http_response TEXT;
    api_response JSONB;
BEGIN
    BEGIN
        SELECT content INTO http_response
        FROM http((
            'GET',
            'https://www.bpoc.io/api/public/user-data',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        
        api_response := http_response::JSONB;
        
        IF (api_response->>'success')::BOOLEAN THEN
            RETURN QUERY SELECT 
                TRUE, 
                'BPOC API connection successful', 
                jsonb_array_length(api_response->'data');
        ELSE
            RETURN QUERY SELECT 
                FALSE, 
                'BPOC API returned unsuccessful response', 
                0;
        END IF;
        
    EXCEPTION WHEN OTHERS THEN
        RETURN QUERY SELECT 
            FALSE, 
            'BPOC API connection error: ' || SQLERRM, 
            0;
    END;
END;
$function$
;

-- DROP FUNCTION public.test_http_extension();

CREATE OR REPLACE FUNCTION public.test_http_extension()
 RETURNS text
 LANGUAGE plpgsql
AS $function$
BEGIN
    -- Try to make a simple HTTP request
    BEGIN
        PERFORM content FROM http((
            'GET',
            'https://httpbin.org/get',
            ARRAY[http_header('Accept', 'application/json')],
            NULL,
            NULL
        )::http_request);
        RETURN 'HTTP extension is working correctly';
    EXCEPTION WHEN OTHERS THEN
        RETURN 'HTTP extension error: ' || SQLERRM;
    END;
END;
$function$
;

-- DROP FUNCTION public.text_to_bytea(text);

CREATE OR REPLACE FUNCTION public.text_to_bytea(data text)
 RETURNS bytea
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$text_to_bytea$function$
;

-- DROP FUNCTION public.update_bpoc_employees_updated_at();

CREATE OR REPLACE FUNCTION public.update_bpoc_employees_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$function$
;

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
  -- Update user's updated_at timestamp
  UPDATE users 
  SET updated_at = NOW()
  WHERE user_id = NEW.user_id;
  
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
    -- Update user's updated_at timestamp
    UPDATE users SET updated_at = NOW()
    WHERE user_id = NEW.user_id;
    
    RETURN NEW;
END;
$function$
;

-- DROP FUNCTION public.urlencode(bytea);

CREATE OR REPLACE FUNCTION public.urlencode(string bytea)
 RETURNS text
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$urlencode$function$
;

-- DROP FUNCTION public.urlencode(varchar);

CREATE OR REPLACE FUNCTION public.urlencode(string character varying)
 RETURNS text
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$urlencode$function$
;

-- DROP FUNCTION public.urlencode(jsonb);

CREATE OR REPLACE FUNCTION public.urlencode(data jsonb)
 RETURNS text
 LANGUAGE c
 IMMUTABLE STRICT
AS '$libdir/http', $function$urlencode_jsonb$function$
;