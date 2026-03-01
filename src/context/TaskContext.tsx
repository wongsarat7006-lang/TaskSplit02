'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

// --- Interfaces ---
export interface Task {
  id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'doing' | 'done'
  assignee?: string
  dueDate?: string
  category_id?: string
  categories?: { name: string; color: string }
  created_at?: string
  user_id?: string
  authorEmail?: string 
  max_assignees?: number 
  current_people?: number 
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface Profile {
  id: string
  full_name?: string
  email?: string
  avatar_url?: string
}

interface TaskContextType {
  tasks: Task[]
  categories: Category[]
  allUsers: Profile[]
  isDarkMode: boolean
  isSidebarOpen: boolean
  loading: boolean
  currentUser: any 
  toggleDarkMode: () => void
  toggleSidebar: () => void
  addTask: (taskData: any) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  joinTask: (taskId: string) => Promise<void>
  reorderTasks: (destination: any, source: any, draggableId: string) => Promise<void>
  fetchComments: (taskId: string) => Promise<any[]>
  addComment: (taskId: string, content: string, author: string) => Promise<{ data: any, error: any }>
  getTaskTimeStatus: (dueDate: string | undefined) => { label: string; color: string }
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [allUsers, setAllUsers] = useState<Profile[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // --- Initialization ---
  useEffect(() => {
    const initData = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setCurrentUser(session.user)
        await Promise.all([fetchTasks(), fetchCategories(), fetchAllUsers()])
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ?? null)
        if (session) fetchAllUsers()
      })

      setLoading(false)
      return () => subscription.unsubscribe()
    }
    initData()

    const savedTheme = localStorage.getItem('tasksplit_theme')
    if (savedTheme) setIsDarkMode(JSON.parse(savedTheme))
  }, [])

  // --- Fetch Functions ---
  const fetchAllUsers = async () => {
    const { data, error } = await supabase.from('profiles').select('id, full_name, email, avatar_url')
    if (!error && data) setAllUsers(data as Profile[])
  }

  const fetchTasks = async () => {
    const { data } = await supabase.from('tasks').select('*, categories (name, color)').order('created_at', { ascending: false })
    if (data) setTasks(data as Task[])
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data as Category[])
  }

  // --- Task Actions ---
  const addTask = async (taskData: any) => {
    const catId = taskData.category_id || (categories.length > 0 ? categories[0].id : null)
    
    const payload = {
      ...taskData,
      category_id: catId,
      user_id: currentUser?.id,
      authorEmail: currentUser?.email,
      current_people: 1,
      status: 'todo'
    }

    const { data, error } = await supabase.from('tasks').insert([payload]).select('*, categories (name, color)').single()
    if (!error && data) {
      setTasks([data, ...tasks])
      await saveLog({ task_id: data.id, action: 'created', new_value: data.title })
    }
  }

  const updateTask = async (updatedTask: Task) => {
    const { categories: _, ...cleanTask } = updatedTask as any 
    const { data, error } = await supabase.from('tasks').update(cleanTask).eq('id', updatedTask.id).select('*, categories (name, color)').single()
    if (!error && data) {
      setTasks(tasks.map(t => t.id === updatedTask.id ? data : t))
    }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(tasks.filter(t => t.id !== id))
  }

  const joinTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return
    
    if ((task.current_people || 0) >= (task.max_assignees || 1)) {
      alert("ขออภัย! สมาชิกในทีมเต็มแล้ว")
      return
    }

    const newCount = (task.current_people || 0) + 1
    const { error } = await supabase.from('tasks').update({ current_people: newCount }).eq('id', taskId)

    if (!error) {
      setTasks(tasks.map(t => t.id === taskId ? { ...t, current_people: newCount } : t))
      await saveLog({ task_id: taskId, action: 'joined', new_value: `User joined. Total: ${newCount}` })
    }
  }

  // --- Drag & Drop (Reorder) ---
  const reorderTasks = async (destination: any, source: any, draggableId: string) => {
    if (!destination) return
    if (destination.droppableId === source.droppableId && destination.index === source.index) return

    const newStatus = destination.droppableId as 'todo' | 'doing' | 'done'
    const updatedTasks = Array.from(tasks)
    const taskIndex = updatedTasks.findIndex(t => t.id === draggableId)
    
    if (taskIndex !== -1) {
      updatedTasks[taskIndex].status = newStatus
      setTasks(updatedTasks)
      
      const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', draggableId)
      if (error) fetchTasks() // Revert if failed
    }
  }

  // --- Comments & Logs ---
  const fetchComments = async (taskId: string) => {
    const { data } = await supabase.from('task_comments').select('*').eq('task_id', taskId).order('created_at', { ascending: true })
    return data || []
  }

  const addComment = async (taskId: string, content: string, author: string) => {
    return await supabase.from('task_comments').insert([{ task_id: taskId, content, author_name: author }]).select().single()
  }

  const saveLog = async (logData: any) => {
    await supabase.from('task_logs').insert([logData])
  }

  // --- Helpers ---
  const getTaskTimeStatus = (dueDate: string | undefined) => {
    if (!dueDate) return { label: 'NO DEADLINE', color: '#888' }
    const now = new Date(); const deadline = new Date(dueDate)
    const diff = deadline.getTime() - now.getTime()
    if (diff < 0) return { label: 'OVERDUE', color: '#ff4d4d' }
    if (diff / (1000*60*60*24) <= 1) return { label: 'DUE SOON', color: '#ffaa44' }
    return { label: 'ON TRACK', color: '#44ffaa' }
  }

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('tasksplit_theme', JSON.stringify(newMode))
  }
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  return (
    <TaskContext.Provider value={{ 
      tasks, categories, allUsers, isDarkMode, isSidebarOpen, loading, currentUser, 
      toggleDarkMode, toggleSidebar, addTask, updateTask, deleteTask, joinTask, reorderTasks,
      fetchComments, addComment, getTaskTimeStatus
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