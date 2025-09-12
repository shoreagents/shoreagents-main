-- DROP SCHEMA auth;

CREATE SCHEMA auth AUTHORIZATION supabase_admin;

-- DROP TYPE auth."aal_level";

CREATE TYPE auth."aal_level" AS ENUM (
	'aal1',
	'aal2',
	'aal3');

-- DROP TYPE auth."code_challenge_method";

CREATE TYPE auth."code_challenge_method" AS ENUM (
	's256',
	'plain');

-- DROP TYPE auth."factor_status";

CREATE TYPE auth."factor_status" AS ENUM (
	'unverified',
	'verified');

-- DROP TYPE auth."factor_type";

CREATE TYPE auth."factor_type" AS ENUM (
	'totp',
	'webauthn',
	'phone');

-- DROP TYPE auth."oauth_registration_type";

CREATE TYPE auth."oauth_registration_type" AS ENUM (
	'dynamic',
	'manual');

-- DROP TYPE auth."one_time_token_type";

CREATE TYPE auth."one_time_token_type" AS ENUM (
	'confirmation_token',
	'reauthentication_token',
	'recovery_token',
	'email_change_token_new',
	'email_change_token_current',
	'phone_change_token');

-- DROP SEQUENCE auth.refresh_tokens_id_seq;

CREATE SEQUENCE auth.refresh_tokens_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 1
	CACHE 1
	NO CYCLE;-- auth.audit_log_entries definition

-- Drop table

-- DROP TABLE auth.audit_log_entries;

CREATE TABLE auth.audit_log_entries (
	instance_id uuid NULL,
	id uuid NOT NULL,
	payload json NULL,
	created_at timestamptz NULL,
	ip_address varchar(64) DEFAULT ''::character varying NOT NULL,
	CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id)
);
CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);
COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


-- auth.flow_state definition

-- Drop table

-- DROP TABLE auth.flow_state;

CREATE TABLE auth.flow_state (
	id uuid NOT NULL,
	user_id uuid NULL,
	auth_code text NOT NULL,
	"code_challenge_method" auth."code_challenge_method" NOT NULL,
	code_challenge text NOT NULL,
	provider_type text NOT NULL,
	provider_access_token text NULL,
	provider_refresh_token text NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	authentication_method text NOT NULL,
	auth_code_issued_at timestamptz NULL,
	CONSTRAINT flow_state_pkey PRIMARY KEY (id)
);
CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);
CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);
CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);
COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


-- auth.instances definition

-- Drop table

-- DROP TABLE auth.instances;

CREATE TABLE auth.instances (
	id uuid NOT NULL,
	"uuid" uuid NULL,
	raw_base_config text NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT instances_pkey PRIMARY KEY (id)
);
COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


-- auth.oauth_clients definition

-- Drop table

-- DROP TABLE auth.oauth_clients;

CREATE TABLE auth.oauth_clients (
	id uuid NOT NULL,
	client_id text NOT NULL,
	client_secret_hash text NOT NULL,
	registration_type auth."oauth_registration_type" NOT NULL,
	redirect_uris text NOT NULL,
	grant_types text NOT NULL,
	client_name text NULL,
	client_uri text NULL,
	logo_uri text NULL,
	created_at timestamptz DEFAULT now() NOT NULL,
	updated_at timestamptz DEFAULT now() NOT NULL,
	deleted_at timestamptz NULL,
	CONSTRAINT oauth_clients_client_id_key UNIQUE (client_id),
	CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
	CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
	CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048)),
	CONSTRAINT oauth_clients_pkey PRIMARY KEY (id)
);
CREATE INDEX oauth_clients_client_id_idx ON auth.oauth_clients USING btree (client_id);
CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


-- auth.schema_migrations definition

-- Drop table

-- DROP TABLE auth.schema_migrations;

CREATE TABLE auth.schema_migrations (
	"version" varchar(255) NOT NULL,
	CONSTRAINT schema_migrations_pkey PRIMARY KEY (version)
);
COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


-- auth.sso_providers definition

-- Drop table

-- DROP TABLE auth.sso_providers;

CREATE TABLE auth.sso_providers (
	id uuid NOT NULL,
	resource_id text NULL, -- Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	disabled bool NULL,
	CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0))),
	CONSTRAINT sso_providers_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));
CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);
COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';

-- Column comments

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


-- auth.users definition

-- Drop table

-- DROP TABLE auth.users;

CREATE TABLE auth.users (
	instance_id uuid NULL,
	id uuid NOT NULL,
	aud varchar(255) NULL,
	"role" varchar(255) NULL,
	email varchar(255) NULL,
	encrypted_password varchar(255) NULL,
	email_confirmed_at timestamptz NULL,
	invited_at timestamptz NULL,
	confirmation_token varchar(255) NULL,
	confirmation_sent_at timestamptz NULL,
	recovery_token varchar(255) NULL,
	recovery_sent_at timestamptz NULL,
	email_change_token_new varchar(255) NULL,
	email_change varchar(255) NULL,
	email_change_sent_at timestamptz NULL,
	last_sign_in_at timestamptz NULL,
	raw_app_meta_data jsonb NULL,
	raw_user_meta_data jsonb NULL,
	is_super_admin bool NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	phone text DEFAULT NULL::character varying NULL,
	phone_confirmed_at timestamptz NULL,
	phone_change text DEFAULT ''::character varying NULL,
	phone_change_token varchar(255) DEFAULT ''::character varying NULL,
	phone_change_sent_at timestamptz NULL,
	confirmed_at timestamptz GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED NULL,
	email_change_token_current varchar(255) DEFAULT ''::character varying NULL,
	email_change_confirm_status int2 DEFAULT 0 NULL,
	banned_until timestamptz NULL,
	reauthentication_token varchar(255) DEFAULT ''::character varying NULL,
	reauthentication_sent_at timestamptz NULL,
	is_sso_user bool DEFAULT false NOT NULL, -- Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.
	deleted_at timestamptz NULL,
	is_anonymous bool DEFAULT false NOT NULL,
	CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2))),
	CONSTRAINT users_phone_key UNIQUE (phone),
	CONSTRAINT users_pkey PRIMARY KEY (id)
);
CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);
CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);
CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);
CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);
CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);
CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);
COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';
CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));
CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);
CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);
COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';

-- Column comments

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


-- auth.identities definition

-- Drop table

-- DROP TABLE auth.identities;

CREATE TABLE auth.identities (
	provider_id text NOT NULL,
	user_id uuid NOT NULL,
	identity_data jsonb NOT NULL,
	provider text NOT NULL,
	last_sign_in_at timestamptz NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	email text GENERATED ALWAYS AS (lower(identity_data ->> 'email'::text)) STORED NULL, -- Auth: Email is a generated column that references the optional email property in the identity_data
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	CONSTRAINT identities_pkey PRIMARY KEY (id),
	CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider),
	CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);
COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';
CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);
COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';

-- Column comments

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


-- auth.mfa_factors definition

-- Drop table

-- DROP TABLE auth.mfa_factors;

CREATE TABLE auth.mfa_factors (
	id uuid NOT NULL,
	user_id uuid NOT NULL,
	friendly_name text NULL,
	"factor_type" auth."factor_type" NOT NULL,
	status auth."factor_status" NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	secret text NULL,
	phone text NULL,
	last_challenged_at timestamptz NULL,
	web_authn_credential jsonb NULL,
	web_authn_aaguid uuid NULL,
	CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at),
	CONSTRAINT mfa_factors_pkey PRIMARY KEY (id),
	CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);
CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);
CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);
CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);
COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


-- auth.one_time_tokens definition

-- Drop table

-- DROP TABLE auth.one_time_tokens;

CREATE TABLE auth.one_time_tokens (
	id uuid NOT NULL,
	user_id uuid NOT NULL,
	token_type auth."one_time_token_type" NOT NULL,
	token_hash text NOT NULL,
	relates_to text NOT NULL,
	created_at timestamp DEFAULT now() NOT NULL,
	updated_at timestamp DEFAULT now() NOT NULL,
	CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id),
	CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0)),
	CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);
CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);
CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


-- auth.saml_providers definition

-- Drop table

-- DROP TABLE auth.saml_providers;

CREATE TABLE auth.saml_providers (
	id uuid NOT NULL,
	sso_provider_id uuid NOT NULL,
	entity_id text NOT NULL,
	metadata_xml text NOT NULL,
	metadata_url text NULL,
	attribute_mapping jsonb NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	name_id_format text NULL,
	CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
	CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
	CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0)),
	CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id),
	CONSTRAINT saml_providers_pkey PRIMARY KEY (id),
	CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE
);
CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);
COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


-- auth.saml_relay_states definition

-- Drop table

-- DROP TABLE auth.saml_relay_states;

CREATE TABLE auth.saml_relay_states (
	id uuid NOT NULL,
	sso_provider_id uuid NOT NULL,
	request_id text NOT NULL,
	for_email text NULL,
	redirect_to text NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	flow_state_id uuid NULL,
	CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0)),
	CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id),
	CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE,
	CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE
);
CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);
CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);
CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);
COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


-- auth.sessions definition

-- Drop table

-- DROP TABLE auth.sessions;

CREATE TABLE auth.sessions (
	id uuid NOT NULL,
	user_id uuid NOT NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	factor_id uuid NULL,
	aal auth."aal_level" NULL,
	not_after timestamptz NULL, -- Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.
	refreshed_at timestamp NULL,
	user_agent text NULL,
	ip inet NULL,
	tag text NULL,
	CONSTRAINT sessions_pkey PRIMARY KEY (id),
	CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);
CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);
CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);
COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';

-- Column comments

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


-- auth.sso_domains definition

-- Drop table

-- DROP TABLE auth.sso_domains;

CREATE TABLE auth.sso_domains (
	id uuid NOT NULL,
	sso_provider_id uuid NOT NULL,
	"domain" text NOT NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0)),
	CONSTRAINT sso_domains_pkey PRIMARY KEY (id),
	CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));
CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);
COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


-- auth.mfa_amr_claims definition

-- Drop table

-- DROP TABLE auth.mfa_amr_claims;

CREATE TABLE auth.mfa_amr_claims (
	session_id uuid NOT NULL,
	created_at timestamptz NOT NULL,
	updated_at timestamptz NOT NULL,
	authentication_method text NOT NULL,
	id uuid NOT NULL,
	CONSTRAINT amr_id_pk PRIMARY KEY (id),
	CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method),
	CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE
);
COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


-- auth.mfa_challenges definition

-- Drop table

-- DROP TABLE auth.mfa_challenges;

CREATE TABLE auth.mfa_challenges (
	id uuid NOT NULL,
	factor_id uuid NOT NULL,
	created_at timestamptz NOT NULL,
	verified_at timestamptz NULL,
	ip_address inet NOT NULL,
	otp_code text NULL,
	web_authn_session_data jsonb NULL,
	CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id),
	CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE
);
CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);
COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


-- auth.refresh_tokens definition

-- Drop table

-- DROP TABLE auth.refresh_tokens;

CREATE TABLE auth.refresh_tokens (
	instance_id uuid NULL,
	id bigserial NOT NULL,
	"token" varchar(255) NULL,
	user_id varchar(255) NULL,
	revoked bool NULL,
	created_at timestamptz NULL,
	updated_at timestamptz NULL,
	parent varchar(255) NULL,
	session_id uuid NULL,
	CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
	CONSTRAINT refresh_tokens_token_unique UNIQUE (token),
	CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE
);
CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);
CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);
CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);
CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);
CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);
COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';



-- DROP FUNCTION auth.email();

CREATE OR REPLACE FUNCTION auth.email()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$function$
;

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';

-- DROP FUNCTION auth.jwt();

CREATE OR REPLACE FUNCTION auth.jwt()
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$function$
;

-- DROP FUNCTION auth."role"();

CREATE OR REPLACE FUNCTION auth.role()
 RETURNS text
 LANGUAGE sql
 STABLE
AS $function$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$function$
;

COMMENT ON FUNCTION auth."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';

-- DROP FUNCTION auth.uid();

CREATE OR REPLACE FUNCTION auth.uid()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$function$
;

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';

-- DROP SCHEMA public;

CREATE SCHEMA public AUTHORIZATION postgres;

-- DROP TYPE public.user_type_enum;

CREATE TYPE public.user_type_enum AS ENUM (
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
	user_type public.user_type_enum DEFAULT 'Anonymous'::user_type_enum NOT NULL,
	CONSTRAINT users_pkey PRIMARY KEY (id),
	CONSTRAINT users_user_id_key UNIQUE (user_id)
);
CREATE INDEX idx_users_company ON public.users USING btree (company);
CREATE INDEX idx_users_country ON public.users USING btree (country);
CREATE INDEX idx_users_email ON public.users USING btree (email);
CREATE INDEX idx_users_user_id ON public.users USING btree (user_id);



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

-- Grant necessary permissions to allow access to tables
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.users TO anon, authenticated;
GRANT ALL ON public.user_page_visits TO anon, authenticated;

-- Disable Row Level Security to prevent permission issues
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_page_visits DISABLE ROW LEVEL SECURITY;