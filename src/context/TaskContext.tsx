'use client'

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react'
import { supabase } from '../lib/supabaseClient'

export interface Task {
  id: string
  title: string
  description?: string
  priority: 'high' | 'medium' | 'low'
  status: 'todo' | 'doing' | 'done'
  due_date?: string
  category_id?: string
  categories?: { name: string; color: string }
  created_at?: string
  user_id?: string
  author_email?: string
  max_assignees?: number
  team_members?: string[]
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
  loading: boolean
  currentUser: any
  isDarkMode: boolean
  isSidebarOpen: boolean
  toggleDarkMode: () => void
  toggleSidebar: () => void
  setSidebarOpen: (value: boolean) => void
  fetchTasks: () => Promise<void>
  addTask: (taskData: any) => Promise<void>
  updateTask: (task: Task) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  joinTask: (task: Task) => Promise<void>
  fetchComments: (taskId: string) => Promise<any[]>
  addComment: (taskId: string, content: string, author: string) => Promise<{ data: any; error: any }>
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [allUsers, setAllUsers] = useState<Profile[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true)

  const toggleDarkMode = () => setIsDarkMode(prev => !prev)
  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  const fetchTasks = useCallback(async () => {
    console.log('[fetchTasks] starting...')
    const { data, error } = await supabase
      .from('tasks')
      .select('*, categories (name, color)')
      .order('created_at', { ascending: false })
    console.log('[fetchTasks] data:', data)
    console.log('[fetchTasks] error:', error)
    if (error) { console.error('[fetchTasks] ERROR:', error.message); return }
    console.log('[fetchTasks] setting', data?.length, 'tasks')
    setTasks(data as Task[])
  }, [])

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase.from('categories').select('*')
    console.log('[fetchCategories]', data, error)
    if (data) setCategories(data as Category[])
  }, [])

  const fetchAllUsers = useCallback(async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
    console.log('[fetchAllUsers]', data, error)
    if (data) setAllUsers(data as Profile[])
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        setLoading(true)
        const { data: { session } } = await supabase.auth.getSession()
        console.log('[init] session:', session?.user?.email ?? 'no session')
        if (!mounted) return
        setCurrentUser(session?.user ?? null)

        // หน้าแรกต้องเห็นงานได้แม้ยังไม่ล็อกอิน
        await Promise.all([
          fetchTasks(),
          fetchCategories(),
          session ? fetchAllUsers() : Promise.resolve(),
        ])
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    // ✅ สำคัญ: cleanup auth listener (กันติดซ้ำใน dev/StrictMode แล้วทำให้ state เพี้ยน)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('[authChange]', _event)
      setCurrentUser(session?.user ?? null)
      // logout แล้วยังต้องเห็น public tasks ต่อได้
      await fetchTasks()
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [fetchTasks, fetchCategories, fetchAllUsers])

  const addTask = async (taskData: any) => {
    if (!currentUser) throw new Error('Not authenticated')
    const payload = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority || 'medium',
      status: 'todo',
      due_date: taskData.due_date || null,
      category_id: taskData.category_id || (categories.length ? categories[0].id : null),
      user_id: currentUser.id,
      author_email: currentUser.email,
      max_assignees: taskData.max_assignees || 1,
      current_people: 1,
      team_members: [currentUser.email]
    }
    console.log('[addTask] payload:', payload)
    const { data, error } = await supabase
      .from('tasks').insert(payload)
      .select('*, categories (name, color)').single()
    console.log('[addTask] result:', data, error)
    if (error) throw error
    setTasks(prev => [data as Task, ...prev])
  }

  const updateTask = async (task: Task) => {
    const { categories, ...clean } = task as any
    const { data, error } = await supabase
      .from('tasks').update(clean).eq('id', task.id)
      .select('*, categories (name, color)').single()
    if (error) throw error
    setTasks(prev => prev.map(t => (t.id === task.id ? data : t)))
  }

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const joinTask = async (task: Task) => {
    if (!currentUser) { alert('กรุณาเข้าสู่ระบบ'); return }
    const members = task.team_members || []
    const currentCount = task.current_people || 0
    const maxCount = task.max_assignees || 1
    if (members.includes(currentUser.email)) { alert('คุณรับงานนี้แล้ว'); return }
    if (currentCount >= maxCount) { alert('งานเต็มแล้ว'); return }
    const { error } = await supabase.from('tasks')
      .update({ current_people: currentCount + 1, team_members: [...members, currentUser.email] })
      .eq('id', task.id)
    if (error) throw error
    await fetchTasks()
  }

  const fetchComments = async (taskId: string) => {
    const { data } = await supabase.from('task_comments').select('*')
      .eq('task_id', taskId).order('created_at')
    return data || []
  }

  const addComment = async (taskId: string, content: string, author: string) => {
    return await supabase.from('task_comments')
      .insert({ task_id: taskId, content, author_name: author })
      .select().single()
  }

  return (
    <TaskContext.Provider value={{
      tasks, categories, allUsers, loading, currentUser,
      isDarkMode, isSidebarOpen,
      toggleDarkMode, toggleSidebar, setSidebarOpen,
      fetchTasks, addTask, updateTask, deleteTask, joinTask,
      fetchComments, addComment
    }}>
      {children}
    </TaskContext.Provider>
  )
}

export const useTasks = () => {
  const ctx = useContext(TaskContext)
  if (!ctx) throw new Error('useTasks must be inside TaskProvider')
  return ctx
}