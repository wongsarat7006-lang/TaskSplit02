'use client'

import { createContext, useContext, useState } from 'react'
import { Task, TaskStatus } from '../types/task'

/* ================= TYPES ================= */

type TaskContextType = {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: number, updates: Partial<Task>) => void
  deleteTask: (id: number) => void
  moveTaskNext: (id: number) => void
}

/* ================= CONTEXT ================= */

const TaskContext = createContext<TaskContextType | null>(null)

/* ================= PROVIDER ================= */

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: 1, 
      title: 'Design home page', 
      description: 'ออกแบบหน้าแรกของเว็บไซต์',
      assignee: 'A',
      status: 'todo',
      dueDate: '2025-04-15',
      createdAt: new Date().toISOString()
    },
    { 
      id: 2, 
      title: 'Create task board layout', 
      description: 'สร้างบอร์ดจัดการงาน',
      assignee: 'B',
      status: 'doing',
      dueDate: '2025-04-20',
      createdAt: new Date().toISOString()
    },
    { 
      id: 3, 
      title: 'Prepare project presentation', 
      description: 'เตรียมนำเสนอโปรเจค',
      assignee: 'C',
      status: 'done',
      dueDate: '2025-04-10',
      createdAt: new Date().toISOString()
    },
  ])

  // เพิ่มงานใหม่
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    setTasks(prev => [
      ...prev,
      {
        ...task,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      },
    ])
  }

  // อัปเดตงาน
  const updateTask = (id: number, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    )
  }

  // ลบงาน
  const deleteTask = (id: number) => {
    setTasks(prev => prev.filter(task => task.id !== id))
  }

  // ย้ายงานไปสถานะถัดไป
  const moveTaskNext = (id: number) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task

        if (task.status === 'todo') return { ...task, status: 'doing' as TaskStatus }
        if (task.status === 'doing') return { ...task, status: 'done' as TaskStatus }

        return task
      })
    )
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, moveTaskNext }}>
      {children}
    </TaskContext.Provider>
  )
}

/* ================= HOOK ================= */

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within TaskProvider')
  }
  return context
}