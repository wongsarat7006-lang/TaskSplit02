'use client'

import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie' // นำเข้า Cookies เพื่อจัดการ Session

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode } = useTasks()
  const pathname = usePathname()
  const router = useRouter()

  const sidebarWidth = isSidebarOpen ? '260px' : '72px'

  // ฟังก์ชัน Logout แบบมืออาชีพ
  const handleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบใช่หรือไม่?")) {
      Cookies.remove('token') // ลบ Token จาก Cookies
      router.push('/login')   // ดีดไปหน้า Login
      router.refresh()        // รีเฟรชสถานะ
    }
  }

  const t = {
    bg:        isDarkMode ? '#0a0a0a' : '#ffffff',
    border:    isDarkMode ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.1)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.5)' : 'rgba(255,107,0,0.4)',
    text:      isDarkMode ? '#f0ede8' : '#111110',
    subText:   isDarkMode ? '#6a6a62' : '#8a8a82',
    grid:      isDarkMode ? 'rgba(255,107,0,0.03)' : 'rgba(255,107,0,0.05)',
    shadow:    isDarkMode ? '4px 0 30px rgba(0,0,0,0.5)' : '4px 0 20px rgba(0,0,0,0.06)',
    activeNav: isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.05)',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  return (
    <aside style={{
      width: sidebarWidth,
      background: t.bg,
      height: '100vh',
      position: 'fixed', left: 0, top: 0,
      transition: 'width 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1), background 0.3s ease',
      display: 'flex', flexDirection: 'column',
      zIndex: 1000, overflow: 'hidden',
      borderRight: `1px solid ${t.border}`,
      boxShadow: t.shadow,
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }} />
      
      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 12px 16px' }}>

        <Link href="/" style={{ textDecoration: 'none', marginBottom: '36px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center', gap: '12px', padding: '4px' }}>
            <div style={{ minWidth: '40px', height: '40px', background: '#ff6b00', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0, boxShadow: '0 0 20px rgba(255,107,0,0.35)' }}>⚡</div>
            {isSidebarOpen && (
              <span style={{ fontFamily: engFont, color: t.text, fontWeight: 900, fontSize: '28px', letterSpacing: '1px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                Task<span style={{ color: '#ff6b00' }}>Split</span>
              </span>
            )}
          </div>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavItem href="/"    icon="⊞" label="หน้าแรก"    active={pathname === '/'}    open={isSidebarOpen} t={t} thaiFont={thaiFont} isDarkMode={isDarkMode} />
          <NavItem href="/tasks"   icon="▦" label="Task Board" active={pathname === '/tasks'}  open={isSidebarOpen} t={t} thaiFont={thaiFont} isDarkMode={isDarkMode} />
          <NavItem href="/profile" icon="◉" label="โปรไฟล์"    active={pathname === '/profile'}  open={isSidebarOpen} t={t} thaiFont={thaiFont} isDarkMode={isDarkMode} />
        </nav>

        <div style={{ height: '1px', background: `linear-gradient(90deg, ${t.border}, transparent)`, margin: '16px 8px' }} />

        <button onClick={toggleDarkMode} style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          padding: '12px 14px', borderRadius: '6px',
          border: `1px solid ${isDarkMode ? 'rgba(255,107,0,0.3)' : 'rgba(255,107,0,0.1)'}`,
          color: isDarkMode ? '#ff6b00' : t.subText,
          background: isDarkMode ? 'rgba(255,107,0,0.1)' : 'rgba(0,0,0,0.02)',
          gap: '12px', cursor: 'pointer',
          transition: 'all 0.2s ease', width: '100%', whiteSpace: 'nowrap',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>{isDarkMode ? '☀️' : '🌙'}</span>
          {isSidebarOpen && <span style={{ fontFamily: thaiFont, fontSize: '14px', fontWeight: 500 }}>{isDarkMode ? 'โหมดสว่าง' : 'โหมดมืด'}</span>}
        </button>

        <div style={{ flex: 1 }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button onClick={toggleSidebar} style={{
            border: `1px solid ${t.border}`, padding: '11px 14px', borderRadius: '6px', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            gap: '10px', background: 'transparent', color: t.subText,
            transition: 'all 0.2s ease', width: '100%',
          }}>
            <span style={{ fontSize: '12px' }}>{isSidebarOpen ? '◀' : '▶'}</span>
            {isSidebarOpen && <span style={{ fontFamily: monoFont, fontSize: '11px' }}>COLLAPSE</span>}
          </button>

          <button onClick={handleLogout} style={{
            border: 'none', padding: '12px 14px', borderRadius: '6px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            gap: '10px', background: 'rgba(239,68,68,0.1)', color: '#f87171', transition: 'all 0.2s ease', width: '100%',
          }}>
            <span style={{ fontSize: '15px' }}>🚪</span>
            {isSidebarOpen && <span style={{ fontFamily: thaiFont, fontSize: '14px', fontWeight: 600 }}>ออกจากระบบ</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, href, active, open, t, thaiFont, isDarkMode }: any) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center',
      justifyContent: open ? 'flex-start' : 'center',
      padding: '12px 14px', borderRadius: '6px',
      textDecoration: 'none',
      color: active ? (isDarkMode ? '#ff6b00' : '#111110') : t.subText,
      background: active ? t.activeNav : 'transparent',
      border: `1px solid ${active ? (isDarkMode ? 'rgba(255,107,0,0.3)' : 'rgba(0,0,0,0.05)') : 'transparent'}`,
      gap: '12px', transition: 'all 0.2s ease',
      boxShadow: active && !isDarkMode ? '0 4px 12px rgba(0,0,0,0.03)' : 'none',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: '18px', fontWeight: 900 }}>{icon}</span>
      {open && <span style={{ fontFamily: thaiFont, fontSize: '14px', fontWeight: active ? 700 : 500 }}>{label}</span>}
    </Link>
  )
}