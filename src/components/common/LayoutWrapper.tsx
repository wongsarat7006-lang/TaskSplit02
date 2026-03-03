'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode
}) {
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
      {/* ✅ Sidebar ใช้สถานะเปิด/ปิดภายในตัวเอง (ความกว้าง) */}
      <Sidebar />

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