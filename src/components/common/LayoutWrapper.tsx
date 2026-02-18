'use client'

import Sidebar from './Sidebar'
import { useTasks } from '../../context/TaskContext'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { isSidebarOpen } = useTasks()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* 1. ส่วน Sidebar ด้านซ้าย */}
      <Sidebar />

      {/* 2. ส่วนเนื้อหาด้านขวา */}
      <div style={{ 
        flex: 1, 
        // ขยับเนื้อหาตามความกว้าง Sidebar (260px หรือ 80px)
        marginLeft: isSidebarOpen ? '260px' : '80px', 
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* ตรงนี้ไม่ต้องมี <Navbar /> แล้ว เพราะเราใช้ Sidebar จัดการทุกอย่าง */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  )
}