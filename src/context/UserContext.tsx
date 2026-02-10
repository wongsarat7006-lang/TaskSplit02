// src/context/UserContext.tsx
'use client'

import { createContext, useContext, useState } from 'react'
import { User } from '../types/user'  

/* ================= TYPES ================= */

type UserContextType = {
  user: User | null
  updateUser: (updates: Partial<User>) => void
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
}

/* ================= CONTEXT ================= */

const UserContext = createContext<UserContextType | null>(null)

/* ================= PROVIDER ================= */

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: 1,
    name: 'สมชาย ใจดี',
    email: '12235@example.com',
    phone: '081-999-9999',
    bio: 'นักพัฒนาเว็บแอปพลิเคชัน',
    createdAt: new Date().toISOString(),
  })

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      })
    }
  }

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    console.log('🔐 เปลี่ยนรหัสผ่าน:', {
      currentPassword,
      newPassword,
    })

    await new Promise((resolve) => setTimeout(resolve, 500))
    return true
  }

  return (
    <UserContext.Provider value={{ user, updateUser, changePassword }}>
      {children}
    </UserContext.Provider>
  )
}

/* ================= HOOK ================= */

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}