# 🔧 Country Column Fix - SCALPTRA (Vercel Environment)

## 🚨 **Error: value too long for type character varying(2)**

### **📋 สาเหตุของปัญหา:**
- Column `country` ถูกกำหนดเป็น `VARCHAR(2)` สำหรับ ISO country codes
- เมื่อไม่มี country detection หรือ local development จะได้ `'unknown'` ซึ่งยาวเกิน 2 ตัวอักษร
- Vercel ให้ country data ผ่าน `x-vercel-ip-country` header และ `request.geo.country`

## 🔧 **วิธีแก้ไข (เลือก 1 วิธี):**

### **วิธีที่ 1: ทำความสะอาดข้อมูล (แนะนำ)**

รันใน Supabase SQL Editor:

```sql
-- ลบข้อมูล country ที่ไม่ถูกต้อง
UPDATE waitlist 
SET country = NULL 
WHERE country IS NOT NULL 
AND (LENGTH(country) > 2 OR country = 'unknown');

-- ตรวจสอบผลลัพธ์
SELECT country, COUNT(*) as count
FROM waitlist 
GROUP BY country 
ORDER BY count DESC;
```

### **วิธีที่ 2: ขยาย Column Size**

รันใน Supabase SQL Editor:

```sql
-- ขยาย column เป็น VARCHAR(10)
ALTER TABLE waitlist ALTER COLUMN country TYPE VARCHAR(10);

-- ตรวจสอบ schema ใหม่
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
AND column_name = 'country';
```

## ✅ **การแก้ไขใน Code (ทำแล้ว)**

API ได้รับการอัพเดทสำหรับ Vercel environment:

```typescript
// Vercel IP and Country Detection
const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
                 request.headers.get('x-real-ip') || 
                 request.ip ||
                 'unknown'

const countryRaw = request.headers.get('x-vercel-ip-country') || 
                   request.geo?.country || 
                   'XX'

// Validate country code before inserting
const country = countryRaw && countryRaw.length === 2 && countryRaw !== 'XX' 
  ? countryRaw.toUpperCase() 
  : null
```

### **🎯 การทำงานใหม่ (Vercel Environment):**
- ✅ ใช้ `x-vercel-ip-country` header สำหรับ country detection
- ✅ ใช้ `request.geo.country` เป็น fallback
- ✅ ใช้ `x-forwarded-for` สำหรับ real IP detection
- ✅ รับเฉพาะ country codes ที่ยาว 2 ตัวอักษร
- ✅ แปลงเป็นตัวพิมพ์ใหญ่ (TH, US, JP, etc.)
- ✅ ใส่ `null` แทนค่าที่ไม่ถูกต้อง

## 🧪 **การทดสอบหลังแก้ไข**

### **Test 1: Normal Signup**
```bash
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -H "Referer: https://your-domain.vercel.app" \
  -d '{"email":"test@example.com","honeypot":""}'
```

**Expected**: `201 Created` (ไม่มี error)

### **Test 2: Check Database**
```sql
-- ดูข้อมูลล่าสุด
SELECT email, country, ip_address, created_at 
FROM waitlist 
ORDER BY created_at DESC 
LIMIT 5;
```

**Expected**: country จะเป็น `null` หรือ country code 2 ตัวอักษร

## 🔍 **Debug Information (Vercel)**

### **Check Vercel Headers**
ใน Vercel Function Logs ดู:
```
Country detection - Header: "TH", Geo: "TH", Final: "TH"
Country detection - Header: null, Geo: "US", Final: "US"
Country detection - Header: null, Geo: null, Final: "XX"
```

### **Vercel Geo Data:**
- ✅ `"TH"` - Thailand
- ✅ `"US"` - United States  
- ✅ `"JP"` - Japan
- ❌ `null` - ไม่ทราบ (จะถูกแปลงเป็น `null`)
- ❌ `"XX"` - Default value (จะถูกแปลงเป็น `null`)

## 📊 **Vercel vs Cloudflare Headers**

### **Vercel (ปัจจุบัน):**
```typescript
// IP Detection
request.headers.get('x-forwarded-for')
request.headers.get('x-real-ip')
request.ip

// Country Detection
request.headers.get('x-vercel-ip-country')
request.geo?.country
```

### **Cloudflare (เก่า - ไม่ใช้แล้ว):**
```typescript
// IP Detection
request.headers.get('cf-connecting-ip')

// Country Detection  
request.headers.get('cf-ipcountry')
```

## 🚨 **Troubleshooting**

### **ถ้ายังมี Error:**

1. **ตรวจสอบ Vercel Headers:**
```javascript
// ใน API route เพิ่ม debug
console.log('All headers:', Object.fromEntries(request.headers.entries()))
console.log('Geo data:', request.geo)
console.log('IP:', request.ip)
```

2. **ตรวจสอบข้อมูลเก่า:**
```sql
SELECT country, LENGTH(country) as length, COUNT(*) as count
FROM waitlist 
WHERE country IS NOT NULL
GROUP BY country, LENGTH(country)
ORDER BY length DESC;
```

3. **ลบข้อมูลที่ผิด:**
```sql
DELETE FROM waitlist 
WHERE LENGTH(country) > 2;
```

## ✅ **Success Indicators**

หลังจากแก้ไขสำเร็จ:
- ✅ Email signup ทำงานได้ปกติ (201 Created)
- ✅ ไม่มี "value too long" error
- ✅ Country data เป็น `null` หรือ 2-character codes
- ✅ Debug logs แสดงค่า country จาก Vercel headers
- ✅ IP detection ใช้ Vercel headers

---

## 🎯 **Quick Fix Summary (Vercel Environment)**

1. **Run SQL**: `UPDATE waitlist SET country = NULL WHERE LENGTH(country) > 2;`
2. **Deploy Code**: Code ได้รับการแก้ไขสำหรับ Vercel แล้ว
3. **Test**: ทดสอบ email signup บน Vercel domain
4. **Verify**: ตรวจสอบ database และ Vercel Function Logs

หลังจากทำตามขั้นตอนนี้ ระบบจะทำงานได้ปกติบน Vercel โดยไม่ต้องใช้ Cloudflare proxy!