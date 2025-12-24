# ⏰ Vercel Cron Setup Guide - SCALPTRA

## 🎯 **การตั้งค่า Cron Jobs สำหรับ Supabase Ping**

### **📋 Current Configuration**

ไฟล์ `vercel.json` ได้ตั้งค่าไว้แล้ว:

```json
{
  "crons": [
    {
      "path": "/api/ping",
      "schedule": "0 0 */7 * *"
    }
  ],
  "functions": {
    "app/api/waitlist/route.ts": {
      "maxDuration": 15
    },
    "app/api/ping/route.ts": {
      "maxDuration": 15
    }
  }
}
```

### **⏰ Schedule Explanation**
- `"0 0 */7 * *"` = ทุก 7 วัน เวลา 00:00 UTC
- Format: `minute hour day-of-month month day-of-week`

## 🚀 **Deployment Steps**

### **1. 📤 Deploy to Vercel**

#### **Option A: Vercel CLI (Recommended)**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### **Option B: GitHub Integration**
1. Connect repository to Vercel
2. Push to master branch
3. Auto-deployment will trigger

### **2. 🔧 Environment Variables Setup**

ใน Vercel Dashboard → Settings → Environment Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Cron Job Security
CRON_SECRET=your-random-secret-key-here
```

### **3. ✅ Verify Cron Job Setup**

#### **Check Vercel Dashboard:**
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Functions" tab
4. Look for "Cron Jobs" section
5. Verify `/api/ping` is listed with schedule

#### **Manual Test:**
```bash
# Test ping endpoint manually
curl -X GET "https://your-domain.vercel.app/api/ping" \
  -H "Authorization: Bearer your-cron-secret"
```

## 📊 **Monitoring Cron Jobs**

### **🔍 Check Execution Logs**

#### **Vercel Dashboard:**
1. Functions → View Function Details
2. Check "Invocations" for cron executions
3. Look for successful 200 responses

#### **Supabase Dashboard:**
```sql
-- Check recent ping logs
SELECT * FROM ping_logs 
ORDER BY pinged_at DESC 
LIMIT 10;

-- Check ping success rate
SELECT 
  status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM ping_logs 
GROUP BY status;
```

### **🚨 Alert Setup (Optional)**

#### **Vercel Monitoring:**
```json
// In vercel.json - add monitoring
{
  "functions": {
    "app/api/ping/route.ts": {
      "maxDuration": 15,
      "memory": 128
    }
  }
}
```

## ⚙️ **Advanced Cron Configurations**

### **🔄 Multiple Schedules**

```json
{
  "crons": [
    {
      "path": "/api/ping",
      "schedule": "0 0 */7 * *"
    },
    {
      "path": "/api/health-check",
      "schedule": "0 */6 * * *"
    }
  ]
}
```

### **📅 Common Schedule Patterns**

```bash
# Every 7 days at midnight UTC
"0 0 */7 * *"

# Every day at 2 AM UTC
"0 2 * * *"

# Every 6 hours
"0 */6 * * *"

# Every Monday at 9 AM UTC
"0 9 * * 1"

# First day of every month
"0 0 1 * *"
```

### **🛡️ Security Headers**

```json
{
  "headers": [
    {
      "source": "/api/ping",
      "headers": [
        {
          "key": "X-Robots-Tag",
          "value": "noindex"
        },
        {
          "key": "Cache-Control",
          "value": "no-cache, no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

## 🧪 **Testing Cron Jobs**

### **🔧 Local Testing**

```bash
# Start development server
npm run dev

# Test ping endpoint locally
curl -X GET "http://localhost:3000/api/ping" \
  -H "Authorization: Bearer your-cron-secret"
```

### **🌐 Production Testing**

```bash
# Test production endpoint
curl -X GET "https://your-domain.vercel.app/api/ping" \
  -H "Authorization: Bearer your-cron-secret"

# Expected response
{
  "message": "Ping successful",
  "timestamp": "2025-12-24T16:30:00.000Z",
  "data": null
}
```

## 🚨 **Troubleshooting**

### **❌ Common Issues**

#### **1. Cron Job Not Running**
- ✅ Check vercel.json syntax
- ✅ Verify deployment was successful
- ✅ Check Vercel Dashboard for cron jobs
- ✅ Ensure project is on Pro plan (if needed)

#### **2. 401 Unauthorized**
- ✅ Check CRON_SECRET environment variable
- ✅ Verify Authorization header format
- ✅ Ensure secret matches in both places

#### **3. 500 Internal Server Error**
- ✅ Check Supabase connection
- ✅ Verify environment variables
- ✅ Check function logs in Vercel Dashboard

### **🔍 Debug Commands**

```sql
-- Check if ping_logs table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'ping_logs';

-- Check recent errors
SELECT * FROM ping_logs 
WHERE status = 'failed' 
ORDER BY pinged_at DESC 
LIMIT 5;

-- Check database connection
SELECT NOW() as current_time;
```

## 📈 **Performance Optimization**

### **⚡ Function Configuration**

```json
{
  "functions": {
    "app/api/ping/route.ts": {
      "maxDuration": 15,
      "memory": 128,
      "regions": ["iad1"]
    }
  }
}
```

### **🎯 Best Practices**

1. **Keep Functions Lightweight**: Ping should complete in <5 seconds
2. **Use Appropriate Memory**: 128MB is sufficient for ping
3. **Set Reasonable Timeout**: 15 seconds max duration
4. **Monitor Execution**: Check logs regularly
5. **Handle Errors Gracefully**: Log failures for debugging

## ✅ **Success Checklist**

### **🎯 Deployment Verification**
- [ ] `vercel.json` contains cron configuration
- [ ] Environment variables set in Vercel Dashboard
- [ ] Project deployed successfully
- [ ] Cron job appears in Vercel Dashboard
- [ ] Manual ping test returns 200 OK

### **📊 Monitoring Setup**
- [ ] ping_logs table exists in Supabase
- [ ] Successful ping entries appear in logs
- [ ] Error handling works correctly
- [ ] Security logging functions properly

### **🔒 Security Verification**
- [ ] CRON_SECRET is secure and random
- [ ] API endpoints return 401 without proper auth
- [ ] No sensitive data in logs
- [ ] Rate limiting works correctly

---

## 🎉 **Final Result**

หลังจากตั้งค่าเสร็จสิ้น:

- ✅ **Supabase Database**: จะไม่ pause เพราะมี ping ทุก 7 วัน
- ✅ **Automatic Monitoring**: ระบบจะ ping ตัวเองอัตโนมัติ
- ✅ **Error Tracking**: บันทึกข้อผิดพลาดใน ping_logs
- ✅ **Zero Maintenance**: ไม่ต้องดูแลเพิ่มเติม

Vercel Cron จะทำงานอัตโนมัติและรักษา Supabase database ให้อยู่ในสถานะ active ตลอดเวลา!