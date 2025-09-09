
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 3: Create the main table
CREATE TABLE user_page_visits (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    ip_address TEXT,
    visit_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- New columns for tracking visits and time
    visit_count INTEGER DEFAULT 1,
    time_spent_seconds INTEGER DEFAULT 0,
    last_visit_timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint to prevent duplicates for same user+page
ALTER TABLE user_page_visits 
ADD CONSTRAINT unique_user_page_visit 
UNIQUE (user_id, page_path);

