'use client'

import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode } = useTasks()
  const pathname = usePathname()

  const sidebarWidth = isSidebarOpen ? '260px' : '80px'
  
  // โทนสีใหม่: Deep Slate (น้ำเงินเข้มเกือบดำ)
  const sidebarBg = isDarkMode ? '#0f172a' : '#1e293b' 
  const activeBg = 'rgba(99, 102, 241, 0.2)' // Indigo โปร่งแสง
  const activeText = '#818cf8' // Indigo สว่าง
  const inactiveText = '#94a3b8'

  return (
    <aside style={{
      width: sidebarWidth,
      background: sidebarBg,
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0,
      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 14px',
      zIndex: 1000,
      overflow: 'hidden',
      boxShadow: '10px 0 30px rgba(0,0,0,0.2)'
    }}>
      
      {/* 1. Logo Section (Indigo Accent) */}
      <Link href="/" style={{ textDecoration: 'none', marginBottom: '40px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          gap: '15px',
          padding: '5px'
        }}>
          <div style={{
            minWidth: '42px',
            height: '42px',
            background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            ⚡
          </div>
          {isSidebarOpen && (
            <span style={{ 
              color: '#fff', 
              fontWeight: 800, 
              fontSize: '20px', 
              letterSpacing: '0.5px',
              background: 'linear-gradient(to right, #fff, #94a3b8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              TaskSplit
            </span>
          )}
        </div>
      </Link>

      {/* 2. Navigation Menu */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <MenuLink icon="🏠" label="หน้าแรก" href="/" active={pathname === '/'} open={isSidebarOpen} colors={{ activeBg, activeText, inactiveText }} />
        <MenuLink icon="📊" label="Dashboard" href="/tasks" active={pathname === '/tasks'} open={isSidebarOpen} colors={{ activeBg, activeText, inactiveText }} />
        <MenuLink icon="👤" label="โปรไฟล์" href="/profile" active={pathname === '/profile'} open={isSidebarOpen} colors={{ activeBg, activeText, inactiveText }} />
        
        <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)', margin: '15px 10px' }} />

        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            color: isDarkMode ? '#fbbf24' : '#94a3b8',
            background: isDarkMode ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255,255,255,0.03)',
            gap: '15px',
            cursor: 'pointer',
            transition: '0.3s',
            width: '100%'
          }}
        >
          <span style={{ fontSize: '18px' }}>{isDarkMode ? '☀️' : '🌙'}</span>
          {isSidebarOpen && <span style={{ fontWeight: 600, fontSize: '14px' }}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </button>
      </nav>

      {/* 3. Footer Actions */}
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '12px', 
        paddingBottom: '20px',
        marginTop: 'auto' 
      }}>
        <button 
          onClick={toggleSidebar} 
          style={{ 
            ...btnStyle, 
            background: 'rgba(255,255,255,0.05)',
            color: '#fff'
          }}
        >
          {isSidebarOpen ? '◀ Collapse Menu' : '▶'}
        </button>
        
        <button 
          style={{ 
            ...btnStyle, 
            background: 'rgba(239, 68, 68, 0.1)', 
            color: '#ef4444', 
            fontWeight: 700 
          }}
          onClick={() => alert('Signing out...')}
        >
          {isSidebarOpen ? 'Sign Out' : '🚪'}
        </button>
      </div>
    </aside>
  )
}

function MenuLink({ icon, label, href, active, open, colors }: any) {
  return (
    <Link href={href} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: open ? 'flex-start' : 'center',
      padding: '14px',
      borderRadius: '12px',
      textDecoration: 'none',
      color: active ? colors.activeText : colors.inactiveText,
      background: active ? colors.activeBg : 'transparent',
      gap: '15px',
      transition: 'all 0.2s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* ตัวบอกสถานะด้านข้างเมื่อ Active */}
      {active && <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: '4px', background: colors.activeText, borderRadius: '0 4px 4px 0' }} />}
      
      <span style={{ fontSize: '20px', filter: active ? 'drop-shadow(0 0 5px rgba(129, 140, 248, 0.5))' : 'none' }}>{icon}</span>
      {open && <span style={{ fontWeight: active ? 700 : 500, fontSize: '15px' }}>{label}</span>}
    </Link>
  )
}

const btnStyle: React.CSSProperties = {
  border: 'none',
  padding: '14px',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '13px',
  transition: 'all 0.2s ease',
}