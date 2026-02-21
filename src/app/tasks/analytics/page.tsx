'use client'

import { useTasks } from '../../../context/TaskContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AnalyticsPage() {
  const { tasks, categories, isDarkMode } = useTasks()
  const router = useRouter()

  // --- THEME ---
  const t = {
    bg:         isDarkMode ? '#0a0a0a' : '#fafaf8',
    card:       isDarkMode ? '#0f0f0f' : '#ffffff',
    text:       isDarkMode ? '#f0ede8' : '#111110',
    subText:    isDarkMode ? '#6a6a62' : '#7a7a72',
    border:     isDarkMode ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.2)',
    primary:    '#ff6b00',
    grid:       isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
  }

  // --- LOGIC: คำนวณตัวเลขสรุป ---
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const todo = tasks.filter(t => t.status === 'todo').length
  const doing = tasks.filter(t => t.status === 'doing').length
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done').length
  
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, padding: '60px 24px', fontFamily: "'Sarabun', sans-serif" }}>
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: '11px', color: t.primary, letterSpacing: '0.2em' }}>// PERFORMANCE METRICS</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '64px', margin: 0, lineHeight: 0.9 }}>DATA <span style={{ color: t.primary }}>ANALYTICS</span></h1>
          </div>
          <Link href="/tasks" style={{ color: t.subText, textDecoration: 'none', fontSize: '14px', fontWeight: 600, borderBottom: `1px solid ${t.subText}` }}>
            ← BACK TO BOARD
          </Link>
        </div>

        {/* 1. Main Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          <StatCard label="OVERALL PROGRESS" value={`${completionRate}%`} color={t.primary} t={t} />
          <StatCard label="ACTIVE TASKS" value={todo + doing} color="#ffaa44" t={t} />
          <StatCard label="CRITICAL (HIGH)" value={highPriority} color="#ef4444" t={t} />
          <StatCard label="COMPLETED" value={done} color="#10b981" t={t} />
        </div>

        {/* 2. Visual Progress Bar */}
        <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '30px', marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
            <h3 style={{ margin: 0, fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px', letterSpacing: '1px' }}>Project Completion</h3>
            <span style={{ fontFamily: 'monospace', fontSize: '14px', color: t.primary }}>{done} / {total} Tasks</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: isDarkMode ? '#222' : '#eee', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${completionRate}%`, height: '100%', background: `linear-gradient(90deg, ${t.primary}, #ffaa44)`, transition: 'width 1s ease-out' }} />
          </div>
        </div>

        {/* 3. Category Distribution */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '30px' }}>
            <h3 style={{ margin: '0 0 20px 0', fontFamily: "'Bebas Neue', sans-serif", fontSize: '24px' }}>By Category</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {categories.map(cat => {
                const count = tasks.filter(task => task.category_id === cat.id).length
                const percent = total > 0 ? (count / total) * 100 : 0
                return (
                  <div key={cat.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '5px' }}>
                      <span style={{ color: cat.color, fontWeight: 700 }}>{cat.name}</span>
                      <span style={{ color: t.subText }}>{count} tasks</span>
                    </div>
                    <div style={{ width: '100%', height: '4px', background: isDarkMode ? '#222' : '#eee', borderRadius: '2px' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: cat.color, borderRadius: '2px' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
             <div style={{ fontSize: '12px', color: t.subText, marginBottom: '10px', fontFamily: 'monospace' }}>// MOTIVATION</div>
             <p style={{ fontSize: '18px', fontWeight: 500, fontStyle: 'italic', margin: 0, color: t.text }}>
               {completionRate === 100 ? "ยอดเยี่ยม! คุณเคลียร์งานทั้งหมดแล้ว" : 
                completionRate > 70 ? "ใกล้ความจริงแล้ว สู้ต่อไป!" : 
                "เริ่มต้นก้าวแรก และรักษาวินัยไว้"}
             </p>
          </div>
        </div>

      </div>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');`}</style>
    </main>
  )
}

function StatCard({ label, value, color, t }: any) {
  return (
    <div style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: '12px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
      <div style={{ fontSize: '11px', fontWeight: 800, color: t.subText, letterSpacing: '1px', marginBottom: '10px' }}>{label}</div>
      <div style={{ fontSize: '42px', fontWeight: 900, color: color, fontFamily: "'Bebas Neue', sans-serif", lineHeight: 1 }}>{value}</div>
    </div>
  )
}