'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '../../../context/TaskContext'

export default function CreateTaskPage() {
  const { addTask, isDarkMode } = useTasks()
  const router = useRouter()

  const [formData, setFormData] = useState({
    id: '', title: '', description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'todo' as 'todo' | 'doing' | 'done',
    assignee: '', dueDate: ''
  })
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const t = {
    bg:        isDarkMode ? '#0a0a0a' : '#fafaf8',
    card:      isDarkMode ? '#0f0f0f' : '#ffffff',
    text:      isDarkMode ? '#f0ede8' : '#111110',
    subText:   isDarkMode ? '#5a5a52' : '#8a8a82',
    border:    isDarkMode ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.2)',
    borderStr: isDarkMode ? 'rgba(255,107,0,0.35)' : 'rgba(255,107,0,0.45)',
    inputBg:   isDarkMode ? '#0a0a0a' : '#fafaf8',
    grid:      isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
    disabledBg:isDarkMode ? '#0d0d0d' : '#f0ede8',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return alert('กรุณาใส่หัวข้องาน')
    const { id, ...dataToSubmit } = formData
    addTask(dataToSubmit)
    router.push('/tasks')
  }

  const priorityConfig = {
    high:   { color: '#ef4444', label: 'สูง (High)',   desc: 'เร่งด่วน' },
    medium: { color: '#ffaa44', label: 'ปกติ (Medium)', desc: 'ทั่วไป' },
    low:    { color: '#22c55e', label: 'ต่ำ (Low)',    desc: 'ไม่เร่งด่วน' },
  }

  const fieldStyle = (name: string, disabled = false) => ({
    width: '100%', padding: '13px 16px',
    background: disabled ? t.disabledBg : t.inputBg,
    border: `1px solid ${focusedField === name ? 'rgba(255,107,0,0.6)' : t.border}`,
    borderRadius: '6px', outline: 'none',
    fontFamily: thaiFont, fontSize: '14px', color: t.text,
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
    boxShadow: focusedField === name ? '0 0 12px rgba(255,107,0,0.08)' : 'none',
  })

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: thaiFont, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', transition: 'background 0.3s ease' }}>

      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
      <div style={{ position: 'fixed', top: '-200px', right: '-200px', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden', boxShadow: isDarkMode ? '0 0 60px rgba(255,107,0,0.06)' : '0 8px 40px rgba(0,0,0,0.08)', transition: 'background 0.3s ease' }}>

        <div style={{ height: '3px', background: 'linear-gradient(90deg, #ff6b00, #ff9944, transparent)' }} />

        <div style={{ padding: '40px 44px' }}>

          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: monoFont, fontSize: '11px', color: '#ff6b00', letterSpacing: '0.2em', marginBottom: '10px' }}>// CREATE NEW TASK</div>
            <h1 style={{ fontFamily: engFont, fontSize: '52px', fontWeight: 900, lineHeight: 0.95, margin: 0, textTransform: 'uppercase', letterSpacing: '-1px' }}>
              <span style={{ color: t.text }}>NEW</span>
              <span style={{ color: '#ff6b00', textShadow: '0 0 30px rgba(255,107,0,0.3)' }}> TASK</span>
            </h1>
            <p style={{ fontFamily: thaiFont, fontSize: '14px', color: t.subText, marginTop: '8px' }}>เพิ่มรายการงานลงในระบบบอร์ดของคุณ</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>

            {/* Title */}
            <div>
              <label style={{ display: 'block', fontFamily: thaiFont, fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>หัวข้องาน *</label>
              <input style={fieldStyle('title')} placeholder="กรอกชื่อกิจกรรมที่ต้องทำ" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} onFocus={() => setFocusedField('title')} onBlur={() => setFocusedField(null)} required />
            </div>

            {/* Priority */}
            <div>
              <label style={{ display: 'block', fontFamily: thaiFont, fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '10px' }}>ระดับความสำคัญ</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {(Object.entries(priorityConfig) as [string, typeof priorityConfig['high']][]).map(([key, cfg]) => (
                  <button key={key} type="button" onClick={() => setFormData({ ...formData, priority: key as any })}
                    style={{ padding: '14px 10px', background: formData.priority === key ? `${cfg.color}18` : t.inputBg, border: `1px solid ${formData.priority === key ? cfg.color : t.border}`, borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease', textAlign: 'center', boxShadow: formData.priority === key ? `0 0 16px ${cfg.color}25` : 'none' }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, margin: '0 auto 8px', boxShadow: formData.priority === key ? `0 0 8px ${cfg.color}` : 'none' }} />
                    <div style={{ fontFamily: thaiFont, fontSize: '12px', fontWeight: 700, color: formData.priority === key ? cfg.color : t.subText }}>{cfg.label}</div>
                    <div style={{ fontFamily: thaiFont, fontSize: '11px', color: t.subText, marginTop: '2px' }}>{cfg.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee + Due Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontFamily: thaiFont, fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>ผู้รับผิดชอบ</label>
                <input style={fieldStyle('assignee')} placeholder="ชื่อสมาชิก" value={formData.assignee} onChange={e => setFormData({ ...formData, assignee: e.target.value })} onFocus={() => setFocusedField('assignee')} onBlur={() => setFocusedField(null)} />
              </div>
              <div>
                <label style={{ display: 'block', fontFamily: thaiFont, fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>กำหนดส่ง</label>
                <input type="date" style={{ ...fieldStyle('dueDate'), colorScheme: isDarkMode ? 'dark' : 'light' }} value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} onFocus={() => setFocusedField('dueDate')} onBlur={() => setFocusedField(null)} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontFamily: thaiFont, fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>รายละเอียด</label>
              <textarea style={{ ...fieldStyle('desc'), minHeight: '100px', resize: 'vertical', lineHeight: 1.7 }} placeholder="ใส่รายละเอียดของงาน..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} onFocus={() => setFocusedField('desc')} onBlur={() => setFocusedField(null)} />
            </div>

            <div style={{ height: '1px', background: `linear-gradient(90deg, ${t.borderStr}, transparent)` }} />

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="button" onClick={() => router.back()}
                style={{ flex: 1, padding: '14px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '6px', cursor: 'pointer', fontFamily: thaiFont, fontSize: '15px', fontWeight: 600, color: t.subText, transition: 'all 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,107,0,0.4)'; (e.currentTarget as HTMLElement).style.color = t.text }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.color = t.subText }}
              >ยกเลิก</button>
              <button type="submit"
                style={{ flex: 2, padding: '14px', background: '#ff6b00', border: 'none', borderRadius: '6px', cursor: 'pointer', fontFamily: thaiFont, fontSize: '16px', fontWeight: 700, color: '#0a0a0a', boxShadow: '0 0 30px rgba(255,107,0,0.3)', transition: 'all 0.2s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#ff8533'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#ff6b00'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)' }}
              >+ สร้างงาน</button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;500;600;700&display=swap');
        ::placeholder { color: ${isDarkMode ? '#2a2a22' : '#c0bdb8'} !important; }
        input[type="date"]::-webkit-calendar-picker-indicator { filter: ${isDarkMode ? 'invert(0.3) sepia(1) saturate(5) hue-rotate(10deg)' : 'invert(0.5) sepia(1) saturate(3) hue-rotate(10deg)'}; }
      `}</style>
    </main>
  )
}