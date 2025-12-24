# Social Media Integration Guide

## 🎯 **ปัจจุบัน**

### ✅ **Facebook**
- URL: https://www.facebook.com/scalptra/
- Icon: Facebook (Lucide React)
- Color: Blue (#60a5fa)
- Status: ✅ Active

## 🚀 **การเพิ่ม Social Media ใหม่**

### 📝 **วิธีเพิ่ม Social Media Platform ใหม่**

1. **แก้ไขไฟล์ `components/SocialMediaLinks.tsx`**
2. **เพิ่มข้อมูลใน `socialLinks` array:**

```typescript
{
  name: "Twitter",
  url: "https://twitter.com/scalptra",
  icon: Twitter,
  color: "text-sky-400",
  hoverColor: "group-hover:text-sky-300",
  bgColor: "bg-sky-400"
},
```

3. **Import icon ที่ต้องการ:**
```typescript
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
```

4. **อัปเดต structured data ใน `app/layout.tsx`:**
```typescript
"sameAs": [
  "https://www.facebook.com/scalptra/",
  "https://twitter.com/scalptra",
  "https://instagram.com/scalptra"
],
```

## 🎨 **สีที่แนะนำสำหรับแต่ละ Platform**

### **Facebook**
- Color: `text-blue-400` (#60a5fa)
- Hover: `group-hover:text-blue-300`
- Background: `bg-blue-400`

### **Twitter/X**
- Color: `text-sky-400` (#38bdf8)
- Hover: `group-hover:text-sky-300`
- Background: `bg-sky-400`

### **Instagram**
- Color: `text-pink-400` (#f472b6)
- Hover: `group-hover:text-pink-300`
- Background: `bg-pink-400`

### **LinkedIn**
- Color: `text-blue-500` (#3b82f6)
- Hover: `group-hover:text-blue-400`
- Background: `bg-blue-500`

### **YouTube**
- Color: `text-red-400` (#f87171)
- Hover: `group-hover:text-red-300`
- Background: `bg-red-400`

### **TikTok**
- Color: `text-purple-400` (#c084fc)
- Hover: `group-hover:text-purple-300`
- Background: `bg-purple-400`

### **Discord**
- Color: `text-indigo-400` (#818cf8)
- Hover: `group-hover:text-indigo-300`
- Background: `bg-indigo-400`

### **Telegram**
- Color: `text-cyan-400` (#22d3ee)
- Hover: `group-hover:text-cyan-300`
- Background: `bg-cyan-400`

## 🔧 **Component Options**

### **SocialMediaLinks Props:**

```typescript
interface SocialMediaLinksProps {
  className?: string;        // เพิ่ม CSS classes
  showText?: boolean;        // แสดง/ซ่อนชื่อ platform
  layout?: 'horizontal' | 'vertical'; // จัดเรียงแนวนอนหรือแนวตั้ง
}
```

### **การใช้งาน:**

```tsx
// แบบพื้นฐาน
<SocialMediaLinks />

// แบบไม่แสดงข้อความ (แค่ icon)
<SocialMediaLinks showText={false} />

// แบบจัดเรียงแนวตั้ง
<SocialMediaLinks layout="vertical" />

// แบบกำหนด CSS เพิ่มเติม
<SocialMediaLinks className="mt-8" />
```

## 📱 **Responsive Design**

Component ได้รับการออกแบบให้ responsive:
- **Desktop**: แสดงทั้ง icon และข้อความ
- **Mobile**: ปรับขนาดให้เหมาะสม
- **Touch-friendly**: ขนาดที่เหมาะสำหรับการแตะ

## 🎭 **Animation Features**

- **Hover Effects**: Scale up และ glow effect
- **Stagger Animation**: แต่ละ icon จะ animate ทีละตัว
- **Smooth Transitions**: การเปลี่ยนสีและขนาดที่นุ่มนวล

## 🔍 **SEO Benefits**

- **Structured Data**: อัปเดตอัตโนมัติใน JSON-LD
- **Social Signals**: ช่วยเพิ่ม authority ของเว็บไซต์
- **Brand Consistency**: รักษาความสอดคล้องของแบรนด์

## 📊 **Analytics Tracking**

สามารถเพิ่ม tracking ได้:

```tsx
onClick={() => {
  // Google Analytics
  gtag('event', 'social_click', {
    social_network: social.name,
    social_action: 'click',
    social_target: social.url
  });
}}
```

## 🚀 **Future Enhancements**

### **ที่สามารถเพิ่มได้:**
1. **Follow Count Display** - แสดงจำนวนผู้ติดตาม
2. **Live Feed Integration** - แสดงโพสต์ล่าสุด
3. **Share Buttons** - ปุ่มแชร์เนื้อหา
4. **Social Login** - เข้าสู่ระบบผ่าน social media
5. **Custom Icons** - ใช้ icon ที่ออกแบบเอง

---

**💡 Tip**: อย่าลืมทดสอบลิงก์ทุกตัวก่อน deploy และอัปเดต sitemap.xml หากมีการเปลี่ยนแปลง!