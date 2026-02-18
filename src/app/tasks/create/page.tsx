'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTasks } from '../../../context/TaskContext'

export default function CreateTaskPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignee, setAssignee] = useState('A')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium')
  
  const { addTask, isDarkMode } = useTasks()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!title.trim()) {
      alert('กรุณากรอกชื่องาน')
      return
    }

    // แก้ให้ส่งเป็น Object ตาม Context ใหม่ หายแดงแน่นอนครับ
    addTask({
      title,
      priority,
      description,
      assignee,
      dueDate
    })

    alert(`สร้างงาน "${title}" สำเร็จ!`)
    router.push('/tasks')
  }

  const theme = {
    bg: isDarkMode ? '#121212' : '#f1f5f9',
    card: isDarkMode ? '#1e1e1e' : '#ffffff',
    text: isDarkMode ? '#f3f4f6' : '#0f172a',
    subText: isDarkMode ? '#94a3b8' : '#64748b',
    border: isDarkMode ? '#333' : '#e2e8f0',
    inputBg: isDarkMode ? '#2d2d2d' : '#ffffff'
  }

  return (
    <main style={{ minHeight: '100vh', background: theme.bg, padding: '40px 24px', transition: '0.3s' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: theme.text, margin: 0 }}>Create Task</h1>
          <p style={{ color: theme.subText, marginTop: 8, fontSize: 16 }}>เพิ่มงานใหม่เข้าสู่ระบบจัดการงาน</p>
        </div>

        <div style={{ background: theme.card, borderRadius: 20, padding: '40px', boxShadow: '0 10px 25px rgba(0,0,0,0.06)', border: `1px solid ${theme.border}` }}>
          <form onSubmit={handleSubmit}>
            
            <Field label="Title" isDarkMode={isDarkMode}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ระบุชื่อแอปหรืองาน..."
                style={{ ...inputStyle, background: theme.inputBg, color: theme.text, borderColor: theme.border }}
              />
            </Field>

            <Field label="Priority (ความสำคัญ)" isDarkMode={isDarkMode}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <PriorityBtn active={priority === 'high'} color="#ef4444" label="ด่วนมาก" onClick={() => setPriority('high')} />
                <PriorityBtn active={priority === 'medium'} color="#f59e0b" label="ปกติ" onClick={() => setPriority('medium')} />
                <PriorityBtn active={priority === 'low'} color="#22c55e" label="รอได้" onClick={() => setPriority('low')} />
              </div>
            </Field>

            <Field label="Description" isDarkMode={isDarkMode}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="รายละเอียดเพิ่มเติม..."
                style={{ ...inputStyle, background: theme.inputBg, color: theme.text, borderColor: theme.border, resize: 'vertical' }}
              />
            </Field>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <Field label="Assignee" isDarkMode={isDarkMode}>
                <select
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  style={{ ...inputStyle, background: theme.inputBg, color: theme.text, borderColor: theme.border }}
                >
                  <option>A</option><option>B</option><option>C</option><option>D</option>
                </select>
              </Field>

              <Field label="Due Date" isDarkMode={isDarkMode}>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  style={{ ...inputStyle, background: theme.inputBg, color: theme.text, borderColor: theme.border }}
                />
              </Field>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 40 }}>
              <Link href="/tasks" style={{ ...cancelBtn, background: isDarkMode ? '#333' : '#e5e7eb', color: isDarkMode ? '#ccc' : '#334155' }}>
                ยกเลิก
              </Link>
              <button type="submit" style={saveBtn}>บันทึกงานใหม่</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

/* --- Helpers --- */
function PriorityBtn({ active, color, label, onClick }: any) {
  return (
    <button type="button" onClick={onClick} style={{ padding: '12px', borderRadius: '10px', border: `2px solid ${active ? color : 'transparent'}`, background: active ? `${color}20` : '#80808010', color: active ? color : '#64748b', fontWeight: 700, cursor: 'pointer', transition: '0.2s' }}>
      {label}
    </button>
  )
}

function Field({ label, children, isDarkMode }: any) {
  return (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: isDarkMode ? '#94a3b8' : '#334155', marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = { width: '100%', padding: '14px', borderRadius: '10px', border: '1px solid', fontSize: '15px', boxSizing: 'border-box' as const, outline: 'none' }
const saveBtn = { padding: '14px 40px', borderRadius: '10px', background: '#2563eb', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '16px' }
const cancelBtn = { padding: '14px 40px', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', fontSize: '16px' }