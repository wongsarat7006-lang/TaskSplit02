'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
}

export interface Category {
  id: string
  name: string
  color: string
}

interface TaskContextType {
  tasks: Task[]
  categories: Category[]
  isDarkMode: boolean
  isSidebarOpen: boolean
  loading: boolean
  toggleDarkMode: () => void
  toggleSidebar: () => void
  addTask: (task: Omit<Task, 'id' | 'created_at' | 'categories'>) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  reorderTasks: (destination: any, source: any, draggableId: string) => Promise<void>
  fetchComments: (taskId: string) => Promise<any[]>
  addComment: (taskId: string, content: string, author: string) => Promise<{ data: any, error: any }>
  // ✅ เพิ่มฟังก์ชันเข้า Type
  getTaskTimeStatus: (dueDate: string | undefined) => { label: string; color: string }
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initData = async () => {
      setLoading(true)
      await Promise.all([fetchTasks(), fetchCategories()])
      setLoading(false)
    }
    initData()
    const savedTheme = localStorage.getItem('tasksplit_theme')
    if (savedTheme) setIsDarkMode(JSON.parse(savedTheme))
  }, [])

  const fetchTasks = async () => {
    const { data } = await supabase
      .from('tasks')
      .select('*, categories (name, color)')
      .order('created_at', { ascending: false })
    if (data) setTasks(data as Task[])
  }

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*')
    if (data) setCategories(data as Category[])
  }

  // ✅ เพิ่ม Logic คำนวณเวลา
  const getTaskTimeStatus = (dueDate: string | undefined) => {
    if (!dueDate) return { label: 'NO DEADLINE', color: '#888' };
    const now = new Date();
    const deadline = new Date(dueDate);
    const diffInMs = deadline.getTime() - now.getTime();
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInMs < 0) return { label: 'OVERDUE', color: '#ff4d4d' };
    if (diffInDays <= 1) return { label: 'DUE SOON', color: '#ffaa44' };
    return { label: 'ON TRACK', color: '#44ffaa' };
  };

  const saveLog = async (logData: { task_id: string; action: string; field?: string; old_value?: string; new_value?: string; }) => {
    await supabase.from('task_logs').insert([logData])
  }

  const fetchComments = async (taskId: string) => {
    const { data } = await supabase.from('task_comments').select('*').eq('task_id', taskId).order('created_at', { ascending: true });
    return data || [];
  };

  const addComment = async (taskId: string, content: string, author: string) => {
    const { data, error } = await supabase.from('task_comments').insert([{ task_id: taskId, content, author_name: author }]).select().single();
    return { data, error };
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('tasksplit_theme', JSON.stringify(newMode))
  }

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const addTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'categories'>) => {
    const { data, error } = await supabase.from('tasks').insert([taskData]).select('*, categories (name, color)').single()
    if (!error && data) {
      setTasks([data, ...tasks])
      await saveLog({ task_id: data.id, action: 'created', new_value: data.title })
    }
  }

  const updateTask = async (updatedTask: Task) => {
    const oldTask = tasks.find(t => t.id === updatedTask.id)
    const { categories: _, ...cleanTask } = updatedTask as any 
    const { data, error } = await supabase.from('tasks').update(cleanTask).eq('id', updatedTask.id).select('*, categories (name, color)').single()
    if (!error && data && oldTask) {
      setTasks(tasks.map(t => t.id === updatedTask.id ? data : t))
    }
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(tasks.filter(t => t.id !== id))
  }

  const reorderTasks = async (destination: any, source: any, draggableId: string) => {
    if (!destination || destination.droppableId === source.droppableId) return
    const newStatus = destination.droppableId
    const oldStatus = source.droppableId
    const { error } = await supabase.from('tasks').update({ status: newStatus }).eq('id', draggableId)
    if (!error) {
      await saveLog({ task_id: draggableId, action: 'moved', field: 'status', old_value: oldStatus, new_value: newStatus })
      setTasks(tasks.map(t => t.id === draggableId ? { ...t, status: newStatus } : t))
    }
  }

  return (
    <TaskContext.Provider value={{ 
      tasks, categories, isDarkMode, isSidebarOpen, loading,
      toggleDarkMode, toggleSidebar, addTask, updateTask, deleteTask, reorderTasks,
      fetchComments, addComment, getTaskTimeStatus // ✅ ส่งฟังก์ชันออกไป
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