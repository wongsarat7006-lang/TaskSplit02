'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  status: 'todo' | 'doing' | 'done'
}

interface TaskContextType {
  tasks: Task[]
  addTask: (title: string) => void
  moveTaskNext: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (updatedTask: Task) => void // ฟังก์ชันแก้ไขงาน
  isSidebarOpen: boolean
  toggleSidebar: () => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    const savedMode = localStorage.getItem('isDarkMode')
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedMode) setIsDarkMode(JSON.parse(savedMode))
  }, [])

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
  }, [tasks, isDarkMode])

  const addTask = (title: string) => {
    const newTask: Task = { id: Date.now().toString(), title, status: 'todo' }
    setTasks([...tasks, newTask])
  }

  // ระบบค้นหาและอัปเดตงานตัวที่แก้ไข
  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
  }

  const moveTaskNext = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        if (task.status === 'todo') return { ...task, status: 'doing' }
        if (task.status === 'doing') return { ...task, status: 'done' }
      }
      return task
    }))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <TaskContext.Provider value={{ 
      tasks, addTask, moveTaskNext, deleteTask, updateTask,
      isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode 
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used within TaskProvider')
  return context
}