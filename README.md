# SCALPTRA - AI-Powered Quantitative Trading Coming Soon

เว็บไซต์ Coming Soon สำหรับ SCALPTRA พร้อมระบบ Email Waitlist และ 3D Background ที่สวยงาม

## ✨ Features

### 🎨 **UI/UX ที่สวยงาม**
- 3D Particle Background พร้อม Floating Geometric Shapes
- Gradient Text และ Glow Effects
- Smooth Animations ด้วย Framer Motion
- Responsive Design สำหรับทุกอุปกรณ์
- Interactive Email Form พร้อม Loading States

### 📧 **Email Waitlist System**
- ✅ เชื่อมต่อกับ Supabase Database
- ✅ Email Validation และ Duplicate Prevention
- ✅ Real-time Feedback Messages
- ✅ IP Address Logging สำหรับ Analytics
- ✅ Demo Mode (ทำงานได้แม้ยังไม่ตั้งค่า Supabase)

### 🔄 **Auto Ping System (ป้องกัน Supabase Pause)**
- ✅ Cron Job ทุก 7 วัน
- ✅ รองรับ Vercel Cron Jobs
- ✅ GitHub Actions Workflow
- ✅ External Cron Services
- ✅ Ping Logging และ Error Tracking

### 🚀 **Next.js 16 Compatible**
- ✅ ใช้ Turbopack (5-10x เร็วกว่า)
- ✅ React 19.2 Support
- ✅ TypeScript Strict Mode
- ✅ API Routes พร้อม Error Handling

## 🛠️ การติดตั้งและใช้งาน

### 1. Clone และติดตั้ง Dependencies
```bash
git clone <repository-url>
cd scalptra_coming
npm install
```

### 2. ตั้งค่า Environment Variables
สร้างไฟล์ `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cron Job Secret
CRON_SECRET=your-random-secret-key-here
```

### 3. ตั้งค่า Supabase Database
1. สร้าง Supabase Project ใหม่
2. รันคำสั่ง SQL จากไฟล์ `supabase-setup.sql`
3. คัดลอก URL และ API Keys มาใส่ใน `.env.local`

### 4. รันโปรเจกต์
```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์

## 📊 การใช้งาน API

### Email Waitlist API
```bash
# เพิ่มอีเมลใหม่
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

### Ping API (สำหรับ Cron Jobs)
```bash
# Ping เพื่อป้องกัน Database Pause
curl -X GET http://localhost:3000/api/ping \
  -H "Authorization: Bearer your-cron-secret"
```

## 🔄 การตั้งค่า Auto Ping (ป้องกัน Supabase Pause)

### วิธีที่ 1: Vercel Cron Jobs (แนะนำ)
ไฟล์ `vercel.json` ถูกตั้งค่าไว้แล้ว - จะทำงานอัตโนมัติเมื่อ deploy ไป Vercel

### วิธีที่ 2: GitHub Actions
สร้างไฟล์ `.github/workflows/ping-supabase.yml`:
```yaml
name: Ping Supabase
on:
  schedule:
    - cron: '0 0 */7 * *'  # ทุก 7 วัน
jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Supabase
        run: |
          curl -X GET "${{ secrets.SITE_URL }}/api/ping" \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}"
```

### วิธีที่ 3: External Cron Service
ใช้ [cron-job.org](https://cron-job.org) หรือ [EasyCron](https://www.easycron.com):
- URL: `https://your-domain.com/api/ping`
- Schedule: `0 0 */7 * *` (ทุก 7 วัน)
- Header: `Authorization: Bearer your-cron-secret`

## 📈 การตรวจสอบข้อมูล

### ดูรายชื่อ Waitlist
```sql
SELECT email, created_at, ip_address 
FROM waitlist 
ORDER BY created_at DESC;
```

### ตรวจสอบ Ping Logs
```sql
SELECT pinged_at, status, error_message 
FROM ping_logs 
ORDER BY pinged_at DESC 
LIMIT 10;
```

### นับจำนวน Subscribers
```sql
SELECT COUNT(*) as total_subscribers FROM waitlist;
```

## 🚀 การ Deploy

### Deploy ไปยัง Vercel
```bash
npm run build
vercel --prod
```

### ตั้งค่า Environment Variables ใน Vercel
1. ไปที่ Vercel Dashboard
2. เลือกโปรเจกต์
3. ไปที่ Settings > Environment Variables
4. เพิ่มตัวแปรทั้งหมดจาก `.env.local`

## 🔧 Tech Stack

- **Framework**: Next.js 16.1.1 (Turbopack)
- **React**: 19.2.3
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.x
- **3D Graphics**: Three.js + React Three Fiber
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📝 การปรับแต่งเพิ่มเติม

### เปลี่ยนสีธีม
แก้ไขไฟล์ `components/Background3D.tsx` และ `components/ComingSoonUI.tsx`

### เพิ่ม Analytics
- Google Analytics
- Vercel Analytics  
- Supabase Analytics

### เพิ่ม Email Marketing Integration
- Mailchimp
- ConvertKit
- SendGrid

## 🛡️ Security Features

- ✅ Email Validation
- ✅ Duplicate Prevention
- ✅ Rate Limiting
- ✅ IP Address Logging
- ✅ Secure API Endpoints
- ✅ Environment Variables Protection
- ✅ Row Level Security (RLS)

## 📞 Support

หากมีปัญหาหรือต้องการความช่วยเหลือ:
1. ตรวจสอบไฟล์ `SETUP.md` สำหรับคำแนะนำโดยละเอียด
2. ดู Browser DevTools สำหรับ error messages
3. ตรวจสอบ Vercel Function Logs
4. ดู Supabase Dashboard Logs

---

© 2025 Scalptra Lab • Built with Next.js 16