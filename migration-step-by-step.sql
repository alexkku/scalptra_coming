-- Step-by-Step Migration for Bot Protection
-- Run each section separately in Supabase SQL Editor

-- STEP 1: Add missing columns to waitlist table
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS country VARCHAR(2);
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS security_score INTEGER DEFAULT 100;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS verification_token UUID DEFAULT gen_random_uuid();
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS notes TEXT;

-- STEP 2: Create security_logs table
CREATE TABLE IF NOT EXISTS security_logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    event_type VARCHAR(50), -- 'bot_detected', 'rate_limit', 'honeypot', 'suspicious_email'
    details JSONB,
    blocked BOOLEAN DEFAULT TRUE
);

-- STEP 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_country ON waitlist(country);
CREATE INDEX IF NOT EXISTS idx_waitlist_security_score ON waitlist(security_score);
CREATE INDEX IF NOT EXISTS idx_waitlist_is_verified ON waitlist(is_verified);
CREATE INDEX IF NOT EXISTS idx_waitlist_ip_address ON waitlist(ip_address);

CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);

-- STEP 4: Enable RLS for security_logs
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- STEP 5: Create policies
CREATE POLICY "Service role can do everything on security_logs" ON security_logs
    FOR ALL USING (auth.role() = 'service_role');

-- STEP 6: Grant permissions
GRANT ALL ON security_logs TO service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- STEP 7: Create analytics functions
CREATE OR REPLACE FUNCTION get_waitlist_by_country()
RETURNS TABLE(country VARCHAR(2), count BIGINT) AS $$
BEGIN
    RETURN QUERY
    SELECT w.country, COUNT(*) as count
    FROM waitlist w
    WHERE w.country IS NOT NULL
    GROUP BY w.country
    ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_security_stats()
RETURNS TABLE(
    total_attempts BIGINT,
    blocked_attempts BIGINT,
    success_rate NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_attempts,
        COUNT(*) FILTER (WHERE blocked = TRUE) as blocked_attempts,
        ROUND(
            CASE 
                WHEN COUNT(*) = 0 THEN 0
                ELSE (COUNT(*) FILTER (WHERE blocked = FALSE)::NUMERIC / COUNT(*)::NUMERIC) * 100
            END, 
            2
        ) as success_rate
    FROM security_logs;
END;
$$ LANGUAGE plpgsql;

-- STEP 8: Create admin view
CREATE OR REPLACE VIEW waitlist_summary AS
SELECT 
    id,
    email,
    created_at,
    country,
    security_score,
    is_verified,
    CASE 
        WHEN security_score >= 80 THEN 'High'
        WHEN security_score >= 60 THEN 'Medium'
        ELSE 'Low'
    END as trust_level
FROM waitlist
ORDER BY created_at DESC;

-- STEP 9: Grant access to view
GRANT SELECT ON waitlist_summary TO service_role;

-- STEP 10: Verify the migration
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
ORDER BY ordinal_position;