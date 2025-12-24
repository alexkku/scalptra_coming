# 🔧 Database Migration Instructions

## 🚨 **Error Fix: column "is_verified" does not exist**

### **📋 Step-by-Step Migration Process**

## **1. 🎯 Run Simple Migration First**

ใน Supabase SQL Editor ให้รันไฟล์ `migration-simple.sql`:

```sql
-- Simple Migration - Add Essential Columns Only
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
```

## **2. ✅ Verify Migration Success**

รันคำสั่งนี้เพื่อตรวจสอบ:

```sql
-- Check if columns were added successfully
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
AND column_name IN ('country', 'security_score')
ORDER BY column_name;

-- Check if security_logs table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'security_logs';
```

### **Expected Results:**
```
column_name     | data_type         | column_default
country         | character varying | NULL
security_score  | integer          | 100

table_name
security_logs
```

## **3. 🧪 Test Bot Protection**

หลังจาก migration สำเร็จ ให้ทดสอบ:

### **Normal User (Should Work):**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/waitlist" -Method POST -Body '{"email":"test@example.com","honeypot":""}' -ContentType "application/json" -Headers @{"User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"; "Referer" = "http://localhost:3000"} -UseBasicParsing
```
**Expected**: `201 Created`

### **Bot Detection (Should Block):**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/waitlist" -Method POST -Body '{"email":"bot@example.com","honeypot":""}' -ContentType "application/json" -Headers @{"User-Agent" = "python-requests/2.28.1"} -UseBasicParsing
```
**Expected**: `403 Forbidden`

## **4. 📊 Optional: Add Analytics Functions**

หากต้องการ analytics เพิ่มเติม ให้รัน:

```sql
-- Function for country statistics
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

-- Function for security statistics
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
```

## **5. 🔍 Monitor Security Events**

หลังจาก migration ให้ตรวจสอบ security logs:

```sql
-- View recent security events
SELECT 
    created_at,
    ip_address,
    event_type,
    blocked,
    details
FROM security_logs 
ORDER BY created_at DESC 
LIMIT 10;

-- Count events by type
SELECT 
    event_type,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE blocked = TRUE) as blocked_count
FROM security_logs 
GROUP BY event_type
ORDER BY count DESC;
```

## **6. 🚨 Troubleshooting**

### **If Migration Fails:**

1. **Check Current Schema:**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
ORDER BY ordinal_position;
```

2. **Drop and Recreate if Needed:**
```sql
-- Only if absolutely necessary
DROP TABLE IF EXISTS security_logs CASCADE;
-- Then re-run the migration
```

3. **Check Permissions:**
```sql
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'waitlist';
```

## **7. ✅ Success Indicators**

### **After Successful Migration:**
- ✅ `country` column exists in waitlist table
- ✅ `security_score` column exists in waitlist table  
- ✅ `security_logs` table exists
- ✅ Bot protection API returns 403 for bots
- ✅ Normal users can still sign up (201 Created)
- ✅ Security events are logged in security_logs table

### **API Response Changes:**
```json
// Before migration
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2025-12-24T16:06:09.703+00:00",
  "ip_address": "::1",
  "user_agent": "Mozilla/5.0...",
  "referrer": "http://localhost:3000"
}

// After migration
{
  "id": 1,
  "email": "user@example.com",
  "created_at": "2025-12-24T16:06:09.703+00:00",
  "ip_address": "::1",
  "user_agent": "Mozilla/5.0...",
  "referrer": "http://localhost:3000",
  "country": "TH",
  "security_score": 100
}
```

---

## 🎯 **Quick Fix Summary**

1. **Run**: `migration-simple.sql` in Supabase SQL Editor
2. **Verify**: Check columns exist with verification query
3. **Test**: Try bot protection endpoints
4. **Monitor**: Check security_logs for events

หลังจากทำตามขั้นตอนนี้ ระบบป้องกัน bot จะทำงานได้เต็มประสิทธิภาพ!