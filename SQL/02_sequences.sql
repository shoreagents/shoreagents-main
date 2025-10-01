-- Sequences
-- ==========

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
	NO CYCLE;

-- DROP SEQUENCE public.candidate_views_id_seq;

CREATE SEQUENCE public.candidate_views_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;
