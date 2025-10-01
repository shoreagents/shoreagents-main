-- Main Schema File
-- ================
-- This file imports all the separate SQL components in the correct order
-- Execute this file to set up the complete database schema

-- Create schema
CREATE SCHEMA public AUTHORIZATION postgres;

-- Import all components in dependency order
\i 01_data_types.sql
\i 02_sequences.sql
\i 03_tables.sql
\i 04_views.sql
\i 06_functions_http_supabase.sql
\i 07_functions_user_management.sql
\i 08_functions_candidate_views.sql
\i 09_functions_analytics.sql
\i 10_functions_bpoc_integration.sql
\i 11_functions_utility.sql
\i 05_triggers.sql
