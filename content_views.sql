-- Content Views Tracking Table
-- This table tracks user interactions with various content types across the website

CREATE TABLE content_views (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Information
    user_id VARCHAR(255) REFERENCES users(user_id) ON DELETE SET NULL, -- NULL for anonymous users
    session_id VARCHAR(255), -- Track anonymous sessions
    device_id VARCHAR(255), -- Track device-specific views
    
    -- Content Information
    content_type VARCHAR(50) NOT NULL, -- 'page', 'blog', 'case_study', 'employee_profile', 'service', 'pricing_quote', etc.
    content_id VARCHAR(255) NOT NULL, -- ID or slug of the specific content
    content_title VARCHAR(500), -- Title of the content for easier reporting
    content_url TEXT, -- Full URL of the content
    
    -- Page/Section Context
    page_section VARCHAR(100), -- 'hero', 'services', 'testimonials', 'footer', etc.
    referrer_url TEXT, -- Where the user came from
    referrer_type VARCHAR(50), -- 'direct', 'search', 'social', 'email', 'internal', 'external'
    
    -- View Details
    view_duration INTEGER, -- Time spent on content in seconds
    scroll_depth INTEGER, -- Percentage of page scrolled (0-100)
    is_bounce BOOLEAN DEFAULT FALSE, -- Single page visit
    is_return_visit BOOLEAN DEFAULT FALSE, -- User has visited before
    
    
    -- Engagement Metrics
    interactions_count INTEGER DEFAULT 0, -- Number of clicks/interactions on the page
    form_submissions INTEGER DEFAULT 0, -- Forms submitted on this page

    -- Timestamps
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX idx_content_views_user_id ON content_views(user_id);
CREATE INDEX idx_content_views_session_id ON content_views(session_id);
CREATE INDEX idx_content_views_content_type ON content_views(content_type);
CREATE INDEX idx_content_views_content_id ON content_views(content_id);
CREATE INDEX idx_content_views_viewed_at ON content_views(viewed_at);
CREATE INDEX idx_content_views_referrer_type ON content_views(referrer_type);

-- Composite indexes for common queries
CREATE INDEX idx_content_views_content_analytics ON content_views(content_type, content_id, viewed_at);
CREATE INDEX idx_content_views_user_analytics ON content_views(user_id, viewed_at);
CREATE INDEX idx_content_views_session_analytics ON content_views(session_id, viewed_at);

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_content_views_updated_at
    BEFORE UPDATE ON content_views
    FOR EACH ROW
    EXECUTE FUNCTION update_content_views_updated_at();


-- Sample queries for analytics (commented out - for reference)

/*
-- Most viewed content
SELECT 
    content_type,
    content_id,
    content_title,
    COUNT(*) as view_count,
    AVG(view_duration) as avg_duration,
    AVG(scroll_depth) as avg_scroll_depth
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY content_type, content_id, content_title
ORDER BY view_count DESC;

-- User engagement by content type
SELECT 
    content_type,
    COUNT(*) as total_views,
    COUNT(DISTINCT user_id) as unique_users,
    COUNT(DISTINCT session_id) as unique_sessions,
    AVG(view_duration) as avg_duration,
    AVG(scroll_depth) as avg_scroll_depth
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '7 days'
GROUP BY content_type
ORDER BY total_views DESC;

-- Engagement metrics analysis
SELECT 
    content_type,
    AVG(interactions_count) as avg_interactions,
    AVG(form_submissions) as avg_form_submissions,
    COUNT(*) as total_views
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY content_type
ORDER BY avg_interactions DESC;

-- Bounce rate analysis
SELECT 
    content_type,
    COUNT(*) as total_views,
    COUNT(CASE WHEN is_bounce = TRUE THEN 1 END) as bounce_count,
    ROUND(
        (COUNT(CASE WHEN is_bounce = TRUE THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as bounce_rate_percent
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY content_type
ORDER BY bounce_rate_percent DESC;

-- Referrer analysis
SELECT 
    referrer_type,
    COUNT(*) as view_count,
    COUNT(DISTINCT user_id) as unique_users,
    AVG(view_duration) as avg_duration
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY referrer_type
ORDER BY view_count DESC;

-- Return visitor analysis
SELECT 
    content_type,
    COUNT(*) as total_views,
    COUNT(CASE WHEN is_return_visit = TRUE THEN 1 END) as return_visits,
    ROUND(
        (COUNT(CASE WHEN is_return_visit = TRUE THEN 1 END) * 100.0 / COUNT(*)), 2
    ) as return_visitor_percent
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '30 days'
GROUP BY content_type
ORDER BY return_visitor_percent DESC;

-- Page section performance
SELECT 
    page_section,
    COUNT(*) as view_count,
    AVG(view_duration) as avg_duration,
    AVG(scroll_depth) as avg_scroll_depth
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '30 days'
    AND page_section IS NOT NULL
GROUP BY page_section
ORDER BY view_count DESC;

-- User engagement by session
SELECT 
    session_id,
    COUNT(*) as pages_viewed,
    SUM(interactions_count) as total_interactions,
    SUM(form_submissions) as total_form_submissions,
    AVG(view_duration) as avg_duration
FROM content_views 
WHERE viewed_at >= NOW() - INTERVAL '7 days'
    AND session_id IS NOT NULL
GROUP BY session_id
HAVING COUNT(*) > 1
ORDER BY pages_viewed DESC
LIMIT 100;
*/
