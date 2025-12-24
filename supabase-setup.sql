-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT
);

-- Create ping_logs table for tracking database activity
CREATE TABLE IF NOT EXISTS ping_logs (
  id BIGSERIAL PRIMARY KEY,
  pinged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status VARCHAR(20) NOT NULL DEFAULT 'success',
  response_data JSONB,
  error_message TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);
CREATE INDEX IF NOT EXISTS idx_ping_logs_pinged_at ON ping_logs(pinged_at);

-- Enable Row Level Security (RLS)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE ping_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for waitlist table
CREATE POLICY "Allow public to insert emails" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow service role to read all" ON waitlist
  FOR SELECT USING (auth.role() = 'service_role');

-- Create policies for ping_logs table
CREATE POLICY "Allow service role full access to ping_logs" ON ping_logs
  FOR ALL USING (auth.role() = 'service_role');

-- Create a function to get waitlist count (useful for analytics)
CREATE OR REPLACE FUNCTION get_waitlist_count()
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM waitlist);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_waitlist_count() TO authenticated;
GRANT EXECUTE ON FUNCTION get_waitlist_count() TO service_role;