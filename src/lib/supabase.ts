import { createClient } from '@supabase/supabase-js'

// ดึงค่าจากไฟล์ .env.local ที่คุณตั้งค่าไว้
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// สร้างตัวเชื่อมต่อ (Client) เพื่อส่งออกไปใช้งานในหน้าอื่นๆ
export const supabase = createClient(supabaseUrl, supabaseAnonKey)