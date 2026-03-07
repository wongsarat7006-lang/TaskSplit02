'use client'

import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
import { supabase } from '../../lib/supabaseClient'

export default function Sidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    isDarkMode,
    toggleDarkMode,
  } = useTasks()

  const pathname = usePathname()
  const router = useRouter()

  const sidebarWidth = isSidebarOpen ? '260px' : '72px'

  const handleLogout = async () => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      try {
        Cookies.remove('token')
        await supabase.auth.signOut()
      } finally {
        router.push('/login')
      }
    }
  }

  const t = {
    // ทำให้ sidebar "ตัด" กับพื้นหลังมากขึ้น และเพิ่ม contrast ของตัวหนังสือในโหมดมืด
    bg:        isDarkMode ? '#070707' : '#ffffff',
    border:    isDarkMode ? 'rgba(255,107,0,0.22)' : 'rgba(255,107,0,0.12)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.55)' : 'rgba(255,107,0,0.45)',
    text:      isDarkMode ? '#f6f2ed' : '#111110',
    subText:   isDarkMode ? '#c8c4be' : '#3f3f39',
    grid:      isDarkMode ? 'rgba(255,107,0,0.05)' : 'rgba(255,107,0,0.05)',
    shadow:    isDarkMode ? '8px 0 40px rgba(0,0,0,0.65)' : '6px 0 26px rgba(0,0,0,0.08)',
    activeNav: isDarkMode ? 'rgba(255,107,0,0.18)' : 'rgba(255,107,0,0.07)',
    surface:   isDarkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  return (
    <aside
      style={{
        width: sidebarWidth,
        // ให้ sidebar ยาวชนล่างจอ และอยู่กับที่เวลาเลื่อน
        height: '100dvh',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        background: `linear-gradient(180deg, ${t.bg}, ${isDarkMode ? '#050505' : '#ffffff'})`,
        transition: 'width 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,                // ⭐ สำคัญ
        overflow: 'hidden',
        borderRight: `1px solid ${t.border}`,
        boxShadow: t.shadow,
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `
            linear-gradient(${t.grid} 1px, transparent 1px),
            linear-gradient(90deg, ${t.grid} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Accent divider to increase separation */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: 2,
        height: '100%',
        background: `linear-gradient(180deg, transparent, ${t.borderStr}, transparent)`,
        opacity: isDarkMode ? 0.9 : 0.6,
        pointerEvents: 'none',
      }} />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: '24px 12px 16px',
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', marginBottom: '36px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarOpen ? 'flex-start' : 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                minWidth: '40px',
                height: '40px',
                background: '#ff6b00',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                boxShadow: '0 0 20px rgba(255,107,0,0.35)',
              }}
            >
              ⚡
            </div>

            {isSidebarOpen && (
              <span
                style={{
                  fontFamily: engFont,
                  color: t.text,
                  fontWeight: 900,
                  fontSize: '28px',
                }}
              >
                Task<span style={{ color: '#ff6b00' }}>Split</span>
              </span>
            )}
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavItem href="/" icon="⊞" label="หน้าแรก" active={pathname === '/'} open={isSidebarOpen} t={t} thaiFont={thaiFont} isDarkMode={isDarkMode} />
          <NavItem href="/tasks" icon="▦" label="Task Board" active={pathname === '/tasks'} open={isSidebarOpen} t={t} thaiFont={thaiFont} isDarkMode={isDarkMode} />
          <NavItem href="/profile" icon="◉" label="โปรไฟล์" active={pathname === '/profile'} open={isSidebarOpen} t={t} thaiFont={thaiFont} isDarkMode={isDarkMode} />
        </nav>

        <div style={{ flex: 1 }} />

        {/* Dark mode */}
        <button onClick={toggleDarkMode} style={{
          marginBottom: '8px',
          padding: '12px',
          borderRadius: '6px',
          border: `1px solid ${t.border}`,
          background: t.surface,
          cursor: 'pointer',
          display: 'flex',
          width: '100%',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          gap: '10px',
          color: t.text,
        }}>
          {isDarkMode ? '☀️' : '🌙'}
          {isSidebarOpen && <span style={{ color: t.subText }}>โหมดมืด</span>}
        </button>

        {/* Controls */}
        <button onClick={toggleSidebar} style={{
          padding: '12px',
          borderRadius: '6px',
          border: `1px solid ${t.border}`,
          background: t.surface,
          cursor: 'pointer',
          display: 'flex',
          width: '100%',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          gap: '10px',
          color: t.text,
        }}>
          {isSidebarOpen ? '◀ COLLAPSE' : '▶'}
        </button>

        <button onClick={handleLogout} style={{
          marginTop: '10px',
          padding: '12px',
          borderRadius: '6px',
          border: '1px solid rgba(239,68,68,0.35)',
          background: isDarkMode ? 'rgba(239,68,68,0.10)' : 'rgba(239,68,68,0.08)',
          color: isDarkMode ? '#ffb4b4' : '#b91c1c',
          cursor: 'pointer',
          display: 'flex',
          width: '100%',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          gap: '10px',
        }}>
          🚪 {isSidebarOpen && 'ออกจากระบบ'}
        </button>
      </div>
    </aside>
  )
}

function NavItem({ icon, label, href, active, open, t, thaiFont, isDarkMode }: any) {
  return (
    <Link
      href={href}
      title={open ? undefined : label}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: open ? 'flex-start' : 'center',
        padding: '12px 14px',
        borderRadius: '6px',
        textDecoration: 'none',
        color: active ? '#ff6b00' : t.subText,
        background: active ? t.activeNav : 'transparent',
        gap: '12px',
        whiteSpace: 'nowrap',
        border: active ? `1px solid ${t.borderStr}` : '1px solid transparent',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <span style={{ color: active ? '#ff6b00' : t.text }}>{icon}</span>
      {open && <span style={{ fontFamily: thaiFont, color: active ? '#ff6b00' : t.text }}>{label}</span>}
    </Link>
  )
}