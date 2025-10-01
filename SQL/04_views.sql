-- Views
-- =====

-- public.candidate_view_summary source

CREATE OR REPLACE VIEW public.candidate_view_summary
AS SELECT candidate_id,
    candidate_name,
    count(*) AS total_views,
    sum(view_duration) AS total_duration,
    avg(view_duration) AS avg_duration,
    max(view_duration) AS max_duration,
    avg(scroll_percentage) AS avg_scroll_percentage,
    max(scroll_percentage) AS max_scroll_percentage,
    count(DISTINCT user_id) AS unique_users,
    min(created_at) AS first_viewed,
    max(created_at) AS last_viewed
   FROM candidate_views
  GROUP BY candidate_id, candidate_name;

-- public.user_candidate_relationships source

CREATE OR REPLACE VIEW public.user_candidate_relationships
AS SELECT user_id,
    candidate_id,
    candidate_name,
    count(*) AS total_views,
    sum(view_duration) AS total_duration,
    avg(view_duration) AS avg_duration,
    max(view_duration) AS max_duration,
    avg(scroll_percentage) AS avg_scroll_percentage,
    max(scroll_percentage) AS max_scroll_percentage,
    min(created_at) AS first_viewed,
    max(created_at) AS last_viewed
   FROM candidate_views
  GROUP BY user_id, candidate_id, candidate_name;
