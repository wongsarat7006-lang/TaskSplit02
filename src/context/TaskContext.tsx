'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface Task {
  id: string
  title: string
  description?: string 
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'doing' | 'done'
  assignee?: string
  dueDate?: string
}

interface TaskContextType {
  tasks: Task[]
  isDarkMode: boolean
  isSidebarOpen: boolean
  toggleDarkMode: () => void
  toggleSidebar: () => void
  addTask: (task: Omit<Task, 'id'>) => void
  updateTask: (task: Task) => void
  deleteTask: (id: string) => void
  reorderTasks: (destination: any, source: any, draggableId: string) => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasksplit_storage')
    const savedTheme = localStorage.getItem('tasksplit_theme')
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedTheme) setIsDarkMode(JSON.parse(savedTheme))
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('tasksplit_storage', JSON.stringify(tasks))
      localStorage.setItem('tasksplit_theme', JSON.stringify(isDarkMode))
    }
  }, [tasks, isDarkMode, isLoaded])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const addTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = { ...taskData, id: Math.random().toString(36).substring(2, 11) }
    setTasks([...tasks, newTask])
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t))
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const reorderTasks = (destination: any, source: any, draggableId: string) => {
    if (!destination) return
    const newTasks = Array.from(tasks)
    const taskIndex = newTasks.findIndex(t => t.id === draggableId)
    const [removed] = newTasks.splice(taskIndex, 1)
    removed.status = destination.droppableId
    const tasksInDest = newTasks.filter(t => t.status === destination.droppableId)
    const otherTasks = newTasks.filter(t => t.status !== destination.droppableId)
    tasksInDest.splice(destination.index, 0, removed)
    setTasks([...otherTasks, ...tasksInDest])
  }

  return (
    <TaskContext.Provider value={{ 
      tasks, isDarkMode, isSidebarOpen, toggleDarkMode, toggleSidebar,
      addTask, updateTask, deleteTask, reorderTasks 
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