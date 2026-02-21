'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTasks } from '../../../context/TaskContext'

export default function CreateTaskPage() {
  // ✅ ดึงข้อมูลจาก Context
  const { addTask, categories, isDarkMode } = useTasks()
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'todo' as 'todo' | 'doing' | 'done',
    assignee: '',
    dueDate: '',
    category_id: '' 
  })
  
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ธีมสี (ส้ม-ดำ)
  const t = {
    bg:         isDarkMode ? '#0a0a0a' : '#fafaf8',
    card:       isDarkMode ? '#0f0f0f' : '#ffffff',
    text:       isDarkMode ? '#f0ede8' : '#111110',
    subText:    isDarkMode ? '#5a5a52' : '#8a8a82',
    border:     isDarkMode ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.2)',
    borderStr:  isDarkMode ? 'rgba(255,107,0,0.35)' : 'rgba(255,107,0,0.45)',
    inputBg:    isDarkMode ? '#0a0a0a' : '#fafaf8',
    grid:       isDarkMode ? 'rgba(255,107,0,0.035)' : 'rgba(255,107,0,0.06)',
  }

  const thaiFont = "'Sarabun', sans-serif"
  const engFont  = "'Bebas Neue', 'Impact', sans-serif"
  const monoFont = "'Courier New', monospace"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return alert('กรุณาใส่หัวข้องาน')
    
    setIsSubmitting(true)
    try {
      await addTask({
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignee: formData.assignee,
        dueDate: formData.dueDate,
        category_id: formData.category_id || undefined 
      })
      router.push('/tasks') 
    } catch (error) {
      console.error("Error creating task:", error)
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล")
    } finally {
      setIsSubmitting(false)
    }
  }

  const priorityConfig = {
    high:   { color: '#ef4444', label: 'สูง (High)' },
    medium: { color: '#ffaa44', label: 'ปกติ (Medium)' },
    low:    { color: '#22c55e', label: 'ต่ำ (Low)' },
  }

  const fieldStyle = (name: string) => ({
    width: '100%', padding: '13px 16px',
    background: t.inputBg,
    border: `1px solid ${focusedField === name ? 'rgba(255,107,0,0.6)' : t.border}`,
    borderRadius: '6px', outline: 'none',
    fontFamily: thaiFont, fontSize: '14px', color: t.text,
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
  })

  return (
    <main style={{ minHeight: '100vh', background: t.bg, color: t.text, fontFamily: thaiFont, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
      
      {/* Background Decor */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', backgroundImage: `linear-gradient(${t.grid} 1px, transparent 1px), linear-gradient(90deg, ${t.grid} 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '600px', background: t.card, border: `1px solid ${t.border}`, borderRadius: '10px', overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.12)' }}>
        
        <div style={{ height: '3px', background: 'linear-gradient(90deg, #ff6b00, #ff9944, transparent)' }} />

        <div style={{ padding: '40px 44px' }}>
          <div style={{ marginBottom: '32px' }}>
            <div style={{ fontFamily: monoFont, fontSize: '11px', color: '#ff6b00', letterSpacing: '0.2em', marginBottom: '10px' }}>// CREATE NEW TASK</div>
            <h1 style={{ fontFamily: engFont, fontSize: '52px', fontWeight: 900, lineHeight: 0.95, margin: 0, textTransform: 'uppercase' }}>
              NEW <span style={{ color: '#ff6b00' }}>TASK</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>หัวข้องาน *</label>
              <input style={fieldStyle('title')} placeholder="กรอกชื่อกิจกรรม" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} onFocus={() => setFocusedField('title')} onBlur={() => setFocusedField(null)} required />
            </div>

            {/* Category Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>หมวดหมู่ (Category)</label>
              <select 
                style={fieldStyle('category')} 
                value={formData.category_id} 
                onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                onFocus={() => setFocusedField('category')}
                onBlur={() => setFocusedField(null)}
              >
                <option value="">-- เลือกหมวดหมู่ --</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Priority Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '10px' }}>ระดับความสำคัญ</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                {Object.entries(priorityConfig).map(([key, cfg]) => (
                  <button key={key} type="button" onClick={() => setFormData({ ...formData, priority: key as any })}
                    style={{ padding: '14px 10px', background: formData.priority === key ? `${cfg.color}18` : t.inputBg, border: `1px solid ${formData.priority === key ? cfg.color : t.border}`, borderRadius: '6px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, margin: '0 auto 8px' }} />
                    <div style={{ fontSize: '12px', fontWeight: 700, color: formData.priority === key ? cfg.color : t.subText }}>{cfg.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Assignee & Due Date */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>ผู้รับผิดชอบ</label>
                <input style={fieldStyle('assignee')} placeholder="ชื่อสมาชิก" value={formData.assignee} onChange={e => setFormData({ ...formData, assignee: e.target.value })} onFocus={() => setFocusedField('assignee')} onBlur={() => setFocusedField(null)} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>กำหนดส่ง</label>
                <input type="date" style={{ ...fieldStyle('dueDate'), colorScheme: isDarkMode ? 'dark' : 'light' }} value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} onFocus={() => setFocusedField('dueDate')} onBlur={() => setFocusedField(null)} />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#ff6b00', marginBottom: '8px' }}>รายละเอียด</label>
              <textarea style={{ ...fieldStyle('description'), minHeight: '80px', resize: 'vertical' }} placeholder="ใส่รายละเอียด..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} onFocus={() => setFocusedField('description')} onBlur={() => setFocusedField(null)} />
            </div>

            {/* ✅ ส่วนที่แก้ Error: ปุ่มแยกออกจากกันชัดเจน */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
              <button 
                type="button" 
                onClick={() => router.back()} 
                style={{ flex: 1, padding: '14px', background: 'transparent', border: `1px solid ${t.border}`, borderRadius: '6px', cursor: 'pointer', color: t.subText }}
              >
                ยกเลิก
              </button>
              
              <button 
                type="submit" 
                disabled={isSubmitting} 
                style={{ flex: 2, padding: '14px', background: '#ff6b00', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, color: '#0a0a0a', boxShadow: '0 4px 20px rgba(255,107,0,0.2)' }}
              >
                {isSubmitting ? 'กำลังบันทึก...' : '+ สร้างงาน'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Sarabun:wght@400;600;700&display=swap');
        select { appearance: none; cursor: pointer; }
      `}</style>
    </main>
  )
}