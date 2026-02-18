'use client'
import React, { createContext, useContext, useState, useEffect } from 'react'

// 1. กำหนดโครงสร้างข้อมูล Task ให้รองรับทุกหน้า
export interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  dueDate?: string
  status: 'todo' | 'doing' | 'done'
  priority: 'high' | 'medium' | 'low'
}

interface TaskContextType {
  tasks: Task[]
  addTask: (taskData: Omit<Task, 'id' | 'status'>) => void
  moveTaskNext: (id: string) => void
  deleteTask: (id: string) => void
  updateTask: (updatedTask: Task) => void
  // เพิ่ม Logic สำหรับการลากวาง
  reorderTasks: (destination: any, source: any, draggableId: string) => void
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

  // โหลดข้อมูลจาก LocalStorage เมื่อเปิดแอป
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks')
    const savedMode = localStorage.getItem('isDarkMode')
    if (savedTasks) setTasks(JSON.parse(savedTasks))
    if (savedMode) setIsDarkMode(JSON.parse(savedMode))
  }, [])

  // บันทึกข้อมูลเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode))
  }, [tasks, isDarkMode])

  // ฟังก์ชันเพิ่มงานใหม่ (รับเป็น Object)
  const addTask = (taskData: Omit<Task, 'id' | 'status'>) => {
    const newTask: Task = { 
      id: Date.now().toString(), 
      status: 'todo',
      ...taskData 
    }
    setTasks(prev => [...prev, newTask])
  }

  // ฟังก์ชันสำหรับการลากและวาง (Drag & Drop Logic)
  const reorderTasks = (destination: any, source: any, draggableId: string) => {
    if (!destination) return

    setTasks(prevTasks => {
      const newTasks = Array.from(prevTasks)
      // หา Task ที่กำลังถูกลาก
      const taskIndex = newTasks.findIndex(t => t.id === draggableId)
      if (taskIndex === -1) return prevTasks

      const [removed] = newTasks.splice(taskIndex, 1)
      
      // อัปเดตสถานะใหม่ตาม DroppableId (todo, doing, done)
      removed.status = destination.droppableId as 'todo' | 'doing' | 'done'

      // แยกงานในคอลัมน์เป้าหมายออกมาจัดลำดับใหม่
      const otherTasks = newTasks.filter(t => t.status !== destination.droppableId)
      const targetColTasks = newTasks.filter(t => t.status === destination.droppableId)
      
      targetColTasks.splice(destination.index, 0, removed)

      return [...otherTasks, ...targetColTasks]
    })
  }

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
      tasks, addTask, moveTaskNext, deleteTask, updateTask, reorderTasks,
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