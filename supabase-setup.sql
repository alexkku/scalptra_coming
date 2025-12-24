-- SCALPTRA Waitlist Database Schema with Bot Protection
-- สำหรับ Supabase PostgreSQL

-- สร้างตาราง waitlist พร้อมข้อมูลความปลอดภัย
CREATE TABLE IF NOT EXISTS waitlist (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    country VARCHAR(2), -- ISO country code from Cloudflare
    security_score INTEGER DEFAULT 100, -- Security score (0-100)
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token UUID DEFAULT gen_random_uuid(),
    notes TEXT -- For admin notes
);

-- สร้าง index สำหรับ performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_ip_address ON waitlist(ip_address);
CREATE INDEX IF NOT EXISTS idx_waitlist_country ON waitlist(country);
CREATE INDEX IF NOT EXISTS idx_waitlist_security_score ON waitlist(security_score);

-- สร้างตาราง ping_logs สำหรับติดตาม uptime
CREATE TABLE IF NOT EXISTS ping_logs (
    id BIGSERIAL PRIMARY KEY,
    pinged_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(20) NOT NULL, -- 'success', 'failed'
    response_data JSONB,
    error_message TEXT,
    response_time_ms INTEGER
);

-- สร้าง index สำหรับ ping_logs
CREATE INDEX IF NOT EXISTS idx_ping_logs_pinged_at ON ping_logs(pinged_at DESC);
CREATE INDEX IF NOT EXISTS idx_ping_logs_status ON ping_logs(status);

-- สร้างตาราง security_logs สำหรับติดตาม bot attempts
CREATE TABLE IF NOT EXISTS security_logs (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    event_type VARCHAR(50), -- 'bot_detected', 'rate_limit', 'honeypot', 'suspicious_email'
    details JSONB,
    blocked BOOLEAN DEFAULT TRUE
);

-- สร้าง index สำหรับ security_logs
CREATE INDEX IF NOT EXISTS idx_security_logs_created_at ON security_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_logs_ip_address ON security_logs(ip_address);
CREATE INDEX IF NOT EXISTS idx_security_logs_event_type ON security_logs(event_type);

-- Function สำหรับนับจำนวน subscribers
CREATE OR REPLACE FUNCTION get_waitlist_count()
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM waitlist);
END;
$$ LANGUAGE plpgsql;

-- Function สำหรับนับจำนวน subscribers ตาม country
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

-- Function สำหรับ security statistics
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
            (COUNT(*) FILTER (WHERE blocked = FALSE)::NUMERIC / COUNT(*)::NUMERIC) * 100, 
            2
        ) as success_rate
    FROM security_logs;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE ping_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_logs ENABLE ROW LEVEL SECURITY;

-- Policy สำหรับ service role (full access)
CREATE POLICY "Service role can do everything on waitlist" ON waitlist
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on ping_logs" ON ping_logs
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can do everything on security_logs" ON security_logs
    FOR ALL USING (auth.role() = 'service_role');

-- Policy สำหรับ anon role (insert only for waitlist)
CREATE POLICY "Anonymous can insert waitlist" ON waitlist
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT ON waitlist TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- สร้าง view สำหรับ admin dashboard (ไม่แสดง sensitive data)
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

-- Grant access to view
GRANT SELECT ON waitlist_summary TO service_role;