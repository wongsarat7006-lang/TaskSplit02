export type TaskStatus = 'todo' | 'doing' | 'done'

/** Task ที่ดึงจาก DB */
export type Task = {
  id: number | string
  title: string
  description: string | null
  assignee: string | null
  status: TaskStatus
  dueDate: string | null

  // ✅ เพิ่ม: email ของผู้ที่เป็นเจ้าของ task
  userEmail: string

  // (ถ้ายังใช้ userId อยู่ เก็บไว้ได้)
  userId: number | string

  createdAt: string
  updatedAt: string
}

/** Task ตอนสร้างใหม่ (ยังไม่เข้าฐานข้อมูล) */
export type CreateTask = {
  title: string
  description?: string
  assignee?: string
  status?: TaskStatus
  dueDate?: string

  // ✅ เพิ่ม: ผูก task กับผู้ล็อกอิน
  userEmail: string
}