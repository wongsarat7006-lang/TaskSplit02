export type TaskStatus = 'todo' | 'doing' | 'done'

/** Task ที่ดึงจาก DB */
export type Task = {
  id: string
  title: string
  description: string | null
  assignee: string | null
  status: TaskStatus
  due_date: string | null

  author_email: string   // ✅ ตรงกับ DB
  user_id: string        // ✅ ตรงกับ DB

  created_at: string     // ✅ snake_case
  updated_at: string     // ✅ snake_case
}

/** Task ตอนสร้างใหม่ (ยังไม่เข้าฐานข้อมูล) */
export type CreateTask = {
  title: string
  description?: string
  assignee?: string
  status?: TaskStatus
  due_date?: string

  author_email: string   // ✅ ตรงกับ DB
}