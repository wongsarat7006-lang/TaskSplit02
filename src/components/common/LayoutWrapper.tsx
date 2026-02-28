'use client'

import { usePathname } from 'next/navigation'
import Sidebar from './Sidebar'
import { useTasks } from '../../context/TaskContext'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useTasks()
  const pathname = usePathname()

  // เพิ่มเงื่อนไขให้ดักทั้ง /login และ /signup
  if (pathname === '/login' || pathname === '/signup') {
    return <main style={{ width: '100%' }}>{children}</main>
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: isSidebarOpen ? '260px' : '72px' }}>
        <main>{children}</main>
      </div>
    </div>
  )
}