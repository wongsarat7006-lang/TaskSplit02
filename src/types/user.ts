export type User = {
  id: string                // ✅ ใช้ string อย่างเดียว (Supabase เป็น UUID)
  name: string
  email: string
  phone?: string
  bio?: string
  avatar?: string | null   // ✅ รองรับ null
  createdAt?: string
  updatedAt?: string
}