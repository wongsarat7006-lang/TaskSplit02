'use client'

import Link from 'next/link'
import { useTasks } from '../context/TaskContext'

export default function HomePage() {
  const { isDarkMode } = useTasks()

  const t = {
    bg:        isDarkMode ? '#0a0a0a' : '#fafaf8',
    text:      isDarkMode ? '#f0ede8' : '#111110',
    subText:   isDarkMode ? '#6a6a62' : '#7a7a72',
    card:      isDarkMode ? '#0f0f0f' : '#ffffff',
    border:    isDarkMode ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.2)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.35)' : 'rgba(255,107,0,0.4)',
    grid:      isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
    badge:     isDarkMode ? 'rgba(255,107,0,0.12)' : 'rgba(255,107,0,0.08)',
    statBg:    isDarkMode ? '#0f0f0f' : '#ffffff',
    watermark: isDarkMode ? '#2a2a22' : '#e0ddd8',
    footer:    isDarkMode ? '#3a3a32' : '#c0bdb8',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  return (
    <main style={{
      minHeight: '100vh', background: t.bg, color: t.text,
      fontFamily: thaiFont, position: 'relative', overflow: 'hidden',
      transition: 'background 0.3s ease, color 0.3s ease',
    }}>

      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
      }} />
      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.12) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '-300px', left: '-200px', width: '700px', height: '700px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', padding: '60px 24px', maxWidth: '960px', margin: '0 auto',
      }}>

        {/* Badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: t.badge, border: `1px solid ${t.borderStr}`,
          borderRadius: '4px', padding: '6px 16px', marginBottom: '40px',
          fontFamily: monoFont, fontSize: '12px', color: '#ff6b00',
          letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff6b00', boxShadow: '0 0 8px #ff6b00', animation: 'pulse 2s ease-in-out infinite' }} />
          Task Management System
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: engFont,
          fontSize: 'clamp(72px, 14vw, 140px)', fontWeight: 900,
          lineHeight: 0.9, textAlign: 'center', marginBottom: '8px',
          letterSpacing: '-2px', textTransform: 'uppercase',
        }}>
          <span style={{ color: t.text }}>TASK</span>
          <span style={{ color: '#ff6b00', textShadow: '0 0 40px rgba(255,107,0,0.4)' }}>SPLIT</span>
        </h1>

        <div style={{ width: '100%', maxWidth: '480px', height: '2px', background: 'linear-gradient(90deg, transparent, #ff6b00, transparent)', margin: '28px auto' }} />

        {/* Subtitle - Thai font */}
        <p style={{
          fontFamily: thaiFont, fontSize: '17px', color: t.subText,
          textAlign: 'center', marginBottom: '52px',
          lineHeight: 1.8, maxWidth: '520px', fontWeight: 400,
        }}>
          ระบบจัดการงานที่ต้องทำ Task Board อย่างมืออาชีพ<br />
          สร้าง แบ่ง และติดตามงานของทีมได้อย่างชัดเจน
        </p>

        {/* CTA */}
        <Link href="/tasks" style={{
          display: 'inline-flex', alignItems: 'center', gap: '12px',
          background: '#ff6b00', color: '#0a0a0a',
          padding: '16px 48px', borderRadius: '4px',
          textDecoration: 'none', fontFamily: thaiFont,
          fontSize: '17px', fontWeight: 700,
          boxShadow: '0 0 40px rgba(255,107,0,0.35)',
          transition: 'all 0.2s ease',
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ff8533'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ff6b00'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
        >
          + เริ่มจัดการงานของคุณ →
        </Link>

        {/* Stats */}
        <div style={{ display: 'flex', marginTop: '60px', marginBottom: '80px', border: `1px solid ${t.borderStr}`, borderRadius: '8px', overflow: 'hidden' }}>
          {[
            { num: '3', label: 'สถานะงาน' },
            { num: '∞', label: 'งานที่สร้างได้' },
            { num: '100%', label: 'ฟรี' },
          ].map((s, i) => (
            <div key={i} style={{ padding: '24px 40px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${t.border}` : 'none', background: t.statBg }}>
              <div style={{ fontFamily: engFont, fontSize: '36px', fontWeight: 900, color: '#ff6b00', lineHeight: 1, marginBottom: '4px' }}>{s.num}</div>
              <div style={{ fontFamily: thaiFont, fontSize: '13px', color: t.subText, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', width: '100%', background: t.borderStr, borderRadius: '8px', overflow: 'hidden' }}>
          {[
            { icon: '📝', title: 'สร้างงานชัดเจน', desc: 'กำหนดรายละเอียดและผู้รับผิดชอบได้ทันที', index: 0 },
            { icon: '📊', title: 'เห็นภาพรวมงาน', desc: 'ติดตามสถานะ To Do, Doing และ Done', index: 1 },
            { icon: '⚡', title: 'ใช้งานง่าย', desc: 'ออกแบบมาให้เข้าใจง่าย ไม่ซับซ้อน', index: 2 },
          ].map((f) => (
            <div key={f.index} style={{ background: t.card, padding: '36px 28px', position: 'relative', transition: 'background 0.2s ease' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = isDarkMode ? '#141410' : '#fff8f4'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = t.card}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: 'linear-gradient(90deg, #ff6b00, transparent)', opacity: 0.6 }} />
              <div style={{ position: 'absolute', top: '12px', right: '16px', fontFamily: monoFont, fontSize: '11px', color: t.watermark }}>{String(f.index + 1).padStart(2, '0')}</div>
              <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: thaiFont, fontSize: '18px', fontWeight: 700, marginBottom: '8px', color: t.text }}>{f.title}</h3>
              <p style={{ fontFamily: thaiFont, fontSize: '14px', color: t.subText, lineHeight: '1.7', fontWeight: 400 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ marginTop: '60px', fontFamily: monoFont, fontSize: '11px', color: t.footer, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          // TaskSplit — ระบบจัดการงานอย่างมืออาชีพ
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');
        @keyframes pulse { 0%, 100% { opacity: 1; box-shadow: 0 0 8px #ff6b00; } 50% { opacity: 0.5; box-shadow: 0 0 4px #ff6b00; } }
      `}</style>
    </main>
  )
}