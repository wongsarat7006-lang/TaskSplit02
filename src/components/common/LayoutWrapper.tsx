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
  const { isDarkMode } = useTasks()
  const pathname = usePathname()

  // ❗ ไม่แสดง Sidebar ในหน้า login / signup
  if (pathname === '/login' || pathname === '/signup') {
    return (
      <main style={{ minHeight: '100vh', width: '100%' }}>
        {children}
      </main>
    )
  }

  const appBg = isDarkMode ? '#0a0a0a' : '#fafaf8'

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100dvh',
        width: '100%',
        background: appBg, // กันพื้นขาวโผล่เวลามีช่องว่าง/เลื่อน
      }}
    >
      {/* ✅ Sidebar ใช้สถานะเปิด/ปิดภายในตัวเอง (ความกว้าง) */}
      <Sidebar />

      {/* ✅ Content หลัก ไม่ต้องใช้ margin */}
      <main
        style={{
          flex: 1,
          minHeight: '100dvh',
          background: appBg,
        }}
      >
        {children}
      </main>
    </div>
  )
}