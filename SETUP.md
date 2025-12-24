# SCALPTRA Coming Soon Setup Guide

## 🚀 การตั้งค่า Supabase

### 1. สร้าง Supabase Project
1. ไปที่ [supabase.com](https://supabase.com)
2. สร้างโปรเจกต์ใหม่
3. คัดลอก Project URL และ API Keys

### 2. ตั้งค่า Environment Variables
แก้ไขไฟล์ `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cron Job Secret (สร้าง random string)
CRON_SECRET=your-random-secret-key-here
```

### 3. สร้างตารางในฐานข้อมูล
1. เข้าไปที่ Supabase Dashboard
2. ไปที่ SQL Editor
3. รันคำสั่ง SQL จากไฟล์ `supabase-setup.sql`

## 🔄 การตั้งค่า Cron Job (Ping ทุก 7 วัน)

### วิธีที่ 1: ใช้ Vercel Cron Jobs (แนะนำ)
1. สร้างไฟล์ `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/ping",
      "schedule": "0 0 */7 * *"
    }
  ]
}
```

### วิธีที่ 2: ใช้ GitHub Actions
สร้างไฟล์ `.github/workflows/ping-supabase.yml`:

```yaml
name: Ping Supabase
on:
  schedule:
    - cron: '0 0 */7 * *'  # ทุก 7 วัน
  workflow_dispatch:  # สามารถรันด้วยตนเองได้

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -X GET "${{ secrets.SITE_URL }}/api/ping" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### วิธีที่ 3: ใช้ cron-job.org (ฟรี)
1. ไปที่ [cron-job.org](https://cron-job.org)
2. สร้างบัญชีใหม่
3. เพิ่ม Cron Job:
   - URL: `https://your-domain.com/api/ping`
   - Schedule: `0 0 */7 * *`
   - Headers: `Authorization: Bearer your-cron-secret`

## 🧪 การทดสอบ

### ทดสอบ Waitlist API
```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

### ทดสอบ Ping API
```bash
curl -X GET http://localhost:3000/api/ping \
  -H "Authorization: Bearer your-cron-secret"
```

## 📊 การตรวจสอบข้อมูล

### ดูรายชื่อ Waitlist
```sql
SELECT email, created_at FROM waitlist ORDER BY created_at DESC;
```

### ดู Ping Logs
```sql
SELECT * FROM ping_logs ORDER BY pinged_at DESC LIMIT 10;
```

### นับจำนวน Subscribers
```sql
SELECT get_waitlist_count();
```

## 🔒 Security Features

- ✅ Email validation
- ✅ Duplicate email prevention
- ✅ Rate limiting (built-in Next.js)
- ✅ IP address logging
- ✅ Secure API endpoints
- ✅ Row Level Security (RLS)

## 🚀 Deployment

1. Deploy ไปยัง Vercel:
```bash
npm run build
vercel --prod
```

2. ตั้งค่า Environment Variables ใน Vercel Dashboard

3. เปิดใช้งาน Cron Jobs (ถ้าใช้ Vercel)

## 📈 Analytics & Monitoring

คุณสามารถเพิ่ม analytics เพิ่มเติมได้:
- Google Analytics
- Vercel Analytics
- Supabase Analytics
- Custom dashboard สำหรับ waitlist metrics

## 🛠️ Troubleshooting

### ปัญหาที่พบบ่อย:
1. **Supabase connection error**: ตรวจสอบ URL และ API keys
2. **CORS error**: ตรวจสอบ domain settings ใน Supabase
3. **Cron job ไม่ทำงาน**: ตรวจสอบ Authorization header
4. **Database pause**: Ping job จะช่วยป้องกันปัญหานี้

### การ Debug:
- ดู Network tab ใน Browser DevTools
- ตรวจสอบ Vercel Function Logs
- ดู Supabase Logs ใน Dashboard