-- Create users table that references user_page_visits
-- This table will store unique users and their aggregated data

CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL, -- References the device_id from user_page_visits
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  company VARCHAR(200),
  email VARCHAR(255),
  phone_number VARCHAR(20),
  country VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Create index on company for analytics
CREATE INDEX IF NOT EXISTS idx_users_company ON users(company);

-- Create index on country for analytics
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);

-- No foreign key constraints to allow multiple page visits per user
-- This allows tracking of individual page visits for each user
-- Users table is independent and can be populated when users sign up


-- Create a view for user analytics
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
  u.user_id,
  u.first_name,
  u.last_name,
  u.company,
  u.email,
  u.phone_number,
  u.country,
  u.created_at,
  COUNT(upv.id) as unique_pages_visited,
  SUM(upv.visit_count) as total_page_views,
  SUM(upv.time_spent_seconds) as total_time_spent_seconds,
  MIN(upv.visit_timestamp) as first_visit_timestamp,
  MAX(upv.last_visit_timestamp) as last_visit_timestamp
FROM users u
LEFT JOIN user_page_visits upv ON u.user_id = upv.user_id
GROUP BY u.user_id, u.first_name, u.last_name, u.company, u.email, u.phone_number, u.country, u.created_at;

