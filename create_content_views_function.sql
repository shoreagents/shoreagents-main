-- Create the missing update function for content_views table
-- This function is referenced by the trigger but doesn't exist yet

CREATE OR REPLACE FUNCTION update_content_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
