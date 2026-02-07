'use client'

import { createContext, useContext, useState } from 'react'

/* ================= TYPES ================= */

export type TaskStatus = 'todo' | 'doing' | 'done'

export type Task = {
  id: number
  title: string
  status: TaskStatus
}

type TaskContextType = {
  tasks: Task[]
  addTask: (title: string) => void
  moveTaskNext: (id: number) => void
}

/* ================= CONTEXT ================= */

const TaskContext = createContext<TaskContextType | null>(null)

/* ================= PROVIDER ================= */

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Design home page', status: 'todo' },
    { id: 2, title: 'Create task board layout', status: 'doing' },
    { id: 3, title: 'Prepare project presentation', status: 'done' },
  ])

  const addTask = (title: string) => {
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        title,
        status: 'todo',
      },
    ])
  }

  const moveTaskNext = (id: number) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id !== id) return task

        if (task.status === 'todo') return { ...task, status: 'doing' }
        if (task.status === 'doing') return { ...task, status: 'done' }

        return task
      })
    )
  }

  return (
    <TaskContext.Provider value={{ tasks, addTask, moveTaskNext }}>
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
