'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { useTasks } from '../../context/TaskContext'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { isSidebarOpen } = useTasks()
  const pathname = usePathname()

  // ❗ ไม่แสดง Sidebar ในหน้า login / signup
  if (pathname === '/login' || pathname === '/signup') {
    return (
      <main style={{ minHeight: '100vh', width: '100%' }}>
        {children}
      </main>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      {/* ✅ แสดง Sidebar เฉพาะตอนเปิด */}
      {isSidebarOpen && <Sidebar />}

      {/* ✅ Content หลัก ไม่ต้องใช้ margin */}
      <main
        style={{
          flex: 1,
          minHeight: '100vh',
        }}
      >
        {children}
      </main>
    </div>
  )
}