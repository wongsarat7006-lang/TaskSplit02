'use client'

import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode } = useTasks()
  const pathname = usePathname()

  const sidebarWidth = isSidebarOpen ? '260px' : '80px'
  
  // ปรับสี Sidebar ตามโหมด
  const sidebarBg = isDarkMode ? '#1e1e1e' : '#1d43ea' 

  return (
    <aside style={{
      width: sidebarWidth,
      background: sidebarBg,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 10px',
      zIndex: 1000,
      overflow: 'hidden',
      boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
    }}>
      
      {/* 1. ส่วนโปรไฟล์ (กดไปหน้า Profile) */}
      <Link href="/profile" style={{ textDecoration: 'none' }}>
        <div style={{
          background: isDarkMode ? '#333' : '#e5e7eb',
          borderRadius: '16px',
          padding: isSidebarOpen ? '15px 10px' : '10px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '24px',
          cursor: 'pointer',
        }}>
          <div style={{ fontSize: '32px' }}>👤</div>
          {isSidebarOpen && (
            <span style={{ 
              color: isDarkMode ? '#fff' : '#111827', 
              fontWeight: 700, 
              fontSize: '14px', 
              marginTop: '4px', 
              whiteSpace: 'nowrap' 
            }}>
              ชื่อ นายกอ กนไกร
            </span>
          )}
        </div>
      </Link>

      {/* 2. เมนูนำทาง */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <MenuLink icon="🏠" label="หน้าแรก" href="/" active={pathname === '/'} open={isSidebarOpen} />
        <MenuLink icon="📊" label="Dashboard" href="/tasks" active={pathname === '/tasks'} open={isSidebarOpen} />
        
        {/* --- ปุ่มสลับโหมดมืด (เพิ่มเข้ามาใหม่) --- */}
        <button 
          onClick={toggleDarkMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '12px 15px',
            borderRadius: '12px',
            border: 'none',
            color: '#fff',
            background: 'rgba(255, 255, 255, 0.1)',
            gap: '15px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%'
          }}
        >
          <span style={{ fontSize: '20px' }}>{isDarkMode ? '☀️' : '🌙'}</span>
          {isSidebarOpen && <span style={{ fontWeight: 600 }}>{isDarkMode ? 'โหมดสว่าง' : 'โหมดมืด'}</span>}
        </button>

        <MenuLink icon="⚙️" label="Profile" href="/profile" active={pathname === '/profile'} open={isSidebarOpen} />
      </nav>

      {/* 3. ส่วนปุ่มด้านล่าง */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '10px', 
        paddingBottom: '30px', 
        marginTop: 'auto' 
      }}>
        <button 
          onClick={toggleSidebar} 
          style={{ ...btnStyle, background: 'rgba(255, 255, 255, 0.2)' }}
        >
          {isSidebarOpen ? '◀ ปิดเมนู' : '▶'}
        </button>
        
        <button 
          style={{ ...btnStyle, background: '#ef4444', fontWeight: 700 }}
          onClick={() => alert('ออกจากระบบ')}
        >
          {isSidebarOpen ? 'Logout' : '🚪'}
        </button>
      </div>
    </aside>
  )
}

function MenuLink({ icon, label, href, active, open }: any) {
  return (
    <Link href={href} style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 15px',
      borderRadius: '12px',
      textDecoration: 'none',
      color: '#fff',
      background: active ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
      gap: '15px',
      whiteSpace: 'nowrap'
    }}>
      <span style={{ fontSize: '20px' }}>{icon}</span>
      {open && <span style={{ fontWeight: 600 }}>{label}</span>}
    </Link>
  )
}

const btnStyle: React.CSSProperties = {
  border: 'none', color: '#fff', padding: '12px', borderRadius: '12px',
  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '14px'
}