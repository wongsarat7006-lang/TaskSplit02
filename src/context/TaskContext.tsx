'use client'
import { createContext, useContext, useState } from 'react'

export type TaskStatus = 'todo' | 'doing' | 'done'

export interface Task {
  id: number
  title: string
  status: TaskStatus
}

interface TaskContextType {
  tasks: Task[]
  moveTaskNext: (id: number) => void
}

const TaskContext = createContext<TaskContextType | null>(null)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Design UI', status: 'todo' },
    { id: 2, title: 'Setup Database', status: 'doing' },
    { id: 3, title: 'Deploy App', status: 'done' },
  ])

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
    <TaskContext.Provider value={{ tasks, moveTaskNext }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used inside TaskProvider')
  }
  return context
}
