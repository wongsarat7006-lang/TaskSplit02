'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type TaskContextType = {
  tasks: any[]
  addTask: (task: any) => void
  moveTaskNext: (id: any) => void
  deleteTask: (id: any) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  // 1. ตั้งค่าเริ่มต้นให้เป็นค่าว่างก่อน
  const [tasks, setTasks] = useState<any[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false) // เช็คว่าโหลดข้อมูลเสร็จหรือยัง

  // 2. [Effect] โหลดข้อมูลจาก Local Storage เมื่อเปิดหน้าเว็บครั้งแรก
  useEffect(() => {
    const savedTasks = localStorage.getItem('my_tasks')
    const savedTheme = localStorage.getItem('is_dark_mode')
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    if (savedTheme) {
      setIsDarkMode(JSON.parse(savedTheme))
    }
    setIsInitialized(true)
  }, [])

  // 3. [Effect] บันทึกข้อมูลลง Local Storage ทุกครั้งที่ tasks หรือ isDarkMode เปลี่ยนแปลง
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('my_tasks', JSON.stringify(tasks))
      localStorage.setItem('is_dark_mode', JSON.stringify(isDarkMode))
    }
  }, [tasks, isDarkMode, isInitialized])

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  const addTask = (task: any) => {
    setTasks([...tasks, { ...task, id: Date.now(), status: 'todo' }])
  }

  const moveTaskNext = (id: any) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        if (t.status === 'todo') return { ...t, status: 'doing' }
        if (t.status === 'doing') return { ...t, status: 'done' }
      }
      return t
    }))
  }

  const deleteTask = (id: any) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  return (
    <TaskContext.Provider value={{ 
      tasks, addTask, moveTaskNext, deleteTask, 
      isDarkMode, toggleDarkMode 
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) throw new Error('useTasks must be used within a TaskProvider')
  return context
}