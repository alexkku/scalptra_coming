-- Simple Migration - Add Essential Columns Only
-- Run this first in Supabase SQL Editor

-- Add essential columns to waitlist table
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS country VARCHAR(2);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS security_score INTEGER DEFAULT 100;

-- Create security_logs table for bot tracking
CREATE TABLE IF NOT EXISTS security_logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    event_type VARCHAR(50),
    details JSONB,
    blocked BOOLEAN DEFAULT TRUE
);

-- Enable RLS for security_logs
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for security_logs
CREATE POLICY "Service role can access security_logs" ON security_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Grant permissions
GRANT ALL ON security_logs TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
AND column_name IN ('country', 'security_score');