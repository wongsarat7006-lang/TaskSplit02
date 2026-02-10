// src/types/task.ts
export type TaskStatus = 'todo' | 'doing' | 'done'

export type Task = {
  id: number | string
  title: string
  description?: string
  assignee?: string
  status: TaskStatus
  dueDate?: string
  userId?: number | string  
  createdAt?: string
  updatedAt?: string
}