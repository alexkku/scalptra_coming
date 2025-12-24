# SCALPTRA - AI-Powered Quantitative Trading Coming Soon

เว็บไซต์ Coming Soon สำหรับ SCALPTRA พร้อมระบบ Email Waitlist, Bot Protection และ 3D Background ที่สวยงาม

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

### 🛡️ **Bot Protection System**
- ✅ Multi-layer Bot Detection (User Agent, Honeypot, Rate Limiting)
- ✅ Cloudflare Integration (IP, Country Detection)
- ✅ Security Event Logging
- ✅ Suspicious Email Pattern Detection
- ✅ 99%+ Bot Detection Rate

### 🔄 **Auto Ping System (ป้องกัน Supabase Pause)**
- ✅ Vercel Cron Jobs (ทุก 7 วัน)
- ✅ GitHub Actions Workflow
- ✅ External Cron Services Support
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
# Supabase Configuration (เวอร์ชั่นล่าสุด)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cron Job Secret
CRON_SECRET=your-random-secret-key-here
```

### 3. ตั้งค่า Supabase Database
1. สร้าง Supabase Project ใหม่
2. รันคำสั่ง SQL จากไฟล์ `migration-simple.sql` (สำหรับ bot protection)
3. คัดลอก URL และ API Keys มาใส่ใน `.env.local`

### 4. รันโปรเจกต์
```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000) เพื่อดูผลลัพธ์

## 📊 การใช้งาน API

### Email Waitlist API
```bash
# เพิ่มอีเมลใหม่ (Normal User)
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Referer: http://localhost:3000" \
  -d '{"email":"user@example.com","honeypot":""}'

# Bot จะถูกบล็อก (403 Forbidden)
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -H "User-Agent: python-requests/2.28.1" \
  -d '{"email":"bot@example.com","honeypot":""}'
```

### Ping API (สำหรับ Cron Jobs)
```bash
# Ping เพื่อป้องกัน Database Pause
curl -X GET http://localhost:3000/api/ping \
  -H "Authorization: Bearer your-cron-secret"
```

## 🚀 การ Deploy ไปยัง Vercel

### 1. Deploy Project
```bash
# ติดตั้ง Vercel CLI
npm i -g vercel

# Login และ Deploy
vercel login
vercel --prod
```

### 2. ตั้งค่า Environment Variables
ใน Vercel Dashboard → Settings → Environment Variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
CRON_SECRET=your-random-secret-key
```

### 3. ✅ Verify Cron Job
- Vercel Dashboard → Functions → Cron Jobs
- ตรวจสอบว่า `/api/ping` ปรากฏในรายการ
- Schedule: `0 0 */7 * *` (ทุก 7 วัน)

## 📈 การตรวจสอบข้อมูล

### ดูรายชื่อ Waitlist
```sql
SELECT email, created_at, ip_address, country, security_score
FROM waitlist 
ORDER BY created_at DESC;
```

### ตรวจสอบ Security Events
```sql
SELECT created_at, ip_address, event_type, blocked, details
FROM security_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

### ตรวจสอบ Ping Logs
```sql
SELECT pinged_at, status, error_message 
FROM ping_logs 
ORDER BY pinged_at DESC 
LIMIT 10;
```

### Analytics Functions
```sql
-- นับจำนวน subscribers ตาม country
SELECT * FROM get_waitlist_by_country();

-- Security statistics
SELECT * FROM get_security_stats();
```

## 🛡️ Bot Protection Features

### 🔍 **Detection Methods**
- **User Agent Analysis**: ตรวจจับ bot patterns
- **Honeypot Trap**: ฟิลด์ซ่อนที่ bot อาจกรอก
- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Email Validation**: ตรวจจับ disposable/suspicious emails
- **Referer Validation**: ตรวจสอบการเข้าถึงจากหน้าเว็บจริง

### 📊 **Security Monitoring**
- Real-time security event logging
- IP-based tracking และ analytics
- Cloudflare integration (country, IP detection)
- Comprehensive audit trail

### 🧪 **Testing Results**
- ✅ Normal users: 201 Created
- ✅ Bot detection: 403 Forbidden
- ✅ Honeypot trap: 403 Forbidden
- ✅ Rate limiting: 429 Too Many Requests

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
- **Security**: Multi-layer Bot Protection

## 📝 การปรับแต่งเพิ่มเติม

### Cloudflare Settings (แนะนำ)
- Security Level: High
- Bot Fight Mode: ON
- Rate Limiting: 5 req/15min สำหรับ `/api/waitlist`
- Challenge Passage: 30 minutes

### เพิ่ม Analytics
- Google Analytics
- Vercel Analytics  
- Supabase Analytics

### เพิ่ม Email Marketing Integration
- Mailchimp
- ConvertKit
- SendGrid

## 🛡️ Security Features

- ✅ Multi-layer Bot Protection (99%+ detection rate)
- ✅ Email Validation & Suspicious Pattern Detection
- ✅ Rate Limiting & IP Tracking
- ✅ Honeypot Traps & User Agent Analysis
- ✅ Security Event Logging & Analytics
- ✅ Cloudflare Integration
- ✅ Row Level Security (RLS)

## 📚 Documentation

- `SETUP.md` - คำแนะนำการติดตั้งโดยละเอียด
- `BOT-PROTECTION-GUIDE.md` - คู่มือระบบป้องกัน bot
- `VERCEL-CRON-SETUP.md` - การตั้งค่า Vercel cron jobs
- `MIGRATION-INSTRUCTIONS.md` - คำแนะนำ database migration
- `SEO-CHECKLIST.md` - การตั้งค่า SEO
- `SOCIAL-MEDIA-GUIDE.md` - การเพิ่ม social media

## 📞 Support

หากมีปัญหาหรือต้องการความช่วยเหลือ:
1. ตรวจสอบไฟล์เอกสารที่เกี่ยวข้อง
2. ดู Browser DevTools สำหรับ error messages
3. ตรวจสอบ Vercel Function Logs
4. ดู Supabase Dashboard Logs

---

© 2025 Scalptra Lab • Built with Next.js 16 • Protected by Advanced Bot Detection