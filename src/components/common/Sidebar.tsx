'use client'

import { useTasks } from '../../context/TaskContext'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'


export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, isDarkMode, toggleDarkMode } = useTasks()
  const pathname = usePathname()
  const router = useRouter()


  const sidebarWidth = isSidebarOpen ? '260px' : '72px'

  const t = {
    bg:        isDarkMode ? '#0a0a0a' : '#ffffff',
    border:    isDarkMode ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.2)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.5)' : 'rgba(255,107,0,0.6)',
    text:      isDarkMode ? '#f0ede8' : '#111110',
    subText:   isDarkMode ? '#5a5a52' : '#8a8a82',
    grid:      isDarkMode ? 'rgba(255,107,0,0.03)' : 'rgba(255,107,0,0.05)',
    shadow:    isDarkMode ? '4px 0 30px rgba(0,0,0,0.4)' : '4px 0 20px rgba(0,0,0,0.08)',
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

      {/* Grid texture */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '40px 40px', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '200px', height: '200px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', height: '100%', padding: '24px 12px 16px' }}>

        {/* ── Logo ── */}
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

        {/* Nav label */}
        {isSidebarOpen && (
          <div style={{ fontFamily: monoFont, fontSize: '10px', color: 'rgba(255,107,0,0.35)', letterSpacing: '0.2em', paddingLeft: '14px', marginBottom: '8px' }}>// NAVIGATION</div>
        )}

        {/* ── Menu ── */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <NavItem href="/"        icon="⊞" label="หน้าแรก"    active={pathname === '/'}        open={isSidebarOpen} t={t} thaiFont={thaiFont} />
          <NavItem href="/tasks"   icon="▦" label="Task Board" active={pathname === '/tasks'}    open={isSidebarOpen} t={t} thaiFont={thaiFont} />
          <NavItem href="/profile" icon="◉" label="โปรไฟล์"    active={pathname === '/profile'}  open={isSidebarOpen} t={t} thaiFont={thaiFont} />
        </nav>

        {/* ── Divider ── */}
        <div style={{ height: '1px', background: `linear-gradient(90deg, rgba(255,107,0,0.25), transparent)`, margin: '16px 8px' }} />

        {/* ── Dark Mode Toggle ── */}
        <button onClick={toggleDarkMode} style={{
          display: 'flex', alignItems: 'center',
          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
          padding: '12px 14px', borderRadius: '6px',
          border: `1px solid ${isDarkMode ? 'rgba(255,107,0,0.3)' : 'rgba(255,107,0,0.2)'}`,
          color: isDarkMode ? '#ff6b00' : t.subText,
          background: isDarkMode ? 'rgba(255,107,0,0.1)' : 'rgba(255,107,0,0.04)',
          gap: '12px', cursor: 'pointer',
          transition: 'all 0.2s ease', width: '100%', whiteSpace: 'nowrap',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '16px', flexShrink: 0 }}>{isDarkMode ? '☀️' : '🌙'}</span>
          {isSidebarOpen && <span style={{ fontFamily: thaiFont, fontSize: '14px', fontWeight: 500, color: isDarkMode ? '#ff6b00' : t.subText }}>{isDarkMode ? 'โหมดสว่าง' : 'โหมดมืด'}</span>}
        </button>

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Footer actions (ไม่ติดก้น) ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '0px' }}>

          {/* Collapse */}
          <button onClick={toggleSidebar} style={{
            border: `1px solid ${t.border}`, padding: '11px 14px', borderRadius: '6px', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            gap: '10px', background: 'transparent', color: t.subText,
            transition: 'all 0.2s ease', whiteSpace: 'nowrap', width: '100%',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = t.text; (e.currentTarget as HTMLElement).style.borderColor = t.borderStr }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = t.subText; (e.currentTarget as HTMLElement).style.borderColor = t.border }}
          >
            <span style={{ fontSize: '12px', flexShrink: 0 }}>{isSidebarOpen ? '◀' : '▶'}</span>
            {isSidebarOpen && <span style={{ fontFamily: monoFont, fontSize: '11px', letterSpacing: '0.1em' }}>COLLAPSE</span>}
          </button>

          {/* Sign Out — เด่นชัด มีสีพื้นหลัง */}
          <button
          onClick={() => {
            localStorage.removeItem('token')
            router.push('/login')
          }} style={{
            border: 'none',
            padding: '12px 14px', borderRadius: '6px', cursor: 'pointer',
            display: 'flex', alignItems: 'center',
            justifyContent: isSidebarOpen ? 'flex-start' : 'center',
            gap: '10px',
            background: 'rgba(239,68,68,0.15)',
            color: '#f87171',
            transition: 'all 0.2s ease', whiteSpace: 'nowrap', width: '100%',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.25)'; (e.currentTarget as HTMLElement).style.color = '#ef4444' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.15)'; (e.currentTarget as HTMLElement).style.color = '#f87171' }}
          >
            <span style={{ fontSize: '15px', flexShrink: 0 }}>🚪</span>
            {isSidebarOpen && <span style={{ fontFamily: thaiFont, fontSize: '14px', fontWeight: 600 }}>ออกจากระบบ</span>}
          </button>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');
      `}</style>
    </aside>
  )
}

function NavItem({ icon, label, href, active, open, t, thaiFont }: any) {
  return (
    <Link href={href} style={{
      display: 'flex', alignItems: 'center',
      justifyContent: open ? 'flex-start' : 'center',
      padding: '12px 14px', borderRadius: '6px',
      textDecoration: 'none',
      color: active ? '#111110' : t.subText,
      background: active ? '#ffffff' : 'transparent',
      border: active ? '1px solid rgba(255,255,255,0.9)' : '1px solid transparent',
      gap: '12px', transition: 'all 0.2s ease',
      position: 'relative', overflow: 'hidden',
      boxShadow: active ? '0 4px 20px rgba(255,255,255,0.15)' : 'none',
      whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,107,0,0.08)'
          ;(e.currentTarget as HTMLElement).style.color = '#ff6b00'
          ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,0,0.2)'
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'transparent'
          ;(e.currentTarget as HTMLElement).style.color = t.subText
          ;(e.currentTarget as HTMLElement).style.borderColor = 'transparent'
        }
      }}
    >
      <span style={{
        fontSize: '18px', flexShrink: 0, lineHeight: 1,
        color: active ? '#ff6b00' : t.subText,
        fontWeight: 900,
      }}>
        {icon}
      </span>

      {open && (
        <span style={{
          fontFamily: thaiFont, fontSize: '14px',
          fontWeight: active ? 700 : 500,
          color: active ? '#111110' : t.subText,
        }}>
          {label}
        </span>
      )}
    </Link>
  )
}