# Coffee Order App

เว็บสั่งซื้อกาแฟออนไลน์ด้วย Next.js + Supabase

## วิธีเริ่มต้น

1. สร้างไฟล์ `.env.local` จาก `.env.local.example` และใส่ค่า Supabase ของคุณ
2. ติดตั้ง dependencies
   ```bash
   npm install
   ```
3. รันเซิร์ฟเวอร์
   ```bash
   npm run dev
   ```

## Deploy บน Vercel
- Push โค้ดขึ้น GitHub
- สร้าง Project ใหม่ใน Vercel และตั้งค่า Environment Variables ตาม `.env.local`
- Deploy ได้ทันที

## SQL สำหรับสร้าง Table ใน Supabase
```sql
create table orders (
  id uuid default uuid_generate_v4() primary key,
  menu text not null,
  size text not null,
  options jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
``` 