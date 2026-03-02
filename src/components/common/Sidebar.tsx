'use client'

import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Cookies from 'js-cookie'

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

  const handleLogout = () => {
    if (confirm('คุณต้องการออกจากระบบใช่หรือไม่?')) {
      Cookies.remove('token')
      router.push('/login')
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
    <aside
      style={{
        width: sidebarWidth,
        height: '100vh',
        background: t.bg,
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
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          gap: '10px',
          color: t.subText,
        }}>
          {isDarkMode ? '☀️' : '🌙'}
          {isSidebarOpen && <span>โหมดมืด</span>}
        </button>

        {/* Controls */}
        <button onClick={toggleSidebar} style={{
          padding: '12px',
          borderRadius: '6px',
          border: `1px solid ${t.border}`,
          background: 'transparent',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          gap: '10px',
        }}>
          {isSidebarOpen ? '◀ COLLAPSE' : '▶'}
        </button>

        <button onClick={handleLogout} style={{
          marginTop: '6px',
          padding: '12px',
          borderRadius: '6px',
          border: 'none',
          background: 'rgba(239,68,68,0.1)',
          color: '#f87171',
          cursor: 'pointer',
          display: 'flex',
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
      }}
    >
      <span>{icon}</span>
      {open && <span style={{ fontFamily: thaiFont }}>{label}</span>}
    </Link>
  )
}