// src/context/UserContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { User } from '../types/user'
import { supabase } from '../lib/supabaseClient'

type UserContextType = {
  user: User | null
  updateUser: (updates: Partial<User>) => Promise<void>
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>
}

const UserContext = createContext<UserContextType | null>(null)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // ✅ โหลด user + profile จาก DB
  useEffect(() => {
    const fetchUser = async () => {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) return

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      if (error || !profile) return

      setUser({
        id: profile.id,
        name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || '',
        avatar: profile.avatar_url || null,
        createdAt: profile.created_at,
      })
    }

    fetchUser()
  }, [])

  // ✅ อัปเดตข้อมูล profile
  const updateUser = async (updates: Partial<User>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.name,
        phone: updates.phone,
        bio: updates.bio,
        avatar_url: updates.avatar,
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error || !data) return

    // ใช้ข้อมูลล่าสุดจาก DB
    setUser({
      id: data.id,
      name: data.full_name || '',
      email: data.email || '',
      phone: data.phone || '',
      bio: data.bio || '',
      avatar: data.avatar_url || null,
      createdAt: data.created_at,
    })
  }

  // ✅ เปลี่ยนรหัสผ่าน
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    return !error
  }

  return (
    <UserContext.Provider value={{ user, updateUser, changePassword }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}