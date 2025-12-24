# 🔧 Country Column Fix - SCALPTRA

## 🚨 **Error: value too long for type character varying(2)**

### **📋 สาเหตุของปัญหา:**
- Column `country` ถูกกำหนดเป็น `VARCHAR(2)` สำหรับ ISO country codes
- Cloudflare ส่ง `cf-ipcountry` เป็น `'unknown'` (7 ตัวอักษร) แทนที่จะเป็น country code
- เมื่อไม่มี Cloudflare หรือ local development จะได้ `'unknown'` ซึ่งยาวเกิน 2 ตัวอักษร

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

API ได้รับการอัพเดทเพื่อ:

```typescript
// Validate country code before inserting
const countryRaw = request.headers.get('cf-ipcountry') || 'XX'
const country = countryRaw && countryRaw.length === 2 && countryRaw !== 'XX' 
  ? countryRaw.toUpperCase() 
  : null
```

### **🎯 การทำงานใหม่:**
- ✅ รับเฉพาะ country codes ที่ยาว 2 ตัวอักษร
- ✅ แปลงเป็นตัวพิมพ์ใหญ่ (TH, US, JP, etc.)
- ✅ ใส่ `null` แทนค่าที่ไม่ถูกต้อง
- ✅ Debug logging เพื่อตรวจสอบค่าที่ได้รับ

## 🧪 **การทดสอบหลังแก้ไข**

### **Test 1: Normal Signup**
```bash
curl -X POST https://your-domain.vercel.app/api/waitlist \
  -H "Content-Type: application/json" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
  -d '{"email":"test@example.com","honeypot":""}'
```

**Expected**: `201 Created` (ไม่มี error)

### **Test 2: Check Database**
```sql
-- ดูข้อมูลล่าสุด
SELECT email, country, created_at 
FROM waitlist 
ORDER BY created_at DESC 
LIMIT 5;
```

**Expected**: country จะเป็น `null` หรือ country code 2 ตัวอักษร

## 🔍 **Debug Information**

### **Check Cloudflare Headers**
ใน Vercel Function Logs ดู:
```
Country header received: "unknown" (length: 7)
Country header received: "TH" (length: 2)
Country header received: "US" (length: 2)
```

### **Common Country Values:**
- ✅ `"TH"` - Thailand
- ✅ `"US"` - United States  
- ✅ `"JP"` - Japan
- ❌ `"unknown"` - ไม่ทราบ (จะถูกแปลงเป็น `null`)
- ❌ `"XX"` - Default value (จะถูกแปลงเป็น `null`)

## 📊 **Expected Database Schema**

หลังจากแก้ไข:

```sql
-- ตรวจสอบ schema
\d waitlist

-- Expected columns:
id              | bigint                      | not null default nextval('waitlist_id_seq'::regclass)
email           | character varying(255)      | not null
created_at      | timestamp with time zone    | default now()
ip_address      | inet                        |
user_agent      | text                        |
referrer        | text                        |
country         | character varying(2)        | -- หรือ VARCHAR(10) ถ้าขยายแล้ว
security_score  | integer                     | default 100
```

## 🚨 **Troubleshooting**

### **ถ้ายังมี Error:**

1. **ตรวจสอบ Migration:**
```sql
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
AND column_name = 'country';
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
- ✅ Debug logs แสดงค่า country ที่ถูกต้อง

---

## 🎯 **Quick Fix Summary**

1. **Run SQL**: `UPDATE waitlist SET country = NULL WHERE LENGTH(country) > 2;`
2. **Deploy Code**: Code ได้รับการแก้ไขแล้ว
3. **Test**: ทดสอบ email signup
4. **Verify**: ตรวจสอบ database ไม่มีข้อมูลผิด

หลังจากทำตามขั้นตอนนี้ ระบบจะทำงานได้ปกติ!